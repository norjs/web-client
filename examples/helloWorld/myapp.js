import { angular, NrViewController } from "norjs";
import template from "./myapp.html";
import "./myapp.scss";

let mainViewComponent = {
	template,
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
