const Inspector = require('../index')

describe('Profiler', () => {
    describe('General methods', () => {
        it('collect raw data', async () => {
            const inspector = new Inspector()
            await inspector.profiler.enable()
            const session = inspector.getCurrentSession()

            expect(typeof session).toEqual('object')

            await inspector.destroy()

            expect(inspector.getCurrentSession()).toEqual(null)
        })
    })

    describe('CPU profiler', () => {
        let inspector = null

        afterEach(async () => {
            await inspector.destroy()
        })

        it('collect raw data', async () => {
            inspector = new Inspector()
            await inspector.profiler.enable()
            await inspector.profiler.start()

            const data = await inspector.profiler.stop()

            expect(Object.keys(data)).toEqual(['nodes', 'startTime', 'endTime', 'samples', 'timeDeltas'])
        })

        it('collect data and send to s3', async () => {
            inspector = new Inspector({
                storage: {
                    type: 's3',
                    bucket: 'testBucket',
                    dir: 'inspector'
                }
            })
            inspector.profiler.s3Tools.putJsonObject = jest.fn(async () => {})

            await inspector.profiler.enable()
            await inspector.profiler.start()

            await inspector.profiler.stop()

            expect(inspector.profiler.s3Tools.putJsonObject.mock.calls.length).toEqual(1)
        })

        it('collect data but fail to send to s3', async () => {
            inspector = new Inspector({
                storage: {
                    type: 's3',
                    bucket: 'testBucket',
                    dir: 'inspector'
                }
            })
            inspector.profiler.s3Tools.putJsonObject = jest.fn(async () => { throw new Error('S3 failed') })

            await inspector.profiler.enable()
            await inspector.profiler.start()

            try {
                await inspector.profiler.stop()
            } catch (err) {
                expect(err.message).toEqual('S3 failed')
            }
        })

        it('collect data and write it on the disk', async () => {
            inspector = new Inspector({
                storage: {
                    type: 'fs'
                }
            })

            await inspector.profiler.enable()
            await inspector.profiler.start()

            const data = await inspector.profiler.stop()
            expect(Object.keys(data)).toEqual(['nodes', 'startTime', 'endTime', 'samples', 'timeDeltas'])
        })

        it('enable() fail', async () => {
            inspector = new Inspector()
            const oldImpl = inspector.profiler.session.post
            inspector.profiler.session.post = (name, cb) => { cb(new Error('enable failed')) }

            try {
                await inspector.profiler.enable()
                await inspector.profiler.start()
                await inspector.profiler.stop()
                throw new Error('Should have failed!')
            } catch (err) {
                inspector.profiler.session.post = oldImpl
                expect(err.message).toEqual('enable failed')
            }
        })

        it('start() fail', async () => {
            inspector = new Inspector()
            const oldImpl = inspector.profiler.session.post

            try {
                await inspector.profiler.enable()
                inspector.profiler.session.post = (name, cb) => { cb(new Error('start failed')) }
                await inspector.profiler.start()
                await inspector.profiler.stop()
                throw new Error('Should have failed!')
            } catch (err) {
                inspector.profiler.session.post = oldImpl
                expect(err.message).toEqual('start failed')
            }
        })

        it('stop() fail', async () => {
            inspector = new Inspector()
            const oldImpl = inspector.profiler.session.post

            try {
                await inspector.profiler.enable()
                await inspector.profiler.start()
                inspector.profiler.session.post = (name, cb) => { cb(new Error('stop failed')) }
                await inspector.profiler.stop()
                throw new Error('Should have failed!')
            } catch (err) {
                inspector.profiler.session.post = oldImpl
                expect(err.message).toEqual('stop failed')
            }
        })
    })
})
