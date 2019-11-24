import _ from 'lodash';
import NrCompileUtils from '@norjs/ui/utils/NrCompileUtils';

/**
 * Builds a function which configures application states for angular-ui-router
 * from static `states` configuration object.
 *
 * @param states {object} States configuration object
 * @return {uiRouterConfigurator}
 * @ngInject
 */
function uiRouterConfiguratorFactory (states) {
  'ngInject';

  /**
   *
   * @param config {StateConfigOptions}
   * @param state {StateConfig}
   * @param route {string}
   * @return {StateConfigOptions}
   */
  function prepareStateOptions (config, state, route) {

    config = _.cloneDeep(config);

    if (config && config.resolve) {
      _.forEach(_.keys(config.resolve), key => {
        const value = config.resolve[key];

        // Convert arrays into functions
        if (_.isArray(value)) {

          // FIXME: How about if the last argument is a function? That isn't handled here.

          const depenciesAndFunction = _.concat(['$parse'], value);
          const argKeys = depenciesAndFunction.slice(0, depenciesAndFunction.length-1);
          const expression = depenciesAndFunction[depenciesAndFunction.length-1];
          let compiledExpression;
          depenciesAndFunction[depenciesAndFunction.length-1] = (...args) => {
            const $parse = _.first(args);
            if (!compiledExpression) {
              // FIXME: Values in the expression could be handled through context also, and
              //        their references would stay same.
              compiledExpression = $parse( NrCompileUtils.stringifyExpression(expression) );
            }
            const context = {};
            _.forEach(argKeys, (key, index) => {
              context[key] = args[index];
            });
            return compiledExpression(context);
          };

          config.resolve[key] = depenciesAndFunction;

        // Convert objects (which are not arrays) into function which returns the value
        } else if (_.isObject(value)) {
          config.resolve[key] = () => value;
        }

      });
    }

    return config;
  }

  /**
   * Configures application states for angular-ui-router from static state
   * configuration object which was provided to the factory function.
   *
   * @param $stateProvider {$stateProvider}
   * @param $urlRouterProvider {$urlRouterProvider}
   * @param $locationProvider {$locationProvider}
   * @ngInject
   */
  function uiRouterConfigurator (
    $stateProvider
    , $urlRouterProvider
    , $locationProvider
  ) {
    'ngInject';

    const defaultUrl = _.get(states, 'main.options.url');

    // Now set up the states
    _.forEach(_.keys(states), route => {
      const name = states[route].name;
      const options = prepareStateOptions(states[route].options, states[route], route);
      //console.log('WOOT: ', name, options);
      $stateProvider.state(states[route].name, options);
    });

    // For any unmatched url, redirect to /main
    if (defaultUrl) $urlRouterProvider.otherwise(defaultUrl);

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

  }

  return uiRouterConfigurator;
}

export default uiRouterConfiguratorFactory;
