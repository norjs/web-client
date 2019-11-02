import template from './nr-nav-view-template.html';
import './nr-nav-view-styles.scss';
import NrNavViewController from './NrNavViewController.js';

/**
 *
 * @type {angular.IComponentOptions}
 * @ngInject
 */
const nrNavViewComponent = {
  template,
  controller: NrNavViewController
};

export default nrNavViewComponent;
