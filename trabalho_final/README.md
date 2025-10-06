# SGCPD – Gerenciador de Notas com Categorias/Tags  
Next.js + Prisma + PostgreSQL

Aplicação full-stack para criar, organizar e buscar **notas** com **categorias**, **tags**, **status** e **data**. Inclui autenticação, painel (dashboard), filtros, modais de visualização/edição, configurações (perfil, tema claro/escuro, alteração de senha) e **exclusão de conta**.

---

## 🧰 Tecnologias

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS 4**
- **Prisma ORM** (migrations + client)
- **PostgreSQL 14+**
- **pnpm** como gerenciador de pacotes
- (Opcional) **DBeaver** para inspecionar o banco

---

## 🚀 Instalação e Execução (Debian 12)

### 1) Pré-requisitos

```bash
# Node.js LTS e pnpm
sudo apt-get update
sudo apt-get install -y curl ca-certificates gnupg
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm -g i pnpm

# PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

### 2) Banco de Dados

```bash
# entrar como usuário postgres
sudo -u postgres psql

-- crie usuário e banco (altere a senha!)
CREATE USER sgcpd_user WITH PASSWORD 'sgcpd_pass';
ALTER ROLE sgcpd_user CREATEDB;        -- necessário em dev para shadow database
CREATE DATABASE sgcpd_db OWNER sgcpd_user;
GRANT ALL PRIVILEGES ON DATABASE sgcpd_db TO sgcpd_user;
\q
```

> Se não puder conceder `CREATEDB`, veja “Solução de problemas” mais abaixo para migrar sem shadow DB.

### 3) Clonar e configurar

```bash
git clone <https://github.com/leticiaCamargoufg/Disciplina-Front-End/tree/trabalho-final>.git
cd <https://github.com/leticiaCamargoufg/Disciplina-Front-End/tree/trabalho-final>
pnpm i
```

Crie o arquivo **`.env`** na raiz:

```env
# Prisma / PostgreSQL
DATABASE_URL="postgresql://sgcpd_user:sgcpd_pass@localhost:5432/sgcpd_db?schema=public"

# Se for usar shadow DB desabilitado (ver troubleshooting)
# SHADOW_DATABASE_URL="file:disabled"

# Se o projeto usar JWT/tokens:
JWT_SECRET="troque-por-uma-chave-forte"
```

### 4) Prisma

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### 5) Rodar em desenvolvimento

```bash
pnpm dev
```

Abra: http://localhost:3000

### 6) Build de produção (opcional)

```bash
pnpm build
pnpm start
```

---

## 🗺️ Rotas principais

- `/signup` – cadastro de usuário  
- `/` – login  
- `/dashboard` – painel com cards de notas (CRUD, filtros)  
- `/settings` – perfil, tema, troca de senha e **apagar conta**

---

## 🧱 Estrutura do Projeto (resumo)

```
prisma/
  schema.prisma
src/
  app/
    api/               # rotas de API (auth, me, notes, etc.)
    dashboard/         # tela principal de notas
    settings/          # configurações
    (auth pages)       # login, signup, forgot/reset
  components/          # Topbar, Sidebar, NoteCard, Modal, Toast, etc.
  lib/                 # prisma client, helpers de auth, current-user
```

---

## ✅ Funcionalidades

- **Autenticação**
  - Login, cadastro, alteração de senha
- **Notas (CRUD)**
  - Criar, visualizar, editar e excluir notas
  - Campos: título, descrição, **data** e **status** (*A Fazer*, *Fazendo*, *Concluída*)
- **Categorias e Tags**
  - 1 categoria opcional por nota
  - várias **tags** por nota (inserção separadas por vírgula)
- **Busca e Filtros**
  - Busca textual (top bar)
  - Filtros por **Categoria**, **Tag** e **Status**
  - Botão **Limpar** para resetar filtros
- **UI/UX**
  - Layout responsivo
  - Cards com menu de 3 pontos (Editar/Excluir)
  - Modais com alto contraste
  - Toast de feedback
  - Botão flutuante (FAB) para criar nota
- **Configurações**
  - Editar **nome** e **email**
  - **Excluir conta** (remove usuário e seus dados)

---

## 🔌 Conectar com DBeaver (opcional)

1. **Database → New Connection → PostgreSQL**  
2. Host: `localhost` | Port: `5432` | Database: `sgcpd_db`  
   User: `sgcpd_user` | Password: `sgcpd_pass`  
3. Teste e **Finish**.

---

## 🧪 Comandos Úteis

```bash
pnpm prisma studio                  # UI do Prisma
pnpm prisma format                  # formata schema
pnpm prisma migrate dev --name x    # nova migração
pnpm lint                           # lint do projeto
```

---

## 🧾 Modelos (Prisma) – visão geral

- **User**: `id`, `name`, `email (unique)`, `passwordHash`, `role`, `resetToken?`, `resetTokenExpires?`, timestamps  
- **Note**: `id`, `title`, `content?`, `date`, `status? ("todo"|"doing"|"done")`, `userId`, `categoryId?`, `tags (NoteTag[])`  
- **Category**: `id`, `name`, `userId`, `@@unique([userId, name])`  
- **Tag**: `id`, `name`, `userId`, `@@unique([userId, name])`  
- **NoteTag**: pivô `@@id([noteId, tagId])`

---

## 🧩 Troubleshooting

### Erro P3014 – *permission denied to create database*
O Prisma usa shadow DB em `migrate dev`. Alternativas:

1. **Conceda `CREATEDB`** ao usuário (recomendado em dev).  
2. Rode migração com o usuário `postgres` apenas para migrar:
   ```bash
   DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/sgcpd_db?schema=public" pnpm prisma migrate dev
   ```
3. **Desabilitar shadow DB** (não recomendado, mas útil em ambientes restritos):
   - `.env`:
     ```env
     SHADOW_DATABASE_URL="file:disabled"
     ```
   - `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider          = "postgresql"
       url               = env("DATABASE_URL")
       shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
     }
     ```

### Aviso do Next.js sobre *Cross origin* em dev
Se acessar pela rede (ex.: `http://192.168.x.x:3000`) e aparecer o aviso, inclua no `next.config.ts`:

```ts
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.x.x:3000"], // ajuste para o seu IP/porta
  },
};
export default nextConfig;
```

### `headers().get(...)` precisa ser “awaited”
No App Router, `headers()`/`cookies()` são **APIs assíncronas**. Use utilitários que as aguardem antes de acessar valores de autenticação.

---

## 📝 Checklist Rápido

1. `pnpm i`  
2. Criar `.env` com `DATABASE_URL`  
3. Criar usuário e banco no PostgreSQL  
4. `pnpm prisma migrate dev && pnpm prisma generate`  
5. `pnpm dev` → http://localhost:3000  
6. Cadastrar usuário em **/signup** e usar o **/dashboard**

---

## 📄 Licença

Projeto educacional. Adapte a licença conforme sua necessidade (ex.: MIT).

---

## 👤 Autor(es)
Trabalho final:

https://github.com/leticiaCamargoufg/Disciplina-Front-End/tree/trabalho-final

Discentes: 
Higor Nóbrega
Letícia Camargo
Pedro Felipe Carrijo
Raniere Luiz