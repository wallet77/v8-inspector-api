'use strict'

const utils = require('./utils')

class Heap {
    constructor (session, config, s3Tools) {
        this.s3Tools = s3Tools
        this.session = session
        this.config = config
    }

    enable () {
        return new Promise((resolve, reject) => {
            this.session.post('HeapProfiler.enable', (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    }

    disable () {
        return new Promise((resolve, reject) => {
            this.session.post('HeapProfiler.disable', (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
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
