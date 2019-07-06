'use strict'

const fs = require('fs')
const os = require('os')

class Profiler {
    constructor (session, config, s3Tools) {
        if (!config.storage) config.storage = { type: 'fs' }

        this.s3Tools = s3Tools
        this.session = session
        this.config = config
    }

    enable () {
        return new Promise((resolve, reject) => {
            this.session.post('Profiler.enable', (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    }

    start () {
        return new Promise((resolve, reject) => {
            this.session.post('Profiler.start', (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    }

    stop () {
        return new Promise((resolve, reject) => {
            this.session.post('Profiler.stop', (err, { profile }) => {
                if (err) return reject(err)

                const date = new Date()
                const fileName = `profile_${date.getTime()}.cpuprofile`

                if (this.config.storage.type === 'fs') {
                    const tmpDir = os.tmpdir()
                    fs.writeFile(`${tmpDir}/${fileName}`, JSON.stringify(profile), (err) => {
                        if (err) return reject(err)
                        resolve()
                    })
                } else if (this.config.storage.type === 's3') {
                    this.s3Tools.putJsonObject(this.config.storage.bucket, `${this.config.storage.dir}/${fileName}`, profile).then(() => {
                        resolve()
                    }).catch((err) => {
                        reject(err)
                    })
                }
            })
        })
    }
}

module.exports = Profiler
