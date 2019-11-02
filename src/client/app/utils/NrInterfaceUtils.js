import _ from "lodash";

/**
 *
 */
class NrInterfaceUtils {

  /**
   * Returns true if object `obj` implements interface in `iface`.
   *
   * @param iface {object}
   * @param obj {object}
   */
  static implements (iface, obj) {
    return _.keys(iface).every(key => _.has(obj, key));
  }

  /**
   *
   * @param iface
   * @param obj
   */
  static createWrapper (iface, obj) {
    let wrapper = {};
    _.keys(iface).forEach(key => {
      const symbol = iface[key];
      if (_.isFunction(obj[symbol])) {
        wrapper[key] = (...args) => obj[symbol](...args);
      } else {
        Object.defineProperty(wrapper, key, {
          get: () => obj[symbol],
          set: (value) => {
            obj[symbol] = value;
          }
        });
      }
    });
    return wrapper;
  }

}

export default NrInterfaceUtils;
