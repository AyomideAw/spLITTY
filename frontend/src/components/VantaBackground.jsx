import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null); // ✅ useRef instead of state to avoid re-renders

  useEffect(() => {
    const loadEffect = async () => {
      if (!window.VANTA) {
        await loadScript('https://cdn.jsdelivr.net/npm/vanta/dist/vanta.clouds.min.js');
      }
      if (!window.THREE) {
        window.THREE = THREE;
      }

      if (vantaRef.current && window.VANTA?.CLOUDS && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.CLOUDS({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: false,
          touchControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          backgroundColor: 0xffffff,
          skyColor: 0x68b8d7,
          cloudColor: 0xadc1de,
          cloudShadowColor: 0x183550,
          sunColor: 0xff9919,
          sunGlareColor: 0xff6633,
          sunlightColor: 0xff9933,
          speed: 1.7
        });
      }
    };

    loadEffect();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []); // ✅ Empty array: run once on mount

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

  return <div ref={vantaRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default VantaBackground;
