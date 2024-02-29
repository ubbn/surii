# Bi-surii

Memory management app

## Develop locally

```bash
# Install all dependencies
docker compose run --rm frontend pnpm install

# Execute other commands if necessary
docker compose run --rm frontend <command inside container>

# Run development server inside docker container
docker compose up

# Remove any residual data, volumes, container history etc...
docker compose rm -fsv
```

Open in browser on [localhost:5137](http://localhost:5173/)

## Develop setup

Install recommended VSCode plugins for code styles and linting

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```
