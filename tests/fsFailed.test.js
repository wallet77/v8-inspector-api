const Inspector = require('../index')

jest.mock('fs', () => ({
    promises: {
        writeFile: (filename, data) => {
            throw new Error('writing failed!')
        }
    }
}))

describe('Make fs failed', () => {
    let inspector = null

    it('collect data and write it on the disk but failed', async () => {
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
