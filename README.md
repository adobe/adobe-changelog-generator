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

Adobe Changelog Generator
=====================

**Adobe Changelog Generator** is the core package that is uses to generate changelog file. 

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Config example](#config-example)
* [Config options](#config-options)
* [Template example](#template-example)
* [Template declaration](#template-declaration)
    * [Template repeats](#template-repeats)
        * [Template repeats list](#there-are-multiple-type-of-repeats-are-available-now)
    * [Template tags](#template-tags)
        * [List of the tags](#list-of-the-tags)
    * [Template directives](#template-directives)
        * [Multiple directives](#multiple-directives)
        * [Directives list](#directives-list)
    * [Template repeat directives](#template-repeat-directives)
        * [Repeat directives list](#repeat-directives-list)
* [Extensibility and customization](#Extensibility-and-customization)
    * [Custom template](#custom-template)         
    * [Custom template directive](#custom-template-directive)         
    * [Custom template repeat](#custom-template-repeat)
    * [Custom release parser](#custom-release-parser)
    * [Custom writer](#custom-writer)
    * [Custom loader](#custom-loader)
    * [Custom filters](#custom-filters)
    * [Custom group](#custom-group)
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

# Config example
<!-- configuration -->
```
{
  "<organization>/<repository>:<branch>" {
    "releaseLine": <from>..<to>@<version>:<filter>
    "combine": {
      "<organization>/<repository>:<branch>": {
        "releaseLine": <from>..<to>@<version>:<filter>
      },
      "<organization>/<repository>:<branch>": {
        "releaseLine": <from>..<to>@<version>:<filter>
      }
    },
    "loader": {
      "name": <loader-name>,
      "config": {
        "exclude": {
          "<filter>": <filter-config>
        },
        "groupBy": {
          "name": <group-name>,
          "config": {
            <configuration>  
          }
        }
      }
    }
    "output": {
      "strategy": "<strategy-type>",
      "template": "<template-name>",
      "filename": "<file-name>",
      "projectPath": "<project-path>"
    }
  }
}
```

# Config options

* `<organization>/<repository>:<branch>` - combination of organization, repository and branch is named namespace. Config can contain multiple namespaces. Tool will asynchronously generate changelog for each namespace.
    * `<organization>` - required
    * `<repository>` - required
    * `<branch>` - optional
* `combine` - provide a list of related namespaces. In case if you project consist of multiple repositories and you want to create changelog that contains data from all repositories you should use this option.
    *  combine - optional
* `releaseLine` - define from-to brackets to collect content. 
    * `<from>` - Starting point.   
        **Optional**  
        **Default:** current.  
        Can be one of the next type:
        * `tag` - Github tag. Example: 1.0.0            
        * `hash` - Github commit hash. Example: fd7ebb1d0cd224e0957c035faafdffd9bd2b2b87
        * `date` - Date in ISO8601 format. Example: YYYY-MM-DD
        * `special-words` - application supports the list of predefined special-words:
            * `now` - Current date and time
            * `current` - Start date of ongoing version not released yet.
            * `start` - Start date of first existing release.
    * `<to>` - Ending point.  
        **Optional**  
        **Default:** now  
        Can be one of the next type:
        * `tag` - Github tag. Example: 1.0.0            
        * `hash` - Github commit hash. Example: fd7ebb1d0cd224e0957c035faafdffd9bd2b2b87
        * `date` - Date in ISO8601 format. Example: YYYY-MM-DD
        * `special-words` - application supports the list of predefined special-words:
            * `now` - Current date and time
            * `current` - Start date of ongoing version not released yet.
            * `start` - Start date of first existing release.
    * `<version>` - the version of ongoing release.  
        **Optional**  
        **Default:** patch.
        Can be one of the next type:
        * `patch` - Increment patch version of last release.    
        * `minor` - Increment minor version of last release.     
        * `major` - Increment major version of last release.     
        * `version` - Custom version. Example: 1.0.1-custom.
    * `<filter>` - Filter RegExp. Optional. Use it for exclude some releases. Example: ^1.1   
* `loader` - responsible to load Pull Request or Issue data from Github. Required.
    * `name` - loader name.
        * **Available options:**
            * pullrequest 
    * `config` - loader config.
        * `exclude` - excludes some data based on specific criteria. Optional.
            * `<filter>` - name of the filter.
                * **Available options:**
                    * labels
            * `<filter-config>` - Specific filter configuration.
        * `groupBy` - group loaded data based on specific criteria. Optional.
            * `name` - group name
                * **Available options:**
                    * labels
            * `config` - configuration specific to group type
* `output` - configuration of result file.
    * `strategy` - responsible for output file. Will it be merged to an existing file or creating new one.  
        * **Available options:**
            * `merge`
            * `create`
    * `format` - format of output file.
        * **Default:**
            * `md`
        * **Available options:**
            * `md`
             
    * `template` - required. Name of template.
        * **Available templates:**
            * PullRequest
    * `filename` - required. Name of output file.
    * `projectPath` - required. Path to the project folder.        


# Template example
```
<!--repeat_namespaces|scope_content-->
{{namespace|namespace_format:short|capitalize}}
=============
<!--repeat_releases-->
## {{tag}} ({{created_at|date_format:dd-MM-yy}}) {{repository}} or {{organization}} or {{branch}}    
<!--repeat_contributionTypes-->
### {{contribution_type}}
<!--repeat_items-->
* [{{organization}}/{{repository}}#{{number}}](https://github.com/{{organization}}/{{repository}}/pull/{{number}})
-- {{title}} by [@{{author}}](https://github.com/{{author}})
<!--repeat_items_end-->
<!--repeat_contributionTypes_end-->
<!--repeat_releases_end-->
<!--repeat_namespaces_end-->
```

# Template declaration
#### Template repeats
Repeats created to iterate list of entities.  
##### There are multiple type of repeats are available now:

* `<!--repeat_namespaces-->  <!--repeat_namespaces_end-->` - Iterate namespaces.  
For more details about namespaces see [config options](#config options).
    * **Allowed:**: Everywhere
* `<!--repeat_releases-->  <!--repeat_releases_end-->` - Iterate release versions.
    * **Allowed:**: in scope of `repeat_namespaces`
* `<!--repeat_contributionTypes-->  <!--repeat_contributionTypes_end-->` - Iterate list of contribution types (Use it only if you use data grouping)
    * **Allowed:**: in scope of `repeat_releases`
* `<!--repeat_items-->  <!--repeat_items_end-->` - Iterate list of items (Pull Requests, Issues, etc)
    * **Allowed:**: in scope of `repeat_releases` or `repeat_contributionTypes`


#### Template tags
Application provide the list of tags that are allowed to use in any template. The tags will be replaced to real data in 
the scope of changelog generation. The tags can mixed in any way to build custom template that will cover project needs.

##### List of the tags:  

* `{{namespace}}` - combination of Github organization, repository and branch 
    * **Format:** `<organization>/<repository>:<branch>`
    * **Allowed:** in scope of `repeat_namespaces`
    * **Modification:** format can be changed by `namespace_format` directive
* `{{organization}}` - Github organization name
    * **Format:** `<organization>`
    * **Allowed:** in scope of `repeat_namespaces`
* `{{repository}}` - Github repository name
    * **Format:** `<repository>`
    * **Allowed:** in scope of `repeat_namespaces`
* `{{branch}}` - Github branch name
    * **Format:** `<repository>`
    * **Allowed:** in scope of `repeat_namespaces`
* `{{tag}}` - release version
    * **Format:** `<tag>`
    * **Allowed:** in scope of `repeat_releases`
* `{{created_at}}` - release version created_at
    * **Format:** `<yyyy-MM-dd>`
    * **Allowed:** in scope of `repeat_releases`
    * **Modification:** format can be changed by `date_format` directive
* `{{contribution_type}}` - item (PR/Issue) contribution type 
    * **Format:** `<contribution_type>`
    * **Allowed:** in scope of `repeat_contributionTypes`
* `{{number}}` - item (PR/Issue) number
    * **Format:** `<number>`
    * **Allowed:** in scope of `repeat_items`
* `{{title}}` - item (PR/Issue) title
    * **Format:** `<text>`
    * **Allowed:** in scope of `repeat_items`
* `{{author}}` - item (PR/Issue) author
    * **Format:** `<author>`
    * **Allowed:** in scope of `repeat_items`
    
#### Template directives
Directives used for modifying/transforming value.
  
##### Multiple directives:
Application allows use multiple directives on single data item. 
Directives will be applied from left to right.

**Example:**  `{{namespace|namespace_format:short|capitalize}}`
Firstly will be applied `namespace_format` directive and `capitalize` next
  
##### Directives list:
* `namespace_format` - change view format of namespaces.
    * **Format:** `{{<namespace>|namespace_format:<option>}}`
    * **Options:**
        * Short
        * Long
* `date_format` - change view format of date. Allowed to any date values. 
    * **Format:** `{{<created_at>|date_format:<option>}}`
    * **Options:** Any datetime format
* `capitalize` - Transform first letter in passed string. Allowed to any string values.
    * **Format:** `{{<namespace>|capitalize}}`
 
#### Template repeat directives 
Template repeat directives works like template directives but on repeats level.

##### Repeat directives list:
* `scope_content` - system directive. The directive add invisible scope tags to output file.   
This invisible scope tags used for output file parsing that is **required** in case when [strategy config option](#config options) is merge.

# Extensibility and customization
#### Custom template
Application supports custom templates, for that you need:

* Create new `<custom_name>.md` file in `src/templates` folder.
* Declare custom template uses `template repeats`, `template tags`, `template directives`.
* Set your custom template name to `output.template` config option.

#### Custom template directive

* Create new `<custom_name>.js` file in `src/template-directives` folder.
* Create new class implementing corresponding interface. (`src/api/template-directive-interface`)  
Note: The name of the class will be used as directive name.
* Use custom directive in template uses custom directive class name as the directive name. 

#### Custom template repeat

* Create new `<custom_name>.js` file in `src/template-handlers` folder.
* Create new class implementing corresponding interface. (`src/api/template-handler-interface`)  
Note: The name of the class will be used as repeat name.
* Use custom repeat in template uses custom repeat class name as the directive name.
    
#### Custom release parser
Application supports multiple type of declaration of version ranges, but you can simply create new one!

* Create new `<custom_name>.js` file in `src/release-parsers` folder.
* Create new class implementing corresponding interface. (`src/api/release-parsers-interface`)  
Note: The name of the file will be used as parser name.
* The release parser will be automatically registered in application and available to use in configuration

#### Custom writer
Application supports multiple type of declaration of version ranges, but you can simply create new one!

* Create new `<custom_name>.js` file in `src/writers` folder.
* Create new class implementing corresponding interface. (`src/api/changelog-writer-interface`)  
Note: The name of the file will be used as writer name.
* Set your custom writer name to `output.format` config option.

#### Custom loader
Custom loaders allow you to collect specific set of data from Github. 

* Create new `<custom_name>.js` file in `src/loades` folder.
* Create new class implementing corresponding interface. (`src/api/loader-interface`)  
Note: The name of the file will be used as loader name.
* Set your custom loader name and configuration to `loader.name` and `loader.config` config options.

**Custom loader configuration example**: 
```
    "loader": {
        "name: "<customFileName>"
    }
```

#### Custom filters
Filters are responsible for filter data received from loader.

* Create new `<custom_name>.js` file in `src/filters` folder.
* Create new class implementing corresponding interface. (`src/api/filter-interface`)  
Note: The name of the file will be used as filter name.
* Set your custom filter name and configuration to `loader.config.exclude` config option.

#### Custom group
Filters are responsible for filter data received from loader.

* Create new `<custom_name>.js` file in `src/groups` folder.
Note: The name of the file will be used as group name.
* Set your custom group name and configuration to `loader.config.groupBy.name` config option.  
**Example**: 
```
    "groupBy": {
        "name: "<customFileName>"
    }
```



## Maintainers and Contributors

This project is maintained by [Open Contribution Office](https://wiki.corp.adobe.com/display/DMSArchitecture/Open+Contribution+Office).

## Contact Us

**Slack**: [#devex-open-contribution-office](https://magento.slack.com/archives/C018Z6CB57U)

**Mail**: [devex-open-contribution-office@adobe.com](mailto:devex-open-contribution-office@adobe.com)
