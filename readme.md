[![GitHub release](https://badge.fury.io/js/inspector-api.svg)](https://github.com/wallet77/v8-inspector-api/releases/)
[![GitHub license](https://img.shields.io/github/license/wallet77/v8-inspector-api)](https://github.com/wallet77/v8-inspector-api/blob/master/LICENSE)

# Purpose

Simple wrapper around "inspector" module.
Basically it adds :
- promises & async/await syntax
- S3 exporter

# Compatibility

**/!\ This module use async/await syntax and the inspector module, this is why you must have node 8.0+.**

Supported and tested : >= 8.0

| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 12.x          | yes           | yes            |
| 10.x          | yes           | yes            |
| 9.x           | yes           | yes            |
| 8.x           | yes           | yes            |

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
