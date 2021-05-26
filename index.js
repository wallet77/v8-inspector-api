'use strict'

const inspector = require('inspector')
const Profiler = require('./src/profiler')
const Heap = require('./src/heap')

const { S3Client } = require('@aws-sdk/client-s3')

class Inspector {
    constructor (config = {}) {
        if (!config.aws) config.aws = { region: 'eu-west-1' }

        const client = new S3Client(config.aws)

        const session = new inspector.Session()
        session.connect()

        this.session = session

        this.profiler = new Profiler(this.session, config, client)
        this.heap = new Heap(this.session, config, client)
    }

    getCurrentSession () {
        return this.session
    }

    async destroy () {
        await this.profiler.disable()
        await this.heap.disable()
        this.session.disconnect()
        this.session = null
    }
}

module.exports = Inspector
