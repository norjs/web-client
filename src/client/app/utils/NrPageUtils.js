import NrPageableList from "./NrPageableList";

/**
 * Helper functions for paging
 */
class NrPageUtils {

  /**
   * Returns a page from the model list.
   *
   * @param fullList {Array}
   * @param opts {{size:number, page:number}}
   * @returns {{content: any, page: number, size: number, totalItems: number}}
   */
  static getPage (fullList, opts) {
    const {page = 0, size = 10} = opts;
    const totalItems = fullList.length;
    const startIndex = page * size;

    let endIndex = (page+1) * size;
    if (endIndex > totalItems) {
      endIndex = startIndex + (totalItems - startIndex);
    }

    const content = startIndex < totalItems ? fullList.slice(startIndex, endIndex) : [];

    return {
      content,
      page,
      size,
      totalItems
    };
  }

}

export default NrPageUtils;
