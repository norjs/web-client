import * as matchers from "./matchers";

export function beforeEach () {
  jasmine.addMatchers(matchers);
}

export default beforeEach;
