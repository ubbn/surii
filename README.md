# Bi-surii

Memory management app

## Requirement

`docker` and `docker compose plugin` is required for development.  
VSCode is recommended.

## Develop locally

```bash
# Build image
docker compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) --no-cache

# Install all dependencies
docker compose run --rm frontend pnpm install

# Run development server inside docker container
docker compose up

# Optionally, execute other commands if necessary
docker compose run --rm frontend <command inside container>
docker compose run --rm frontend pnpm --version

# Optionally, remove any residual data, volumes, container history etc...
docker compose rm -fsv
```

## Debug with test backend

```bash
# Add .env file with test backend endpoints. then re-run docker compose
cat >> .env << 'END'
NEURON_API=https://<api gateway id>.execute-api.<aws env>.amazonaws.com/prod/neuron
NTREE_API=https://<api gateway id>.execute-api.<aws env>.amazonaws.com/prod/ntree
END
```

Open in browser on [localhost:5137](http://localhost:5173/)

## Develop setup

Install recommended VSCode plugins for code styles and linting

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension styled-components.vscode-styled-components
```
