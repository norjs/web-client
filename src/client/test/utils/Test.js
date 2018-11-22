import angular from 'angular';
import defaultBeforeEach from "./beforeEach";
import {componentSpyOn} from "./helpers";

const TEST_COMPONENT_NAME = 'testComponent';
const TEST_COMPONENT_MODULE_NAME = 'test.mocks.testComponent';
const TEST_DEP1 = 'testDep1';
const TEST_DEP1_VALUE = '12345';

class TestElement {

  /**
   *
   * @param test {Test}
   * @param html {string} The HTML code to compile
   */
  constructor ({test = undefined, html = undefined}) {

    /**
     *
     * @member {Test}
     */
    this.test = test;

    /**
     *
     * @member {string}
     */
    this.html = html;

    /**
     * The compiled AngularJS jqLite DOM element.
     *
     * @member {jQlite|undefined}
     */
    this.element = undefined;

  }

  /**
   *
   */
  compile () {
    if (this.element) throw new Error("Element already compiled");
    this.element = this.test.$compile(this.html)(this.test.getScope());
    this.stepForward();
  }

  /**
   * Runs AngularJS $digest loop to process asynchronic code, etc.
   */
  stepForward () {
    this.test.stepForward();
  }

  /**
   * Returns only first jQlite element which match the `locator` under `element`.
   *
   * @param locator {string} The CSS locator
   * @param element {jQlite} The AngularJS jQlite element where to look for.
   * @returns {jQlite}
   */
  find (locator, element = this.element) {
    return angular.element(element[0].querySelector(locator));
  }

  /**
   * Returns all jQlite elements which match the `locator` under `element`.
   *
   * @param locator {string} The CSS locator
   * @param element {jQlite} The AngularJS jQlite element where to look for.
   * @returns {jQlite}
   */
  findAll (locator, element = this.element) {
    return angular.element(element[0].querySelectorAll(locator));
  }

  /**
   * Returns controller by name `name`.
   *
   * @param name {string}
   * @returns {Object}
   */
  getController (name) {
    return Test.getController(this.element, name);
  }

  /**
   * Returns HTML of the test element.
   *
   * @returns {string}
   */
  getHtml () {
    return this.element.html();
  }

  /**
   *
   * @param test
   * @param html
   * @returns {TestElement}
   */
  static create ({test = undefined, html = undefined}) {
    if (!test) throw new TypeError("test argument missing from TestElement.create()");
    if (!html) throw new TypeError("html argument missing from TestElement.create()");

    const element = new TestElement({test, html});
    element.compile();
    return element;
  }

}

/**
 *
 */
class Test {

  /**
   *
   * @param moduleName {string} This is the test subject module name. It will be loaded in `this.beforeEach()`.
   * @param modules {Array.<string>}
   * @param mocks {{}}
   */
  constructor ({
     moduleName = undefined
     , modules = undefined
     , mocks = undefined
  }) {

    /**
     *
     * @member {string}
     */
    this.moduleName = moduleName;

    /**
     *
     * @member {Array.<string>}
     */
    this.modules = modules;

    /**
     *
     * @member {{}}
     */
    this.mocks = mocks;

    /**
     *
     * @member {$compile|undefined}
     */
    this.$compile = undefined;

    /**
     *
     * @member {$rootScope|undefined}
     */
    this.$rootScope = undefined;

    /**
     *
     * @member {$timeout|undefined}
     */
    this.$timeout = undefined;

    /**
     *
     * @member {$flushPendingTasks|undefined}
     */
    this.$flushPendingTasks = undefined;

    /**
     *
     * @member {$verifyNoPendingTasks|undefined}
     */
    this.$verifyNoPendingTasks = undefined;

    /**
     *
     * @member {$injector|undefined}
     */
    this.$injector = undefined;

  }

  /**
   *
   */
  setup () {

    beforeEach(defaultBeforeEach);

    beforeEach(angular.mock.module(this.moduleName, $provide => {

      $provide.value('$log', console);

      $provide.value(TEST_DEP1, TEST_DEP1_VALUE);

    }));

    if (this.modules) {
      _.each(this.modules, module => {
        beforeEach(angular.mock.module(module));
      });
    }

    if (this.mocks) {
      beforeEach(angular.mock.module(this.mocks));
    }

    this.testComponentSpy = componentSpyOn(TEST_COMPONENT_NAME);
    beforeEach(angular.mock.module(TEST_COMPONENT_MODULE_NAME, this.testComponentSpy));

    beforeEach(angular.mock.inject((
      $compile
      , $rootScope
      , $timeout
      , $injector
      , $flushPendingTasks
      , $verifyNoPendingTasks
    ) => {
      this.$compile = $compile;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$injector = $injector;
      this.$flushPendingTasks = $flushPendingTasks;
      this.$verifyNoPendingTasks = $verifyNoPendingTasks;
    }));

  }

  /**
   * Get a AngularJS dependency using the $injector.
   *
   * @param name {string}
   * @returns {*}
   */
  get (name) {
    return this.$injector.get(name);
  }

  /**
   * Create a TestElement instance to test a DOM component.
   *
   * @param html {string}
   * @returns {TestElement}
   */
  createElement (html) {
    if (!html) throw new TypeError("html argument missing from Test.createElement()");
    html = _.trim(html);
    return TestElement.create({test:this, html});
  }

  /**
   * Get the scope which will be used to create elements.
   *
   * @returns {$rootScope}
   */
  getScope () {
    return this.$rootScope;
  }

  /**
   *
   * @param element {jQlite}
   * @param name {string} The name of the tag or a controller name as camelCase
   * @returns {*}
   */
  static getController (element, name = undefined) {
    return angular.element(element).controller(name);
  }

  /**
   * Runs AngularJS $digest loop to process asynchronic code, etc.
   */
  stepForward () {
    this.$rootScope.$digest();
  }

  /**
   * Flush pending tasks.
   * @param delay {number} The delay to flush
   */
  flushTasks (delay = 1000) {
    this.$flushPendingTasks(delay);
    this.$verifyNoPendingTasks();
  }

  /**
   * Click element
   *
   * @param element
   */
  click (element) {
    angular.element(element)[0].click();
    this.stepForward();
  }

  changeElementValue (element, value) {
    element = angular.element(element);
    element[0].value = value;
    element.triggerHandler("change");
    this.stepForward();
  }

  /**
   *
   * @param element
   * @param text
   * @fixme Requires implementation
   */
  writeTextUsingKeyboard (element, text) {

    throw new Error("Not implemented");

    //_.each(text, key => {
    //  console.log('key = ', key);
    //  //element.triggerHandler({type:"keydown", which:keyCode});
    //});
    //
    //this.stepForward();
  }

  /**
   *
   * @param moduleName {string} This is the test subject module name. It will be loaded in `this.beforeEach()`.
   * @param modules {Array.<string>} Modules to load in the test at beforeEach()
   * @param mocks {{}} Mocks to load in the test at beforeEach()
   * @returns {Test}
   */
  static create ({
     moduleName
     , modules = undefined
     , mocks = undefined
  }) {
    if (!moduleName) throw new TypeError("moduleName argument missing from Test.create()");

    const test = new Test({
      moduleName
      , modules
      , mocks
    });
    test.setup();
    return test;
  }

}

Test.TEST_DEP1 = TEST_DEP1;
Test.TEST_DEP1_VALUE = TEST_DEP1_VALUE;
Test.TEST_COMPONENT_NAME = TEST_COMPONENT_NAME;
Test.TEST_COMPONENT_MODULE_NAME = TEST_COMPONENT_MODULE_NAME;

export default Test;
