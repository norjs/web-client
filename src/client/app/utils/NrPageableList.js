import nrPageableInterface from "./nrPageableInterface";
import NrPageUtils from "./NrPageUtils";

const PRIVATE = {
  list: Symbol('_list')
};

class NrPageableList {

  /**
   *
   * @param fullList {array}
   */
  constructor (fullList) {
    'ngInject';
    this[PRIVATE.list] = fullList;
  }

  /**
   * Returns a page from the model list.
   *
   * @param opts {{size:number, page:number}}
   * @returns {{content: Array, page: number, size: number, totalItems: number}}
   */
  [nrPageableInterface.getPage] (opts) {
    return NrPageUtils.getPage(this[PRIVATE.list], opts);
  }

  /**
   *
   * @param fullList {array}
   * @returns {NrPageableList}
   */
  static create (fullList) {
    return new NrPageableList(fullList);
  }

}

export default NrPageableList;
