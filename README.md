# OpenDirectory

## Overview

OpenDirectory is a directory server with an aim to be a competetive self-hosted free alternative to services such as Microsoft Entra ID (previously Azure Active Directory).

## Features

- Account creation & management
- Permission's governance
- Linking of external apps via OAuth2 (WIP)
- Comprehensive UI for managing users (WIP)

## Prerequisites

- PostgreSQL 17 deployment

## Setup

1. Setup the DB by running SQL statements inside the `setup/postgres` directory, starting with `root.sql` and continuing sequentially.

2. Install the necessary packages and build the project.

```
npm install && npm run build
```

3. Run the start script.

```
npm run start
```

## CLI

Currently, the only way to officially interact with the Open Directory is through the use of a command line interface running on the server. Refer to `docs/CLI.md` for details.

## API

Inside the `docs/oapi` directory, you may find the OpenAPI specification for implementing apps that work with Open Directory.

## License

Refer to the `LICENSE.md` file.
