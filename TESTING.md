# Diretrizes de Testes do Projeto (MagicTracked)

Instruções permanentes para execução e manutenção da suíte de testes do projeto:

## 🧪 Estrutura de Testes Exigida

Todas as novas funcionalidades, refatorações ou correções de bugs **DEVEM** obrigatoriamente validar e executar os três níveis de testes:

1. **Teste Unitário (`tests/unit.test.js`)**:
   - Valida classes e módulos isolados sem dependência de DOM (ex: codificador `GifEncoder`, quantização de cores 256, compressão LZW).

2. **Teste de Integração (`tests/integration.test.js`)**:
   - Valida o fluxo e integração entre módulos (ex: `CanvasExporter`, cálculo dinâmico de estimativa de arquivo MB/FPS, ciclo de gravação live `startLiveRecording` e `stopLiveRecording`).

3. **Teste Regressivo (`tests/regression.test.js`)**:
   - Valida a integridade da estrutura HTML (`index.html`), a ordem dos botões do cabeçalho (`Painel` -> `Gravar tela` -> `Fullscreen`), remoção de botões obsoletos e regras CSS essenciais (`src/style.css`).

---

## 🚀 Como Executar os Testes

Para rodar a suíte completa de testes (Unitários, Integração e Regressivos):

```bash
npm test
```

Para rodar a compilação do projeto:

```bash
npm run build
```
