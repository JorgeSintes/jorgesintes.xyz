+++
title = "Self-Hosted GitHub Runners: My Journey to Reproducible Test Environments"
date = 2024-09-27T01:19:04+02:00
draft = false
+++

[Grazper](https://grazper.com), the company I work for, has recently decided to use **GitHub** as our
developer platform. Perhaps because I don't know how to say no, or maybe because my subconscious has a
deep-dark love for DevOps, I took the lead on the whole migration and set up all our infrastructure around
**GitHub Actions**. This is a summary of my journey so far, with the hiccups I've encountered along the way.

I believe this is a setup you might want to have in your company, your team, or even for your personal
projects if you're some kind of **self-hosted nerd** yourself. I hope you find this article useful. Throughout
the guide, I'll assume you're somewhat familiar with GitHub Actions and know the basics of the syntax—enough
to set up workflows on your own. Otherwise, [their documentation](https://docs.github.com/en/actions) is a
good place to get started. Let's dive in!

## Our pre-requisites

- Our runners have to be **self-hosted** since we want to control the hardware the tests run on. Some require
  GPU acceleration, and we want to do performance tests on different platforms (Windows, Linux on `x64` and
  `arm64`).
- We want our test environment to be **reproducible**. Tests should start from a **clean slate** and in the
  same environment every time.
- Maximum **flexibility** to the user of the test environment. You should be able to install, upgrade
  packages, and manipulate the test environment in ways that could potentially break the system.
- However, the self-hosted runner machine should handle this without actually compromising the machine itself.
- We want the **simplest** setup that can achieve all the above, to reduce maintenance cost and avoid an
  over-engineered solution.

For some organizations, it might be worth considering GitHub's
[Actions Runner Controller](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/about-actions-runner-controller),
a Kubernetes operator that orchestrates and scales self-hosted runners. However, setting up something like
this for our small company (~10 engineers) would be like using a bazooka to kill flies—and it would likely
mean spending the rest of my career here solely maintaining this system. Plus, if the machine is powerful
enough, you can just set up several runners in parallel. So, we'll pass.

## On self-hosted runners

In GitHub Enterprise, self-hosted runners can be registered at the enterprise, organization, or the repo
level. This determines the scope your runner will have, i.e., which repos would be able to use it. The setup
process, however, is the same.

Registering a self-hosted runner is **pretty easy**. Just navigate to **Actions -> Runners** in your settings
and follow the instructions on the page. Once your self-hosted runner is configured, you can run it
interactively with `./run.sh` and check if it's working. Then, you can execute a job on it by adding the
`runs-on:` keyword to your workflow. Here's a dummy action you can run:

```yaml
# .github/workflows/dummy.yml
name: Dummy action

on:
  push:
    branches: master

jobs:
  dummy-job:
    runs-on: [self-hosted, Linux]
    steps:
      - name: say hello
        run: |
          echo hello, world!
```

Without any extra configuration, however, our action will get executed on "bare-metal" under the user that set
up the runner, with its rights. This is a huge limitation for running tests because it means we only have one
environment, and either we don't allow users to alter it, or doing so is just the start of our descent down
the [nine circles of dependency hell](https://sourcegraph.com/blog/nine-circles-of-dependency-hell).

## Reproducible test environments

### Docker containers

Unless you've been living under a rock, you've definitely heard of Docker—it's like a **lightweight version of
a virtual machine**, but instead of including an entire operating system, it just packs up your app and its
essentials, making it way faster and more efficient to run anywhere, whether it's on your laptop or in the
cloud.

Luckily for us, GitHub actions has a good integration with Docker containers, and we can leverage them to
achieve our precious reproducible environments. It's "as simple" as entering the following keyword with the
name of the image you want that job to run on. The runner will then pull the image (if it's not in the
machine's cache already) and run your workflow inside a container:

```yaml
#...
jobs:
  dummy-job:
    runs-on: [self-hosted, Linux]
    container: ubuntu
    steps:
      #...
```

This is extremely powerful: it solves our reproducibility issues and gives the action complete freedom to
install, upgrade, remove packages as needed without damaging the external host. Docker is a very mature piece
of software and there are heaps of images for all the use cases you can think of. On top of that, we can
configure our custom Docker images, host them somewhere[^1] and have a reproducible environment with all our
dependencies. Nice! (_Wait, what about the gpu?_)[^3]

[^1]:
    One quirk of this system is that the image needs to be available in some registry for the runner to pull
    it down, which means you can't just build an image locally on the machine and use it. If you want to run
    on a custom Docker image, you'll need to have it available in some registry.

    Since we're using GitHub already, you could host it in
    [GitHub packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-docker-registry),
    which offers free hosting for all public repos. However, if you want to set them up privately, you can
    still use Github, or move to some cloud provider like
    [DockerHub](https://www.docker.com/products/docker-hub/), [AWS](https://aws.amazon.com/ecr/),
    [Azure](https://azure.microsoft.com/en-us/products/container-registry),
    [Google Cloud](https://cloud.google.com/artifact-registry/docs), or, if you have a thing for self-hosting
    there's alternatives like [Pulp](https://pulpproject.org/pulp_container/) or
    [Gitea](https://docs.gitea.com/usage/packages/container).

    I personally went with **Gitea**, since we can use it for self-hosting not only docker containers, but
    python, deb and npm packages and it supports LDAP authentication out of the box. Gitea is an amazing piece
    of software, it's extremely popular, well-maintained, and their package registry is
    [one of the most complete out there](https://docs.gitea.com/usage/packages/overview). Check it out!

[^3]:
    Some of our tests require GPU acceleration. The
    [NVIDIA Container Toolkit](https://github.com/NVIDIA/nvidia-container-toolkit) allows us to run GPU
    accelerated containers. To provide our job with GPU access, we only need to extend our container call like
    so:

    ```yaml
    #...
    jobs:
      dummy-job:
        runs-on: [self-hosted, Linux]
        container:
          image: ubuntu
          options: --gpus all
        steps:
          #...
    ```

    Again, check
    [their documentation](https://docs.github.com/en/actions/writing-workflows/choosing-where-your-workflow-runs/running-jobs-in-a-container)
    for more information on supported options.

I recommend taking a look at their
[documentation on how to run jobs in a container](https://docs.github.com/en/actions/writing-workflows/choosing-where-your-workflow-runs/running-jobs-in-a-container)
, for more information.

### It's reproducible now... Isn't it?

Not so fast... If you run an action inside a container and take a closer look at how GitHub is spawning the
containers in the action log (inside the _Initialize containers_ step on _Starting job container_), you'll
find something similar to:

```bash
/usr/bin/docker create \
    --name 90e78535e458472585903abd70a20877_ubuntu_a8ba9b \
    --label 836fe2 --workdir /__w/my-repo/my-repo \
    --network github_network_a7dd0070ad3346999fd4f51fd5d5059b \
    -e "HOME=/github/home" \
    -e GITHUB_ACTIONS=true -e CI=true \
    -v "/var/run/docker.sock":"/var/run/docker.sock" \
    -v "/home/myuser/actions-runner/_work":"/__w" \
    -v "/home/myuser/actions-runner/externals":"/__e":ro \
    -v "/home/myuser/actions-runner/_work/_temp":"/__w/_temp" \
    -v "/home/myuser/actions-runner/_work/_actions":"/__w/_actions" \
    -v "/home/myuser/actions-runner/_work/_tool":"/__w/_tool" \
    -v "/home/myuser/actions-runner/_work/_temp/_github_home":"/github/home" \
    -v "/home/myuser/actions-runner/_work/_temp/_github_workflow":"/github/workflow" \
    -entrypoint "tail" ubuntu "-f" "/dev/null"
```

Don't get scared. What does all of this mean? Notice a couple of details:

- The runner is changing the `HOME` folder location of our container.
- It mounts the docker socket[^4].
- It mounts the runner's `_work` folder, setting up the `my-repo` folder as the `--workdir`. This is where the
  code from our actions will get executed, and the runner doesn't clean-up this directory after itself [^2].
- The `_work/_temp/_github_home` folder gets mounted to the new home folder, and
  [GitHub claims](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables)
  this `_temp` folder is cleaned up after every job. But hold your horses.

[^4]:
    Mounting the docker socket is the simplest way to make your CI system be able to build, run and push
    containers and Docker images, provided that your container has docker installed. You can check out
    [Jérôme Petazzoni's blog post on the subject](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

[^2]:
    It took me a while to realize that this was actually the case. Actions like
    [`actions/checkout`](https://github.com/actions/checkout) that check out the code also remove the work
    folder, thus giving you a fake sense that the runner cleans up after itself when in reality it doesn't.

These mounts will **always be the same** for a project. Even worse than that, when running the action inside a
container it's fairly common that the user inside the container is `root`, so you know what happens when it
writes to these volumes, don't you? The host machine will see it as if `root` owns those files and the runner
won't even be able to clean up the `_temp` folder. Just to make it nicer, if you try, you won't see any
warning or error messages that this is the case, and you won't notice until everything fails from having
leftover garbage from 50 different tests/builds. Trust me, someone told me.

### So how do I fix it?

There seems to be a way to
[configure how self-hosted runners spawn containers](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs)
. However, as per September 2024, the page itself says:

> **Note**: This feature is currently in beta and is subject to change.

If you have more severe requirements than we do, this might be your path. For us, luckily, there's a much
simpler way:

#### 1. Configure the GitHub runner as root

This way it won't have any permission issues when reading from the stuff written by docker volumes and the
runner will be able to delete the `_temp` folder successfully. We can do so by installing the runner as a
`systemd` service as `root`. To do so:

```bash
cd actions-runner
sudo ./svc.sh install root
sudo ./svc.sh start
```

#### 2. Prevent jobs to run without a container

Having the runner as `root` means people would have the power to destroy our machine (picture a good ol'
`rm -rf /`, or a much more twisted and ... `apt-get remove nvidia-driver-*`). However, somewhere in
[the page to configure self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs)
they mention the existance of an environment variable, `ACTIONS_RUNNER_REQUIRE_JOB_CONTAINER` which we can set
to `true` to prevent this.

To do so, append the following line to the `actions-runner/.env` file:

```bash
ACTIONS_RUNNER_REQUIRE_JOB_CONTAINER=true
```

#### 3. Set up a cleanup job

As mentioned in
[their documentation](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/running-scripts-before-or-after-a-job)
, you can setup a cleanup job to run either at the start or the end of a job by setting
`ACTIONS_RUNNER_HOOK_JOB_STARTED` or `ACTIONS_RUNNER_HOOK_JOB_COMPLETED`, respectively. I personally find it
quite convenient to have access to the written files post-job for debugging purposes, so I'll set up my
cleanup job to run at the beginning. You'll need to place your cleanup script somewhere outside the
`actions-runner` folder.

```bash
#!/bin/bash

echo "Running cleanup.sh..."
# 1. Cleaning up work directory
if [ -d "$GITHUB_WORKSPACE" ] && [ "$(ls -A "$GITHUB_WORKSPACE")" ]; then
  echo "Cleaning up runner work directory: $GITHUB_WORKSPACE"
  rm -rf "${GITHUB_WORKSPACE:?}/"*
else
  echo "Runner work directory not found: $GITHUB_WORKSPACE"
fi

# 2. Pruning unused docker images
echo "Pruning unused docker images with docker image prune:"
docker image prune -f
```

Make sure your file is executable with `chmod +x cleanup.sh`, and append the hook to the `actions-runner/.env`
file:

```bash
ACTIONS_RUNNER_REQUIRE_JOB_CONTAINER=true
ACTIONS_RUNNER_HOOK_JOB_STARTED=/path/to/cleanup.sh
```

And that's it! With these few steps, you've achieved a self-hosted runner configuration that gives you full
control of the hardware your tests run on, full control of the environment they run on, and the capacity to
reproduce it at will. If you have been, thank you for reading! I hope this guide was useful to you!
