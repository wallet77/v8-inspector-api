'use strict'

const utils = require('./utils')

class Profiler {
    constructor (session, config, s3Client) {
        this.s3Client = s3Client
        this.session = session
        this.config = config
    }

    async enable () {
        await utils.invokeFunction(this.session, 'Profiler.enable')
    }

    async disable () {
        await utils.invokeFunction(this.session, 'Profiler.disable')
    }

    async start () {
        await utils.invokeFunction(this.session, 'Profiler.start')
    }

    async stop () {
        return utils.invokeStop('Profiler.stop', this.session, 'profile', 'cpuprofile', this.config, this.s3Client)
    }

    async startPreciseCoverage (args) {
        return utils.invokeFunction(this.session, 'Profiler.startPreciseCoverage', args)
    }

    async stopPreciseCoverage () {
        return utils.invokeFunction(this.session, 'Profiler.stopPreciseCoverage')
    }

    async takePreciseCoverage () {
        return utils.invokeStop('Profiler.takePreciseCoverage', this.session, 'coverage', 'json', this.config, this.s3Client)
    }
}

module.exports = Profiler
