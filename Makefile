.PHONY: up up-prod down migrate seed fresh deploy send db thinker tinker shell \
        deploy-full deploy-rebuild deploy-first deploy-first-ip lint

# ---------------------------------------------------------------------------
# Development
# ---------------------------------------------------------------------------

up:
	docker compose down --remove-orphans
	docker compose up -d --build

down:
	docker compose down

migrate:
	docker compose exec app php artisan migrate

seed:
	docker compose exec app php artisan db:seed

fresh:
	docker compose exec app php artisan migrate:fresh --seed

db:
	docker compose exec mysql mysql -udoacaocuba -pdoacaocuba doacaocuba

# Named "thinker" per the company Makefile standard (kept literally); "tinker" is provided as an alias.
thinker:
	docker compose exec app php artisan tinker

tinker: thinker

shell:
	docker compose exec app sh

# ---------------------------------------------------------------------------
# Lint (used by `make send`)
# ---------------------------------------------------------------------------

lint:
	docker compose exec app ./vendor/bin/pint --test
	npm run lint
	npx tsc --noEmit

# ---------------------------------------------------------------------------
# Git workflow — Phase 1: code -> main
# ---------------------------------------------------------------------------

send:
	@$(MAKE) lint
	@read -p "Mensagem de commit: " msg; \
	branch="auto/$$(date +%Y%m%d-%H%M%S)"; \
	if [ -z "$$(git status --porcelain)" ]; then \
		echo "Nada para commitar."; \
		exit 0; \
	fi; \
	git checkout -b "$$branch"; \
	git add -A; \
	git commit -m "$$msg"; \
	git push -u origin "$$branch"; \
	if command -v gh >/dev/null 2>&1 && git remote get-url origin >/dev/null 2>&1; then \
		gh pr create --fill --base main --head "$$branch" && \
		gh pr merge "$$branch" --auto --merge --delete-branch; \
	elif command -v glab >/dev/null 2>&1 && git remote get-url origin >/dev/null 2>&1; then \
		glab mr create --fill --target-branch main --source-branch "$$branch" --yes; \
	else \
		echo "gh/glab não configurado (ou sem remote) — pulando criação/merge de PR. Branch enviada: $$branch"; \
		exit 0; \
	fi; \
	git checkout main; \
	git pull; \
	git branch -d "$$branch"

# ---------------------------------------------------------------------------
# Git workflow — Phase 2: main -> production
# ---------------------------------------------------------------------------

up-prod:
	docker compose -f docker-compose.prod.yml up -d --build

deploy:
	git stash
	git pull
	@$(MAKE) deploy-full

deploy-rebuild:
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml up -d app
	@$(MAKE) deploy-full

deploy-first:
	@test -n "$$DOMAIN" || { echo "Defina DOMAIN=seu-dominio.com antes de rodar make deploy-first"; exit 1; }
	sed "s/__DOMAIN__/$$DOMAIN/g" docker/nginx/initial.conf > docker/nginx/active.conf
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml up -d
	docker compose -f docker-compose.prod.yml exec app composer install --no-dev --optimize-autoloader --no-interaction
	docker compose -f docker-compose.prod.yml exec app php artisan key:generate --force
	docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot -d $$DOMAIN
	sed "s/__DOMAIN__/$$DOMAIN/g" docker/nginx/production.conf > docker/nginx/active.conf
	docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
	@$(MAKE) deploy-full
	docker compose -f docker-compose.prod.yml exec app php artisan config:cache

deploy-first-ip:
	@test -n "$$IP" || { echo "Defina IP=seu-ip antes de rodar make deploy-first-ip"; exit 1; }
	sed "s/__IP__/$$IP/g" docker/nginx/ip.conf > docker/nginx/active.conf
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml up -d
	docker compose -f docker-compose.prod.yml exec app composer install --no-dev --optimize-autoloader --no-interaction
	docker compose -f docker-compose.prod.yml exec app php artisan key:generate --force
	@$(MAKE) deploy-full
	docker compose -f docker-compose.prod.yml exec app php artisan config:cache

deploy-full:
	@echo "==> [1/6] Preparando ambiente"
	@START=$$(date +%s); \
	docker compose -f docker-compose.prod.yml exec app chmod -R 775 storage bootstrap/cache; \
	docker compose -f docker-compose.prod.yml exec app rm -f public/hot; \
	if [ ! -f docker/nginx/active.conf ]; then \
		test -n "$$DOMAIN" || { echo "docker/nginx/active.conf não existe e DOMAIN não foi definido — rode make deploy-first primeiro."; exit 1; }; \
		sed "s/__DOMAIN__/$$DOMAIN/g" docker/nginx/production.conf > docker/nginx/active.conf; \
	fi; \
	echo "==> [2/6] Instalando dependências do backend"; \
	docker compose -f docker-compose.prod.yml exec app composer install --no-dev --optimize-autoloader --no-interaction; \
	echo "==> [3/6] Build isolado do frontend"; \
	docker compose -f docker-compose.prod.yml run --rm node sh -c "npm install && npm run build" || { echo "Build do frontend falhou — abortando deploy (aplicação não sai do ar)."; exit 1; }; \
	echo "==> [4/6] Modo de manutenção"; \
	MAINT_START=$$(date +%s); \
	docker compose -f docker-compose.prod.yml exec app php artisan down --secret="$${MAINT_SECRET:-deploy-preview}" --retry=10; \
	echo "==> [5/6] Migrations, cache e restart"; \
	docker compose -f docker-compose.prod.yml exec app php artisan migrate --force; \
	docker compose -f docker-compose.prod.yml exec app php artisan config:cache; \
	docker compose -f docker-compose.prod.yml exec app php artisan route:cache; \
	docker compose -f docker-compose.prod.yml exec app php artisan view:clear; \
	docker compose -f docker-compose.prod.yml exec app php artisan view:cache; \
	docker compose -f docker-compose.prod.yml exec app php artisan storage:link; \
	docker compose -f docker-compose.prod.yml up -d mysql redis nginx; \
	docker compose -f docker-compose.prod.yml up -d --force-recreate app scheduler queue; \
	docker compose -f docker-compose.prod.yml exec app chmod -R 775 storage bootstrap/cache; \
	docker compose -f docker-compose.prod.yml exec nginx nginx -s reload; \
	echo "==> [6/6] Saindo do modo de manutenção"; \
	docker compose -f docker-compose.prod.yml exec app php artisan up; \
	MAINT_END=$$(date +%s); \
	END=$$(date +%s); \
	echo "{\"commit\":\"$$(git rev-parse --short HEAD)\",\"date\":\"$$(date -Iseconds)\"}" > dist/version.json; \
	echo "Tempo total: $$((END-START))s | Downtime: $$((MAINT_END-MAINT_START))s"
