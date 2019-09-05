const Inspector = require('../index')
const utils = require('../src/utils')

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

            expect(Object.prototype.hasOwnProperty.call(data, 'snapshot')).toEqual(true)
        })

        it('should failed on takeHeapSnapshot', async () => {
            inspector = new Inspector({
                storage: { type: 'fs' }
            })

            inspector.heap.session.post = (name, opts, cb) => { if (cb) cb(new Error('takeHeapSnapshot failed')) }

            try {
                await inspector.heap.takeSnapshot()
                throw new Error('Should have failed!')
            } catch (err) {
                expect(err.message).toEqual('takeHeapSnapshot failed')
            }
        })

        it('should failed on takeHeapSnapshot because of writeData', async () => {
            inspector = new Inspector({
                storage: { type: 'fs' }
            })

            const spy = jest.spyOn(utils, 'writeData').mockReturnValue(Promise.reject(new Error('writeData failed')))

            try {
                await inspector.heap.takeSnapshot()
                throw new Error('Should have failed!')
            } catch (err) {
                expect(err.message).toEqual('writeData failed')
                expect(spy).toHaveBeenCalledTimes(1)
            }
        })

        it('collect sampling raw data', async () => {
            inspector = new Inspector()

            await inspector.heap.enable()

            await inspector.heap.startSampling()

            const data = await inspector.heap.stopSampling()

            expect(Object.keys(data)).toEqual(['head'])
        })
    })
})
