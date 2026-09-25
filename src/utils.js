const fs = require('fs').promises
const os = require('os')

/** @typedef {import('inspector').Session} Session */
/** @typedef {import('@aws-sdk/client-s3').S3Client} S3Client */
/** @typedef {import('./types').ResolvedConfig} ResolvedConfig */

/**
 * @param {any} data
 * @param {string} fileName
 * @param {ResolvedConfig} config
 * @param {S3Client | null} s3Client
 * @returns {Promise<any>}
 */

const writeData = async (data, fileName, config, s3Client) => {
    if (config.storage.type === 'fs') {
        const tmpDir = os.tmpdir()
        await fs.writeFile(`${tmpDir}/${fileName}`, JSON.stringify(data))
    } else if (config.storage.type === 's3') {
        const { PutObjectCommand } = require('@aws-sdk/client-s3')
        const params = {
            Body: JSON.stringify(data),
            Bucket: config.storage.bucket,
            Key: `${config.storage.dir}/${fileName}`,
            ContentType: 'application/json'
        }
        const command = new PutObjectCommand(params)
        await /** @type {S3Client} */ (s3Client).send(command)
    }
    return data
}

module.exports = {
    writeData: writeData,

    /**
     * @param {Session} session
     * @param {string} fnName
     * @param {object} [args]
     * @returns {Promise<void>}
     */
    invokeFunction: (session, fnName, args = {}) => {
        return new Promise((resolve, reject) => {
            session.post(fnName, args, (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    },

    /**
     * @param {string} fnName
     * @param {Session} session
     * @param {string} suffix
     * @param {string} ext
     * @param {ResolvedConfig} config
     * @param {S3Client | null} s3Client
     * @returns {Promise<any>}
     */
    invokeStop: (fnName, session, suffix, ext, config, s3Client) => {
        return new Promise((resolve, reject) => {
            session.post(fnName, (/** @type {Error | null} */ err, /** @type {any} */ res) => {
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
