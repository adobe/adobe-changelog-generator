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
