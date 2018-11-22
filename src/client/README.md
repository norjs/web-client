
### Install packages

```
npm install -d
```

### Running server

```
npm start
```

You can also configure where to load the build configuration for the app by 
configuring an ENV variable `NORJS_CONFIG_FILE`: 

```
NORJS_CONFIG_FILE=./apps/vnc/app.json npm start
```

By default it points to `./src/app.json`.

### Running unit tests

```
npm test
```
