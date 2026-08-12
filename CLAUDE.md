# CLAUDE.md — doacaoCuba

Este arquivo orienta qualquer assistente de IA (e desenvolvedores humanos) trabalhando neste repositório. Siga estas regras à risca.

## 1. Regra de commits

**Nunca realize commits automáticos.** Só crie um commit quando o usuário pedir explicitamente. `make send` sempre pergunta a mensagem de commit antes de agir — nunca a preencha sozinho.

## 2. Padrão de idioma

- Toda documentação, comentários de UI, mensagens de erro/toast e mensagens de commit devem ser escritas em **Português do Brasil, com acentuação correta**.
- Código (nomes de variáveis, funções, classes) permanece em inglês, seguindo as convenções de cada linguagem.

## 3. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Backend | Laravel (11+; instalado 13.x — 11 está fora de suporte de segurança), PHP 8.4+, MySQL 8, Laravel Sanctum (token Bearer) |
| Frontend | React 19, TypeScript 5+, Vite, Tailwind CSS v4, React Router |
| Infra | Docker + Docker Compose, Nginx, Redis, Git |

## 4. Estrutura de pastas

```
/
├── backend/            Laravel — API REST (routes/api.php)
├── pages/              Telas React (rotas)
├── components/         layout/, ui/, auth/, donation/, admin/
├── services/           Cliente HTTP (apiClient.ts) + serviços por recurso
├── hooks/              useAuth, useToast, useModalClose, useDonations, useDebounce
├── utils/              types.ts, formatters.ts, constants.ts
├── docker/             php/ (Dockerfiles + opcache), nginx/ (dev/initial/production)
├── main.tsx, router.tsx, index.css, index.html
├── docker-compose.yml       (dev)
├── docker-compose.prod.yml  (produção)
├── Makefile
└── README.md
```

O frontend fica na raiz do repositório (sem pasta `frontend/` ou `src/`), conforme o padrão da empresa.

## 5. Comandos `make`

**Nunca execute `php artisan` diretamente fora do Makefile/Docker.** Todo comando artisan deve passar por `docker compose exec app php artisan ...`.

| Comando | Descrição |
|---|---|
| `make up` | Sobe o ambiente de desenvolvimento (Docker, hot reload) |
| `make up-prod` | Sobe o ambiente de produção |
| `make down` | Derruba os containers de desenvolvimento |
| `make migrate` | Roda as migrations |
| `make seed` | Roda os seeders |
| `make fresh` | `migrate:fresh --seed` |
| `make db` | Abre o cliente MySQL |
| `make thinker` / `make tinker` | Abre o Tinker |
| `make shell` | Shell dentro do container `app` |
| `make lint` | Pint (backend) + oxlint + tsc (frontend) |
| `make send` | Lint → pergunta mensagem de commit → branch `auto/*` → push → PR (se `gh`/`glab` configurado) |
| `make deploy` | `git pull` + deploy completo (produção) |
| `make deploy-rebuild` | Rebuild de imagens + deploy completo |
| `make deploy-first` | Primeiro deploy: certificado TLS + deploy completo (requer `DOMAIN=...`) |
| `make deploy-first-ip` | Primeiro deploy sem domínio: HTTP puro por IP, sem TLS (requer `IP=...`) |

## 6. Convenções de código

### Backend (Laravel)
- Controllers são finos: recebem um FormRequest, chamam um Service, retornam uma API Resource envolvida em `App\Traits\ApiResponse`.
- Toda validação de entrada usa **FormRequest** (`app/Http/Requests`), nunca validação inline no controller.
- Toda saída de API passa por uma **API Resource** (`app/Http/Resources`) — nunca retorne um Model diretamente.
- Regra de negócio vive em **Services** (`app/Services`), nunca no Controller.
- Toda tabela tem `id()`, `timestamps()` e `softDeletes()`. Chaves estrangeiras usam `->constrained()->onDelete(...)`.
- Seeders são idempotentes — sempre `updateOrCreate()`, nunca inserts estáticos.

### Frontend (React)
- Somente componentes funcionais + hooks. Sem classes.
- Props tipadas via `interface`.
- **Nunca** faça `fetch`/`axios` direto dentro de um componente — toda chamada de API vive em `/services`.
- Todo `<input>` que usa o componente `Input` (`components/ui/Input.tsx`) deve receber `name` (ou `id`) explícito, senão o `<label>` não fica associado ao campo (acessibilidade).

## 7. Padrões de UI

- **Glassmorphism**: use as classes utilitárias já definidas em `index.css` (`.glass-panel`, `.glass-card`, `.glass-input`, `.glow-emerald`, `.glow-cyan`, `.cuba-decay-texture`) — não recrie o efeito com classes Tailwind soltas.
- **Paleta**: emerald/blue/cyan sobre fundo slate-950 (ver `utils/constants.ts` e `index.css`). Âmbar para acentos administrativos, rosa para erros.
- Componentes reutilizáveis já existem em `components/ui/` (`GlassCard`, `GlassPanel`, `Button`, `Input`, `StatTile`, `StatusBadge`, `DataTable`, `Modal`) — reutilize antes de criar um novo.
- Responsividade é obrigatória em toda tela nova (mobile/tablet/desktop).

### Modais
Todo modal **deve** usar o hook `useModalClose` (`hooks/useModalClose.ts`) ou o componente `Modal` (que já o usa internamente). Isso garante que ESC e clique fora sempre fecham o modal — não implemente esse comportamento manualmente em cada componente.

### Erros e toasts
- Erros de API **nunca** aparecem como "Error 500" ou mensagem crua do backend. O interceptor em `services/apiClient.ts` traduz cada código HTTP para uma mensagem humana em português antes de chegar ao componente.
- Um 401 desloga o usuário automaticamente e redireciona para `/login` com um toast explicativo.
- Erros de validação (422) retornam o objeto `errors` por campo — exiba-os junto ao campo correspondente, não apenas como toast genérico.
- Toda mensagem de erro nova (backend ou frontend) deve ser clara e em português, nunca um código técnico cru.

## 8. LGPD

- Cadastro de visitante (RF-12/13) exige aceite explícito (`lgpd_consent`) antes de criar a conta — o backend rejeita a requisição sem esse campo.
- Senhas são sempre hasheadas (`Hash::make`), nunca armazenadas em texto plano.
- Um usuário só acessa/edita os próprios dados via `/api/profile` — não existe endpoint para um visitante ver dados de outro.
- Dados do doador em uma doação (`donations.donor_*`) são um snapshot no momento da doação, não uma referência viva ao perfil — isso preserva o histórico mesmo que o usuário edite o perfil depois.

## 9. Fuso horário

Toda a aplicação usa **America/Sao_Paulo (UTC-3)** — `config/app.php` (`timezone`) no backend e `Intl.DateTimeFormat(..., { timeZone: 'America/Sao_Paulo' })` no frontend (`utils/formatters.ts`). Nunca converta datas para UTC ao salvar ou exibir.

## 10. Contas de demonstração

Todas com senha `123456`:
- **Administrador**: `admin@admin.com`
- **Visitante**: `visitante@doacaocuba.org`

A tela de login tem um card de atalhos que preenche essas credenciais automaticamente.

## 11. Limitações conhecidas

- **`make send`**: a criação/merge automático de PR depende de `gh` ou `glab` configurado com um remote válido. Sem isso, o comando faz commit + push e para por aí (não é um erro, é o comportamento esperado documentado).
- **Pagamento**: a seleção de forma de pagamento é inteiramente estilizada — não há integração real com nenhum gateway (Pix, cartão, boleto ou cripto).
- **Watcher do Vite em Docker**: bind mounts do Docker Desktop/WSL2 não propagam eventos de sistema de arquivos para dentro do container, então `vite.config.ts` usa `usePolling`. O `ignored` exclui `backend/`, `docker/` e `.git/` — nunca remova essa exclusão: fazer polling sobre `backend/vendor` (milhares de arquivos) derruba a performance do dev server (chegamos a ver respostas de 17s+ antes de restringir o watcher).
