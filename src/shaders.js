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
    varying vec2 vScreenUv;
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
      vScreenUv = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
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
    varying vec2 vScreenUv;
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

      // Use screen space UV for true refraction (aligns perfectly with background camera)
      vec2 baseUv = vScreenUv;

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

export const LiquidRippleShader = {
  uniforms: {
    uTexture: { value: null },
    uRefractionStrength: { value: 1.5 },
    uOpacity: { value: 0.95 },
    uWaveRipple: { value: 0.8 },
    uTime: { value: 0.0 },
    uResolution: { value: [1.0, 1.0] },
    // Reusing these uniforms so the sliders still work without errors
    uIridescence: { value: 0.2 },
    uChromaticDispersion: { value: 0.1 }
  },

  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uWaveRipple;

    varying vec2 vUv;
    varying vec2 vScreenUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;

      // Heavy radial ripples and displacement for liquid effect
      vec3 pos = position;
      
      // Calculate distance from center
      float dist = length(pos.xy);
      
      // Circular wave originating from the center
      float radialWave = sin(dist * 15.0 - uTime * 6.0) * exp(-dist * 1.5);
      
      // Add a secondary wave for chaos
      float noiseWave = sin(pos.x * 5.0 + uTime * 2.0) * cos(pos.y * 5.0 - uTime * 3.0);
      
      float totalWave = (radialWave * 0.8 + noiseWave * 0.2) * uWaveRipple * 0.4;
      
      // Extrude along the normal
      pos += normal * totalWave;

      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;

      vec4 mvPosition = viewMatrix * worldPosition;
      vViewPosition = -mvPosition.xyz;

      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * mvPosition;
      vScreenUv = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uRefractionStrength;
    uniform float uOpacity;
    uniform float uChromaticDispersion;
    uniform float uTime;

    varying vec2 vUv;
    varying vec2 vScreenUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Stronger refraction for thick liquid (like water/glass)
      float offsetScale = uRefractionStrength * 0.15;
      vec2 distortion = normal.xy * offsetScale;

      // RGB split for chromatic aberration through thick liquid
      float dispersion = uChromaticDispersion * 0.5;
      vec2 baseUv = vScreenUv;
      vec2 uvR = baseUv + distortion * (1.0 + dispersion);
      vec2 uvG = baseUv + distortion;
      vec2 uvB = baseUv + distortion * (1.0 - dispersion);

      // Sample webcam texture
      float r = texture2D(uTexture, clamp(uvR, 0.001, 0.999)).r;
      float g = texture2D(uTexture, clamp(uvG, 0.001, 0.999)).g;
      float b = texture2D(uTexture, clamp(uvB, 0.001, 0.999)).b;
      
      // Base liquid color (slightly tinted cyan/blue for water feel)
      vec3 liquidTint = vec3(0.9, 0.95, 1.0);
      vec3 refractedColor = vec3(r, g, b) * liquidTint;

      // Fresnel for mirror-like edges
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
      
      // Intense specular highlight for glossy liquid
      vec3 lightDir = normalize(vec3(0.8, 1.0, 0.5));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
      vec3 specularColor = vec3(1.0, 1.0, 1.0) * spec * 1.5; // Bright highlight

      // Combine
      vec3 finalColor = mix(refractedColor, vec3(0.8, 0.9, 1.0), fresnel * 0.4);
      finalColor += specularColor;

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
};

export const ThermalVisionShader = {
  uniforms: {
    uTexture: { value: null },
    uOpacity: { value: 1.0 },
    // Uniforms reused so UI sliders don't crash
    uRefractionStrength: { value: 0.0 },
    uWaveRipple: { value: 0.0 },
    uTime: { value: 0.0 },
    uResolution: { value: [1.0, 1.0] },
    uIridescence: { value: 0.0 }, 
    uChromaticDispersion: { value: 0.0 }
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec2 vScreenUv;
    void main() {
      vUv = uv;
      // Flat projection, no 3D distortion for thermal vision to match the screenshots
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vScreenUv = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec2 vScreenUv;

    // Heatmap gradient mapping function
    // Colors go from Dark Blue -> Green -> Yellow -> Red -> Pink/White
    vec3 getThermalColor(float value) {
      // Clamp the input value to ensure it stays in bounds
      float t = clamp(value, 0.0, 1.0);
      
      vec3 c0 = vec3(0.0, 0.0, 0.5);       // Dark Blue (Coldest)
      vec3 c1 = vec3(0.0, 0.8, 0.2);       // Green
      vec3 c2 = vec3(0.9, 0.9, 0.1);       // Yellow
      vec3 c3 = vec3(1.0, 0.1, 0.0);       // Red
      vec3 c4 = vec3(1.0, 0.0, 0.8);       // Pink (Hottest)
      vec3 c5 = vec3(1.0, 1.0, 1.0);       // White (Core)

      vec3 color;
      if (t < 0.2) {
        color = mix(c0, c1, t / 0.2);
      } else if (t < 0.4) {
        color = mix(c1, c2, (t - 0.2) / 0.2);
      } else if (t < 0.6) {
        color = mix(c2, c3, (t - 0.4) / 0.2);
      } else if (t < 0.8) {
        color = mix(c3, c4, (t - 0.6) / 0.2);
      } else {
        color = mix(c4, c5, (t - 0.8) / 0.2);
      }
      return color;
    }

    void main() {
      // Sample the original camera texture using screen space coordinates
      vec4 texColor = texture2D(uTexture, vScreenUv);
      
      // Calculate luminance (brightness) to act as heat
      // Using standard perceptual luminance weights
      float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      
      // Enhance contrast slightly for better thermal effect
      float heat = smoothstep(0.1, 0.9, luminance);

      // Map the brightness to the thermal color gradient
      vec3 thermalColor = getThermalColor(heat);

      gl_FragColor = vec4(thermalColor, uOpacity);
    }
  `
};

export const AsciiShader = {
  uniforms: {
    uTexture: { value: null },
    uOpacity: { value: 1.0 },
    // Uniforms reused so UI sliders don't crash
    uRefractionStrength: { value: 0.0 },
    uWaveRipple: { value: 0.0 },
    uTime: { value: 0.0 },
    uResolution: { value: [1.0, 1.0] },
    uIridescence: { value: 0.0 }, 
    uChromaticDispersion: { value: 0.0 }
  },

  vertexShader: /* glsl */ `
    varying vec2 vScreenUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vScreenUv = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    uniform float uTime;
    varying vec2 vScreenUv;

    // ASCII procedural character generator using SDF
    float character(vec2 p, float lum) {
      // Scale coordinates to 0..1 inside the cell
      p = fract(p);
      float c = 0.0;
      
      // Determine which shape to draw based on brightness
      if (lum > 0.8) {
        // '#' Hash - Brightest
        float h = step(abs(p.x - 0.3), 0.1) + step(abs(p.x - 0.7), 0.1);
        float v = step(abs(p.y - 0.3), 0.1) + step(abs(p.y - 0.7), 0.1);
        c = clamp(h + v, 0.0, 1.0);
      } else if (lum > 0.6) {
        // '*' Asterisk
        float cross = step(abs(p.x - 0.5), 0.1) + step(abs(p.y - 0.5), 0.1);
        float diag = step(abs(p.x - p.y), 0.1) + step(abs(p.x + p.y - 1.0), 0.1);
        c = clamp(cross + diag, 0.0, 1.0);
      } else if (lum > 0.4) {
        // '+' Plus
        c = clamp(step(abs(p.x - 0.5), 0.1) + step(abs(p.y - 0.5), 0.1), 0.0, 1.0);
      } else if (lum > 0.2) {
        // '.' Dot
        c = step(length(p - vec2(0.5)), 0.15);
      } else {
        // ' ' Space - Darkest
        c = 0.0;
      }
      return c;
    }

    void main() {
      // Determine the size of the ASCII cells
      // We divide the screen into 80 columns (like a terminal)
      float cols = 80.0;
      
      // Aspect ratio of the cell (assuming 16:9 for the camera feed, cell width/height)
      vec2 cellSize = vec2(1.0 / cols, (1.0 / cols) * (16.0/9.0)); 
      
      // Calculate which cell this pixel belongs to
      vec2 cellPos = floor(vScreenUv / cellSize) * cellSize;
      
      // Sample the texture color at the center of the cell
      vec2 samplePos = cellPos + (cellSize * 0.5);
      vec4 texColor = texture2D(uTexture, samplePos);
      
      // Calculate luminance of the cell
      float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      
      // Create character based on local coordinate inside the cell
      vec2 localPos = vScreenUv / cellSize;
      float asciiMask = character(localPos, luminance);
      
      // Matrix green color theme
      vec3 matrixGreen = vec3(0.1, 0.9, 0.2);
      
      // Optional: blend the original color slightly
      vec3 finalColor = mix(vec3(0.0), matrixGreen * (0.5 + luminance * 0.5), asciiMask);

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
};
