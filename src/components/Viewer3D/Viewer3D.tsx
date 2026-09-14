import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { SceneEngine } from './SceneEngine';
import { FloatingPins } from './FloatingPins';
import { ClinicalCondition, LayerOpacityState } from '../../types/anatomy';

export interface Viewer3DRef {
  focusOnOrgan: (id: string) => void;
  resetCamera: () => void;
  setViewAngle: (angle: 'front' | 'side' | 'back') => void;
  setBodyRegion: (region: 'full' | 'head' | 'chest' | 'abdomen' | 'legs') => void;
  toggleAutoRotate: (enabled?: boolean) => boolean;
  setExplode: (val: number) => void;
  setLayerOpacity: (layer: keyof LayerOpacityState, opacity: number) => void;
  setLayerVisibility: (layer: keyof LayerOpacityState, visible: boolean) => void;
  setIsolateMode: (organId: string | null, enabled: boolean) => void;
  setClinicalCondition: (cond: ClinicalCondition) => void;
}

interface Viewer3DProps {
  selectedOrganId: string;
  onSelectOrgan: (organId: string) => void;
  condition: ClinicalCondition;
  isIsolateMode: boolean;
  showPins: boolean;
  onLoadComplete: () => void;
  onLoadProgress: (label: string, percent: number) => void;
}

export const Viewer3D = forwardRef<Viewer3DRef, Viewer3DProps>(
  (
    {
      selectedOrganId,
      onSelectOrgan,
      condition,
      isIsolateMode,
      showPins,
      onLoadComplete,
      onLoadProgress,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const engineRef = useRef<SceneEngine | null>(null);
    const [pinPositions, setPinPositions] = useState<
      Record<string, { x: number; y: number; visible: boolean }>
    >({});

    useEffect(() => {
      if (!containerRef.current) return;

      const engine = new SceneEngine(containerRef.current, {
        onLoadProgress,
        onAllLoaded: onLoadComplete,
        onOrganSelect: onSelectOrgan,
      });
      engineRef.current = engine;

      let rafId: number;
      const updatePins = () => {
        if (engineRef.current) {
          setPinPositions(engineRef.current.getProjectedPinPositions());
        }
        rafId = requestAnimationFrame(updatePins);
      };
      rafId = requestAnimationFrame(updatePins);

      return () => {
        cancelAnimationFrame(rafId);
        engine.destroy();
      };
    }, []);

    // Sync condition
    useEffect(() => {
      if (engineRef.current) {
        engineRef.current.currentCondition = condition;
      }
    }, [condition]);

    // Sync isolate mode
    useEffect(() => {
      if (engineRef.current) {
        engineRef.current.setIsolateMode(selectedOrganId, isIsolateMode);
      }
    }, [isIsolateMode, selectedOrganId]);

    useImperativeHandle(ref, () => ({
      focusOnOrgan: (id: string) => engineRef.current?.focusOnOrgan(id),
      resetCamera: () => engineRef.current?.resetCamera(),
      setViewAngle: (angle) => engineRef.current?.setViewAngle(angle),
      setBodyRegion: (region) => engineRef.current?.setBodyRegion(region),
      toggleAutoRotate: (enabled) => engineRef.current?.toggleAutoRotate(enabled) ?? false,
      setExplode: (val) => engineRef.current?.setExplode(val),
      setLayerOpacity: (layer, opacity) => engineRef.current?.setLayerOpacity(layer, opacity),
      setLayerVisibility: (layer, visible) => engineRef.current?.setLayerVisibility(layer, visible),
      setIsolateMode: (organId, enabled) => engineRef.current?.setIsolateMode(organId, enabled),
      setClinicalCondition: (cond) => {
        if (engineRef.current) engineRef.current.currentCondition = cond;
      },
    }));

    return (
      <div className="relative w-full h-full overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full" />
        <FloatingPins
          pinPositions={pinPositions}
          selectedOrganId={selectedOrganId}
          onSelectOrgan={onSelectOrgan}
          visible={showPins}
        />
      </div>
    );
  }
);
