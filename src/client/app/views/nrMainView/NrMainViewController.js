/**
 *
 * @ngInject
 */
class NrMainViewController {

  get nrName () {
    return "nrMainViewController";
  }

  static get $inject () {
    if (this._inject) return this._inject;
    return [];
  }
  static set $inject (value) {
    this._inject = value;
  }

  /**
   *
   * @ngInject
   */
  constructor () {
    'ngInject';
  }

}

export default NrMainViewController;
