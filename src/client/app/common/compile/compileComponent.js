import CompileController from './CompileController';

/**
 *
 * @type {{controller: CompileController}}
 */
let compileComponent = {
  transclude: true
  , bindings: {
    "__options": "<?options",
    "__component": "@?component",
    "__resolve": "<?resolve",
    "__content": "@?content"
  }
  , controller: CompileController
};

export default compileComponent;
