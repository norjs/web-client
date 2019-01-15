import NrService from "../../abstracts/NrService";

/**
 *
 */
class TableService extends NrService {

  /**
   *
   * @param $injector {$injector}
   * @ngInject
   */
  constructor ($injector) {
    super("TableService", $injector);
  }

}

export default TableService;
