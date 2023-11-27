[![GitHub release](https://img.shields.io/npm/v/inspector-api.svg)](https://github.com/wallet77/v8-inspector-api/releases/)
[![GitHub license](https://img.shields.io/github/license/wallet77/v8-inspector-api.svg)](https://github.com/wallet77/v8-inspector-api/blob/master/LICENSE)

[![CI pipeline](https://github.com/wallet77/v8-inspector-api/workflows/Node.js%20CI/badge.svg)](https://github.com/wallet77/v8-inspector-api/actions?query=workflow%3A%22Node.js+CI%22)
[![Code coverage](https://codecov.io/gh/wallet77/v8-inspector-api/branch/master/graph/badge.svg)](https://codecov.io/gh/wallet77/v8-inspector-api)
[![Opened issues](https://img.shields.io/github/issues-raw/wallet77/v8-inspector-api)](https://github.com/wallet77/v8-inspector-api/issues)
[![Opened PR](https://img.shields.io/github/issues-pr-raw/wallet77/v8-inspector-api)](https://github.com/wallet77/v8-inspector-api/pulls)
[![DeepScan grade](https://deepscan.io/api/teams/12061/projects/15020/branches/292505/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12061&pid=15020&bid=292505)
[![Node version](https://img.shields.io/node/v-lts/inspector-api.svg)](https://github.com/wallet77/v8-inspector-api)

# Purpose

Simple wrapper around "inspector" module.
Basically it adds :
- promises & async/await syntax
- S3 exporter

# Compatibility

| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 20.x          | yes           | yes            |
| 18.x          | yes           | yes            |
| 16.x          | yes           | yes            |

**In order to have all features we recommend to use at least Node.js version 10 or higher.**

# Installation

```console
$ npm install inspector-api --save
```

# Usage

## CPU profiling
```javascript
const Inspector = require('inspector-api')
const inspector = new Inspector()

await inspector.profiler.enable()
await inspector.profiler.start()
// Invoke business logic under measurement here...

// some time later...
await inspector.profiler.stop()

```

## Memory sampling
```javascript
const Inspector = require('inspector-api')
const inspector = new Inspector()

await inspector.heap.enable()
await inspector.heap.startSampling()
// Invoke business logic under measurement here...

// some time later...
await inspector.heap.stopSampling()

```

## Memory snapshot
```javascript
const Inspector = require('inspector-api')
const inspector = new Inspector()

await inspector.heap.takeSnapshot()

```

## Code coverage
```javascript
const Inspector = require('inspector-api')
const inspector = new Inspector()

await inspector.profiler.enable()
await inspector.profiler.startPreciseCoverage({ callCount: true, detailed: true })

const data = await inspector.profiler.takePreciseCoverage()
await inspector.profiler.stopPreciseCoverage()

```

## Use S3 exporter
```javascript
const Inspector = require('inspector-api')
const inspector = new Inspector({
    storage: {
        type: 's3',
        bucket: 'testBucket',
        dir: 'inspector'
    }
})

await inspector.profiler.enable()
await inspector.profiler.start()
// Invoke business logic under measurement here...

// some time later...
await inspector.profiler.stop()

```

**Warning: it seems that the new AWS SDK leads to unexpected error if you use the takeSnapshot method (you should use memory sampling)**

### Constructor's config

```javascript
new inspector([config])
```

#### config.storage

| Option        | description                                | Default value  |
|:-------------:|:------------------------------------------:|:--------------:|
| `type`        | Storage type (raw, s3 or fs)               | raw            |
| `bucket`      | S3 bucket's name                           | none           |
| `dir`         | Directory where to store the file          | none           |

If you use fs, the generated data will be store on the disk in your default tmp directory.
You can display it in Node.js with the command `require('os').tmpdir()`

# Test

```console
$ npm test
```

Coverage report can be found in coverage/.
