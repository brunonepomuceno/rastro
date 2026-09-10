# 🌈 Motion Veil (Efeitos Refrativos & Shaders)

Uma aplicação web interativa em 3D que rastreia os movimentos das mãos do usuário através da câmera e cria múltiplos efeitos visuais e holográficos manipuláveis em tempo real.

---

## ⚡ Recursos Principais

* **Rastreamento Gestual 3D (MediaPipe Hands):** Rastreia 21 pontos anatômicos das mãos em tempo real a 60 FPS diretamente no navegador.
* **Shaders e Efeitos GLSL (Three.js WebGL):**
  * **Iridescent Fabric:** Tecido refrativo, com refração óptica, dispersão cromática e gradiente Fresnel.
  * **Liquid Ripple:** Distorções aquáticas simulando ondas líquidas.
  * **Thermal Vision:** Câmera térmica com mapeamento de luminosidade para cores de calor.
  * **ASCII Art:** Filtro clássico verde em estilo *Matrix* gerado procedimentalmente.
  * **Glitch Effect:** Efeito *cyberpunk* com aberração cromática severa, *scanlines* CRT e ruído estático de canal morto.
  * **Effect Circle:** Sistema avançado de *GPU Instancing* que renderiza múltiplos painéis de efeito espiralados flutuando entre as duas mãos.
* **Interface de Estúdio Completa:**
  * Modo **Fullscreen (100% Tela Cheia)**.
  * Painel de controles dinâmicos.
  * Sistema de Snapshot (Exportação de quadros da câmera para PNG de alta resolução).
  * Modo **Simulador Demo** interno integrado para simular mãos virtualmente.

---

## 🚀 Como Executar Localmente

O projeto foi rigorosamente **sanitizado e otimizado** para produção utilizando a ferramenta de *build* **Vite**. Não sofre com dependências NPM pesadas ou incompatibilidades de módulos estáticos, mantendo um perfil leve e limpo.

```bash
# 1. Instale as dependências (Vite e Three.js)
npm install

# 2. Inicie o servidor local de desenvolvimento
npm run dev
```

Acesse o IP ou \`localhost\` exibido no terminal.

---

## 🌍 Como Fazer Deploy em Produção (Servidores Online)

A arquitetura do projeto foi reformulada para evitar problemas clássicos de importação dinâmica em produção. Você pode gerar a versão de produção e hospedá-la instantaneamente em serviços estáticos como **GitHub Pages**, **Vercel**, **Netlify** ou **AWS S3**.

1. **Gere a Build de Produção:**
   ```bash
   npm run build
   ```
   *Isto criará uma pasta chamada \`/dist\` na raiz do seu projeto contendo o HTML enxuto, CSS minificado e JS empacotado e ofuscado.*

2. **Hospede a pasta \`/dist\`:**
   Faça o upload de todo o conteúdo da pasta \`/dist\` para a raiz do seu provedor de hospedagem web ou *bucket*. O sistema de build já está configurado (\`vite.config.js\`) com \`base: './'\`, o que assegura o funcionamento impecável dos arquivos estáticos em qualquer caminho, domínio ou sub-diretório de URL (ex: \`meudominio.com/app-camera/\`).

---

## 📄 Licença

Todos os direitos reservados.
