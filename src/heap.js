'use strict'

const utils = require('./utils')

class Heap {
    /**
     * @param {import('inspector').Session} session
     * @param {import('./types').ResolvedConfig} config
     * @param {import('@aws-sdk/client-s3').S3Client | null} s3Client
     */
    constructor (session, config, s3Client) {
        this.s3Client = s3Client
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
        return utils.invokeStop('HeapProfiler.stopSampling', this.session, 'heapprofiler', 'heapprofile', this.config, this.s3Client)
    }

    /** @returns {Promise<any>} */
    takeSnapshot () {
        return new Promise((resolve, reject) => {
            /** @type {string[]} */
            const res = []
            /** @param {import('inspector').InspectorNotification<import('inspector').HeapProfiler.AddHeapSnapshotChunkEventDataType>} m */
            const getChunk = (m) => {
                res.push(m.params.chunk)
            }

            this.session.on('HeapProfiler.addHeapSnapshotChunk', getChunk)

            this.session.post('HeapProfiler.takeHeapSnapshot', undefined, (err) => {
                this.session.removeListener('HeapProfiler.addHeapSnapshotChunk', getChunk)

                if (err) return reject(err)

                const date = new Date()
                const fileName = `profile_${date.getTime()}.heapsnapshot`

                utils.writeData(JSON.parse(res.join('')), fileName, this.config, this.s3Client).then((data) => {
                    resolve(data)
                }).catch(err => reject(err))
            })
        })
    }
}

module.exports = Heap
