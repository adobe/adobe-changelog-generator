Adobe Changelog Generator
=====================

**Adobe Changelog Generator**  is the core package that is used to generate a changelog file.
<!-- toc -->

---
* [Installation](#installation)
* [Commands](#commands)
* [Configuration](https://github.com/adobe/aio-cli-plugin-changelog/wiki/Configuration)
* [Template](https://github.com/adobe/aio-cli-plugin-changelog/wiki/Templates)
---
* [Development installation](https://github.com/adobe/aio-cli-plugin-changelog/wiki/Development-installation)
* [Extension Points](https://github.com/adobe/aio-cli-plugin-changelog/wiki/Extension-Points)   
---
* [Maintainers and Contributors](#maintainers-and-Contributors)
* [Contact Us](#contact-us)  
--- 
<!-- tocstop -->

## Technical Requirements
* [NodeJS 12 or higher](https://nodejs.org/en/download/)
* [AIO CLI](https://github.com/adobe/aio-cli)

# Installation
```
$ aio plugins:install -g @adobe/aio-cli-plugin-changelog
$ # OR
$ aio discover -i
$ aio changelog --help...
$ aio config set <GITHUB_TOKEN>
```

# Commands
<!-- commands -->
* [`aio changelog:generate`](#aio-changelog)

## `aio changelog:generate`

#### Options

| Long  | Short | Multiple | Description
| ------------- | ------------- | ------------- | ------------- |
| `config` | `-c` | false | The path to local machine config |
| `namespaces` | `-n` |  true | Generate changelog for provided namespaces |
<!-- commandsstop -->


## Maintainers and Contributors

This project is maintained by [Open Contribution Office](https://wiki.corp.adobe.com/display/DMSArchitecture/Open+Contribution+Office).

## Contact Us

**Slack**: [#devex-open-contribution-office](https://magento.slack.com/archives/C018Z6CB57U)

**Mail**: [devex-open-contribution-office@adobe.com](mailto:devex-open-contribution-office@adobe.com)
