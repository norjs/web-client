import LoggingContext from "../classes/NrLoggingContext";

const PRIVATE = {
  name: Symbol('name'),
  $log: Symbol('$log')
};

/**
 *
 */
class NrService {

  /**
   *
   * @param name {string} Name of concrete class
   * @param $injector {$injector}
   * @ngInject
   * @protected
   */
  constructor (name, $injector) {

    /**
     * @member {string}
     * @protected
     */
    this[PRIVATE.name] = name;

    /**
     * @member {$injector}
     * @protected
     */
    this.$injector = $injector;

    /**
     *
     * @member {$log}
     * @protected
     */
    this[PRIVATE.$log] = $injector.get('$log');

    this.$log = new LoggingContext(this[PRIVATE.$log], name);

  }

  getClassName () {
    return this[PRIVATE.name];
  }

}

export default NrService;
