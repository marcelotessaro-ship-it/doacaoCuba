# doacaoCuba

Plataforma web para arrecadação de doações em apoio ao povo cubano diante da crise econômica. Visitantes podem doar como convidados ou criar uma conta para acompanhar seu histórico; administradores acompanham todas as doações e visitantes cadastrados em um painel dedicado.

## Stack

- **Backend**: Laravel (13.x — o padrão da empresa pede "11+"; a série 11 está fora de suporte de segurança, então instalamos a última versão estável), PHP 8.4+, MySQL 8, Laravel Sanctum (autenticação por token Bearer).
- **Frontend**: React 19, TypeScript 5, Vite, Tailwind CSS v4, React Router.
- **Infra**: Docker + Docker Compose, Nginx, Redis.

Convenções de código, UI e regras de negócio detalhadas estão em [CLAUDE.md](./CLAUDE.md).

## Pré-requisitos

- Docker + Docker Compose
- `make`

## Como rodar (desenvolvimento)

```bash
cp backend/.env.example backend/.env
cp .env.example .env

make up        # sobe app, nginx, mysql, redis e o servidor Vite (hot reload)
make fresh     # roda migrations + seeders
```

URLs locais:
- Frontend: http://localhost:5173
- API: http://localhost:8080/api

## Contas de demonstração

Senha `123456` para todas:
- **Administrador**: `admin@admin.com`
- **Visitante**: `visitante@doacaocuba.org`

A tela de login tem um card de atalhos que preenche essas credenciais com um clique.

## Estrutura de pastas

```
/
├── backend/            API Laravel
├── pages/              Telas React
├── components/         layout/, ui/, auth/, donation/, admin/
├── services/           Cliente HTTP + serviços por recurso
├── hooks/               useAuth, useToast, useModalClose, useDonations, useDebounce
├── utils/               types.ts, formatters.ts, constants.ts
├── docker/               Dockerfiles (PHP) e configs Nginx (dev/initial/production)
├── docker-compose.yml        (desenvolvimento)
├── docker-compose.prod.yml   (produção)
└── Makefile
```

## Comandos `make`

| Comando | Descrição |
|---|---|
| `make up` | Sobe o ambiente de desenvolvimento |
| `make down` | Derruba os containers de desenvolvimento |
| `make migrate` / `make seed` / `make fresh` | Migrations e seeders |
| `make db` | Cliente MySQL interativo |
| `make shell` | Shell no container da aplicação |
| `make thinker` | Tinker |
| `make lint` | Pint + oxlint + tsc |
| `make send` | Lint, commit (pede a mensagem), push e abre PR (se `gh`/`glab` configurado) |
| `make up-prod` | Sobe o ambiente de produção |
| `make deploy` | Deploy em produção (`git pull` + deploy completo) |
| `make deploy-first` | Primeiro deploy: emite certificado TLS e faz o deploy completo (`DOMAIN=seudominio.com make deploy-first`) |

## Fluxo de uso

**Landing page → Login/Cadastro → Doação → Confirmação**

- A doação funciona para visitantes não autenticados ("Doe agora" na landing page abre o fluxo direto, sem exigir login).
- Criar uma conta permite acompanhar o histórico de doações e dados pessoais em `/painel`.
- Contas com papel `admin` têm acesso a `/admin`, com indicadores gerais, lista de doações e lista de visitantes (com busca).

## Deploy em produção

O pipeline de deploy (`docker-compose.prod.yml`, configs Nginx e alvos `deploy*` do Makefile) já está pronto, mas **ainda não há um servidor de produção configurado** — é infraestrutura pronta para uso, não uma implantação ativa. Veja a seção "Deployment Standard" do padrão da empresa e os comentários no Makefile para o fluxo completo (`deploy-first` → `deploy`/`deploy-rebuild`).

## Limitações conhecidas

- **Pagamento estilizado**: não há integração real com nenhum gateway de pagamento (Pix, cartão, boleto, cripto) — a doação é registrada diretamente como concluída.
- **`make send`**: a criação/merge automático de Pull Request depende de `gh` ou `glab` configurado com um remote válido; sem isso, o comando faz commit + push e para (comportamento documentado, não é um erro).

## LGPD

Este projeto segue a Lei Geral de Proteção de Dados: coleta mínima de dados, senhas sempre hasheadas, consentimento explícito no cadastro, e cada usuário só acessa/edita os próprios dados. Detalhes em [CLAUDE.md](./CLAUDE.md#8-lgpd).
