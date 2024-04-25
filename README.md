# 🐢 jorgesintes.xyz 🐢

This repository contains the source code for my personal blog, built with [Hugo](https://gohugo.io/) and styled using [picoCSS](https://picocss.com/). Previously, I was using the [Congo](https://jpanther.github.io/congo/) theme, but I decided to rewrite it from the minimal [Lugo](https://github.com/LukeSmithxyz/lugo) theme to bring it to a minimal codebase that I can easily understand, modify and use.

## Local Development
To set up and run the blog locally, make sure you have [Hugo](https://gohugo.io/) installed. Then:
1. Clone the repo:
```bash
git clone https://github.com/JorgeSintes/jorgesintes.xyz.git
cd jorgesintes.xyz
```
2. Start the Hugo server:
```bash
hugo server
```
This will start the local development server. Visit `http://localhost:1313` to view it.

3. Create new posts by adding markdown files to `content/posts`, or adding folders with an `index.md` and a `thumbnail.jpg`. Hugo will automatically render these in the blog post.

## Deployment
For deployment, just run:
```bash
hugo
```
This will place all the website files under `public/`. You just then need to serve the contents of the website in a server,
maybe [nginx](https://www.nginx.com/).