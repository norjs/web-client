import TestComponentController from './TestComponentController';

/**
 *
 * @type {{template, controller: TestComponentController}}
 */
let testComponentComponent = {
  template: ''
  , bindings: {
    __type: "@type",
    __foo: "<foo",
    __value: "=value",
    __getValue: "&getValue"
  }
  , controller: TestComponentController
};

export default testComponentComponent;
