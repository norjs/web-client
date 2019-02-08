import template from './nav-view-template.html';
import './nav-view-styles.scss';
import NavViewController from './NavViewController.js';

/**
 *
 * @type {{template, controller: NavViewController}}
 * @ngInject
 */
const navViewComponent = {
  template,
  controller: NavViewController
};

export default navViewComponent;
