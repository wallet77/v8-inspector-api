'use strict'

const utils = require('./utils')

class Heap {
    constructor (session, config, s3Tools) {
        this.s3Tools = s3Tools
        this.session = session
        this.config = config
    }

    takeSnapshot () {
        return new Promise((resolve, reject) => {
            const res = []

            this.session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
                res.push(m.params.chunk)
            })

            this.session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
                if (err) return reject(err)

                const date = new Date()
                const fileName = `profile_${date.getTime()}.heapsnapshot`

                utils.writeData(res.join(''), fileName, this.config, this.s3Tools).then((data) => {
                    resolve(data)
                }).catch(err => reject(err))
            })
        })
    }
}

module.exports = Heap
