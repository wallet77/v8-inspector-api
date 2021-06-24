const fs = require('fs')
const promises = require('fs/promises')
const os = require('os')
const path = require('path')

const writeData = async (data, fileName, config, s3Client) => {
    if (config.storage.type === 'fs') {
        let pathDestination = os.tmpdir()
        const customPath = config.storage.dir || ''
        if (customPath && fs.existsSync(path.resolve(customPath))) {
            pathDestination = path.resolve(customPath)
        }
        await promises.writeFile(`${pathDestination}/${fileName}`, JSON.stringify(data))
    } else if (config.storage.type === 's3') {
        const { PutObjectCommand } = require('@aws-sdk/client-s3')
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
