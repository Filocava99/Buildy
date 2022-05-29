<div style="text-align: center;">

![Build status](https://img.shields.io/github/workflow/status/filocava99/Buildy/Build/master?style=flat-square)
![Github license](https://img.shields.io/github/license/filocava99/buildy?style=flat-square)
![Github stars](https://img.shields.io/github/stars/filocava99/Buildy?style=flat-square)
![Github forks](https://img.shields.io/github/forks/filocava99/Buildy?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/filocava99/Buildy?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/filocava99/Buildy?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/filocava99/Buildy?style=flat-square)
![Codiga code quality](https://api.codiga.io/project/33237/status/svg)

</div>
<!--![(https://img.shields.io/codacy/grade/0f2d702e7c8a4372bf106d96bd693ac8/master)]-->

# <center>Buildy</center>
Buildy is a continuous deployment platform that is hosted on [GitHub pages](https://filocava99.github.io/Buildy). It is a simple, easy to use, and powerful tool for building and deploying your Java projects.

## Workflows
The workflow is easy to understand, and it is based on [GitHub Actions](https://github.com/features/actions):
1. Every 10 minutes an action is triggered which runs the NodeJS component of Buildy;
2. The NodeJS component is responsible for building the project and deploying it to GitHub pages. For doing so it needs to:
    1. Check every tracked project[^1] to see if there are new commits;
    2. If there are new commits, it will build clone the project and build it;
    3. A html page for the project is generated using Handlebars, as well as a log file and an SVG badge for the build outcome;
    4. The build artifacts, the log file and the html page are committed and pushed to the Buildy repository;
    5. A GitHub action will then update GitHub pages.

[^1]: All the tracked projects are listed in the `projects.json` file.
