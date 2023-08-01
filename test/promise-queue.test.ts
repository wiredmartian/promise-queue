import { PromiseBatchResult, PromiseQueue } from "../src/promise-queue"

describe('PromiseQueue', () => {

    describe('run', () => {

        it('should process the promises correctly with the correct outputs', async () => {
            const resolves = createPromiseWithDelay("resolve", 5, 1)
            const rejects = createPromiseWithDelay("rejected", 5, 1)

            const expected: PromiseBatchResult<string, string>[] = [
                { status: 'rejected', error: 'rejected after 1 seconds' },
                { status: 'rejected', error: 'rejected after 1 seconds' },
                { status: 'rejected', error: 'rejected after 1 seconds' },
                { status: 'rejected', error: 'rejected after 1 seconds' },
                { status: 'rejected', error: 'rejected after 1 seconds' },
                { status: 'fulfilled', data: 'completed after 1 seconds' },
                { status: 'fulfilled', data: 'completed after 1 seconds' },
                { status: 'fulfilled', data: 'completed after 1 seconds' },
                { status: 'fulfilled', data: 'completed after 1 seconds' },
                { status: 'fulfilled', data: 'completed after 1 seconds' }
            ]

            const q = new PromiseQueue([...rejects, ...resolves], 2)

            const actual = await q.run()

            expect(actual).toEqual(expected)

        })

        it('should not take more than 2 seconds to process ten 1 second delayed promises', async () => {
            const items = createPromiseWithDelay("resolve", 10, 1)
    
            const start = performance.now()
    
            const promiseQueue = new PromiseQueue(items, 5)
            const actual = await promiseQueue.run()
    
            const end = performance.now()
    
            expect(end - start).not.toBeGreaterThan(2000)
            expect(actual).not.toBeUndefined()
        })
    })
})


function createPromiseWithDelay(type: "resolve" | "rejected", count: number, delayInSeconds: number) {
    const requests = []
    let promiseFunc = delayResolved(delayInSeconds)

    if (type === "rejected") {
        promiseFunc = delayRejected(delayInSeconds)
    }
    for (let i = 0; i < count; i++) {
        requests.push(promiseFunc)
    }
    return requests
}

function delayResolved(seconds: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`completed after ${seconds} seconds`)
        }, seconds * 1000)
    })
}

function delayRejected(seconds: number) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(`rejected after ${seconds} seconds`)
        }, seconds * 1000)
    })
}
