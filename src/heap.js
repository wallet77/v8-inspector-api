'use strict'

const utils = require('./utils')

class Heap {
    constructor (session, config, s3Tools) {
        this.s3Tools = s3Tools
        this.session = session
        this.config = config
    }

    async enable () {
        await utils.invokeFunction(this.session, 'HeapProfiler.enable')
    }

    async disable () {
        await utils.invokeFunction(this.session, 'HeapProfiler.disable')
    }

    async startSampling () {
        await utils.invokeFunction(this.session, 'HeapProfiler.startSampling')
    }

    async stopSampling () {
        return utils.invokeStop('HeapProfiler.stopSampling', this.session, 'heapprofiler', 'heapprofile', this.config, this.s3Tools)
    }

    takeSnapshot () {
        return new Promise((resolve, reject) => {
            const res = []
            const getChunk = (m) => {
                res.push(m.params.chunk)
            }

            this.session.on('HeapProfiler.addHeapSnapshotChunk', getChunk)

            this.session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
                this.session.removeListener('HeapProfiler.addHeapSnapshotChunk', getChunk)

                if (err) return reject(err)

                const date = new Date()
                const fileName = `profile_${date.getTime()}.heapsnapshot`

                utils.writeData(JSON.parse(res.join('')), fileName, this.config, this.s3Tools).then((data) => {
                    resolve(data)
                }).catch(err => reject(err))
            })
        })
    }
}

module.exports = Heap
