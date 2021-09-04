# conference-vue

[![Build Status](https://app.travis-ci.com/Vaggal/conference-vue.svg?branch=master)](https://app.travis-ci.com/Vaggal/conference-vue)

Front-End for the conference project

## Running the project

In order for the project to work the conference back-end needs to run so that there is a web server and a socket server running locally.  
You should have node 15+ installed locally.

For production the resulting build from this project should be placed in the public folder of the conference project so that they can be deployed together.

### Provided commands

There are several scripts that provide an easier way to execute some tasks in the project.

#### Install the packages

```bash
npm install
```

#### Compile and hot-reload for development

```bash
npm run serve
```

#### Compile and minify for production

```bash
npm run build
```

#### Run the unit tests

```bash
npm run test:unit
```

#### Run the e2e tests

```bash
npm run test:e2e
```

to enable cypress recording, a record key should be provided through an environment variable named CYPRESS_RECORD_KEY

#### Lint the files

```bash
npm run lint
```

#### Format all the files

```bash
npm run prettier
```
