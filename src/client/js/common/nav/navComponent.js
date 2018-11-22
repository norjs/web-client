import template from './nav-template.html';
import './nav-styles.css';
import NavController from './NavController';

/**
 *
 * @type {{template, controller: NavController}}
 */
let navComponent = {
  template
  , bindings: {
    __collection: "<?collection"
    , __options: "<?options"
  }
  , controller: NavController
};

export default navComponent;
