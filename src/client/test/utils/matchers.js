import _ from 'lodash';

/**
 * Jasmine matcher compare function result.
 */
class MatcherResult {

  constructor (pass, actual, expected = '') {
    this.pass = pass;
    this.actual = actual;
    this.expected = expected;
  }

  get message () {
    const verb = this.pass ? 'not to be' : 'to be';
    return `Expected ${this.actual} ${verb} ${this.expected}`;
  }

}

/**
 * Jasmine custom matcher base class.
 */
class CustomMatcher {

  constructor (util, customEqualityTesters) {
    this.util = util;
    this.customEqualityTesters = customEqualityTesters;
  }

  /**
   * The actual test function
   *
   * @param actual
   * @param expected
   */
  test (actual, expected) {
    throw new TypeError('Not implemented: pass');
  }

  /**
   * Convert actual value as something which explains what it was.
   *
   * @param actual
   * @returns {*}
   */
  actual (actual) {
    return `"${jasmine.pp(actual)}"`;
  }

  /**
   * Convert expected value as something which explains what it was expected to be.
   *
   * @param expected
   * @returns {*}
   */
  expected (expected) {
    return `"${jasmine.pp(expected)}"`;
  }

  /**
   * This is the compare function for Jasmine.
   *
   * @param actual {*}
   * @param expected {*}
   * @returns {MatcherResult}
   */
  compare (actual, expected) {
    const pass = this.test(actual, expected);
    return new MatcherResult(pass, this.actual(actual), this.expected(expected));
  }

  /**
   *
   * @param util
   * @param customEqualityTesters
   * @returns {{compare: (bound|any)}}
   */
  static create (util, customEqualityTesters) {
    const matcher = new this(util, customEqualityTesters);
    return {compare: matcher.compare.bind(matcher)};
  }

}

class ArrayMatcher extends CustomMatcher {

  test (actual, expected) {
    return _.isArray(actual);
  }

  expected (expected) {
    return expected ? `array (${jasmine.pp(expected)})` : 'array';
  }

}

class ObjectMatcher extends CustomMatcher {

  test (actual, expected) {
    return _.isObject(actual);
  }

  expected (expected) {
    return expected ? `object (${jasmine.pp(expected)})` : 'object';
  }

}

class FunctionMatcher extends CustomMatcher {

  test (actual, expected) {
    return _.isFunction(actual);
  }

  expected (expected) {
    return expected ? `function (${jasmine.pp(expected)})` : 'function';
  }

}

var COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
  '<!--[\\s\\S]*?(?:-->)?'
  + '<!---+>?'  // A comment with no body
  + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
  + '|<[?][^>]*>?',  // A pseudo-comment
  'g');

class HtmlMatcher extends CustomMatcher {

  static normalize (value) {
    return _.trim((''+value).replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, ""));
  }

  test (actual, expected) {
    return HtmlMatcher.normalize(actual) === HtmlMatcher.normalize(expected);
  }

  actual (value) {
    return jasmine.pp(HtmlMatcher.normalize(value));
  }

  expected (value) {
    return jasmine.pp(HtmlMatcher.normalize(value));
  }

}

/**
 * Matcher for Jasmine to test a value is an array.
 *
 * @param util
 * @param customEqualityTesters
 * @returns {*}
 */
export function toBeArray (util, customEqualityTesters) {
  return ArrayMatcher.create(util, customEqualityTesters);
}

/**
 * Matcher for Jasmine to test a value is an object.
 *
 * @param util
 * @param customEqualityTesters
 * @returns {*}
 */
export function toBeObject (util, customEqualityTesters) {
  return ObjectMatcher.create(util, customEqualityTesters);
}

/**
 * Matcher for Jasmine to test a value is a function.
 *
 * @param util
 * @param customEqualityTesters
 * @returns {*}
 */
export function toBeFunction (util, customEqualityTesters) {
  return FunctionMatcher.create(util, customEqualityTesters);
}

/**
 * Matcher for Jasmine to test a value is identical HTML source code.
 *
 * @param util
 * @param customEqualityTesters
 * @returns {*}
 */
export function toBeHtml (util, customEqualityTesters) {
  return HtmlMatcher.create(util, customEqualityTesters);
}
