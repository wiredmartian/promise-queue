export class PromiseQueue {
    private tasks: Array<Promise<any>>;
    private running: number;
    private concurrent: number;

    constructor(promises: Array<Promise<any>>, concurrent: number) {
        this.tasks = promises;
        this.concurrent = concurrent;
        this.running = 0;
    }

    async run<T>() {
        const result: T[] = []
        let maxTasks = Math.min(this.concurrent - this.running, this.tasks.length)

        while (maxTasks > 0) {
            const tasksBatch = this.tasks.splice(0, maxTasks)
            this.running += maxTasks

            const batchResults = await Promise.allSettled<T>(tasksBatch)

            for (const batchResult of batchResults) {
                if (batchResult.status === 'fulfilled') {
                    result.push(batchResult.value)
                } else {
                    result.push(batchResult.reason)
                }
                this.running--
            }

            const remainingTasks = Math.min(this.concurrent - this.running, this.tasks.length)
            maxTasks = remainingTasks > 0 ? remainingTasks : 0
        }

        return result
    }
}