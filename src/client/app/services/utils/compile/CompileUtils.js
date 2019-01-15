import _ from 'lodash';
import NrService from "../../../abstracts/NrService";

/**
 * Encode expression from a parsed diverse variable (eg. from JSON) format in to a string.
 *
 * For example if is is an array, will convert it like `["foo", "bar"]` ==> `"foobar"`.
 *
 * Anything except a string will be converted to JSON and returned as such.
 *
 * @param expression {*}
 * @return {string}
 */
export function stringifyExpression (expression) {

  if (_.isString(expression)) {
    return expression;
  }

  if (_.isArray(expression)) {
    return _.map(
      expression,
      part => _.isString(part) ? part : JSON.stringify(part)
    ).join('');
  }

  return JSON.stringify(expression);
}

/**
 * This service handles login process to the backend.
 */
class CompileUtils extends NrService {

  /**
   *
   * @param $injector {$injector}
   * @ngInject
   */
  constructor ($injector) {
    super("nrCompileUtils", $injector);
  }

  /**
   * Encode expression from a parsed diverse variable (eg. from JSON) format in to a string.
   *
   * For example if is is an array, will convert it like `["foo", "bar"]` ==> `"foobar"`.
   *
   * Anything except a string will be converted to JSON and returned as such.
   *
   * @param expression {*}
   * @return {string}
   */
  stringifyExpression (expression) {
    return stringifyExpression(expression);
  }

}

export default CompileUtils;
