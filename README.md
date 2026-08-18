# Architech

Blog/portfolio pessoal — listagem de posts com busca, filtro por tag e ordenação, mais uma
sidebar de perfil, projetos e contato. Inspirado em [carolinelog](https://carolinelog.vercel.app/).

- **Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend**: Python + Flask + SQLAlchemy (SQLite)

## Rodando localmente

### Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
flask --app run seed-db       # cria e popula o banco SQLite
flask --app run run           # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

## Rodando com Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:4173
- Backend: http://localhost:5000

## API

| Método | Rota                | Descrição                                             |
| ------ | -------------------- | ------------------------------------------------------ |
| GET    | `/api/posts`          | Lista posts. Query params: `q`, `category`, `tag`, `sort` (`desc`\|`asc`) |
| GET    | `/api/posts/<slug>`   | Detalhe de um post (inclui conteúdo em Markdown)        |
| GET    | `/api/tags`            | Categorias com suas tags                                |
| GET    | `/api/profile`         | Dados do perfil                                         |
| GET    | `/api/projects`        | Lista de projetos                                       |
| GET    | `/api/contact`         | Links de contato                                         |
