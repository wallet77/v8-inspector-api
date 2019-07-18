'use strict'

const utils = require('./utils')

class Profiler {
    constructor (session, config, s3Tools) {
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

    disable () {
        return new Promise((resolve, reject) => {
            this.session.post('Profiler.disable', (err) => {
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
            this.session.post('Profiler.stop', (err, res) => {
                if (err) return reject(err)

                const profile = res.profile

                const date = new Date()
                const fileName = `profile_${date.getTime()}.cpuprofile`

                utils.writeData(profile, fileName, this.config, this.s3Tools).then((data) => {
                    resolve(data)
                }).catch(err => reject(err))
            })
        })
    }
}

module.exports = Profiler
