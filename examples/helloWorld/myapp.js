import { angular, NrViewController } from "norjs";

let mainViewComponent = {
	template: `
<main>
  <h3>MyApp</h3>

  <p>Hello World</p>
</main>
`,
	controller: class MainViewController extends NrViewController {
		constructor ($injector, $element, $attrs, $scope) {
			super("myMainViewController", $injector, $element, $attrs, $scope);
		}
	}
};

export default angular.module(
	"myapp"
	, [
    ]
  )
  .component('myMainView', mainViewComponent)
  .name;
