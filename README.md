Adobe Changelog Generator
=====================

**Adobe Changelog Generator**  is the core package that is used to generate a changelog file.
<!-- toc -->
* [Installation and update](#installation)
* [Commands](#commands)
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

### Update
Please use the latest version of the plugin.   
Use command `aio plugins` to see plugins that are outdated.  
Use command `aio plugins:update` for update plugins to latest stable version.  


# Commands
<!-- commands -->
* [`aio changelog:generate`](#aio-changeloggenerate)

## `aio changelog:generate`

Changelog generation tool

```
Changelog generation tool

USAGE
  $ aio changelog:generate

OPTIONS
  -c, --config=config          Path to local machine config

  -n, --namespaces=namespaces  [default: ] Generate changelog for specific namespace, example:
                               organization/repository:branch

EXAMPLE
  $ aio changelog:generate
```
<!-- commandsstop -->


## Maintainers and Contributors

This project is maintained by [Open Contribution Office](https://wiki.corp.adobe.com/display/DMSArchitecture/Open+Contribution+Office).

## Contact Us

**Slack**: [#devex-open-contribution-office](https://magento.slack.com/archives/C018Z6CB57U)

**Mail**: [devex-open-contribution-office@adobe.com](mailto:devex-open-contribution-office@adobe.com)
