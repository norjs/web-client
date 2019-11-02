import template from './nr-main-view-template.html';
import './nr-main-view-styles.css';
import NrMainViewController from './NrMainViewController';

/**
 *
 * @type {angular.IComponentOptions}
 * @ngInject
 */
const nrMainViewComponent = {
  template,
  controller: NrMainViewController
};

export default nrMainViewComponent;
