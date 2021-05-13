/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

export interface TemplateDirectiveInterface {
    /**
     * Extension point for new directives.
     * Each new directive should implement this interface
     *
     * @param {string} value
     * @param {Array<string>} param
     * @return {Array<string>}
     */
    execute(value:string, param?:Array<string>):string
}
