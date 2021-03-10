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

import { LoaderInterface } from './loader-interface.js';
import { ProcessorInterface } from './processor-interface.js';
import { WriterInterface } from './writer-interface.js';

export interface changelogInterface {
    constructor(
        loader:LoaderInterface,
        processors:Array<ProcessorInterface>,
        writer:WriterInterface
    ):void,
    load(config:Object):Array<Object> | Error,
    process(config:Object):void | Error,
    write(config:Object):void | Error
}
