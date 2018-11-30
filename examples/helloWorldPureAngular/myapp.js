import angular from "angular";

let mainViewComponent = {
	template: `
<main>
  <h3>MyApp</h3>

  <p>Hello World</p>
</main>
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
