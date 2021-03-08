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
