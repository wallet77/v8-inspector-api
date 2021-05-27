const fs = require('fs').promises
const os = require('os')
const { PutObjectCommand } = require('@aws-sdk/client-s3')

const writeData = async (data, fileName, config, s3Client) => {
    if (!config.storage) config.storage = { type: 'raw' }

    if (config.storage.type === 'fs') {
        const tmpDir = os.tmpdir()
        await fs.writeFile(`${tmpDir}/${fileName}`, JSON.stringify(data))
    } else if (config.storage.type === 's3') {
        const params = {
            Body: JSON.stringify(data),
            Bucket: config.storage.bucket,
            Key: `${config.storage.dir}/${fileName}`,
            ContentType: 'application/json'
        }
        const command = new PutObjectCommand(params)
        await s3Client.send(command)
    }
    return data
}

module.exports = {
    writeData: writeData,

    invokeFunction: (session, fnName, args = {}) => {
        return new Promise((resolve, reject) => {
            session.post(fnName, args, (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    },

    invokeStop: (fnName, session, suffix, ext, config, s3Client) => {
        return new Promise((resolve, reject) => {
            session.post(fnName, (err, res) => {
                if (err) return reject(err)

                const data = res.profile || res.result

                const date = new Date()
                const fileName = `${suffix}_${date.getTime()}.${ext}`

                writeData(data, fileName, config, s3Client).then((data) => {
                    resolve(data)
                }).catch(err => reject(err))
            })
        })
    }
}
