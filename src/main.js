import { AppRenderer } from './renderer.js';
import { HandTracker } from './handTracker.js';

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const webcam = document.getElementById('webcam');
  const pipVideo = document.getElementById('pipVideo');
  const threeCanvas = document.getElementById('threeCanvas');
  const skeletonCanvas = document.getElementById('skeletonCanvas');
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const gestureHint = document.getElementById('gestureHint');
  const controlsSidebar = document.getElementById('controlsSidebar');

  // Controls DOM
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const btnToggleCamera = document.getElementById('btnToggleCamera');
  const btnDemoVideo = document.getElementById('btnDemoVideo');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnSnapshot = document.getElementById('btnSnapshot');
  const btnPause = document.getElementById('btnPause');
  const btnPlay = document.getElementById('btnPlay');
  const btnReset = document.getElementById('btnReset');
  const btnMotionVeil = document.getElementById('btnMotionVeil');
  const btnLiquidRipple = document.getElementById('btnLiquidRipple');
  const btnThermalVision = document.getElementById('btnThermalVision');
  const btnAscii = document.getElementById('btnAscii');

  const skeletonColorInput = document.getElementById('skeletonColor');
  const skeletonColorHex = document.getElementById('skeletonColorHex');

  const fabricOpacity = document.getElementById('fabricOpacity');
  const fabricOpacityVal = document.getElementById('fabricOpacityVal');

  const refractionStrength = document.getElementById('refractionStrength');
  const refractionStrengthVal = document.getElementById('refractionStrengthVal');

  const iridescence = document.getElementById('iridescence');
  const iridescenceVal = document.getElementById('iridescenceVal');

  const chromaticDispersion = document.getElementById('chromaticDispersion');
  const chromaticDispersionVal = document.getElementById('chromaticDispersionVal');

  const waveRipple = document.getElementById('waveRipple');
  const waveRippleVal = document.getElementById('waveRippleVal');

  const skeletonLineWidth = document.getElementById('skeletonLineWidth');
  const skeletonLineWidthVal = document.getElementById('skeletonLineWidthVal');

  const presetCards = document.querySelectorAll('.preset-card');

  // Initialize Renderer
  const appRenderer = new AppRenderer(threeCanvas, skeletonCanvas, webcam);

  // Initialize Hand Tracker
  const tracker = new HandTracker(webcam, pipVideo, (results) => {
    appRenderer.updateHandLandmarks(results);
    if (results && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      gestureHint.style.opacity = '0.3';
    } else {
      gestureHint.style.opacity = '1';
    }
  });

  // Render Loop
  const loop = () => {
    appRenderer.render();
    requestAnimationFrame(loop);
  };
  loop();

  // Try Starting Camera
  updateStatus('Inicializando Câmera...', false);
  const camSuccess = await tracker.startCamera();
  if (camSuccess) {
    updateStatus('Câmera Ativa (Webcam)', true);
  } else {
    updateStatus('Modo Simulador Demo', true);
  }

  function updateStatus(text, isLive) {
    statusText.textContent = text;
    if (isLive) {
      statusBadge.classList.add('live-badge');
    } else {
      statusBadge.classList.remove('live-badge');
    }
  }

  // --- UI Event Handlers ---
  btnToggleSidebar.addEventListener('click', () => {
    controlsSidebar.classList.toggle('collapsed');
  });

  btnToggleCamera.addEventListener('click', async () => {
    if (tracker.isCameraActive) {
      tracker.stopCamera();
      tracker.startDemoMode();
      updateStatus('Modo Simulador Demo', true);
    } else {
      updateStatus('Conectando Câmera...', false);
      const success = await tracker.startCamera();
      if (success) {
        updateStatus('Câmera Ativa (Webcam)', true);
      } else {
        updateStatus('Falha na Câmera - Modo Demo', true);
      }
    }
  });

  btnDemoVideo.addEventListener('click', () => {
    tracker.startDemoMode();
    updateStatus('Modo Simulador Demo', true);
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  // Play / Pause
  btnPause.addEventListener('click', () => {
    appRenderer.isPlaying = false;
    tracker.setPaused(true);
    btnPause.classList.add('active');
    btnPlay.classList.remove('active');
  });

  btnPlay.addEventListener('click', () => {
    appRenderer.isPlaying = true;
    tracker.setPaused(false);
    btnPlay.classList.add('active');
    btnPause.classList.remove('active');
  });

  // Effect Shader Switcher
  const effectBtns = [btnMotionVeil, btnLiquidRipple, btnThermalVision, btnAscii];
  
  function setActiveEffectBtn(activeBtn) {
    effectBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  btnMotionVeil.addEventListener('click', () => {
    appRenderer.setEffectType('motionVeil');
    setActiveEffectBtn(btnMotionVeil);
  });

  btnLiquidRipple.addEventListener('click', () => {
    appRenderer.setEffectType('liquidRipple');
    setActiveEffectBtn(btnLiquidRipple);
  });

  btnThermalVision.addEventListener('click', () => {
    appRenderer.setEffectType('thermalVision');
    setActiveEffectBtn(btnThermalVision);
  });

  btnAscii.addEventListener('click', () => {
    appRenderer.setEffectType('ascii');
    setActiveEffectBtn(btnAscii);
  });

  // Color Input
  function setSkeletonColor(hex) {
    skeletonColorInput.value = hex;
    skeletonColorHex.value = hex.toUpperCase();
    appRenderer.skeletonColor = hex;
  }

  skeletonColorInput.addEventListener('input', (e) => {
    setSkeletonColor(e.target.value);
  });

  skeletonColorHex.addEventListener('change', (e) => {
    let hex = e.target.value;
    if (!hex.startsWith('#')) hex = '#' + hex;
    setSkeletonColor(hex);
  });

  // Range Slider Handlers
  fabricOpacity.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    fabricOpacityVal.textContent = val.toFixed(2);
    appRenderer.material.uniforms.uOpacity.value = val;
  });

  refractionStrength.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    refractionStrengthVal.textContent = Math.round(val);
    appRenderer.material.uniforms.uRefractionStrength.value = val;
  });

  iridescence.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    iridescenceVal.textContent = val.toFixed(2);
    appRenderer.material.uniforms.uIridescence.value = val;
  });

  chromaticDispersion.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    chromaticDispersionVal.textContent = val.toFixed(3);
    appRenderer.material.uniforms.uChromaticDispersion.value = val;
  });

  waveRipple.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    waveRippleVal.textContent = val.toFixed(2);
    appRenderer.material.uniforms.uWaveRipple.value = val;
  });

  skeletonLineWidth.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    skeletonLineWidthVal.textContent = val.toFixed(1) + 'px';
    appRenderer.skeletonThickness = val;
  });

  // Presets Configuration
  const PRESETS = {
    brik: {
      color: '#00ffaa',
      opacity: 0.9,
      refraction: 76,
      iridescence: 0.85,
      dispersion: 0.05,
      ripple: 0.4,
      lineWidth: 2.5
    },
    liquidGlass: {
      color: '#80deea',
      opacity: 0.65,
      refraction: 120,
      iridescence: 0.3,
      dispersion: 0.08,
      ripple: 0.2,
      lineWidth: 2.0
    },
    neonPrism: {
      color: '#00f0ff',
      opacity: 0.95,
      refraction: 90,
      iridescence: 1.0,
      dispersion: 0.12,
      ripple: 0.6,
      lineWidth: 3.5
    },
    silkCloth: {
      color: '#ff9a9e',
      opacity: 0.85,
      refraction: 40,
      iridescence: 0.7,
      dispersion: 0.03,
      ripple: 0.8,
      lineWidth: 2.5
    }
  };

  function applyPreset(name) {
    const p = PRESETS[name];
    if (!p) return;

    setSkeletonColor(p.color);

    fabricOpacity.value = p.opacity;
    fabricOpacityVal.textContent = p.opacity.toFixed(2);
    appRenderer.material.uniforms.uOpacity.value = p.opacity;

    refractionStrength.value = p.refraction;
    refractionStrengthVal.textContent = p.refraction;
    appRenderer.material.uniforms.uRefractionStrength.value = p.refraction;

    iridescence.value = p.iridescence;
    iridescenceVal.textContent = p.iridescence.toFixed(2);
    appRenderer.material.uniforms.uIridescence.value = p.iridescence;

    chromaticDispersion.value = p.dispersion;
    chromaticDispersionVal.textContent = p.dispersion.toFixed(3);
    appRenderer.material.uniforms.uChromaticDispersion.value = p.dispersion;

    waveRipple.value = p.ripple;
    waveRippleVal.textContent = p.ripple.toFixed(2);
    appRenderer.material.uniforms.uWaveRipple.value = p.ripple;

    skeletonLineWidth.value = p.lineWidth;
    skeletonLineWidthVal.textContent = p.lineWidth.toFixed(1) + 'px';
    appRenderer.skeletonThickness = p.lineWidth;

    presetCards.forEach(card => {
      card.classList.toggle('active', card.dataset.preset === name);
    });
  }

  presetCards.forEach(card => {
    card.addEventListener('click', () => {
      applyPreset(card.dataset.preset);
    });
  });

  btnReset.addEventListener('click', () => {
    applyPreset('brik');
  });

  // Snapshot Capture
  btnSnapshot.addEventListener('click', () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = threeCanvas.width;
    tempCanvas.height = threeCanvas.height;
    const ctx = tempCanvas.getContext('2d');

    ctx.drawImage(threeCanvas, 0, 0);
    ctx.drawImage(skeletonCanvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `iridescent-veil-snapshot-${Date.now()}.png`;
    a.click();
  });
});
