# Webpack bundling

`%ClientRoot%` = "schedule.web.app/Scheduler/Client"

## 1) Install `node`
Install [`nvm`](https://github.com/creationix/nvm) (Linux/OSX) *OR*
Install [`nvm-windows`](https://github.com/coreybutler/nvm-windows) (Windows)

#### Linux/OSX
From `%ClientRoot%`:
```
> nvm install
```

#### Windows
From `%ClientRoot%`:
```
> nvm install 8.1.4 // Whatever version exists in .nvmrc
```

## 2) Install dependencies with `npm`
From `%ClientRoot%`:
```
> npm install
```

## 3) Start the `webpack` development server
From `%ClientRoot%`:
```
> npm run devserver
```

Now open your dev environment in the browser and the `webpack`-bundled app should load. The dev server will recompile as changes to source files (under `src/AppBundle/Resources/client`) are saved.

## Testing JS

Testing is done through [`jest`](https://facebook.github.io/jest/) for a test runner, and [`enzyme`](https://github.com/airbnb/enzyme) for React-specific tests.

Run all test suites:
```
> npm test
```
Run all test suites and generate a coverage report (at `src/AppBundle/Resources/client/coverage`):
```
> npm run testCoverage
```
Run a single test suite:
```
> npm test TestSuiteName.test.js
```
Run a test suite and update test snapshots:
```
> npm test TestSuiteName.test.js -- -u
```
