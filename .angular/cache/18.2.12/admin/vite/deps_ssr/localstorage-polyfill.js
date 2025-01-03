import { createRequire } from 'module';const require = createRequire(import.meta.url);

// node_modules/localstorage-polyfill/localStorage.js
var valuesMap = /* @__PURE__ */ new Map();
var LocalStorage = class {
  getItem(key) {
    const stringKey = String(key);
    if (valuesMap.has(key)) {
      return String(valuesMap.get(stringKey));
    }
    return null;
  }
  setItem(key, val) {
    valuesMap.set(String(key), String(val));
  }
  removeItem(key) {
    valuesMap.delete(key);
  }
  clear() {
    valuesMap.clear();
  }
  key(i) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present.");
    }
    var arr = Array.from(valuesMap.keys());
    return arr[i];
  }
  get length() {
    return valuesMap.size;
  }
};
var instance = new LocalStorage();
global.localStorage = new Proxy(instance, {
  set: function(obj, prop, value) {
    if (LocalStorage.prototype.hasOwnProperty(prop)) {
      instance[prop] = value;
    } else {
      instance.setItem(prop, value);
    }
    return true;
  },
  get: function(target, name) {
    if (LocalStorage.prototype.hasOwnProperty(name)) {
      return instance[name];
    }
    if (valuesMap.has(name)) {
      return instance.getItem(name);
    }
  }
});
//# sourceMappingURL=localstorage-polyfill.js.map
