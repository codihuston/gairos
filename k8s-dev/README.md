# Purpose of this Directory

This directory is only relevant if you are using `Skaffold` for development.

If you are developing using the `Skaffold` workflow, you can configure
the development deployment of this project to your Kubernetes cluster here.
First, copy the contents of the `k8s-example` directory into here. Files in this
directory should not be committed to source, and will be `gitignored`
out-of-box. You may then configure these k8s objects to your liking.

> Note: The example files are configured such that they should work out of box.

## Changing Default Configurations

Reasons why you might not want to use the default configrations are as follows:

1. You are running a `Mac / linux Operating System`
    - You will want to update the `sql-deployment.yml` `hostPath` key as per
    the remarks in said file to change where the database is persisted on your
    local hard drive.

    > Note: If you are using a Windows machine, the pre-defined path should work out-of-box if you are using Docker Desktop. If you are NOT using Docker
    Desktop and are instead using `minikube` or otherwise for your Kubernetes
    setup, you will need to remove the `/run/desktop` prefix on the provided
    `hostPath` value

1. You already have something listening on port `80/443` on `localhost`

    - This is configured by the `ingress-controller`, which is configured by
    `ingress-nginx-example.yml` in the project root

      > Note: You may have your own existing ingress controller already set up.
      If you do, then know that the ingress controller is
      `project independent` and should be excluded from `Skaffold` entirely.
      If you are using `Skaffold` for another project, be sure that the
      http routes in project's `k8s-example/ingress-nginx.yml` file do not
      conflict, and that the other project does not tear down the
      ingress controller on shutdown.

    - Make changes by copying it to the root and renaming it to
    `ingress-nginx.yml`, and change the `port` keys on lines `291` and `295`
    to your liking
    - Apply or update your the `ingress-nginx` configuration by running:

    ```cmd
    kubectl apply -f ingress-nginx.yml
    ```

1. You have something listening on port `3306`, which is the default port for
  `mysql/mariadb`. If you want to change the `DBMS` you are using
  (move to postgres), you may want to update the port mapping as per these instructions as well...

    - This is configured by the `sql-deployment.yml` and
    `sql-cluster-ip-service.yml` files. You can replace all of the instances
    of the port number that you wish to change
    - `IMPORTANT`: If you change any `APP_*` or `DB_*` environment variables,
    you will want to ensure that your `server/.env-development` and `server/.env-test` files are matching! The `DB_HOST` should remain `localhost` if
    you are relying in the databased provided in this cluster!

1. When changing environment variables for the services, you can do so in the
following ways:
    - Use the files that you have copied into your `k8s-dev` directory
    to your liking

    > `Important`: The variables set at the container level will override any
    variables set in the `.env-*` files!