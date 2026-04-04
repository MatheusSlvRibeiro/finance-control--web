# Finance Control — Frontend

Aplicação web de controle financeiro pessoal com autenticação JWT, dashboard interativo, gerenciamento de contas, transações e categorias.

> Backend Django REST disponível em: [finance-control--api](https://github.com/MatheusSlvRibeiro/finance-control-backend)
>
> Demo: [https://fincontrol.devreloaded.com.br](https://fincontrol.devreloaded.com.br)

---

## Funcionalidades

- Autenticação com JWT (login, cadastro, logout, proteção de rotas)
- Dashboard com cards de saldo, receitas e despesas
- Gráfico de evolução de despesas (linha) e despesas por categoria (pizza)
- Gerenciamento de contas (criar, editar, excluir)
- Gerenciamento de transações (criar, editar, excluir, filtrar)
- Gerenciamento de categorias integrado com a API
- Layout responsivo com sidebar e header adaptativos
- Estados de loading (skeleton) e empty state em todas as listagens

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Roteamento | React Router DOM 7 |
| HTTP | Axios (com interceptors JWT e logout automático em 401) |
| Estilo | SCSS Modules + design tokens globais |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Testes | Vitest + Testing Library |
| Deploy | Vercel |

---

## Arquitetura

```
src/
├── components/
│   ├── layout/          # AppLayout, AppHeader, AppSidebar, Footer
│   └── ui/              # Button, Select, Dropdown, Modal, Input, SkeletonLoader
├── constants/           # Mapeamentos estáticos (tipos de conta, etc.)
├── context/             # AuthContext + AuthProvider
├── hooks/               # useAccounts, useTransactions, useCategories, useUser...
├── mocks/               # Dados de teste para Vitest
├── pages/               # Landing, Login, Register, Dashboard, Accounts, Transactions, Categories
├── routes/              # ProtectedRoute + AppRoutes
├── services/
│   ├── api.ts           # Instância Axios com interceptors
│   ├── genericService.ts
│   ├── accounts/
│   ├── auth/
│   ├── category/        # categoryService + categoryNormalizer
│   ├── transactions/    # transactionService + transactionNormalizer
│   └── user/
├── styles/              # globals.scss, variables.scss (tokens injetados globalmente)
├── types/               # Account, Category, Transaction, User
└── utils/               # formatCurrency, formatDate
```

### Decisões de arquitetura

**Separação por domínio em todos os níveis**
Cada feature (accounts, transactions, categories) tem sua própria pasta em `pages/`, `services/`, `hooks/` e `types/`. Isso torna o código previsível e facilita encontrar o que precisa ser alterado.

**GenericService\<T\> como base**
A classe base encapsula a lógica de paginação do DRF (`PaginatedResponse<T>`). Serviços específicos herdam dela e adicionam apenas os métodos de domínio.

**Normalização na camada de serviço**
A API retorna `account_type`, `category_type`, `category_color` (enum string) e `opening_balance`. Essas transformações para o shape que os componentes esperam (`type`, `color` em hex, `openingBalance`) ficam nos normalizadores — os componentes nunca lidam com o shape raw da API.

**Identificador `uuid` consistente**
Todos os tipos (`Account`, `Category`, `Transaction`, `User`) usam `uuid` como campo de identificação, alinhado com o que a API retorna.

**Logout automático em 401**
O interceptor de resposta do Axios dispara o evento customizado `unauthorized`. O `AuthProvider` escuta esse evento e executa logout + redirect, sem precisar que cada componente trate esse caso individualmente.

**Migração Next.js → React + Vite**
O projeto usou Next.js inicialmente. A migração para Vite foi motivada por: falha crítica com `react-server`, ausência de necessidade real de SSR num dashboard autenticado, e impossibilidade de injetar variáveis SCSS globalmente no Next.js sem repetir imports em cada arquivo.

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Backend rodando localmente (ver instruções no repositório da API)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/MatheusSlvRibeiro/finance-control.git
cd finance-control

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da sua API local
```

### Variáveis de ambiente

```env
# .env
VITE_API_URL=http://localhost:8000/
```

### Rodando

```bash
pnpm dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Testes

```bash
pnpm test          # executa uma vez
pnpm test:watch    # modo watch
```

---

## Deploy

O frontend está configurado para deploy na Vercel via `vercel.json`, com rewrites para suporte a SPA routing (todas as rotas redirecionam para `index.html`).

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

A variável `VITE_API_URL` deve ser configurada nas variáveis de ambiente do projeto na Vercel apontando para o backend em produção.

---

## Autor

**Matheus Ribeiro** — Desenvolvedor Fullstack

- GitHub: [MatheusSlvRibeiro](https://github.com/MatheusSlvRibeiro)
- LinkedIn: [matheusslvribeiro](https://www.linkedin.com/in/matheusslvribeiro/)
