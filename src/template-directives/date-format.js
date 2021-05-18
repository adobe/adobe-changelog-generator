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

import type { TemplateDirectiveInterface } from '../api/template-directive-interface';
const formatFns = require('date-fns').format;

class DateFormat implements TemplateDirectiveInterface {
    /**
     * Change date format
     *
     * @param value
     * @param param
     * @return {string}
     */
    execute(value:string, param:Array<string>):string {
        const date = new Date(value);
        return formatFns(new Date(date.getTime() + date.getTimezoneOffset() * 60000), param[0]);
    }
}

module.exports = DateFormat;
