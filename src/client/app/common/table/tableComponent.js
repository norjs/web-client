import template from './table-template.html';
import './table-styles.scss';
import TableController from './TableController';

/**
 *
 * @type {{template, restrict: string, controller: TableController, controllerAs: string}}
 */
let tableComponent = {
  template,
  bindings: {
    __content: '<content', // Reference to an object (eg. service) which implements pageableInterface; or the content itself as an array.
    __options: '<?options' // Reference to a configuration object.
  },
  controller: TableController
};

export default tableComponent;
