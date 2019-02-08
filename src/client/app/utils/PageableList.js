import pageableInterface from "./pageableInterface";
import PageUtils from "./PageUtils";

const PRIVATE = {
  list: Symbol('_list')
};

class PageableList {

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
  [pageableInterface.getPage] (opts) {
    return PageUtils.getPage(this[PRIVATE.list], opts);
  }

  /**
   *
   * @param fullList {array}
   * @returns {PageableList}
   */
  static create (fullList) {
    return new PageableList(fullList);
  }

}

export default PageableList;
