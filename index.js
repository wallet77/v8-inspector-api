'use strict'

const inspector = require('inspector')
const AwsUtils = require('@voodoo.io/aws-utils').s3
const Profiler = require('./src/profiler')

const aws = require('aws-sdk')

class Inspector {
    constructor (config = {}) {
        if (!config.aws) config.aws = {}

        aws.config.update({ region: config.aws.region || 'eu-west-1' })
        const cli = new aws.S3(config.aws.s3 || {})
        const s3Tools = new AwsUtils(cli)

        const session = new inspector.Session()
        session.connect()

        this.session = session

        this.profiler = new Profiler(session, config, s3Tools)
    }

    getCurrentSession () {
        return this.session
    }
}

module.exports = Inspector
