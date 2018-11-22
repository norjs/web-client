import _ from 'lodash';
import NrService from '../../abstracts/NrService';
import angular from "angular";

const PRIVATE = {
  $compile: Symbol('$compile'),
  $document: Symbol('$document'),
  $rootScope: Symbol('$rootScope'),
  windows: Symbol('_windows'),
  zIndexBase: Symbol('_zIndexBase'),
  updateZIndexes: Symbol('_updateZIndexes'),
  moveToFront: Symbol('_moveToFront')
};

/**
 * @ngInject
 */
class WindowService extends NrService {

  /**
   *
   * @param $injector {$injector}
   * @param $document {$document}
   * @param $rootScope {$rootScope}
   * @ngInject
   */
  constructor ($injector, $document, $rootScope) {
    super("WindowController", $injector);

    this[PRIVATE.$compile] = $injector.get('$compile');
    this[PRIVATE.$document] = $document;
    this[PRIVATE.$rootScope] = $rootScope;

    /**
     *
     * @type {Array.<WindowController>}
     * @private
     */
    this[PRIVATE.windows] = [];

    /**
     * The base for window z indexes.
     *
     * @type {number}
     * @private
     */
    this[PRIVATE.zIndexBase] = 10000;

  }

  /**
   *
   * @param window {WindowController}
   * @return {{width: number, height: number}}
   */
  register (window) {
    this.$log.log('Registering a window: ', window);

    const previousWindow = this[PRIVATE.windows].length ? this[PRIVATE.windows][this[PRIVATE.windows].length -1] : undefined;
    this[PRIVATE.windows].push(window);

    if (previousWindow) {
      const previousWindowPlacement = previousWindow.getWindowPlacement();
      window.setWindowPosition(previousWindowPlacement.x + 20, previousWindowPlacement.y + 20);
    }

    window.setZIndex(this[PRIVATE.zIndexBase] + this[PRIVATE.windows].length - 1);

    return {
      width: 300,
      height: 200
    };
  }

  /**
   *
   * @param window {WindowController}
   */
  unregister (window) {
    this.$log.log('Unregistering a window: ', window);
    _.remove(this[PRIVATE.windows], w => w === window);
  }

  /**
   * Create a new nr-window element with nr-compile inside it and place it on the document body.
   *
   * @param title {string}
   * @param component {string}
   * @param resolve {object}
   */
  createWindow ({title, component, resolve}) {
    let element;

    const scope = this[PRIVATE.$rootScope].$new();

    scope.window = {
      title,
      onClose: () => {
        scope.$destroy();
        element.remove();
      },
      options: {
        component,
        resolve
      }
    };

    const html = `<nr-window 
        title="{{::window.title}}" 
        on-close="window.onClose()"
        ><nr-compile 
            options="window.options"
            ></nr-compile></nr-window>`;
    const template = angular.element(html);
    const linkFn = this[PRIVATE.$compile](template);
    element = linkFn(scope);
    this[PRIVATE.$document].find('body')[0].appendChild(element[0]);
  }

  /**
   * Set window z indexes based on the index in the array.
   *
   * @private
   */
  [PRIVATE.updateZIndexes] () {
    _.forEach(this[PRIVATE.windows], (window, index) => {
      window.setZIndex(this[PRIVATE.zIndexBase] + index);
    });
  }

  /**
   * Move the window as the last window if it isn't already.
   *
   * @param window
   * @private
   * @return {boolean} Returns true if the window was moved.
   */
  [PRIVATE.moveToFront] (window) {
    const windows = this[PRIVATE.windows];
    if (windows[windows.length - 1] !== window) {
      _.remove(windows, w => w === window);
      windows.push(window);
      return true;
    }
    return false;
  }

  /**
   * This call moves the window on the front.
   */
  setFocusOnWindow (window) {
    if (this[PRIVATE.moveToFront](window)) {
      this[PRIVATE.updateZIndexes]();
    }
  }

}

export default WindowService;
