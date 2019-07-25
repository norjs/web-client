import AbstractComponentController from "../../abstracts/NrComponentController";
import InterfaceUtils from "../../utils/InterfaceUtils";
import TableRow from "./TableRow";
import tableRowInterface from "./tableRowInterface";
import pageableInterface from "../../utils/pageableInterface";
import PageableList from "../../utils/PageableList";

/**
 * @typedef {Object} TableColumnObject
 * @property {number} id -
 * @property {string} key -
 * @property {string} label -
 */

/**
 * @typedef {Object} TableOptionsObject
 * @property {Array.<TableColumnObject>} columns -
 */

/**
 * Private member property symbols for TableController.
 *
 * @type {{$q: Symbol, tableService: Symbol, content: Symbol, options: Symbol, contentAPI: Symbol, fetchPage: Symbol,
 *     columnCompileOptions: Symbol}}
 */
const PRIVATE = {

  $q: Symbol('$q'),

  tableService: Symbol('tableService'),

  /**
   * The logger
   */
  log: Symbol('_log'),

  /**
   * The content data
   */
  content: Symbol('_content'),

  /**
   * The options data
   */
  options: Symbol('_options'),

  /**
   * Interface to access content data using pageable interface
   */
  contentAPI: Symbol('_contentAPI'),

  /**
   * Private method to get an instance implementing tableRowInterface for a specific table row item.
   */
  getRowAPI: Symbol('_getRowAPI'),

  /**
   * Private method to fetch a page.
   */
  fetchPage: Symbol('_fetchPage'),

  /**
   * Private array member to save column compile configuration objects.
   */
  columnCompileOptions: Symbol('_columnCompileOptions')

};

/**
 *
 * @ngInject
 */
class TableController extends AbstractComponentController {

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @param $q {$q}
   * @param tableService {TableService}
   * @ngInject
   */
  constructor ($injector, $element, $attrs, $scope, $q, tableService) {
    'ngInject';
    super("TableController", $injector, $element, $attrs, $scope);

    /**
     * @member {TableService}
     */
    this[PRIVATE.tableService] = tableService;

    /**
     * @member {$q}
     */
    this[PRIVATE.$q] = $q;

    /**
     * Current visible page.
     *
     * @member {undefined|{}}
     */
    this.page = undefined;

    /**
     *
     * @member {[]}
     */
    this[PRIVATE.content] = undefined;

    /**
     *
     * @member {{}}
     */
    this[PRIVATE.options] = {};

    /**
     *
     * @member {PageableInterface|undefined}
     */
    this[PRIVATE.contentAPI] = undefined;

    /**
     *
     * @member {Array}
     */
    this[PRIVATE.columnCompileOptions] = [];

    this[PRIVATE.log] = TableController.getLogger(this, name);

  }

  /**
   * Getter for AngularJS component attribute binding.
   *
   * @returns {*}
   * @private
   */
  get __options () {
    return this[PRIVATE.options];
  }

  /**
   * Setter for AngularJS component attribute binding.
   *
   * @param value
   * @private
   */
  set __options (value) {
    this[PRIVATE.options] = value;
  }

  /**
   * Getter for AngularJS component attribute binding.
   *
   * @returns {*}
   * @private
   */
  get __content () {
    return this[PRIVATE.content];
  }

  /**
   * Setter for AngularJS component attribute binding.
   *
   * @param value
   * @private
   */
  set __content (value) {

    this[PRIVATE.content] = value;

    if (value === undefined) {
      this[PRIVATE.log].log('undefined assigned to the table content property.');
      return;
    }

    if (InterfaceUtils.implements(pageableInterface, value)) {
      this[PRIVATE.contentAPI] = InterfaceUtils.createWrapper(pageableInterface, value);
    } else if (_.isArray(value)) {
      this[PRIVATE.contentAPI] = InterfaceUtils.createWrapper(pageableInterface, PageableList.create(value));
    } else {
      // FIXME: Change this to a visible error message.
      this[PRIVATE.log].warn("Warning! Content for table-view was not a supported type: " + typeof value);
      return;
    }

    this[PRIVATE.fetchPage]({page:0, size:10}).catch(err => {
      this[PRIVATE.log].error('Error: ', err);
    });

  }

  /**
   *
   * @param opts {{size:number,page:number}}
   * @returns {Promise<Object>}
   */
  [PRIVATE.fetchPage] (opts) {
    return this[PRIVATE.$q].resolve(this[PRIVATE.contentAPI].getPage(opts)).then(page => {
      page.content = _.map(page.content, item => this[PRIVATE.getRowAPI](item));
      this.page = page;
      this[PRIVATE.log].log('Page assigned as: ', this.page);

      let columns = this[PRIVATE.options] ? this[PRIVATE.options].columns : [];
      if (columns.length) {
        const item = _.first(page.content);
        _.each(columns, column => {
          if (!column.label && column.key && item) {
            column.label = item.getLabel(column.key);
          }
        });
      } else {
        _.each(page.content, item => {
          _.each(item.getKeys(), key => {
            if (!_.some(columns, column => column.key === key)) {
              const label = item.getLabel(key);
              columns.push({id: columns.length, key, label});
            }
          });
        });
      }

      this.columns = columns;
      this[PRIVATE.log].debug('columns assigned as ', this.columns);

    });
  }

  /**
   *
   * @param item
   */
  [PRIVATE.getRowAPI] (item) {
    if (InterfaceUtils.implements(tableRowInterface, item)) {
      return InterfaceUtils.createWrapper(tableRowInterface, item);
    }
    return InterfaceUtils.createWrapper(tableRowInterface, TableRow.create(item));
  }

  /** The ID of the item
   *
   * @param item
   */
  getItemId (item) {
    return item.getId();
  }

  /** Returns value for column by key
   *
   * @param item
   * @param column
   */
  getItemValue (item, column) {
    return item.getValue(column.key);
  }

  /**
   *
   * @returns {*}
   */
  getItems () {
    return _.get(this.page, 'content', undefined);
  }

  /** Returns label for column by key
   *
   * @param key
   */
  getLabel (key) {
  }

  /**
   * Returns the current page number for humans (eg. starts from `1`).
   *
   * @returns {*}
   */
  getCurrentPage () {
    return _.get(this.page, 'page', 0) + 1;
  }

  /**
   * Returns the total number of pages for humans (eg. starts from `1`).
   *
   * @returns {number}
   */
  getTotalPages () {
    const totalItems = _.get(this.page, 'totalItems', 0);
    const pageSize = _.get(this.page, 'size', 1);
    return Math.ceil(totalItems / pageSize);
  }

  /**
   * Check if previous page button should be enabled.
   *
   * @returns {boolean}
   */
  isPrevPageEnabled () {
    return _.get(this.page, 'page', 0) >= 1;
  }

  /**
   * Check if next page button should be enabled.
   *
   * @returns {boolean}
   */
  isNextPageEnabled () {
    return _.get(this.page, 'page', 0)+1 < this.getTotalPages();
  }

  /**
   *
   * @returns {*|Promise<T | never>|void}
   */
  goPrevPage () {
    const page = _.get(this.page, 'page', 0) - 1;
    const size = _.get(this.page, 'size', 0);
    this[PRIVATE.log].debug('Going to page ', page, ' with size ', size);
    return this[PRIVATE.fetchPage]({page, size}).catch(err => {
      this[PRIVATE.log].error('Error: ', err);
    });
  }

  /**
   *
   * @returns {*|Promise<T | never>|void}
   */
  goNextPage () {
    const page = _.get(this.page, 'page', 0) + 1;
    const size = _.get(this.page, 'size', 0);
    this[PRIVATE.log].debug('Going to page ', page, ' with size ', size);
    return this[PRIVATE.fetchPage]({page, size}).catch(err => {
      this[PRIVATE.log].error('Error: ', err);
    });
  }

  /**
   *
   * @param column
   * @returns {boolean}
   */
  isItemCompileAble (column) {
    return !!(column && column.component);
  }

  /**
   *
   * @param column
   * @param item
   * @returns {*}
   */
  getCompileOptions (column, item) {

    const columnCompileOptions = this[PRIVATE.columnCompileOptions];

    const id = column && column.id;

    if (!id) {
      this[PRIVATE.log].warn('Warning! Column did not have an id, which is required for item resolving: ', column);
      return column;
    }

    let options = _.find(columnCompileOptions, o => o.id === id && _.get(o, 'resolve.item') === item);

    if (!options) {
      options = _.cloneDeep(column);
      columnCompileOptions.push(options);
    }

    //console.log('WOOT options = ', options.id, id);

    // Assign item if item isn't already there
    if (_.isObject(options) && !angular.equals(_.get(options, 'resolve.item'), item)) {
      if (!_.isObject(options.resolve)) {
        options.resolve = {};
      }
      options.resolve.item = item;
    }

    return options;
  }

}

export default TableController;
