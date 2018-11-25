import _ from 'lodash';
import NrComponentController from '../../abstracts/NrComponentController';

const defaultWindowWidth = 300;
const defaultWindowHeight = 200;

/**
 *
 * @type {{windowService: *, $document: *, $onInit: *, $onDestroy: *, $postLink: *, title: *, mouseMove: *, mouseUp: *, mouseDown: *, contentMouseDown: *,
 *     windowPosition: *, startX: *, startY: *, startWidth: *, startHeight: *, initialMouseX: *, initialMouseY: *, isMoving: *, options: *, contentElement: *,
 *     zIndex: *, contentAreaSeen: *, unbindFromDocument: *, initContentAreaElement: *, updateIsMoving: *, toggleElementClass: *, onDocumentMouseMove: *,
 *     onDocumentMouseUp: *, onElementMouseDown: *, onContentMouseDown: *}}
 */
const PRIVATE = {

  // Symbols for dependencies
  windowService: Symbol('_windowService')
  , $document: Symbol('$document')

  // Our lifecycle handler symbols
  , initMouseDownListener: Symbol('initMouseDownListener')
  , unregisterFromWindowService: Symbol('unregisterFromWindowService')
  , offMouseDownListener: Symbol('offMouseDownListener')
  , offContentElementMouseDownListener: Symbol('offContentElementMouseDownListener')
  , unbindFromDocumentIfMoving: Symbol('unbindFromDocumentIfMoving')

  // Private member property symbols
  , title: Symbol('_title')
  , mouseMove: Symbol('_mouseMove')
  , mouseUp: Symbol('_mouseUp')
  , mouseDown: Symbol('_mouseDown')
  , contentMouseDown: Symbol('_contentMouseDown')
  , windowPosition: Symbol('_windowPosition')
  , startX: Symbol('_startX')
  , startY: Symbol('_startY')
  , startWidth: Symbol('_startWidth')
  , startHeight: Symbol('_startHeight')
  , initialMouseX: Symbol('_initialMouseX')
  , initialMouseY: Symbol('_initialMouseY')
  , isMoving: Symbol('_isMoving')
  , options: Symbol('_options')
  , contentElement: Symbol('_contentElement')
  , zIndex: Symbol('_zIndex')
  , contentAreaSeen: Symbol('_contentAreaSeen')

  // Private method symbols
  , unbindFromDocument: Symbol('_unbindFromDocument')
  , initContentAreaElement: Symbol('_initContentAreaElement')
  , updateIsMoving: Symbol('_updateIsMoving')
  , toggleElementClass: Symbol('_toggleElementClass')
  , onDocumentMouseMove: Symbol('_onDocumentMouseMove')
  , onDocumentMouseUp: Symbol('_onDocumentMouseUp')
  , onElementMouseDown: Symbol('_onElementMouseDown')
  , onContentMouseDown: Symbol('_onContentMouseDown')

};

/**
 * Simple floating window element
 *
 * @ngInject
 */
class WindowController extends NrComponentController {

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @ngInject
   */
  constructor ($injector, $element, $attrs, $scope) {
    super("nrWindowController", $injector, $element, $attrs, $scope);

    /**
     * @member {WindowService}
     */
    this[PRIVATE.windowService] = $injector.get('nrWindowService');

    /**
     * @member {$document}
     */
    this[PRIVATE.$document] = $injector.get('$document');

    /**
     *
     * @param $event
     * @returns {boolean}
     * @private
     */
    this[PRIVATE.mouseMove] = ($event) => this[PRIVATE.onDocumentMouseMove]($event);

    /**
     *
     * @param $event
     * @private
     */
    this[PRIVATE.mouseUp] = ($event) => this[PRIVATE.onDocumentMouseUp]($event);

    /**
     *
     * @param $event
     * @returns {boolean}
     * @private
     */
    this[PRIVATE.mouseDown] = ($event) => this[PRIVATE.onElementMouseDown]($event);

    /**
     *
     * @param $event
     * @returns {boolean}
     * @private
     */
    this[PRIVATE.contentMouseDown] = ($event) => this[PRIVATE.onContentMouseDown]($event);


    /**
     * The window position.
     *
     * @type {{x: undefined|number, y: undefined|number}}
     * @private
     */
    this[PRIVATE.windowPosition] = {x: undefined, y:undefined};

    /**
     *
     * @type {undefined|number}
     * @private
     */
    this[PRIVATE.startX] = undefined;

    /**
     *
     * @type {undefined|number}
     * @private
     */
    this[PRIVATE.startY] = undefined;

    /**
     *
     * @type {undefined|number}
     * @private
     */
    this[PRIVATE.startWidth] = undefined;

    /**
     *
     * @type {undefined|number}
     * @private
     */
    this[PRIVATE.startHeight] = undefined;

    /**
     *
     * @type {undefined|number}
     * @private
     */
    this[PRIVATE.initialMouseX] = undefined;

    /**
     *
     * @type {undefined|number}
     * @private
     */
    this[PRIVATE.initialMouseY] = undefined;

    /**
     *
     * @type {boolean}
     * @private
     */
    this[PRIVATE.isMoving] = false;

    /**
     *
     * @type {{width: number, height: number}}
     * @private
     */
    this[PRIVATE.options] = this[PRIVATE.windowService].register(this);

    /**
     * Event broadcasted to child components when window changes size.
     *
     * @member {string}
     */
    this.RESIZE_EVENT = 'nr-window:resize';

    this.$element.css({
      position: 'absolute'
      , width: this.getWindowWidth() + 'px'
      , height: this.getWindowHeight() + 'px'
    });

    this.registerLifeCycleMethods({
      $onInit: PRIVATE.initMouseDownListener
      , $onDestroy: [
        PRIVATE.unregisterFromWindowService
        , PRIVATE.offMouseDownListener
        , PRIVATE.offContentElementMouseDownListener
        , PRIVATE.unbindFromDocumentIfMoving
      ]
      , $postLink: PRIVATE.initContentAreaElement
    });

  }

  /**
   * Register mousedown listener on $element.
   *
   * This is one of the $onInit handlers.
   */
  [PRIVATE.initMouseDownListener] () {
    this.$element.on('mousedown', this[PRIVATE.mouseDown]);
  }

  /**
   * Tell windowService to unregister us.
   *
   * This is one of the $onDestroy handlers.
   */
  [PRIVATE.unregisterFromWindowService] () {
    this.$log.log('Unregistering from window service...');
    this[PRIVATE.windowService].unregister(this);
  }

  /**
   * Unlisten mousedown events from $element
   *
   * This is one of the $onDestroy handlers.
   */
  [PRIVATE.offMouseDownListener] () {
    this.$element.off('mousedown', this[PRIVATE.mouseDown]);
  }

  /**
   * Unlisten mousedown events from contentElement if it exists
   *
   * This is one of the $onDestroy handlers.
   */
  [PRIVATE.offContentElementMouseDownListener] () {
    if (this[PRIVATE.contentElement]) {
      this[PRIVATE.contentElement].off('mousedown', this[PRIVATE.contentMouseDown]);
    }
  }

  /**
   * Unbind from document if we need to.
   *
   * This is one of the $onDestroy handlers.
   */
  [PRIVATE.unbindFromDocumentIfMoving] () {
    if (this[PRIVATE.isMoving]) {
      this[PRIVATE.unbindFromDocument]();
    }
  }

  /**
   * AngularJS binding attribute setter.
   *
   * @param value
   * @private
   */
  set __title (value) {
    this[PRIVATE.title] = value;
  }

  /**
   * AngularJS binding attribute getter.
   *
   * @returns {*}
   * @private
   */
  get __title () {
    return this[PRIVATE.title];
  }

  /**
   * Set window title.
   *
   * @param value {string}
   */
  setTitle (value) {
    this[PRIVATE.title] = value;
    this.$log.log('Window title set as: ', value);
  }

  /**
   *
   * @returns {string}
   */
  getTitle () {
    return '' + (this[PRIVATE.title] || 'common.title');
  }

  /**
   * Returns the title of the window.
   *
   * @returns {string}
   */
  get title () {
    return this.getTitle();
  }

  /**
   *
   * @returns {boolean}
   */
  isMoving () {
    return !!this[PRIVATE.isMoving];
  }

  /**
   *
   * @returns {undefined|number}
   */
  getX () {
    if (this[PRIVATE.windowPosition].x === undefined) {
      this[PRIVATE.windowPosition].x = this.$element.prop('offsetLeft');
    }
    return this[PRIVATE.windowPosition].x;
  }

  /**
   *
   * @returns {undefined|number}
   */
  getY () {
    if (this[PRIVATE.windowPosition].y === undefined) {
      this[PRIVATE.windowPosition].y = this.$element.prop('offsetTop');
    }
    return this[PRIVATE.windowPosition].y;
  }

  /**
   * Returns current zIndex (actually the last one we set there)
   * @returns {*}
   */
  getZIndex () {
    return this[PRIVATE.zIndex];
  }

  /**
   * Set window CSS z index
   *
   * @param zIndex
   */
  setZIndex (zIndex) {
    if (zIndex === this[PRIVATE.zIndex]) return;
    this[PRIVATE.zIndex] = zIndex;
    this.$element.css({zIndex});
  }

  /**
   *
   * @returns {number}
   */
  getWindowWidth () {
    return _.get(this[PRIVATE.options], 'width', defaultWindowWidth);
  }

  /**
   *
   * @returns {number}
   */
  getWindowHeight () {
    return _.get(this[PRIVATE.options], 'height', defaultWindowHeight);
  }

  /**
   * Initialize this[PRIVATE.contentElement].
   *
   * This is registered as a $postLink handler.
   *
   * @private
   */
  [PRIVATE.initContentAreaElement] () {
    if (this[PRIVATE.contentElement]) return;

    this[PRIVATE.contentElement] = angular.element(this.$element[0].querySelector('.content-area'));

    if (this[PRIVATE.contentElement]) {
      this[PRIVATE.contentElement].on('mousedown', this[PRIVATE.contentMouseDown]);
    }

  }

  /**
   *
   */
  initContentAreaElement () {
    this[PRIVATE.initContentAreaElement]();
  }

  /**
   * Detect when a click is made to the content area and mark the $event object for later use in
   * `this[PRIVATE.onElementMouseDown]()`.
   *
   * @param $event
   * @private
   */
  [PRIVATE.onContentMouseDown] ($event) {
    $event[PRIVATE.contentAreaSeen] = true;
  }

  /**
   * When mouse is pressed down, bind listeners to $document for mouse movement.
   *
   * This handler will ignore the click if it was made to the content area.
   *
   * @param $event
   * @returns {boolean|undefined}
   * @private
   */
  [PRIVATE.onElementMouseDown] ($event) {

    this[PRIVATE.windowService].setFocusOnWindow(this);

    // Ignore if this click was through the content area element
    if ($event[PRIVATE.contentAreaSeen]) return;

    $event.preventDefault();
    this[PRIVATE.startX] = this.$element.prop('offsetLeft');
    this[PRIVATE.startY] = this.$element.prop('offsetTop');
    this[PRIVATE.startWidth] = this.getWindowWidth();
    this[PRIVATE.startHeight] = this.getWindowHeight();
    this[PRIVATE.initialMouseX] = $event.clientX;
    this[PRIVATE.initialMouseY] = $event.clientY;

    const borderWidth = 3;
    const width = this[PRIVATE.startWidth];
    const height = this[PRIVATE.startHeight];
    const offsetLimit = 3;
    const isLeft = Math.abs(this[PRIVATE.initialMouseX] - this[PRIVATE.startX]) <= offsetLimit;
    const isTop = Math.abs(this[PRIVATE.initialMouseY] - this[PRIVATE.startY]) <= offsetLimit;
    const isRight = Math.abs(this[PRIVATE.initialMouseX] - this[PRIVATE.startX] - width - borderWidth) <= offsetLimit;
    const isBottom = Math.abs(this[PRIVATE.initialMouseY] - this[PRIVATE.startY] - height - borderWidth) <= offsetLimit;

    let actions = [];
    if (!isLeft && !isTop && !isRight && !isBottom) {
      actions.push('move');
    } else {
      if (isLeft) actions.push('resize:left');
      if (isRight) actions.push('resize:right');
      if (isTop) actions.push('resize:top');
      if (isBottom) actions.push('resize:bottom');
    }
    this.actions = actions;

    //console.log('WOOT - '
    //  , isLeft
    //  , isTop
    //  , isRight
    //  , isBottom
    //  , actions
    //  , $event);

    this[PRIVATE.$document].on('mousemove', this[PRIVATE.mouseMove]);
    this[PRIVATE.$document].on('mouseup', this[PRIVATE.mouseUp]);
    this[PRIVATE.updateIsMoving](true);
    return false;
  }

  /**
   * Handle mouse movement
   *
   * @param $event
   * @private
   */
  [PRIVATE.onDocumentMouseMove] ($event) {
    $event.preventDefault();

    const placement = this.getWindowPlacement();
    const dx = $event.clientX - this[PRIVATE.initialMouseX];
    const dy = $event.clientY - this[PRIVATE.initialMouseY];

    //console.log('WOOT - ', dx, dy, placement);

    const minWidth = 64;
    const minHeight = 64;

    let x = placement.x;
    let y = placement.y;
    let w = placement.width;
    let h = placement.height;

    let resized = false;

    _.forEach(this.actions, action => {
      let args = action.split(':');
      let command = args.shift();
      switch(command) {

        case "move":
          x = this[PRIVATE.startX] + dx;
          y = this[PRIVATE.startY] + dy;
          break;

        case "resize":
          resized = true;
          let direction = args.shift();
          switch(direction) {

            case "top":
              y = this[PRIVATE.startY] + dy;
              h = this[PRIVATE.startHeight] - dy;
              break;

            case "right":
              w = this[PRIVATE.startWidth] + dx;
              break;

            case "bottom":
              h = this[PRIVATE.startHeight] + dy;
              break;

            case "left":
              x = this[PRIVATE.startX] + dx;
              w = this[PRIVATE.startWidth] - dx;
              break;

          }

      }
    });

    this.setWindowPlacement(
      x
      , y
      , w < minWidth ? minWidth : w
      , h < minHeight ? minHeight : h
    );

    if (resized) {
      this.$scope.$broadcast(this.RESIZE_EVENT);
    }

    return false;
  }

  /**
   *
   * @return {{x: (undefined | number), y: (undefined | number)}}
   */
  getWindowPosition () {
    return {
      x: this.getX()
      , y: this.getY()
      , z: this.getZIndex()
    };
  }

  /**
   *
   * @return {{x: (undefined | number), y: (undefined | number), width: number, height: number}}
   */
  getWindowPlacement () {
    return {
      x: this.getX()
      , y: this.getY()
      , z: this.getZIndex()
      , width: this.getWindowWidth()
      , height: this.getWindowHeight()
    };
  }

  /**
   * Set the window position using CSS.
   *
   * @param x
   * @param y
   * @private
   */
  setWindowPosition (x, y) {
    this[PRIVATE.windowPosition] = {x, y};
    this.$element.css({
      left: x + 'px',
      top:  y + 'px'
    });
  }

  /**
   *
   * @param x {number}
   * @param y {number}
   * @param w {number}
   * @param h {number}
   */
  setWindowPlacement (x, y, w, h) {

    this[PRIVATE.windowPosition] = {x, y};
    this[PRIVATE.options].width = w;
    this[PRIVATE.options].height = h;

    this.$element.css({
      left: x + 'px'
      , top:  y + 'px'
      , width: w + 'px'
      , height: h + 'px'
    });

  }

  /**
   * Unbinds listeners from $document
   *
   * @private
   * @param $event
   */
  [PRIVATE.onDocumentMouseUp] ($event) {
    $event.preventDefault();
    this[PRIVATE.unbindFromDocument]();
  }

  /**
   * Unbind mouse listeners from $document object.
   *
   * @private
   */
  [PRIVATE.unbindFromDocument] () {
    this[PRIVATE.$document].off('mousemove', this[PRIVATE.mouseMove]);
    this[PRIVATE.$document].off('mouseup', this[PRIVATE.mouseUp]);
    this[PRIVATE.updateIsMoving](false);
  }

  /**
   * Add or remove is-moving class from the element.
   *
   * @private
   * @param value {boolean}
   */
  [PRIVATE.updateIsMoving] (value) {
    this[PRIVATE.isMoving] = !!value;
    this[PRIVATE.toggleElementClass]('is-moving', this[PRIVATE.isMoving]);
  }

  /**
   * Add or remove a class.
   *
   * @param className {string}
   * @param addIt {boolean} If `true` the class should be removed if it exists
   * @private
   */
  [PRIVATE.toggleElementClass] (className, addIt = true) {
    if (!addIt) {
      if (this.$element.hasClass(className)) {
        this.$element.removeClass(className);
      }
    } else {
      if (!this.$element.hasClass(className)) {
        this.$element.addClass(className);
      }
    }
  }

  /**
   * Close this window.
   */
  close () {
    if (_.isFunction(this.__onClose)) {
      this.__onClose({nrWindow:this});
    } else {
      this.$log.error("No on-close handler implemented. Cannot close the window.");
    }
  }

}

export default WindowController;
