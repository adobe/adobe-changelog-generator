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

module.exports = {
  mapValuesAsync: (obj:Object, asyncFn:Function):Promise<Object> => {
    const keys = Object.keys(obj);
    const promises = keys.map((k) => {
      return asyncFn(obj[k], k).then(newValue => {
        return { key: k, value: newValue };
      });
    });
    return Promise.all(promises).then((values:Array<Object>):Object => {
      const newObj:Object = {};
      values.forEach((v:Object):void => {
        newObj[v.key] = v.value;
      });
      return newObj;
    });
  },
  mapAsync: (arr:Array, asyncFn:Function):Promise<Array> => {
       return Promise.all(arr.map(asyncFn));
  }
};
