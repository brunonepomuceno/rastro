# 🌈 Iridescent Motion Veil (Tecido Refrativo Iridescente)

Uma aplicação web interativa em 3D que rastreia os movimentos das mãos do usuário através da câmera e cria um **tecido refrativo, iridescente e holográfico** esticado entre as mãos em tempo real.

Inspirado na referência de ferramentas criativas da [Brik AI](https://brik.space/).

---

## 📸 Demonstração e Visualização

![Referência do Efeito](frames/frame_003.png)
![Interação Gestual](frames/frame_008.png)

---

## ⚡ Recursos Principais

* **Rastreamento Gestual 3D (MediaPipe Hands):** Rastreia 21 pontos anatômicos das mãos em tempo real a 60 FPS.
* **Shader Refrativo GLSL (Three.js WebGL):**
  * **Refração Óptica:** Distorce o vídeo da câmera através das normais da superfície do tecido.
  * **Dispersão Cromática (RGB Split):** Separa os canais de cor nas bordas e curvas simulando cristal/vidro.
  * **Gradiente Fresnel & Iridescência:** Efeito arco-íris holográfico dinâmico baseado no ângulo de visão.
  * **Ondulações Físicas (Wave Ripples):** Deformação contínua de fluido/tecido.
* **Interface de Estúdio Completa:**
  * Modo **Fullscreen (100% Tela Cheia)** sem bordas pretas (escala *cover*).
  * Painel flutuante de controles (`Edit Controllers`) com design *Glassmorphism*.
  * Botões de **Play / Pause** que congelam perfeitamente vídeo, esqueleto e shader.
  * Seletor de cor do esqueleto wireframe (ex: `#00ffaa`).
  * 4 Presets inclusos: **Brik Original**, **Liquid Glass**, **Neon Prism** e **Rainbow Silk**.
  * Botão de **Exportação HD (PNG)** combinando o vídeo 3D e as linhas do esqueleto.
  * Modo **Simulador Demo** para testar a aplicação mesmo sem câmera conectada.

---

## 🚀 Como Publicar no GitHub Pages (Grátis e sem Build!)

Você pode publicar este projeto no **GitHub** e fazê-lo funcionar online imediatamente usando o **GitHub Pages**:

### Passo a Passo:

1. **Crie um Repositório no GitHub:**
   - Acesse [github.com/new](https://github.com/new)
   - Nomeie o repositório (ex: `iridescent-veil` ou `cam`).
   - Mantenha como **Público** e clique em **Create repository**.

2. **Suba os arquivos pelo Terminal:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - iridescent motion veil app"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

3. **Ative o GitHub Pages:**
   - No seu repositório no GitHub, vá em **Settings** (Configurações) ➔ **Pages** (no menu esquerdo).
   - Em **Build and deployment** ➔ **Source**, selecione **Deploy from a branch**.
   - Em **Branch**, selecione `main` e a pasta `/ (root)`.
   - Clique em **Save**.

4. **Pronto! 🎉**
   - Em cerca de 1 a 2 minutos, o GitHub gerará o link público do seu site:
   - 👉 `https://seu-usuario.github.io/seu-repositorio/`

---

## 🚀 Como Executar Localmente

### Opção 1: Servidor HTTP Estático (Recomendado)
```bash
python3 -m http.server 8080
```
Acesse `http://localhost:8080`.

### Opção 2: Servidor Node.js / Vite
```bash
npm install
npm run dev
```

---

## 🎛️ Guia dos Controles (Edit Controllers)

| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| **Animation** | Buttons | **Play / Pause** — Pausa ou retoma o vídeo, o rastreamento e a animação do shader. |
| **Skeleton Color** | Color Picker | Cor das linhas e juntas do esqueleto das mãos (Padrão: `#00ffaa`). |
| **Fabric Opacity** | Slider (0 - 1) | Opacidade/transparência da superfície do tecido. |
| **Refraction Strength** | Slider (0 - 150) | Intensidade do desvio e distorção óptica da imagem da câmera. |
| **Iridescence Level** | Slider (0 - 1) | Brilho do gradiente arco-íris Fresnel. |
| **RGB Dispersion** | Slider (0 - 0.15) | Separação dos canais de cor (efeito prisma cromático). |
| **Wave Ripples** | Slider (0 - 1) | Amplitude das ondulações contínuas no tecido. |
| **Skeleton Thickness**| Slider (1px - 6px) | Espessura das linhas do esqueleto desenhadas sobre as mãos. |
| **Presets** | Cards | Aplica combinações pré-configuradas de estilo com 1 clique. |

---

## 📄 Licença

Sinta-se à vontade para utilizar, modificar e integrar este efeito em seus próprios sites ou projetos criativos!
