
const PRIVATE = {
  name: Symbol('_name'),
  log: Symbol('_log'),
  getPrefix: Symbol('_getPrefix')
};

export default class NrLoggingContext {

  /**
   *
   * @param $log
   * @param name
   * @ngInject
   */
  constructor ($log, name) {
    'ngInject';
    this[PRIVATE.name] = name;
    this[PRIVATE.log] = $log;
  }

  [PRIVATE.getPrefix] () {
    return `[${this[PRIVATE.name]}] `;
  }

  debug (...args) {
    this[PRIVATE.log].debug(this[PRIVATE.getPrefix](), ...args);
  }

  log (...args) {
    this[PRIVATE.log].log(this[PRIVATE.getPrefix](), ...args);
  }

  info (...args) {
    this[PRIVATE.log].info(this[PRIVATE.getPrefix](), ...args);
  }

  warn (...args) {
    this[PRIVATE.log].warn(this[PRIVATE.getPrefix](), ...args);
  }

  error (...args) {
    this[PRIVATE.log].error(this[PRIVATE.getPrefix](), ...args);
  }

  getMessage (...args) {
    return [this[PRIVATE.getPrefix](), ...args].join(' ');
  }

}
