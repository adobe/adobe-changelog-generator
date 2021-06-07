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
$ aio plugins:install @adobe/aio-cli-plugin-changelog
# OR
$ aio discover -i

$ aio changelog --help...
$ aio config:set GITHUB_TOKEN=<personal access token>
```

## Update
Please use the latest version of the plugin.   
Use command `aio plugins` to see outdated plugins.  
Use command `aio plugins:update` for update plugins to the latest stable version. 


# Commands
<!-- commands -->
* [`aio changelog:generate`](#aio-changeloggenerate)
* [`aio changelog:generate-config-sample`](#aio-changeloggenerate-config-sample)

## `aio changelog:generate`

Changelog generation tool

```
Changelog generation tool

USAGE
  $ aio changelog:generate

OPTIONS
  -c, --config=config          Path to the configuration located on your local machine

  -n, --namespaces=namespaces  [default: ] Generate changelog for specific namespace, example:
                               organization/repository:branch

```

## `aio changelog:generate-config-sample`

```
USAGE
  $ aio changelog:generate-config-sample

OPTIONS
  -t, --type=short|long        [default: Short] Type of generated config. 
                                    Short - minimum required configuration for application.
                                    Long - config with all possible parameters  

  -p, --path=path              [default: <directory from which app was executed>/config.json] 
                                    Path to generated config sample.

```
<!-- commandsstop -->


## Maintainers and Contributors

This project is maintained by [Open Contribution Office](https://wiki.corp.adobe.com/display/DMSArchitecture/Open+Contribution+Office).

## Contact Us

**Slack**: [#devex-open-contribution-office](https://magento.slack.com/archives/C018Z6CB57U)

**Mail**: [devex-open-contribution-office@adobe.com](mailto:devex-open-contribution-office@adobe.com)
