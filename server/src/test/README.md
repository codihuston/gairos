# Testing the Server

For this project, it is intended to test the server locally, outside of the k8s
cluster. For this reason, there is some setup required.

## Setup Before Testing

1. `cd` into the project root and ensure that your k8s cluster is running
(namely, the database), by running the skaffold command from the project root

    ```cmd
    skaffold dev
    ```

    > Note: we will not be running tests inside of the k8s cluster, but on the
    outside, from our host machine. This is step is done to ensure that the
    external components (databases, etc.) are running, which the
    integration/e2e tests are designed to interact with.


1. `cd` into `server` on your host machine and install dependencies by running

    ```cmd
    yarn install
    ```

1. Copy the `server\.env-example` into `server\.env-test`.

    This is loaded into the server when you execute the test runner. The important settings here are the variables holding connection info to external resources (databases, etc.). Since the sql server is hosted inside the K8s cluster, we cannot reference it here by the `sql-cluster-ip-service`.

    Instead, the default `k8s-dev` config out-of-box will expose the ports
    for the `sql-deployment` via a load balancer, so that we can specify the `DB_HOST=localhost`, and `DB_PORT=` must match said port.

1. Run the tests

    ```cmd
    # run all
    yarn run test

    # run unit tests only
    yarn run test:unit

    # run integration tests only
    yarn run test:int

    # run end-to-end tests only
    yarn run test:e2e
    ```

    > NOTE: When running integration tests, you may encounter an issue where the
    database connection is not being established, but the error is being
    swallowed from the test runner stdout.
    For me, this was due to using an older version of the `pg` client.
    It should be fixed, but if you encounter such an issue, please install
    the latest version via `npm` and try again.
