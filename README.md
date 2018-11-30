# The NorJS Runtime Environment.

This is a MIT-licensed runtime environment for apps created with our 
not-yet-published commercial *NorJS Development Environment*, **however** *it 
will run any compatible AngularJS ES6 app as well*.

*The NorJS RE* is still under active development and there is no official 
stable release until we release it to the first commercial customer. 

You may follow the progress in [the feature issue #1](https://github.com/norjs/norjs/issues/1).

### Install norjs command line interface

```
npm install -g norjs
```

### Install NorJS Runtime Environment

```
norjs install
```

### Run NorJS app in a development mode

```
norjs run ./app.json
```

### Build static files for production deployment

```
norjs build ./app.json
``` 

### Hello World app

You can extend your app logic with external ES6 enabled AngularJS modules.

Your custom module `./myapp.js`:

```js
import angular from "angular";

let mainViewComponent = {
  template: `
<main>
  <h3>Main page</h3>

  <p>Hello World</p>
</main>
`,
  controller: class MainViewController {
  }
};

export default angular.module(
  "myapp"
  , [])
  .component('myMainView', mainViewComponent)
  .name;
```

Configuration file `./app.json`:

```json
{
  "name": "Hello World",
  "modules": [
    "myapp"
  ],
  "states": {
    "main": {
      "name": "main"
    , "options": {
        "url": "/main"
      , "component": "myMainView"
      }
    }
  }
}
```

Then run it:

```
norjs run --import=./myapp.js ./app.json
```

Or build it:

```
norjs build --import=./myapp.js ./app.json
```
