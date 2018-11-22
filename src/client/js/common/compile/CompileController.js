import angular from 'angular';
import _ from 'lodash';
import NrComponentController from '../../abstracts/NrComponentController';

/**
 * This object contains symbols for private members of CompileController.
 *
 * @type {{$compile: Symbol, $parse: Symbol, $transclude: Symbol, $scope: Symbol, $element: Symbol, options: Symbol, component: Symbol, resolve: Symbol,
 *     content: Symbol, initialized: Symbol, compileElement: Symbol,
 Symbol     getComponentBindings: Symbol, getAttributeTemplate: Symbol}}
 * @private
 */
const PRIVATE = {

  /**
   * Symbol for a property containing AngularJS $injector
   */
  $injector: Symbol('$injector'),

  /**
   * Symbol for a property containing AngularJS $compile
   */
  $compile: Symbol('$compile'),

  /**
   * Symbol for a property containing AngularJS $parse
   */
  $parse: Symbol('$parse'),

  /**
   * Symbol for a property containing AngularJS $transclude
   */
  $transclude: Symbol('$transclude'),

  /**
   * Symbol for a property containing AngularJS $scope
   */
  $scope: Symbol('$scope'),

  /**
   * Symbol for a property containing AngularJS $element
   */
  $element: Symbol('$element'),

  /**
   * Symbol for a property containing the options attribute which contains options as an object
   */
  options: Symbol('options'),

  /**
   * Symbol for a property containing the component attribute, eg. the name of the component as a string.
   */
  component: Symbol('component'),

  /**
   * Symbol for a property containing the resolve attribute data, eg. resolvable data for attributes as an object.
   */
  resolve: Symbol('resolve'),

  /**
   * Symbol for a property containing
   */
  content: Symbol('content'),

  /**
   * Symbol for a property containing a boolean which tells if the controller has been initialized.
   */
  initialized: Symbol('initialied'),

  /**
   * Symbol for a property containing a private method for compiling the element.
   */
  compileUtils: Symbol('compileUtils'),

  /**
   * Symbol for a property containing a private method for compiling the element.
   */
  compileElement: Symbol('compileElement'),

  /**
   * Symbol for a property containing a private method for fetching component bindings.
   */
  getComponentBindings: Symbol('getComponentBindings'),

  /**
   * Symbol for a property containing a private method for getting an attribute template as a string
   */
  getAttributeTemplate: Symbol('getAttributeTemplate'),

  /**
   * Symbol for a property containing a private method for building expression functions.
   *
   * It takes params (scope: object, expression: string, args: Array.<string>)
   */
  buildExpressionFn: Symbol('buildExpressionFn')

};

const SNAKE_CASE_REGEXP = /[A-Z]/g;

const NG_ATTRIBUTE_REGEXP = /^([=<@&])[?]?(.*)/;

/**
 * Compiles custom element inside this element.
 *
 * @ngInject
 */
class CompileController extends NrComponentController {

  /**
   *
   * @param name {string}
   * @param separator {string}
   * @returns {*}
   */
  static snakeCase (name, separator = '-') {
    name = name.replace(
      SNAKE_CASE_REGEXP,
      ( letter, pos ) => (pos ? separator : '' ) + letter.toLowerCase()
    );
    if (name.length >= 6 && name.substr(0, 5) === 'data-') return `x-${name}`;
    if (name.length >= 3 && name.substr(0, 2) === 'x-') return `x-${name}`;
    return name;
  }

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @param $compile {$compile}
   * @ngInject
   * @param $parse
   * @param $transclude
   * @param compileUtils
   */
  constructor ($injector, $element, $attrs, $scope, $compile, $parse, $transclude, compileUtils) {
    super("nrCompileController", $injector, $element, $attrs, $scope);

    /**
     *
     * @member {$parse}
     */
    this[PRIVATE.$injector] = $injector;

    /**
     *
     * @member {$parse}
     */
    this[PRIVATE.$parse] = $parse;

    /**
     *
     * @member {$transclude}
     */
    this[PRIVATE.$transclude] = $transclude;

    /**
     *
     * @member {$compile}
     */
    this[PRIVATE.$compile] = $compile;

    /**
     *
     * @member {$scope}
     */
    this[PRIVATE.$scope] = $scope;

    /**
     *
     * @member {$element}
     */
    this[PRIVATE.$element] = $element;

    /**
     *
     * @member {compileUtils}
     */
    this[PRIVATE.compileUtils] = compileUtils;

    /**
     *
     * @member {{component: string, bindings:{}}}
     */
    this[PRIVATE.options] = {};

    /**
     *
     * @member {boolean}
     */
    this[PRIVATE.initialized] = false;

  }

  /**
   *
   * @returns {{component: string, bindings:{}}}
   * @private
   */
  get __options () {
    return this[PRIVATE.options];
  }

  /**
   *
   * @param options {{component: string, bindings:{}}}
   * @private
   */
  set __options (options) {
    this[PRIVATE.options] = options;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  get __component () {
    return this[PRIVATE.component];
  }

  /**
   *
   * @param component {string}
   * @private
   */
  set __component (component) {
    this[PRIVATE.component] = component;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  get __content () {
    return this[PRIVATE.content];
  }

  /**
   *
   * @param content {string}
   * @private
   */
  set __content (content) {
    this[PRIVATE.content] = content;
  }

  /**
   *
   * @returns {{}}
   * @private
   */
  get __resolve () {
    return this[PRIVATE.resolve];
  }

  /**
   *
   * @param resolve {{}}
   * @private
   */
  set __resolve (resolve) {
    this[PRIVATE.resolve] = resolve;
  }

  /**
   * @fixme: Use .registerLifeCycleMethods
   */
  $onInit () {
    super.$onInit();

    this[PRIVATE.initialized] = true;

    if (this[PRIVATE.component] === undefined && this[PRIVATE.options] && this[PRIVATE.options].component) {
      this[PRIVATE.component] = this[PRIVATE.options].component;
    }

    if (this[PRIVATE.content] === undefined && this[PRIVATE.options] && this[PRIVATE.options].content) {
      this[PRIVATE.content] = this[PRIVATE.options].content;
    }

    if (this[PRIVATE.resolve] === undefined && this[PRIVATE.options] && this[PRIVATE.options].resolve) {
      this[PRIVATE.resolve] = this[PRIVATE.options].resolve;
    }

    this[PRIVATE.compileElement]();

  }

  /**
   * Get component or directive binding configurations.
   *
   * @param name {string}
   * @return {Array.<{name: string, type: string}>} Eg. `[{name: "foo", type: "="}]`
   * @private
   */
  [PRIVATE.getComponentBindings] (name) {

    if (!this.$injector.has(name + 'Directive')) {
      //this.$log.log(`Injector did not know about "${name}Directive".`);
      return [];
    }

    const definations = this.$injector.get(name + 'Directive');
    if (!definations) {
      //this.$log.log(`Result from injector for "${name}Directive" was non-true: "${definations}"`);
      return [];
    }

    const bindToControllers = _.map(_.filter(definations, d => d && d.bindToController), d => d.bindToController);

    //if (bindToControllers.length <= 0) {
      //this.$log.debug(`Defination for "${name}Directive" did not have .bindToController properties: `, definations);
    //}

    const bindings = _.reduce(bindToControllers, (ret, binds) => _.merge(ret, binds), {});

    //this.$log.debug(`Bindings for "${name}Directive" are: `, bindings);

    const result = _.keys(bindings)
            // { key: 'input', bindings: [ '=foo', '=', 'foo' ] }
            .map(key => ({key, bindings: NG_ATTRIBUTE_REGEXP.exec(bindings[key])}))
            .filter(binding => binding && _.isArray(binding.bindings))
            // { name: ('foo' || 'input'), type: '=' }
            .map(binding => ({ name: binding.bindings[2] || binding.key, type: binding.bindings[1] }));

    //this.$log.debug(`Result for "${name}Directive" is: `, result);

    return result;
  }

  /**
   * Builds a function from AngularJS expression.
   *
   * @param scope {object} The scope object where $eval will be called for the expression
   * @param expression {string} The expression to evaluate when this function is called
   * @param args {Array.<string>} Arguments for the function
   * @return {function(...[*]=): *}
   */
  [PRIVATE.buildExpressionFn] (scope, expression, args) {
    return (...values) => {
      _.each(args, (arg, index) => {
        const value = values[index];
        if ( value === undefined && !_.has(scope, arg) && this[PRIVATE.$injector].has(arg)) {
          values[index] = this[PRIVATE.$injector].get(arg);
        }
      });
      return scope.$eval(this[PRIVATE.compileUtils].stringifyExpression(expression), _.zipObject(args, values))
    };
  }

  /**
   *
   * @param binding {{name:string, type:string}}
   * @param opts {{scope:object}}
   * @returns {string}
   */
  [PRIVATE.getAttributeTemplate] (binding, opts = {}) {

    const { scope } = opts;
    const prefix = '';
    const { name, type } = binding;
    const attributeName = CompileController.snakeCase(name);
    const resolveName = name;
    switch (type) {

    case '@':
      return `${attributeName}='{{${prefix}$resolve.${resolveName}}}'`;

    case '&':
      let fn = this[PRIVATE.resolve][resolveName];

      let args;
      if (_.isString(fn)) {
        args = [];
        fn = this[PRIVATE.resolve][resolveName] = this[PRIVATE.buildExpressionFn](scope, fn, args);
      } else if (_.isArray(fn) && fn.length >= 1) {
        args = fn.slice(0, fn.length - 1);
        this[PRIVATE.resolve][resolveName][fn.length - 1] = this[PRIVATE.buildExpressionFn](scope, _.last(fn), args);
      } else {
        args = (fn && this[PRIVATE.$injector].annotate(fn)) || [];
      }

      const arrayIndexString = _.isArray(fn) ? `[${fn.length - 1}]` : '';
      return `${attributeName}='$resolve.${resolveName}${arrayIndexString}(${args.join(',')})'`;

    default:
      return `${attributeName}='${prefix}$resolve.${resolveName}'`;
    }
  }

  /**
   * Compile and place the compiled element on the DOM as child of `this[PRIVATE.$element]`.
   */
  [PRIVATE.compileElement] () {

    const scope = this[PRIVATE.$scope].$new();

    scope.$resolve = this[PRIVATE.resolve];

    const componentName = this[PRIVATE.component];

    //this.$log.debug('componentName: ', componentName);

    const componentBindings = this[PRIVATE.getComponentBindings](componentName);

    //this.$log.debug('componentBindings: ', componentBindings);

    const tagName = CompileController.snakeCase(componentName);

    let attrs = _.map(
      _.filter(
        componentBindings,
        binding => _.has(this[PRIVATE.resolve], binding.name)
      ),
      binding => this[PRIVATE.getAttributeTemplate](binding, {scope})
    ).join(' ');

    attrs = attrs ? ' ' + attrs : '';

    const content = this[PRIVATE.content] ? this[PRIVATE.content] : '';

    const html = `<${tagName}${attrs}>${content}</${tagName}>`;

    const template = angular.element(html);

    this[PRIVATE.$element][0].appendChild(template[0]);

    const linkFn = this[PRIVATE.$compile](template);

    //let transclude;
    //if (content === '' && this[PRIVATE.$transclude]) {
    //  transclude = this[PRIVATE.$transclude]();
    //}

    const element = linkFn(scope);

    //if (transclude && transclude.length >= 1) {
    //  let i;
    //  for(i=0; i !== transclude.length; i += 1) {
    //    element[0].appendChild(transclude[i]);
    //  }
    //}


  }

}

export default CompileController;
