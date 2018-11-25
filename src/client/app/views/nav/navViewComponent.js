import template from './nav-view-template.html';
import './nav-view-styles.scss';
import NavViewController from './NavViewController';

/**
 *
 * @type {{template, controller: NavViewController}}
 */
let navViewComponent = {
  template,
  controller: NavViewController
};

export default navViewComponent;
