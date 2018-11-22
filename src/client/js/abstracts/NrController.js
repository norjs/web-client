import _ from 'lodash';
import NrLoggingContext from "../classes/NrLoggingContext";

/**
 *
 * @type {{name: *, $log: *, $onInit: *, $onDestroy: *, $postLink: *, $onChanges: *, registerSymbol: *, callSymbol: *, callSymbols: *, onInitSymbols: *,
 *     onDestroySymbols: *, postLinkSymbols: *, onChangesSymbols: *}}
 */
const PRIVATE = {
  name: Symbol('_name')
  , $log: Symbol('$log')
  , $onInit: Symbol('$onInit')
  , $onDestroy: Symbol('$onDestroy')
  , $postLink: Symbol('$postLink')
  , $onChanges: Symbol('$onChanges')
  , $injector: Symbol('$injector')
  , registerSymbol: Symbol('registerSymbol')
  , callSymbol: Symbol('callSymbol')
  , callSymbols: Symbol('callSymbols')
  , onInitSymbols: Symbol('onInitSymbols')
  , onDestroySymbols: Symbol('onDestroySymbols')
  , postLinkSymbols: Symbol('postLinkSymbols')
  , onChangesSymbols: Symbol('onChangesSymbols')
  , log: Symbol('log')
};

/**
 * Abstract base class for AngularJS controllers.
 *
 * @abstract
 */
class NrController {

  /**
   * Returns a logging context which appends a context prefix with the name.
   *
   * Also supports .getMessage() which can be used in error messages.
   *
   * @param that
   * @param name
   * @returns {NrLoggingContext}
   */
  static getLogger (that, name) {
    return new NrLoggingContext(that[PRIVATE.$log], name);
  }

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
     * @private
     */
    this[PRIVATE.name] = name;

    /**
     *
     * @member {$log}
     * @protected
     */
    this[PRIVATE.$log] = $injector.get('$log');

    /**
     *
     * @member {NrLoggingContext}
     */
    this[PRIVATE.log] = NrController.getLogger(this, name);

  }

  getClassName () {
    return this[PRIVATE.name];
  }

  $onInit () {
    this[PRIVATE.$onInit]();
  }

  $onDestroy () {
    this[PRIVATE.$onDestroy]();
  }

  $postLink () {
    this[PRIVATE.$postLink]();
  }

  $onChanges (changes) {
    this[PRIVATE.$onChanges](changes);
  }

  /**
   * Register a new call symbol to the list.
   *
   * @param listSymbol {Symbol}
   * @param callSymbol {Symbol|Array.<Symbol>}
   * @protected
   */
  [PRIVATE.registerSymbol] (listSymbol, callSymbol) {
    if (!callSymbol) throw new TypeError(this[PRIVATE.log].getMessage("callSymbol wasn't defined"));
    if (!this[listSymbol]) {
      this[listSymbol] = [];
    }
    if (_.isArray(callSymbol)) {
      _.forEach(callSymbol, symbol => {
        this[listSymbol].push(symbol);
      });
    } else {
      this[listSymbol].push(callSymbol);
    }
  }

  /**
   * Call a method by the symbol if it exists and catch possible exceptions.
   *
   * Returns the result from the call.
   *
   * This is implemented as its own method because of some Google v8 performance optimizations.
   * Try-catch may break the performance for this method.
   *
   * @param symbol {Symbol}
   * @param args {Array}
   * @protected
   * @return {*}
   */
  [PRIVATE.callSymbol] (symbol, args) {
    try {
      return this[symbol](...args);
    } catch (err) {
      this[PRIVATE.log].error('Exception: ', err);
    }
  }

  /**
   * Call all symbols in the list.
   *
   * @param listSymbol {Symbol}
   * @param args {Array}
   * @protected
   */
  [PRIVATE.callSymbols] (listSymbol, args) {
    _.forEach(this[listSymbol], symbol => {

      if (!_.isFunction(this[symbol])) return;

      const ret = this[PRIVATE.callSymbol](symbol, args);

      if (ret && _.isFunction(ret.then) && _.isFunction(ret.catch)) {
        ret.catch( err => {
          this[PRIVATE.log].error('Exception: ', err);
        });
      }

    });
  }

  /**
   * Register life cycle methods. These can be strings or symbols, or arrays of both.
   *
   * @param symbols {{$onInit: Symbol|string|Array.<Symbol|string>, $onDestroy: Symbol|string|Array.<Symbol|string>, $postLink:
   *     Symbol|string|Array.<Symbol|string>, $onChanges: Symbol|string|Array.<Symbol|string>}}
   * @protected
   */
  registerLifeCycleMethods (symbols) {
    if (!symbols) {
      throw new TypeError(this[PRIVATE.log].getMessage("Invalid argument to .registerLifeCycleSymbols(): ", symbols));
    }
    if (symbols.$onInit) this[PRIVATE.registerSymbol](PRIVATE.onInitSymbols, symbols.$onInit);
    if (symbols.$onDestroy) this[PRIVATE.registerSymbol](PRIVATE.onDestroySymbols, symbols.$onDestroy);
    if (symbols.$postLink) this[PRIVATE.registerSymbol](PRIVATE.postLinkSymbols, symbols.$postLink);
    if (symbols.$onChanges) this[PRIVATE.registerSymbol](PRIVATE.onChangesSymbols, symbols.$onChanges);
  }

  /**
   * This is the implementation which calls all registered $onInit method symbols.
   */
  [PRIVATE.$onInit] () {
    this[PRIVATE.callSymbols](PRIVATE.onInitSymbols, []);
  }

  /**
   * This is the implementation which calls all registered $onDestroy method symbols.
   */
  [PRIVATE.$onDestroy] () {
    this[PRIVATE.callSymbols](PRIVATE.onDestroySymbols, []);
  }

  /**
   * This is the implementation which calls all registered $postLink method symbols.
   */
  [PRIVATE.$postLink] () {
    this[PRIVATE.callSymbols](PRIVATE.postLinkSymbols, []);
  }

  /**
   * This is the implementation which calls all registered $onChanges method symbols.
   */
  [PRIVATE.$onChanges] (changes) {
    this[PRIVATE.callSymbols](PRIVATE.onChangesSymbols, [changes]);
  }

}

export default NrController;
