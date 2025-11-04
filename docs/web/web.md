# Frontend Web (Vite + React)

O frontend consome os mapas/CSV gerados pelo core e apresenta dashboards e análises ao usuário final. Atualmente ele fala com a API FastAPI em modo desenvolvimento; quando a nova API em Node.js estiver pronta, basta ajustar o proxy.

## Requisitos

- Node.js LTS
- npm (ou yarn/pnpm)

## Setup

```bash
cd web
npm install
npm run dev
```

- A aplicação sobe em `http://localhost:8080/`.
- O proxy do Vite encaminha `/api`, `/mapas` e `/tabelas` para `http://127.0.0.1:8000`.

## Estrutura sugerida

- `src/components/` – componentes reutilizáveis.
- `src/pages/` – páginas/rotas principais.
- `src/services/` – clientes para a API.
- `src/styles/` – estilos globais ou Tailwind config.

## Checklist futuro

1. Atualizar o proxy e serviços quando a API Node estiver disponível.
2. Revisar páginas que dependem de renderizadores específicos (agora todos residem em `canasat.rendering`).
3. Adicionar testes (Vitest/React Testing Library) e pipeline de build quando o projeto estiver estabilizado.
