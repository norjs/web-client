

/**
 *
 * @ngInject
 */
class NrNavViewController {

  /**
   *
   * @param NAVS {*}
   * @ngInject
   */
  constructor (NAVS) {
    'ngInject';

    this._nav = _.cloneDeep(NAVS && NAVS.top ? NAVS.top : { collection: [] });

    if (!this._nav.collection) {
      this._nav.collection = [];
    }

    this._nav.getId = item => item.id;
    this._nav.getHref = item => item.href || item.id;
    this._nav.getIcon = item => item.icon;
    this._nav.getLabel = item => item.label;
    this._nav.isVisible = item => item.visible === undefined ? true : item.visible;

  }

  get nav () {
    return this._nav;
  }

}

export default NrNavViewController;
