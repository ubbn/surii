# Bi-surii

Memory management app

## Tech stack

- [ReactJS 18](https://react.dev/) with Typescript
- [Ant Design](https://ant.design/) as UI framework
- [Styled-component](https://styled-components.com/) for customizing styles
- [Vite](https://vitejs.dev/) as dev build tool
- [PNPM](https://pnpm.io/) for package manager
- [Docker](https://www.docker.com/) for development environment
- [Github Action](https://docs.github.com/en/actions) for automated CD
- [Firebase](https://firebase.google.com/) for deployment

## Requirement

Only `docker` and `docker compose plugin` are needed for development. Its official guide [here](https://docs.docker.com/engine/install/).  
[VisualStudio Code](https://code.visualstudio.com/) is recommended as IDE.

## Development

```bash
# Build image
docker compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) --no-cache

# Install all dependencies
docker compose run --rm frontend pnpm install

# Run development server inside docker container
docker compose up
```

Open it in browser on [localhost:5137](http://localhost:5173/)

## Run test

```bash
docker compose run --rm frontend pnpm tests
```

## Optional

```bash
# Execute other commands if necessary
docker compose run --rm frontend <command inside container>
docker compose run --rm frontend pnpm --version

# Remove any residual data, volumes, container history etc...
docker compose rm -fsv
```

## Debug with test backend

```bash
# Add .env file with test backend endpoints, then re-run docker compose
cat >> .env << 'END'
NEURON_API=https://<api gateway id>.execute-api.<aws env>.amazonaws.com/prod/neuron
NTREE_API=https://<api gateway id>.execute-api.<aws env>.amazonaws.com/prod/ntree
END
```

## Development Setup

Install recommended VSCode plugins for code styles and linting

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension styled-components.vscode-styled-components
```
