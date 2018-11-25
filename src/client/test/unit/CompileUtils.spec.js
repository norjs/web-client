import _ from 'lodash';
import Test from "../utils/Test";

describe('CompileUtils', () => {

  const test = Test.create({

    // This is the module name which will be loaded -- the main test subject
    moduleName: 'norjs.app.utils.compile'

  });

  let compileUtils;

  beforeEach( () => {
    compileUtils = test.get('nrCompileUtils');
  } );

  describe('.stringifyExpression()', () => {

    it('should pass empty string unchanged', () => {
      expect( compileUtils.stringifyExpression('') ).toBe('');
    });

    it('should pass non-empty string unchanged', () => {
      expect( compileUtils.stringifyExpression('foo.bar(123)') ).toBe('foo.bar(123)');
    });

    it('should convert array to string', () => {
      expect( compileUtils.stringifyExpression(['foo.bar(', '123', ')']) ).toBe('foo.bar(123)');
    });

    it('should convert mixed array with number to string', () => {
      expect( compileUtils.stringifyExpression(['foo.bar(', 123, ')']) ).toBe('foo.bar(123)');
    });

    it('should convert mixed array with object to string', () => {
      expect( compileUtils.stringifyExpression(['foo.bar(', {value:123}, ')']) ).toBe('foo.bar({"value":123})');
    });

    it('should convert mixed array with object including strings to string', () => {
      expect( compileUtils.stringifyExpression(['foo.bar(', {value:'$foo.bar'}, ')']) ).toBe('foo.bar({"value":"$foo.bar"})');
    });

    it('should convert object to JSON string', () => {
      expect( compileUtils.stringifyExpression({value:'$foo.bar'}) ).toBe('{"value":"$foo.bar"}');
    });

  });

});
