---
title: CV
showDate: false
showAuthor: false
layout: "profile"
showTableOfContents: true
showReadingTime: false
baseURL: "https://jorgesintes.xyz/cv/"
runtimeDownloads:
  - path: /files/jorge-sintes-cv.pdf
    label: Open CV as PDF
---

## Experience

{{< company_title companyName="Grazper Technologies" url="https://www.grazper.com" logoLight="/company_logos/grazper_logo_light.svg" logoDark="/company_logos/grazper_logo_dark.svg" >}}

{{< position title="Machine Learning Software developer" duration="04/2023 - Present" >}}

- Led the redesign of a legacy multi-camera annotation tool into a modern **FastAPI + Vue** web application tailored to Grazper's large-scale multi-camera 3D datasets, enabling **~10 internal annotators** to work efficiently through a novel **3D-first interaction model** for pose correction and review.

- Built database-backed backend services for recordings, drafts, poses, tracklets, and user workflows using **PostgreSQL, SQLAlchemy, Alembic, and Pydantic**.

- Designed and implemented **authentication and user provisioning with Microsoft Entra ID / OpenID Connect**, enabling secure company-wide access to the annotation platform.

- Co-designed and integrated an **auto-annotation pipeline** and supported model-development efforts for human pose recognition, contributing to training workflows and design discussions around detection and pose-estimation systems.

- Led the company's **migration from Gitea to GitHub**, establishing reproducible CI/CD workflows on containerized **self-hosted GitHub runners** for privacy-sensitive dataset and model pipelines. Check out [this post](/posts/self_hosted_github_runners) for more details.

- Deployed and maintained core internal platform infrastructure, including a **self-hosted package registry**, **Prometheus + Grafana** for observability, and **MLflow** for experiment tracking and model deployment workflows.

{{< position title="Master Thesis Student" duration="07/2022 - 02/2023" >}}

- Researched methods to **improve 3D human pose estimation** using IoT sole-pressure sensors.

- Designed a supervised model predicting pressure signals to **enable pose estimation without physical sensors**.

{{< company_title companyName="Novo Nordisk" url="https://www.novonordisk.com" logoLight="/company_logos/novo_nordisk_logo.svg" logoDark="/company_logos/novo_nordisk_logo.svg" >}}

{{< position title="Data Science Student" duration="06/2021 - 07/2022" >}}

- Performed **data processing, statistical analysis, and visualization** for the HR department of Novo Nordisk's largest production site.
- Built automated pipelines for **data collection, cleaning, and reporting**.
- Developed forecasting models to **predict workforce population trends**.

{{< company_title companyName="DTU" url="https://www.dtu.dk" logoLight="/company_logos/dtu_logo_light.png" logoDark="/company_logos/dtu_logo_light.png" >}}
{{< position title="Teaching Assistant" duration="02/2021 - 06/2021" >}}

- Assisted teaching the course **02450 -- Introduction to Machine Learning and Data Mining**.
- Supervised weekly labs for **40+ students** and evaluated course projects.

## Technical skills

{{< icontitle iconClass="fa-solid fa-terminal" title="Languages" >}}

{{< multicolumnlist >}}

- **Python**
- **TypeScript/JavaScript**
- Bash
- C/C++
- HTML/CSS
- LaTeX
- Matlab {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-server" title="Backend / APIs" >}}

{{< multicolumnlist >}}

- **FastAPI**
- **Pydantic**
- SQLAlchemy
- Alembic
- Flask
- WebSockets {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-database" title="Databases" >}}

{{< multicolumnlist >}}

- **PostgreSQL**
- SQL
- data modeling
- DB migrations {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-circle-nodes" title="Machine learning" >}}

{{< multicolumnlist >}}

- **PyTorch**
- **PyTorch Lightning**
- MLflow
- OpenCV
- Scikit-learn
- FiftyOne {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-microchip" title="Numerical" >}}

{{< multicolumnlist >}}

- **NumPy**
- Autograd
- SciPy {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-cubes" title="Infrastructure / DevOps" >}}

{{< multicolumnlist >}}

- **Docker**
- **Git**
- **GitHub Actions**
- self-hosted runners
- Linux
- Gitea (packages)
- Vim {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-shield-halved" title="Observability / Auth" >}}

{{< multicolumnlist >}}

- **Prometheus**
- **Grafana**
- Microsoft Entra ID
- OpenID Connect
- OAuth 2.0 {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-chart-line" title="Data viz" >}}

{{< multicolumnlist >}}

- **Pandas**
- Matplotlib
- Plotly/Dash {{< /multicolumnlist >}}

{{< icontitle iconClass="fa-solid fa-palette" title="Frontend" >}}

{{< multicolumnlist >}}

- **Vue**
- **Hugo**
- Pinia
- Three.js {{< /multicolumnlist >}}

---

## Projects

Here are some of the projects I've done in the past or I'm currently doing now:

- [ScaleGuru](https://scaleguru.jorgesintes.dev/) \
  A web tool for practicing musical scales and keys, designed for daily use in my own music practice. Built with
  **TypeScript**, with ear-training and visualization features for structured instrument practice.
- [PureGym Telegram Bot](https://github.com/JorgeSintes/puregym-bot) \
  Telegram bot for automating PureGym booking workflows and personal gym schedule management.
- [Sudoku Solver](https://github.com/JorgeSintes/sudoku_project) \
  Toy project where I build a web-app solution that lets you upload a picture of a sudoku and solves it. Currently
  in development.
- [Bayesian Methods for Electroencephalogram (EEG) Decoding](https://github.com/JorgeSintes/CNN_EEG_signals) \
  Implementing and comparing the performance of different Bayesian Neural Networks (Ensembles/SWA/SWAG/MultiSWAG)
  with state-of-the-art deep learning techniques in the task of classifying EEG readings while the test subjects
  imagines performing a task.
- [Time Series Anomaly Detection with Variational AutoEncoder and GRU](https://github.com/JorgeSintes/Advanced_Machine_Learning)
  \
  Research project for DTU's Advanced Machine Learning course exploring ways of combining VAEs with RNNs to detect
  anomalies in real-world time-series data from vehicle telemetry, including the design and training of novel hybrid
  architectures. Read the paper [here](/files/time-series-anomaly-detection-vae-gru.pdf).

---

## Education

- [MSc in Mathematical Modelling and Computation](https://www.dtu.dk/english/education/graduate/msc-programmes/mathematical-modelling-and-computation)
  at [Technical University of Denmark (DTU)](https://www.dtu.dk/): _09/2020 - 02/2023_\
  Worked on courses and group projects across machine learning, computer science, and applied mathematics, with
  relevant topics including deep learning, Bayesian machine learning, algorithms and data structures, high-performance
  computing, optimization, and stochastic processes.

- [BSc + MSc in General Engineering](https://www.upv.es/titulaciones/MUII/index-en.html) at
  [UPV](https://www.upv.es/): _09/2015 - 07/2020_\
  Broad engineering education covering mathematics, physics, statistics, thermodynamics, materials, mechanics,
  electronics, automatics, and electrical engineering. Specialized further in Electrical Engineering through a
  research internship in the department of Electrical Engineering.

---

## Other Activities

{{< icontitle iconClass="fa-solid fa-music" title="Music" >}}

Trombonist performing in orchestras, jazz ensembles, and modern music bands. I also practice classical guitar and
jazz improvisation, and studied Jazz in parallel at Sedajazz music academy in Valencia.

{{< icontitle iconClass="fa-solid fa-chalkboard-user" title="Teaching" >}}

One-to-one tutoring in technical subjects during university; I enjoy helping others understand complex concepts.
