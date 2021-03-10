<!--
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

aio-cli-plugin-changelog
=====================


**aio-cli-plugin-changelog** is an plugin for Adobe I/O CLI that provides possibility to generate changelog file based on release data in automatic, system agnostic way. 



<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
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
* [`aio changelog`](#aio-changelog)

## `aio changelog`

```
Changelog generation tool

USAGE
  $ aio changelog

OPTIONS
  -c, --config-path=config-path      Local config path
  -n, --namespace=namespace          [default: ] Namespace, example: organization/repository:branch
  -t, --path-type=absolute|relative  [default: absolute] Local config path type

EXAMPLE
  $ aio changelog
```
<!-- commandsstop -->

### Extensibility
Adobe Changelog Generator tool provide possibility to customize or create your own set of services, such as:
* [`Data loaders`](#data-loaders)
* [`Filters`](#filters)
* [`Templates`](#templates)
* [`Groups`](#groups)

### Data loaders:
Data loaders are responsible for uploading data from Github. 
The Adobe Changelog Generator tool provide the list of loaders. 
All loaders are located in `src/loaders` folder.

**Customization**:
* Implement loader `src-flow/application/api/loader-interface.js.flow` interface with custom functionality
* Place file with custom functionality in `src/loaders` folder
* Use filename as a value in config.
    Example: 
    ```
        "loader": {
            "name: "<customFileName>"
        }
    ```

### Filters:
Filters are responsible for filter data received from loader. 
The Adobe Changelog Generator tool provide the list of filters. 
All loaders are located in `src/filters` folder.

**Customization**:
* Implement loader `src-flow/application/api/filter-interface.js.flow` interface with custom functionality
* Place file with custom functionality in `src/filters` folder
* Use filename as a value in config.

### Groups:
Groups are responsible for grouping data received from loader. 
The Adobe Changelog Generator tool provide the list of groups. 
All loaders are located in `src/groups` folder.

**Customization**:
* Place file with custom functionality in `src/groups` folder
* Use filename as a value in config.

    Example: 
    ```
        "groupBy": {
            "name: "<customFileName>"
        }
    ```

### Templates:
Templates are responsible for view of resulting `Changelog.md` file. 
The Adobe Changelog Generator tool provide the list of templates. 
All loaders are located in `src/templates` folder.

**Customization**:
* Place file with custom template in `src/templates` folder
* Use filename as a value in config.


# Configuration example:
<!-- configuration -->
```
{
  "combine": {
    "oco-test/buddy-repo:master": {}
  },
  "loader": {
    "name": "PullRequest",
    "config": {
      "exclude": {
        "labels": []
      },
      "groupBy": {
        "name" : "labels",
        "config": {
          "Enhancement": []
        }
      }
    }
  },
  "output": {
    "override": false,
    "template": "pullrequest-issue",
    "filename": "CHANGELOG.md"
  }
}
```
## Maintainers and Contributors

This project is maintained by [Open Contribution Office](https://wiki.corp.adobe.com/display/DMSArchitecture/Open+Contribution+Office).

## Contact Us

**Slack**: [#devex-open-contribution-office](https://magento.slack.com/archives/C018Z6CB57U)

**Mail**: [devex-open-contribution-office@adobe.com](mailto:devex-open-contribution-office@adobe.com)
