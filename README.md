# MagicTracked

MagicTracked é uma aplicação web interativa para processamento visual e renderização de efeitos refrativos em tempo real. O sistema utiliza a câmera do dispositivo (ou modo simulador demo) para rastrear os movimentos das mãos e aplicar shaders customizados em malhas 3D e filtros de pós-processamento, além de permitir gravação e exportação em GIF e MP4.

## Funcionalidades

- **Rastreamento de Mãos (MediaPipe Hands):** Mapeamento de 21 pontos de articulação por mão com baixa latência e modo simulador (demo) automático.
- **Efeitos de Shaders (WebGL via Three.js):**
  - **Motion Veil:** Malha 3D conectada entre os dedos com reflexão, refração óptica e dispersão cromática (RGB shift).
  - **Liquid Ripple:** Distorções ondulatórias de fluido sobre o feed de vídeo.
  - **Thermal Vision:** Mapeamento de luminância para paleta de visão térmica.
  - **TouchDesigner Portal:** Efeito portal com deformação radial e franjas de cor iridescentes.
  - **ASCII Art:** Renderização procedimental em matriz de caracteres.
  - **Glitch Effect:** Aberração cromática com linhas de varredura e ruído.
  - **Effect Circle:** Sistema de instanciamento em GPU para anéis de efeito entre os pontos das mãos.
- **Gravação de Tela & Exportação (GIF / MP4):**
  - Gravação ao vivo da tela interativa diretamente na interface.
  - Painel lateral de exportação com suporte a formatos **GIF** e **MP4 (H.264)** compatível com QuickTime Player e reprodutores nativos.
  - Controles de velocidade (0.5x, 1x, 1.5x, 2x), taxa de quadros (10, 15, 20, 24 FPS) e resolução (Auto, 100%, 50%).
  - Estimativa de tamanho de arquivo e barra de progresso em tempo real.
- **Controles & UI:**
  - Botões de ação no cabeçalho (`Painel`, `Gravar tela`, `Fullscreen`).
  - Painéis laterais colapsáveis e mutuamente exclusivos para edição e exportação.
  - Seleção de presets visuais (Brik Original, Liquid Glass, Neon Prism, Rainbow Silk).

## Requisitos

- Node.js (versão 18 ou superior)
- Navegador web moderno com suporte a WebGL e WebCodecs.

## Instalação e Execução

1. Clone o repositório e acesse o diretório do projeto:
   ```bash
   git clone https://github.com/brunonepomuceno/magic-tracked.git
   cd magic-tracked
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

## Testes Automatizados

O projeto conta com suítes de testes unitários, de integração e regressivos:

```bash
npm test
```

Consulte o arquivo [`TESTING.md`](file:///Users/bl4k.code/Developer/cam/TESTING.md) para obter mais detalhes sobre as regras e execução de testes.

## Estrutura do Projeto

```
magic-tracked/
├── index.html          # Estrutura DOM da interface e sidebars
├── package.json        # Dependências (three, gifenc, mp4-muxer) e scripts
├── TESTING.md          # Instruções e regras dos testes
├── tests/              # Suítes de testes unitários, integração e regressivos
└── src/
    ├── main.js         # Inicialização e manipulação da UI
    ├── exporter.js     # Engine de exportação (GIF via gifenc e MP4 via mp4-muxer + WebCodecs)
    ├── handTracker.js  # Integração MediaPipe Hands e modo simulador
    ├── renderer.js     # Cena Three.js, malha 3D e overlay de esqueleto
    ├── meshBuilder.js  # Geometria da malha 3D
    ├── shaders.js      # Vertex e Fragment Shaders
    └── style.css       # Design da interface e painéis laterais
```

## Compilação para Produção

Para gerar os arquivos estáticos otimizados para produção:

```bash
npm run build
```

Os arquivos compilados serão gerados na pasta `dist/`.

## Licença

MIT

