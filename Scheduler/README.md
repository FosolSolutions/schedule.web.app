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
> nvm install 8.12.0 // Manually enter version that exists in .nvmrc
```

## 2) Install dependencies with `npm`

From `%ClientRoot%`:

```
> npm install
```

## 3) Create a /Properties/launchSettings.json file

```
{
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:15275",
      "sslPort": 44321
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "Scheduler": {
      "commandName": "Project",
      "launchBrowser": true,
      "applicationUrl": "https://localhost:5001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

## 4) Start the `webpack` development server

From `%ClientRoot%`:

```
> npm run build:dev
```

Now open your dev environment in the browser and the `webpack`-bundled app should load. The dev server will recompile as changes to source files (under `/Scheduler/Client/src/`) are saved.

## Testing JS

Testing is done through [`jest`](https://facebook.github.io/jest/) for a test runner, and [`enzyme`](https://github.com/airbnb/enzyme) for React-specific tests.

Run all test suites:

```
> npm test
```

Run all test suites and generate a coverage report (at `/Scheduler/Client/src/coverage/icov-report/index.html`):

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
