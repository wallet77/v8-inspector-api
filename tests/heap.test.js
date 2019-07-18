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
    })
})
