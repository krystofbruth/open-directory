# CLI

The Open Directory CLI enables admins to manage their users.

## Running the CLI

Make sure the project is built by running `npm run build` and start the CLI script using the syntax

```
node dist/cli.js <command>
```

List of available commands may be found below.

Bear in mind that this CLI tool doesn't require the server to be started, as it connects to the database directly and manages all business logic itself.

## `create-user`

Starts an interactive user creation session.
