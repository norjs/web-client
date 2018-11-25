import template from './main-view-template.html';
import './main-view-styles.css';
import MainViewController from './MainViewController';

/**
 *
 * @type {{template, restrict: string, controller: MainViewController, controllerAs: string}}
 */
let mainViewComponent = {
  template,
  controller: MainViewController
};

export default mainViewComponent;
