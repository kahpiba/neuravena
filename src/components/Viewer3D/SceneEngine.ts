import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { ClinicalCondition, LayerOpacityState } from '../../types/anatomy';
import { ORGAN_DATABASE, NERVE_ORGAN_IDS } from '../../data/organDatabase';

export interface SceneEngineCallbacks {
  onLoadProgress: (label: string, percent: number) => void;
  onAllLoaded: () => void;
  onOrganSelect: (organId: string) => void;
}

export class SceneEngine {
  private container: HTMLElement;
  private callbacks: SceneEngineCallbacks;

  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;

  // Groups
  public mainHumanGroup: THREE.Group;
  public skeletalGroup: THREE.Group;
  public nervousGroup: THREE.Group;
  public vascularGroup: THREE.Group;
  public flowRoot: THREE.Group;

  // Key Mesh References
  public nervousMeshRef: THREE.Mesh | null = null;
  public skinMeshRef: THREE.Mesh | null = null;
  public arterialMeshRef: THREE.Mesh | null = null;
  public venousMeshRef: THREE.Mesh | null = null;
  public realHeartMesh: THREE.Group | null = null;
  public organMeshes: Record<string, THREE.Object3D> = {};

  // Original Materials Backup (for Isolate / Ghosting mode)
  private originalMaterials: Map<THREE.Mesh, THREE.Material | THREE.Material[]> = new Map();
  private ghostMaterial: THREE.MeshStandardMaterial;

  // State
  public currentCondition: ClinicalCondition = 'sehat';
  public isIsolateMode: boolean = false;
  public isolatedOrganId: string | null = null;
  public layerState: LayerOpacityState = {
    nerves: { visible: true, opacity: 0.95 },
    arteries: { visible: true, opacity: 0.90 },
    veins: { visible: true, opacity: 0.85 },
    heart: { visible: true, opacity: 1.0 },
    skeleton: { visible: true, opacity: 0.50 },
    skin: { visible: true, opacity: 0.30 },
  };

  // Particles
  private particles: {
    o2: Array<{ spr: THREE.Sprite; t: number; speed: number }>;
    nutrient: Array<{ spr: THREE.Sprite; t: number; speed: number }>;
    hormone: Array<{ spr: THREE.Sprite; t: number; speed: number }>;
    co2: Array<{ spr: THREE.Sprite; t: number; speed: number }>;
    impulse: Array<{ spr: THREE.Sprite; t: number; speed: number }>;
  } = { o2: [], nutrient: [], hormone: [], co2: [], impulse: [] };

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Animation & Clock
  private clock = new THREE.Clock();
  private animId: number = 0;
  private isDestroyed: boolean = false;

  // Camera animation target
  private cameraTargetPos: THREE.Vector3 | null = null;
  private cameraTargetLook: THREE.Vector3 | null = null;

  // Heart animation parameters
  private heartRates: Record<ClinicalCondition, number> = {
    sehat: 1.1,
    aterosklerosis: 1.3,
    stroke: 1.6,
    neuropati: 1.0,
  };
  private flowSpeeds: Record<ClinicalCondition, number> = {
    sehat: 1.0,
    aterosklerosis: 0.65,
    stroke: 0.30,
    neuropati: 0.85,
  };

  constructor(container: HTMLElement, callbacks: SceneEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f7fc);

    // 2. Camera setup
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camera.position.set(0, 0.5, 2.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 0.35;
    this.controls.maxDistance = 5.0;
    this.controls.maxPolarAngle = Math.PI * 0.95;
    this.controls.target.set(0, 0.35, 0);

    // 5. Lighting
    this.setupLighting();

    // 6. Hierarchy Groups
    this.mainHumanGroup = new THREE.Group();
    this.skeletalGroup = new THREE.Group();
    this.nervousGroup = new THREE.Group();
    this.vascularGroup = new THREE.Group();
    this.flowRoot = new THREE.Group();

    this.mainHumanGroup.add(this.skeletalGroup);
    this.mainHumanGroup.add(this.nervousGroup);
    this.mainHumanGroup.add(this.vascularGroup);
    this.mainHumanGroup.add(this.flowRoot);
    this.scene.add(this.mainHumanGroup);

    // 7. Ghost X-Ray material for Isolate Mode
    this.ghostMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.12,
      roughness: 0.8,
      metalness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    // 8. Event listeners
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);

    // 9. Particles setup
    this.buildParticles();

    // 10. Load Models
    this.loadModels();

    // 11. Start animation loop
    this.animate();
  }

  private setupLighting() {
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(2, 4, 3);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc7d2fe, 0.45);
    dirLight2.position.set(-2, 1, -2);
    this.scene.add(dirLight2);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 0.4);
    this.scene.add(hemiLight);
  }

  private loadModels() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let loadedCount = 0;
    const totalModels = 4;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalModels) {
        this.callbacks.onAllLoaded();
      }
    };

    // 1. Nervous System
    gltfLoader.load(
      '/assets/models/nervous_system.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.88, 0);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.name.includes('skin') || mesh.name === 'Object_5') {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0x94a3b8,
                transparent: true,
                opacity: 0.30,
                roughness: 0.22,
                transmission: 0.80,
                ior: 1.28,
                side: THREE.DoubleSide,
                depthWrite: false
              });
              this.skinMeshRef = mesh;
            } else {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x0d9488,
                emissive: 0x0f766e,
                emissiveIntensity: 0.5,
                roughness: 0.35,
                transparent: true,
                opacity: 0.95
              });
              this.nervousMeshRef = mesh;
            }
            this.originalMaterials.set(mesh, mesh.material);
          }
        });
        this.nervousGroup.add(model);
        checkAllLoaded();
      },
      (xhr) => {
        if (xhr.total) this.callbacks.onLoadProgress('Sistem Saraf', (xhr.loaded / xhr.total) * 100);
      },
      (err) => console.error('Error loading nervous_system.glb:', err)
    );

    // 2. Skeletal System
    gltfLoader.load(
      '/assets/models/skeletal_system.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.88, 0);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0xe2e8f0,
              roughness: 0.45,
              metalness: 0.05,
              transparent: true,
              opacity: 0.50
            });
            this.originalMaterials.set(mesh, mesh.material);
          }
        });
        this.skeletalGroup.add(model);
        checkAllLoaded();
      },
      (xhr) => {
        if (xhr.total) this.callbacks.onLoadProgress('Kerangka Tulang', (xhr.loaded / xhr.total) * 100);
      },
      (err) => console.error('Error loading skeletal_system.glb:', err)
    );

    // 3. Circulatory System
    gltfLoader.load(
      '/assets/models/circulatory_system.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.88, 0);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.name === 'Object_95') {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xe11d48,
                emissive: 0x991b1b,
                emissiveIntensity: 0.35,
                roughness: 0.35,
                transparent: true,
                opacity: 0.90
              });
              this.arterialMeshRef = mesh;
              this.originalMaterials.set(mesh, mesh.material);
            } else if (mesh.name === 'Object_96') {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x3b82f6,
                emissive: 0x1e3a8a,
                emissiveIntensity: 0.35,
                roughness: 0.40,
                transparent: true,
                opacity: 0.85
              });
              this.venousMeshRef = mesh;
              this.originalMaterials.set(mesh, mesh.material);
            } else if (mesh.name.includes('Skin') || mesh.name === 'Object_5') {
              mesh.visible = false;
            }
          }
        });
        this.vascularGroup.add(model);
        checkAllLoaded();
      },
      (xhr) => {
        if (xhr.total) this.callbacks.onLoadProgress('Pembuluh Darah', (xhr.loaded / xhr.total) * 100);
      },
      (err) => console.error('Error loading circulatory_system.glb:', err)
    );

    // 4. Heart
    gltfLoader.load(
      '/assets/models/heart.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0.030, 0.465, 0.045);
        model.scale.set(0.042, 0.042, 0.042);
        model.rotation.set(0.08, 0.15, -0.15);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
              mat.emissive = new THREE.Color(0x991b1b);
              mat.emissiveIntensity = 0.5;
              mat.roughness = 0.30;
              mat.transparent = true;
              mat.opacity = 1.0;
              mesh.material = mat;
              this.originalMaterials.set(mesh, mat);
            }
          }
        });
        this.realHeartMesh = model;
        this.organMeshes.heart = model;
        this.vascularGroup.add(model);
        checkAllLoaded();
      },
      (xhr) => {
        if (xhr.total) this.callbacks.onLoadProgress('Jantung', (xhr.loaded / xhr.total) * 100);
      },
      (err) => console.error('Error loading heart.glb:', err)
    );
  }

  // --- Layer Opacity & Visibility Control ---
  public setLayerOpacity(layer: keyof LayerOpacityState, opacity: number) {
    this.layerState[layer].opacity = opacity;
    this.applyCurrentLayerStyles();
  }

  public setLayerVisibility(layer: keyof LayerOpacityState, visible: boolean) {
    this.layerState[layer].visible = visible;
    this.applyCurrentLayerStyles();
  }

  public applyCurrentLayerStyles() {
    if (this.isIsolateMode && this.isolatedOrganId) {
      this.applyIsolateMaterials();
      return;
    }

    // Nerves
    if (this.nervousMeshRef) {
      this.nervousMeshRef.visible = this.layerState.nerves.visible;
      const mat = this.nervousMeshRef.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = this.layerState.nerves.opacity;
        mat.transparent = mat.opacity < 1.0;
      }
    }

    // Arteries
    if (this.arterialMeshRef) {
      this.arterialMeshRef.visible = this.layerState.arteries.visible;
      const mat = this.arterialMeshRef.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = this.layerState.arteries.opacity;
        mat.transparent = mat.opacity < 1.0;
      }
    }

    // Veins
    if (this.venousMeshRef) {
      this.venousMeshRef.visible = this.layerState.veins.visible;
      const mat = this.venousMeshRef.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = this.layerState.veins.opacity;
        mat.transparent = mat.opacity < 1.0;
      }
    }

    // Heart
    if (this.realHeartMesh) {
      this.realHeartMesh.visible = this.layerState.heart.visible;
      this.realHeartMesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.opacity = this.layerState.heart.opacity;
            mat.transparent = mat.opacity < 1.0;
          }
        }
      });
    }

    // Skeleton
    if (this.skeletalGroup) {
      this.skeletalGroup.visible = this.layerState.skeleton.visible;
      this.skeletalGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.opacity = this.layerState.skeleton.opacity;
            mat.transparent = mat.opacity < 1.0;
          }
        }
      });
    }

    // Skin
    if (this.skinMeshRef) {
      this.skinMeshRef.visible = this.layerState.skin.visible;
      const mat = this.skinMeshRef.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.opacity = this.layerState.skin.opacity;
        mat.transparent = mat.opacity < 1.0;
      }
    }
  }

  // --- Isolate Mode (X-Ray Ghosting) ---
  public setIsolateMode(organId: string | null, enabled: boolean) {
    this.isIsolateMode = enabled;
    this.isolatedOrganId = organId;

    if (!enabled || !organId) {
      // Restore regular materials
      this.restoreOriginalMaterials();
      this.applyCurrentLayerStyles();
    } else {
      this.applyIsolateMaterials();
    }
  }

  private applyIsolateMaterials() {
    if (!this.isolatedOrganId) return;

    const organ = ORGAN_DATABASE[this.isolatedOrganId];
    if (!organ) return;

    const isNerve = NERVE_ORGAN_IDS.includes(this.isolatedOrganId) || organ.type === 'saraf';

    // Ghost non-target systems
    if (isNerve) {
      // Highlight nerves, ghost vascular and skeletal
      if (this.nervousMeshRef) {
        this.nervousMeshRef.material = this.originalMaterials.get(this.nervousMeshRef) || this.nervousMeshRef.material;
        const mat = this.nervousMeshRef.material as THREE.MeshStandardMaterial;
        mat.opacity = 1.0;
        mat.emissive = new THREE.Color(0x14b8a6);
        mat.emissiveIntensity = 0.8;
      }
      if (this.arterialMeshRef) this.arterialMeshRef.material = this.ghostMaterial;
      if (this.venousMeshRef) this.venousMeshRef.material = this.ghostMaterial;
      if (this.realHeartMesh) {
        this.realHeartMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = this.ghostMaterial;
        });
      }
    } else {
      // Highlight vascular, ghost nerves and skeletal
      if (this.nervousMeshRef) this.nervousMeshRef.material = this.ghostMaterial;
      if (this.arterialMeshRef) {
        this.arterialMeshRef.material = this.originalMaterials.get(this.arterialMeshRef) || this.arterialMeshRef.material;
        const mat = this.arterialMeshRef.material as THREE.MeshStandardMaterial;
        mat.opacity = 1.0;
        mat.emissive = new THREE.Color(0xe11d48);
        mat.emissiveIntensity = 0.7;
      }
      if (this.venousMeshRef) {
        this.venousMeshRef.material = this.originalMaterials.get(this.venousMeshRef) || this.venousMeshRef.material;
        const mat = this.venousMeshRef.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.9;
      }
      if (this.realHeartMesh) {
        this.realHeartMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const orig = this.originalMaterials.get(child as THREE.Mesh);
            if (orig) (child as THREE.Mesh).material = orig as THREE.Material;
          }
        });
      }
    }

    // Always ghost skeleton and hide skin during isolate
    if (this.skeletalGroup) {
      this.skeletalGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = this.ghostMaterial;
      });
    }
    if (this.skinMeshRef) {
      this.skinMeshRef.visible = false;
    }
  }

  private restoreOriginalMaterials() {
    if (this.nervousMeshRef) {
      const orig = this.originalMaterials.get(this.nervousMeshRef);
      if (orig) this.nervousMeshRef.material = orig as THREE.Material;
    }
    if (this.arterialMeshRef) {
      const orig = this.originalMaterials.get(this.arterialMeshRef);
      if (orig) this.arterialMeshRef.material = orig as THREE.Material;
    }
    if (this.venousMeshRef) {
      const orig = this.originalMaterials.get(this.venousMeshRef);
      if (orig) this.venousMeshRef.material = orig as THREE.Material;
    }
    if (this.realHeartMesh) {
      this.realHeartMesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const orig = this.originalMaterials.get(child as THREE.Mesh);
          if (orig) (child as THREE.Mesh).material = orig as THREE.Material;
        }
      });
    }
    if (this.skeletalGroup) {
      this.skeletalGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const orig = this.originalMaterials.get(child as THREE.Mesh);
          if (orig) (child as THREE.Mesh).material = orig as THREE.Material;
        }
      });
    }
  }

  // --- Particles Flow ---
  private buildParticles() {
    const makeParticleTexture = (col: string, size = 64) => {
      const cv = document.createElement('canvas');
      cv.width = size;
      cv.height = size;
      const ctx = cv.getContext('2d')!;
      const rad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      rad.addColorStop(0, col);
      rad.addColorStop(0.4, col);
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(cv);
    };

    const configs = [
      { key: 'o2' as const, color: '#ef4444', size: 0.022, count: 24, path: this.getAortaPath() },
      { key: 'nutrient' as const, color: '#f59e0b', size: 0.019, count: 18, path: this.getCarotidPath() },
      { key: 'co2' as const, color: '#3b82f6', size: 0.020, count: 20, path: this.getVenousPath() },
      { key: 'impulse' as const, color: '#14b8a6', size: 0.024, count: 16, path: this.getNervePath() },
    ];

    for (const cfg of configs) {
      const mat = new THREE.SpriteMaterial({
        map: makeParticleTexture(cfg.color),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      for (let i = 0; i < cfg.count; i++) {
        const spr = new THREE.Sprite(mat);
        spr.scale.set(cfg.size, cfg.size, 1);
        this.flowRoot.add(spr);
        this.particles[cfg.key].push({
          spr,
          t: i / cfg.count,
          speed: 0.003 + Math.random() * 0.001
        });
      }
    }
  }

  private getAortaPath() {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.03, 0.46, 0.04),
      new THREE.Vector3(0.02, 0.52, 0.02),
      new THREE.Vector3(0, 0.40, 0.02),
      new THREE.Vector3(0, 0.15, 0.01),
      new THREE.Vector3(-0.06, -0.20, 0.02),
      new THREE.Vector3(-0.08, -0.55, 0.01),
    ]);
  }

  private getCarotidPath() {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, 0.52, 0.02),
      new THREE.Vector3(0.03, 0.60, 0.03),
      new THREE.Vector3(0.02, 0.70, 0.04),
      new THREE.Vector3(0, 0.75, 0.03),
    ]);
  }

  private getVenousPath() {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.07, -0.55, 0.01),
      new THREE.Vector3(-0.05, -0.20, 0.02),
      new THREE.Vector3(0.02, 0.20, 0.02),
      new THREE.Vector3(0.03, 0.45, 0.03),
    ]);
  }

  private getNervePath() {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.74, 0.02),
      new THREE.Vector3(0, 0.55, 0.01),
      new THREE.Vector3(0, 0.35, -0.01),
      new THREE.Vector3(-0.06, 0.10, -0.01),
      new THREE.Vector3(-0.08, -0.30, -0.01),
      new THREE.Vector3(-0.07, -0.65, 0.0),
    ]);
  }

  // --- Exploded View ---
  public setExplode(ratio: number) {
    if (this.skinMeshRef) this.skinMeshRef.position.z = ratio * 0.40;
    this.skeletalGroup.position.z = -ratio * 0.30;
    this.vascularGroup.position.x = -ratio * 0.35;
    this.nervousGroup.position.y = ratio * 0.25;
    this.mainHumanGroup.position.z = ratio * 0.05;
  }

  // --- Camera Presets & Focus ---
  public focusOnOrgan(organId: string) {
    const organ = ORGAN_DATABASE[organId];
    if (!organ) return;

    this.cameraTargetLook = new THREE.Vector3(...organ.camera.target);
    this.cameraTargetPos = new THREE.Vector3(...organ.camera.pos);
  }

  public resetCamera() {
    this.cameraTargetLook = new THREE.Vector3(0, 0.35, 0);
    this.cameraTargetPos = new THREE.Vector3(0, 0.5, 2.5);
  }

  public setViewAngle(angle: 'front' | 'side' | 'back') {
    const target = this.controls.target.clone();
    if (angle === 'front') {
      this.cameraTargetPos = new THREE.Vector3(0, target.y + 0.1, 2.3);
    } else if (angle === 'side') {
      this.cameraTargetPos = new THREE.Vector3(2.3, target.y + 0.1, 0);
    } else if (angle === 'back') {
      this.cameraTargetPos = new THREE.Vector3(0, target.y + 0.1, -2.3);
    }
  }

  public setBodyRegion(region: 'full' | 'head' | 'chest' | 'abdomen' | 'legs') {
    switch (region) {
      case 'full':
        this.cameraTargetLook = new THREE.Vector3(0, 0.35, 0);
        this.cameraTargetPos = new THREE.Vector3(0, 0.5, 2.5);
        break;
      case 'head':
        this.cameraTargetLook = new THREE.Vector3(0, 0.70, 0);
        this.cameraTargetPos = new THREE.Vector3(0, 0.72, 0.85);
        break;
      case 'chest':
        this.cameraTargetLook = new THREE.Vector3(0, 0.45, 0);
        this.cameraTargetPos = new THREE.Vector3(0, 0.46, 0.90);
        break;
      case 'abdomen':
        this.cameraTargetLook = new THREE.Vector3(0, 0.15, 0);
        this.cameraTargetPos = new THREE.Vector3(0, 0.16, 0.95);
        break;
      case 'legs':
        this.cameraTargetLook = new THREE.Vector3(0, -0.35, 0);
        this.cameraTargetPos = new THREE.Vector3(0, -0.32, 1.15);
        break;
    }
  }

  public toggleAutoRotate(enabled?: boolean) {
    if (typeof enabled === 'boolean') {
      this.controls.autoRotate = enabled;
    } else {
      this.controls.autoRotate = !this.controls.autoRotate;
    }
    this.controls.autoRotateSpeed = 1.2;
    return this.controls.autoRotate;
  }

  // --- Projected Screen Pins ---
  public getProjectedPinPositions(): Record<string, { x: number; y: number; visible: boolean }> {
    const result: Record<string, { x: number; y: number; visible: boolean }> = {};
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    for (const [id, organ] of Object.entries(ORGAN_DATABASE)) {
      const v = new THREE.Vector3(...organ.pos3D);
      v.applyMatrix4(this.mainHumanGroup.matrixWorld);
      v.project(this.camera);

      const isBehind = v.z > 1.0;
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-(v.y * 0.5) + 0.5) * h;

      result[id] = {
        x,
        y,
        visible: !isBehind && x >= 0 && x <= w && y >= 0 && y <= h
      };
    }
    return result;
  }

  // --- Pointer & Raycasting ---
  private onPointerDown = (e: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      [this.nervousGroup, this.vascularGroup, this.skeletalGroup],
      true
    );

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData && hit.userData.organId) {
        this.callbacks.onOrganSelect(hit.userData.organId);
      }
    }
  };

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // --- Main Animation Loop ---
  private animate = () => {
    if (this.isDestroyed) return;
    this.animId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // 1. Smooth Camera Transition
    if (this.cameraTargetPos) {
      this.camera.position.lerp(this.cameraTargetPos, 0.055);
      if (this.camera.position.distanceTo(this.cameraTargetPos) < 0.005) {
        this.cameraTargetPos = null;
      }
    }
    if (this.cameraTargetLook) {
      this.controls.target.lerp(this.cameraTargetLook, 0.055);
      if (this.controls.target.distanceTo(this.cameraTargetLook) < 0.005) {
        this.cameraTargetLook = null;
      }
    }

    // 2. Heart Beat Animation
    const hr = this.heartRates[this.currentCondition] || 1.1;
    const t = (elapsed * hr) % 1.0;
    let scaleF = 0;
    if (t < 0.16) {
      scaleF = Math.sin((t / 0.16) * Math.PI) * 0.18;
    } else if (t >= 0.20 && t < 0.34) {
      scaleF = Math.sin(((t - 0.20) / 0.14) * Math.PI) * 0.09;
    }

    if (this.realHeartMesh && this.layerState.heart.visible) {
      const base = 0.042 * (1.0 + scaleF);
      this.realHeartMesh.scale.set(base, base, base);
    }

    // 3. Neural Impulses Glow
    if (this.nervousMeshRef && !this.isIsolateMode) {
      const mat = this.nervousMeshRef.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = this.currentCondition === 'stroke'
          ? 0.6 + Math.sin(elapsed * 3.0) * 0.35
          : 0.45;
      }
    }

    // 4. Update Particle Positions along Splines
    const flowMult = this.flowSpeeds[this.currentCondition] || 1.0;
    const paths = {
      o2: this.getAortaPath(),
      nutrient: this.getCarotidPath(),
      co2: this.getVenousPath(),
      impulse: this.getNervePath(),
    };

    for (const [key, path] of Object.entries(paths)) {
      const groupKey = key as keyof typeof paths;
      const list = this.particles[groupKey];
      for (const p of list) {
        p.t = (p.t + p.speed * flowMult) % 1.0;
        const pos = path.getPointAt(p.t);
        p.spr.position.copy(pos);
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
