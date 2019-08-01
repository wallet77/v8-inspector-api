const Inspector = require('../index')

describe('Heap', () => {
    describe('Take snapshot', () => {
        let inspector = null

        afterEach(() => {
            inspector.destroy()
        })

        it('collect raw data', async () => {
            inspector = new Inspector({
                storage: { type: 'fs' }
            })

            const data = await inspector.heap.takeSnapshot()

            expect(data.hasOwnProperty('snapshot')).toEqual(true)
        })

        it('should failed on takeHeapSnapshot', async () => {
            inspector = new Inspector({
                storage: { type: 'fs' }
            })

            inspector.profiler.session.post = (name, opts, cb) => { cb(new Error('takeHeapSnapshot failed')) }

            try {
                await inspector.heap.takeSnapshot()
                throw new Error('Should have failed!')
            } catch (err) {
                expect(err.message).toEqual('takeHeapSnapshot failed')
            }
        })
    })
})
