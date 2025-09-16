# App Preview

![App Preview](./app-preview.png)

# Application Launch Guide

within the cloned repository:

```bash
docker compose up
```

# Docker Guide

## Starting Services

To start all the services defined in the `docker-compose.yml` file, run the following command:

```
docker-compose up
```

## Using the Database in a Service

If you have a service that requires a connection to the PostgreSQL database, here's how to set up the connection:

Instead of:

```
postgres://username:password@0.0.0.0:5434/databaseName
```

Use:

```
postgres://username:password@db:5432/databaseName
```

# [API Documentation](./api/docs/api-routes.md)

# [Development guide](./api/README.md)

# Contributors

- [@EwenSellitto](https://github.com/EwenSellitto)
- [@FlorianMinguet](https://github.com/FlorianMinguet)
- [@valakama](https://github.com/valakama)
- [@William-Stoops](https://github.com/William-Stoops)
- [@WilliamDrmrd](https://github.com/WilliamDrmrd)
