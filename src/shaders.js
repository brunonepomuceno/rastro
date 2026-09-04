export const IridescentFabricShader = {
  uniforms: {
    uTexture: { value: null },
    uRefractionStrength: { value: 0.76 },
    uOpacity: { value: 0.9 },
    uIridescence: { value: 0.85 },
    uChromaticDispersion: { value: 0.05 },
    uWaveRipple: { value: 0.4 },
    uTime: { value: 0.0 },
    uResolution: { value: [1.0, 1.0] }
  },

  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uWaveRipple;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;

      // Calculate dynamic wave ripples across fabric surface
      vec3 pos = position;
      float wave1 = sin(pos.x * 6.0 + uTime * 3.0) * cos(pos.y * 6.0 + uTime * 2.5);
      float wave2 = cos(pos.x * 12.0 - uTime * 4.0) * sin(pos.y * 10.0 + uTime * 3.5);
      float totalWave = (wave1 * 0.7 + wave2 * 0.3) * uWaveRipple * 0.12;

      pos += normal * totalWave;

      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;

      vec4 mvPosition = viewMatrix * worldPosition;
      vViewPosition = -mvPosition.xyz;

      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uRefractionStrength;
    uniform float uOpacity;
    uniform float uIridescence;
    uniform float uChromaticDispersion;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    // Cosine color palette for smooth holographic rainbow gradients
    vec3 rainbowPalette(in float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.0, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Screen space UV coordinates
      vec2 screenUv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
      // Fallback to texture UV if screen UV offset is out of bounds
      vec2 baseUv = vUv;

      // Refraction displacement offset computed from surface normal
      float offsetScale = uRefractionStrength * 0.08;
      vec2 distortion = normal.xy * offsetScale;

      // Chromatic dispersion (RGB channel split)
      float dispersion = uChromaticDispersion * 0.4;
      vec2 uvR = baseUv + distortion * (1.0 + dispersion);
      vec2 uvG = baseUv + distortion;
      vec2 uvB = baseUv + distortion * (1.0 - dispersion);

      // Sample webcam texture with RGB split
      float r = texture2D(uTexture, clamp(uvR, 0.001, 0.999)).r;
      float g = texture2D(uTexture, clamp(uvG, 0.001, 0.999)).g;
      float b = texture2D(uTexture, clamp(uvB, 0.001, 0.999)).b;
      vec3 refractedColor = vec3(r, g, b);

      // Fresnel effect for edge glow and iridescence angle dependence
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);

      // Rainbow holographic tint based on view angle and position
      float rainbowPhase = fresnel * 1.8 + vWorldPosition.x * 0.5 + vWorldPosition.y * 0.5 + uTime * 0.15;
      vec3 iridescentColor = rainbowPalette(rainbowPhase);

      // Specular highlight
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
      vec3 specularColor = vec3(1.0) * spec * 0.6;

      // Combine refracted video feed with iridescence and sheen
      vec3 finalColor = mix(refractedColor, iridescentColor, fresnel * uIridescence * 0.7);
      finalColor += specularColor + iridescentColor * uIridescence * 0.15;

      // Subtle edge sheen highlight
      finalColor += vec3(0.8, 1.0, 0.9) * pow(fresnel, 4.0) * 0.5;

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
};
