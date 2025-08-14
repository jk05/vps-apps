COMPOSE_BASE_GUESTBOOK=guestbook/compose.yaml
COMPOSE_OVERRIDE_GUESTBOOK=guestbook/compose.override.yaml

dev-guestbook-up:
	docker compose -f $(COMPOSE_BASE_GUESTBOOK) -f $(COMPOSE_OVERRIDE_GUESTBOOK) up --build

dev-guestbook-down:
	docker compose -f $(COMPOSE_BASE_GUESTBOOK) -f $(COMPOSE_OVERRIDE_GUESTBOOK) down

prod-guestbook-up:
	docker compose -f $(COMPOSE_BASE_GUESTBOOK) up -d

prod-guestbook-down:
	docker compose -f $(COMPOSE_BASE_GUESTBOOK) down