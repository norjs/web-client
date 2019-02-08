import tableRowInterface from "./tableRowInterface";

const PRIVATE = {
  item: Symbol('item')
};

/**
 * TableRow implements TableRowInterface.
 */
export class TableRow {

  constructor (item) {
    'ngInject';
    this[PRIVATE.item] = item;
  }

  static create (item) {
    return new TableRow(item);
  }

  [tableRowInterface.getId] () {
    return this[PRIVATE.item] && this[PRIVATE.item].id;
  }

  [tableRowInterface.getKeys] () {
    return this[PRIVATE.item] ? _.keys(this[PRIVATE.item]) : [];
  }

  [tableRowInterface.getLabel] (key) {
    return key;
  }

  [tableRowInterface.getValue] (key) {
    return this[PRIVATE.item][key];
  }

}

export default TableRow;
