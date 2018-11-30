import angular from "angular";

let mainViewComponent = {
	template: `
`,
	controller: class MainViewController {
	}
};

export default angular.module(
	"myapp"
	, [
    ]
  )
  .component('myMainView', mainViewComponent)
  .name;
