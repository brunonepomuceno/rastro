import * as THREE from 'three';
import { IridescentFabricShader, LiquidRippleShader, ThermalVisionShader, AsciiShader } from './shaders.js';
import { MeshBuilder } from './meshBuilder.js';

// MediaPipe Hand Landmark Connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],           // Index
  [5, 9], [9, 10], [10, 11], [11, 12],      // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],    // Ring
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
];

export class AppRenderer {
  constructor(canvas3d, skeletonCanvas, videoElement) {
    this.canvas3d = canvas3d;
    this.skeletonCanvas = skeletonCanvas;
    this.ctx2d = skeletonCanvas.getContext('2d');
    this.video = videoElement;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 3.0;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas3d,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Video Texture
    this.videoTexture = new THREE.VideoTexture(this.video);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBAFormat;

    // Video Background Plane
    const bgGeo = new THREE.PlaneGeometry(1, 1);
    const bgMat = new THREE.MeshBasicMaterial({ map: this.videoTexture });
    this.bgMesh = new THREE.Mesh(bgGeo, bgMat);
    this.bgMesh.position.z = -0.8;
    this.scene.add(this.bgMesh);

    // Iridescent Fabric Mesh
    this.meshBuilder = new MeshBuilder(24, 24);
    this.material = new THREE.ShaderMaterial({
      vertexShader: IridescentFabricShader.vertexShader,
      fragmentShader: IridescentFabricShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(IridescentFabricShader.uniforms),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.material.uniforms.uTexture.value = this.videoTexture;

    this.fabricMesh = new THREE.Mesh(this.meshBuilder.geometry, this.material);
    this.scene.add(this.fabricMesh);

    // Settings
    this.skeletonColor = '#00ffaa';
    this.skeletonThickness = 2.5;
    this.isPlaying = true;
    this.clock = new THREE.Clock();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  setEffectType(type) {
    if (type === 'liquidRipple') {
      this.material.vertexShader = LiquidRippleShader.vertexShader;
      this.material.fragmentShader = LiquidRippleShader.fragmentShader;
    } else if (type === 'thermalVision') {
      this.material.vertexShader = ThermalVisionShader.vertexShader;
      this.material.fragmentShader = ThermalVisionShader.fragmentShader;
    } else if (type === 'ascii') {
      this.material.vertexShader = AsciiShader.vertexShader;
      this.material.fragmentShader = AsciiShader.fragmentShader;
    } else {
      this.material.vertexShader = IridescentFabricShader.vertexShader;
      this.material.fragmentShader = IridescentFabricShader.fragmentShader;
    }
    this.material.needsUpdate = true;
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.skeletonCanvas.width = width;
    this.skeletonCanvas.height = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.updateBgMeshScale();

    if (this.material.uniforms.uResolution) {
      this.material.uniforms.uResolution.value = [width, height];
    }
  }

  updateBgMeshScale() {
    const distance = 3.8;
    const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
    const visibleHeight = 2 * Math.tan(fovRad / 2) * distance;
    const visibleWidth = visibleHeight * this.camera.aspect;

    const videoAspect = (this.video.videoWidth && this.video.videoHeight)
      ? (this.video.videoWidth / this.video.videoHeight)
      : (16 / 9);

    let planeWidth = visibleWidth;
    let planeHeight = visibleHeight;

    if (this.camera.aspect < videoAspect) {
      planeWidth = visibleHeight * videoAspect;
    } else {
      planeHeight = visibleWidth / videoAspect;
    }

    this.bgMesh.scale.set(planeWidth, planeHeight, 1);
    this.visibleBounds = { width: visibleWidth, height: visibleHeight };
  }

  updateHandLandmarks(results) {
    // If paused, freeze tracking updates and keep current frame intact
    if (!this.isPlaying) return;

    if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      this.fabricMesh.visible = false;
      this.clearSkeletonCanvas();
      return;
    }

    this.fabricMesh.visible = true;
    const hand1 = results.multiHandLandmarks[0];
    const hand2 = results.multiHandLandmarks[1] || null;

    const bounds = this.visibleBounds || { width: 3.5, height: 2.0 };
    this.meshBuilder.updateMeshFromLandmarks(hand1, hand2, this.camera.aspect, bounds);
    this.drawSkeletonOverlay(results.multiHandLandmarks);
  }

  drawSkeletonOverlay(handsLandmarks) {
    const ctx = this.ctx2d;
    const w = this.skeletonCanvas.width;
    const h = this.skeletonCanvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = this.skeletonColor;
    ctx.fillStyle = this.skeletonColor;
    ctx.lineWidth = this.skeletonThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    handsLandmarks.forEach(landmarks => {
      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];

        const x1 = (1.0 - p1.x) * w;
        const y1 = p1.y * h;
        const x2 = (1.0 - p2.x) * w;
        const y2 = p2.y * h;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      landmarks.forEach(p => {
        const x = (1.0 - p.x) * w;
        const y = p.y * h;

        ctx.beginPath();
        ctx.arc(x, y, this.skeletonThickness * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  clearSkeletonCanvas() {
    this.ctx2d.clearRect(0, 0, this.skeletonCanvas.width, this.skeletonCanvas.height);
  }

  render() {
    if (this.isPlaying) {
      const elapsedTime = this.clock.getElapsedTime();
      this.material.uniforms.uTime.value = elapsedTime;

      if (this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
        this.videoTexture.needsUpdate = true;
        this.updateBgMeshScale();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
