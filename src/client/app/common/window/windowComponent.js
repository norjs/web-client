import template from './window-template.html';
import './window-styles.scss';
import WindowController from './WindowController';

/**
 *
 * @type {{template, controller: WindowController}}
 */
let windowComponent = {
  template
  , transclude: true
  , bindings: {
    __title: '@title'
    , __onClose: '&?onClose'
  }
  , controller: WindowController
};

export default windowComponent;
