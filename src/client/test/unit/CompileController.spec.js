import { componentSpyOn } from '../utils/helpers';
import defaultBeforeEach from '../utils/beforeEach';

const TEST_DEP1 = 'testDep1';
const TEST_DEP1_VALUE = '12345';

describe('CompileController', () => {

  beforeEach(defaultBeforeEach);

  beforeEach(angular.mock.module('norjs.app.common.compile', $provide => {
    $provide.value('$log', console);

    $provide.value(TEST_DEP1, TEST_DEP1_VALUE);

  }));

  let $compile;
  let $rootScope;

  const testComponentSpy = componentSpyOn('testComponent');
  beforeEach(angular.mock.module('norjs.test.mocks.testComponent', testComponentSpy));
  beforeEach(angular.mock.module('norjs.app.utils.compile'));

  beforeEach(angular.mock.inject(( _$compile_, _$rootScope_ ) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should replace the element with the appropriate content when using component attribute', () => {
    let element = $compile(`<nr-compile component="div"></nr-compile>`)($rootScope);
    $rootScope.$digest();
    expect(element.html()).toBe(`<div class="ng-scope"></div>`);
  });

  // No transclude support yet
  xit('should replace the element with the appropriate content with transclude', () => {
    let element = $compile(`<nr-compile component="div"><p>Hello</p></nr-compile>`)($rootScope);
    $rootScope.$digest();
    expect(element.html()).toBe(`<div class="ng-scope"><p class="ng-scope">Hello</p></div>`);
  });

  // No transclude support yet
  xit('should replace the element with the appropriate content with transclude and multiple elements', () => {
    let element = $compile(`<nr-compile component="section"><h1>Test</h1><p>Hello</p></nr-compile>`)($rootScope);
    $rootScope.$digest();
    expect(element.html()).toBe(`<section class="ng-scope"><h1 class="ng-scope">Test</h1><p class="ng-scope">Hello</p></section>`);
  });

  it('should replace the element with the appropriate content when using options.component', () => {
    let element = $compile(`<nr-compile options="{'component':'div'}"></nr-compile>`)($rootScope);
    $rootScope.$digest();
    expect(element.html()).toBe(`<div class="ng-scope"></div>`);
  });

  // We don't have support for resolving to non-defined component attributes yet
  xit('should replace the element with the appropriate content when using .component and .resolve with plain html tag', () => {
    let element = $compile(`<nr-compile options="{
        'component': 'div', 
        'resolve': {
            'style': 'border:0'
        }
      }"></nr-compile>`)($rootScope);
    $rootScope.$digest();
    expect(element.html()).toBe(`<div style="border:0" class="ng-scope"></div>`);
  });

  it('should replace the element with the appropriate content when using .component and .resolve with actual component', () => {
    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'type': 'foo bar'
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component type="foo bar" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];

    expect(controller).toBeObject('controller');
    expect(controller.__type).toBe("foo bar", "controller.__type #1");

    $rootScope.testOptions.resolve.type = 'hello world';

    $rootScope.$digest();

    expect(controller.__type).toBe('hello world', "controller.__type #2");

    $rootScope.$digest();

    expect(controller.__type).toBe('hello world', "controller.__type #3");

    controller.__type = 'test';

    expect(controller.__type).toBe('test', "controller.__type #4");

    $rootScope.$digest();

    expect(controller.__type).toBe('test', "controller.__type #5");
    expect($rootScope.testOptions.resolve.type).toBe('hello world', "rootScope.testOptions.resolve.type");

  });

  it('should replace the element with the appropriate content when using .component and .resolve with actual component and two way binding', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'value': 'foo bar'
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component value="$resolve.value" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];

    expect(controller).toBeObject('controller');
    expect(controller.__value).toBe("foo bar", "controller.__value");

    $rootScope.testOptions.resolve.value = 'hello world';

    $rootScope.$digest();

    expect(controller.__value).toBe('hello world', "controller.__value");

    $rootScope.$digest();

    expect(controller.__value).toBe('hello world', "controller.__value");

    controller.__value = 'test';

    expect(controller.__value).toBe('test', "controller.__value");

    $rootScope.$digest();

    expect(controller.__value).toBe('test', "controller.__value");
    expect($rootScope.testOptions.resolve.value).toBe('test', "controller.__value");

  });

  it('should replace the element with the appropriate content when using .component and .resolve with actual component and one way binding', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'foo': 'hello world'
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component foo="$resolve.foo" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];

    expect(controller).toBeObject('controller');
    expect(controller.__foo).toBe("hello world", "controller.__foo");

    $rootScope.testOptions.resolve.foo = 'foo bar';

    $rootScope.$digest();

    expect(controller.__foo).toBe('foo bar', "controller.__foo");

    $rootScope.$digest();

    expect(controller.__foo).toBe('foo bar', "controller.__foo");

    controller.__foo = 'test';

    expect(controller.__foo).toBe('test', "controller.__foo");

    $rootScope.$digest();

    expect(controller.__foo).toBe('test', "controller.__foo");
    expect($rootScope.testOptions.resolve.foo).toBe('foo bar', "controller.__foo");

  });

  it('should trigger output callback with a function', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'getValue': () => 'hello world'
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component get-value="$resolve.getValue()" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];
    expect(controller).toBeObject('controller');

    expect(controller.__getValue).toBeFunction('controller.__getValue');
    expect(controller.__getValue({})).toBe('hello world');

  });

  it('should trigger output callback with a function with depency', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'getValue': (arg) => `(${arg})`
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component get-value="$resolve.getValue(arg)" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];
    expect(controller).toBeObject('controller');

    expect(controller.__getValue).toBeFunction('controller.__getValue');
    expect(controller.__getValue({arg: '1234'})).toBe("(1234)");

  });

  it('should trigger output callback with an expression', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'getValue': `"hello world"`
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component get-value="$resolve.getValue()" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];
    expect(controller).toBeObject('controller');

    expect(controller.__getValue).toBeFunction('controller.__getValue');
    expect(controller.__getValue({})).toBe('hello world');

  });

  it('should trigger output callback with an expression and argument', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'getValue': ["arg", `"(" + arg + ")"`]
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component get-value="$resolve.getValue[1](arg)" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];
    expect(controller).toBeObject('controller');

    expect(controller.__getValue).toBeFunction('controller.__getValue');
    expect(controller.__getValue({arg: 'foobar 1234'})).toBe(`(foobar 1234)`);

  });

  it('should trigger output callback with an expression, argument and dependency', () => {

    $rootScope.testOptions = {
      'component': 'testComponent',
      'resolve': {
        'getValue': ["testDep1", "arg", `"(" + arg + ":" + testDep1 + ")"`]
      }
    };

    let element = $compile(`<nr-compile options="testOptions"></nr-compile>`)($rootScope);
    $rootScope.$digest();

    expect(element.html()).toBe(`<test-component get-value="$resolve.getValue[2](testDep1,arg)" class="ng-scope ng-isolate-scope"></test-component>`);

    expect(testComponentSpy.bindings).toBeArray('testComponentSpy.bindings');
    const controller = testComponentSpy.bindings[0];
    expect(controller).toBeObject('controller');

    expect(controller.__getValue).toBeFunction('controller.__getValue');
    expect(controller.__getValue({arg: 'foobar 1234'})).toBe(`(foobar 1234:${TEST_DEP1_VALUE})`);

  });

});
