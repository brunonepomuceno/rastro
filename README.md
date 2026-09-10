# rastro

Rastro é uma aplicação web interativa para processamento visual e renderização de efeitos refrativos em tempo real. O sistema utiliza a câmera do dispositivo para rastrear os movimentos das mãos e aplicar shaders customizados em malhas 3D e filtros de pós-processamento.

## Funcionalidades

- **Rastreamento de Mãos (MediaPipe Hands):** Mapeamento de 21 pontos de articulação por mão com baixa latência.
- **Efeitos de Shaders (WebGL via Three.js):**
  - **Motion Veil:** Malha 3D conectada entre os dedos com reflexão, refração óptica e dispersão cromática (RGB shift).
  - **Liquid Ripple:** Distorções ondulatórias de fluido sobre o feed de vídeo.
  - **Thermal Vision:** Mapeamento de luminância para paleta de visão térmica.
  - **TouchDesigner Portal:** Efeito portal com deformação radial e franjas de cor iridescentes.
  - **ASCII Art:** Renderização procedimental em matriz de caracteres.
  - **Glitch Effect:** Aberração cromática com linhas de varredura e ruído.
  - **Effect Circle:** Sistema de instanciamento em GPU para anéis de efeito entre os pontos das mãos.
- **Controles em Tempo Real:**
  - Painel lateral para ajuste de parâmetros (opacidade, dispersão RGB, nível de iridescência, espessura do esqueleto).
  - Seleção de presets visuais (Brik Original, Liquid Glass, Neon Prism, Rainbow Silk).
  - Exportação de capturas de tela (PNG) em alta resolução.
  - Alternância de exibição em tela cheia (Fullscreen).

## Requisitos

- Node.js (versão 18 ou superior)
- Navegador web moderno com suporte a WebGL e acesso à webcam.

## Instalação e Execução

1. Clone o repositório e acesse o diretório do projeto:
   ```bash
   git clone https://github.com/brunonepomuceno/rastro.git
   cd rastro
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Como Usar

1. Ao abrir a aplicação, autorize o acesso à câmera.
2. Posicione uma ou ambas as mãos em frente à câmera.
3. Utilize o botão **Painel** no canto superior direito para abrir as configurações.
4. Alterne entre os shaders de efeito no menu **Effect Shader**.
5. Ajuste a cor e a espessura do esqueleto de rastreamento conforme desejado.
6. Clique no botão **Exportar** para capturar e baixar a imagem renderizada.

## Estrutura do Projeto

```
rastro/
├── index.html          # Estrutura DOM da interface
├── package.json        # Dependências e scripts de build
├── vite.config.js      # Configuração do Vite
└── src/
    ├── main.js         # Eventos de UI e inicialização da aplicação
    ├── handTracker.js  # Integração com MediaPipe Hands e simulação demo
    ├── renderer.js     # Cena Three.js, malha 3D e renderização do esqueleto
    ├── meshBuilder.js  # Construção da geometria customizada da malha
    ├── shaders.js      # GLSL Vertex e Fragment Shaders
    └── style.css       # Estilo visual da interface
```

## Compilação para Produção

Para gerar os arquivos estáticos otimizados para produção:

```bash
npm run build
```

Os arquivos compilados serão gerados na pasta `dist/` e podem ser hospedados em qualquer servidor web estático.

## Licença

MIT
