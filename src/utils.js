const fs = require('fs')
const os = require('os')

const writeData = (data, fileName, config, s3Tools) => {
    if (!config.storage) config.storage = { type: 'raw' }

    return new Promise((resolve, reject) => {
        if (config.storage.type === 'fs') {
            const tmpDir = os.tmpdir()
            fs.writeFile(`${tmpDir}/${fileName}`, JSON.stringify(data), (err) => {
                if (err) return reject(err)
                resolve(data)
            })
        } else if (config.storage.type === 's3') {
            s3Tools.putJsonObject(config.storage.bucket, `${config.storage.dir}/${fileName}`, data).then(() => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        } else if (config.storage.type === 'raw') {
            resolve(data)
        }
    })
}

module.exports = {
    writeData: writeData,

    invokeFunction: (session, fnName) => {
        return new Promise((resolve, reject) => {
            session.post(fnName, (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    },

    invokeStop: (fnName, session, suffix, ext, config, s3Tools) => {
        return new Promise((resolve, reject) => {
            session.post(fnName, (err, res) => {
                if (err) return reject(err)

                const profile = res.profile

                const date = new Date()
                const fileName = `${suffix}_${date.getTime()}.${ext}`

                writeData(profile, fileName, config, s3Tools).then((data) => {
                    resolve(data)
                }).catch(err => reject(err))
            })
        })
    }
}
