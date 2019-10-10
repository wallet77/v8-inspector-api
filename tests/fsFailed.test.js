jest.mock('fs')
const Inspector = require('../index')

describe('Make fs failed', () => {
    let inspector = null

    it('collect data and write it on the disk but failed', async () => {
        const fs = require('fs')
        fs.writeFile.mockImplementation((filename, data, cb) => {
            cb(new Error('writing failed!'))
        })
        inspector = new Inspector({
            storage: {
                type: 'fs'
            }
        })

        try {
            await inspector.profiler.enable()
            await inspector.profiler.start()
            await inspector.profiler.stop()
            throw new Error('It should have failed!')
        } catch (err) {
            expect(err.message).toEqual('writing failed!')
        }
    })
})