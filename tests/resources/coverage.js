const doJob = () => {
    let i = 0
    while (i++ < 10000) {}
}

(async () => {
    const Inspector = require('../../index')
    const inspector = new Inspector()
    await inspector.profiler.enable()
    await inspector.profiler.startPreciseCoverage({ callCount: true, detailed: true })

    doJob()

    const data = await inspector.profiler.takePreciseCoverage()
    await inspector.profiler.stopPreciseCoverage()

    process.send(JSON.stringify(data))

    inspector.destroy()
})()
