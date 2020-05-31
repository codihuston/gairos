# Getting Started

> NOTE: This file was ported over from another project, and is a work in
progress!

## For Developers

This document will tell you how to begin developing on this boilerplate.
Documentation that details exactly either component in this project will be
contained in the `docs` directory of each respective component. This only
serves as an entry point into developing on the application it self; that is,
how to start the application(s).

Currently, you can develop in this project by starting it using the
following tooling:

1. Using `skaffold` (multi-container)

In the future, there may be more ways to develop on this project.

## Developing Using Skaffold

This method relies on Kubernetes to run this project in a multi-container
environment on any platform that supports Kubernetes in some form or fashion. The benefit of this is, we take this straight to production at
scale with a few changes!

### Prerequisites

1. Kubernetes is installed ([Docker Desktop](https://www.docker.com/products/docker-desktop) with Kubernetes Enabled)

    - Docker > Settings > Kubernetes > Check, Enable Kubernetes > Apply & Restart
    - A [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) setup with `kubectl` should suffice as well
    - Ultimately, when `kubectl` is operational
    > NOTE: You may want to go to Docker > Settings > Resources and expand the
    available resources to the K8s cluster. In the next section, you can
    take advantage of those resources when you copy k8s configs to the
    dev directory

2. [Skaffold](https://skaffold.dev/) is installed

### Starting the Project

1. In order to begin, we must set up [ingress-nginx](https://kubernetes.github.io/ingress-nginx/). It is possible that you may already have one enabled on your machine. If that is the case, you may skip this setup.
Otherwise, use the provided `ingress-nginx-config-example.yml` file as such:

    ```cmd
    kubectl apply -f ingress-nginx-config-example.yml
    ```

    This will install the `ingress controller`, which we will later configure
    using an `ingress service`. The service will route traffic to the app(s)
    as per the rules defined in our `k8s-dev\ingres-service.yml` file.

    > Note: Once you restart your computer, you may have to restart this
    controller in order to view your web app via your browser

1. Copy the contents of the `k8s-examples` directory to the `k8s-development`

    > Note: If you want to configure environment variables or other default
    configurations, do so in the destination directory mentioned above.
    The defaults work out-of-box for `Windows w/ Docker Desktop Kubernetes`.
    See `k8s-dev/README.md` if you are operating in a different environment
    for additional instructions

1. Initialize secure environment variables. You can do this in your bash
profile (Linux) or user/machine-level environment variables (Windows)

    1. `FONTAWESOME_NPM_AUTH_TOKEN=GET_KEY_FROM_REPO_OWNER`.

    > NOTE: This is used to authenticate to the fontawesome pro
    registry, `and is required when building the client application.`

1. Copy the contents of...

    1. `server/.env-example` to `server/.env-development` and `server/.env-test`

    1. `client/.env-example` to `client/.env-development` and `client/.env-test`

    A few things to know about these files:

    1. Out-of-box, these mirror the environment variables in the `k8s-dev/*-deployments.yml` files

    1. The variables here will NOT overwrite any environment variables
    pre-defined in said `k8s` files, as the `.env-*` files are ignored from the docker image build process, and will never appear in the `k8s` Pods

    1. The purpose of doing this step is so that the commands used to set up the database (discussed later in this step-by-step) or run tests for the server can be
    ran from your local machine (see: Testing the Server)

    > Note: Any `REQUIRED` variables that exist in the `.env-example` file also should be defined in the `k8s-dev/*-deployments.yml` files!

1. Install dependencies for each project.

    ```cmd
    cd server
    yarn install

    cd client
    yarn install
    ```

    > Note that the `node_modules` directories are excluded during
    the docker image process via `.dockerignore`, so you shouldn't see any
    performance drops as as result of installing dependencies

1. From the project root, run the `Skaffold` config file

    ```cmd
    skaffold dev
    ```

    > Note: You may see an error printed by the API server indicating a database error. This will be addressed in the next step.

    > Note: You can exit the `Skaffold` via SIGINT (ctrl+c). Exiting `Skaffold`
    will destroy any Kubernetes Objects defined in `k8s-dev`. The Persistent
    Volume Claims should persist between `Skaffold` instances.

    You can run the following commands to get the status of the
    services/deployments/pods:

    ```cmd
    kubectl get ingress
    kubectl get services
    kubectl get deployments
    kubectl get pods

    kubectl describe service|deployment|pod <object_name>
    ```

    After the deployments are ready, the Kubernetes cluster is served at `localhost` on port `:80` or `:443` (`WARNING:` no tls/ssl cert is used in development!). These ports are configured by default using `ingress-nginx-config.yml`. If you need to change those for any reason, make those changes to a new file locally named `ingress-nginx.yml`, and do not commit it to source (that filename is excluded from this repo by default).

    This step will apply the kubernetes config files from `k8s-dev` into the
    kubernetes cluster. This process works like so:

    1. Initialize the Kubernetes Objects as per their definitions
    1. Builds a docker image locally from each of the `Dockerfile.dev` files (if any) for the services being developed on in this project
    1. Skaffold will listen for file changes and attempt to apply them to the containers without having to re-build them (if possible) and automatically rollout the changes to each of the deployments. These live updates might take a little more time than developing without `Skaffold`

    The applications in this project are served on `localhost` as follows:

    1. Client / front-end app: `localhost`
    1. API Server: `localhost/api`
    1. SQL Server:
        1. For connecting from within the Kubernetes cluster (API server / etc.), use: `sql-cluster-ip-service` and port `3306`. (See the `sql-cluster-ip-service.yml` and `sql-deployment.yml` files)

        1. For connecting from your host machine (Native SQL Client), use: `localhost:3306`, username and password are `root`. This is made available via the Load Balancer service defined in the `sql-deployment.yml` config

1. Initialize the database tables

      > `Important:` Ensure that the sql deployment is running before continuing! If it is not, the server pods may end up in a crashed state. You can restart them by simply saving any `server/*.js` file
      to initiate a rebuild

    Out-of-box, this framework will attempt to create the database instance
    by itself. You will need to create the tables yourself.

      > Note: Depending on the api routes you visit, you may see an error from the API server logs and in the json response indicating that a database relation/table does not exist as the deployments start up. This is because the database has not been configured

    To address this issue, you should run the following command(s) from the `server` directory:

    - Create the tables: This will load all of the `src/db/models` and sync
    them to the database using `Sequelize`. These commands should be ran locally on your machine in the `server` directory

        > Note: There does not exist a similar command for the PRODUCTION environment, as this action destroys the database and rebuilds it from scratch. If you run this multiple times in your development environment,
        know that the database will essentially be `rebuilt from scratch!`

        ```cmd
        yarn run dev:db:sync
        ```
  
    - Apply Migrations: This is used to initialize a database and to apply  programmatic changes to the table structures as time goes on.

        ```cmd
        yarn run dev:db:migrate
        ```

    - Seed the tables: This is used to bulk insert data as defined in the
    `src/db/seeders` files. Seeding can be done in `all environments`, so delete
    any seeds that will not be useful in production when making a `PR` to
    `master`

        ```cmd
        yarn run dev:db:seed
        ```

### Testing the Server

Testing will only happen in the following two cases and environments:

1. Locally

    Simply run `yarn run test` in the directory of the application that you
    want to test.

    > Note: Your tests should not include the use of any external resources.
    Those should be mocked out. That is, calls to to a database should not
    literally be executed. You would test what would happen if such a call
    failed/succeeded. Unit and Integration tests should test smaller and
    larger pieces of the codebase

    > Note: The End-to-End tests should be implemented
    in by Testing Server (which this repo does not provide) during CI/CD. That
    environment could make use of the `yarn test:db:*` commands if it needed to
    configure such a database for such environment, exactly how the
    `yarn dev:db:*` commands do

1. In the CI/CD pipeline

    1. At some point in the pipeline you should build all of the
    `<application>/Dockerfile.dev` files with the `npm run test` command set as
    the image Default Command
    1. You should then run each of those images, stopping the pipeline if
    any of those fail unexpectedly
