## Promise Queue

Run async tasks in a controlled concurrency manner in typescript


#### Example

```ts

type Data = {
    prop1: string
    prop2: string
}

type Err = {
    message: string
}

const promises = [] // assume non-empty list

const concurrent = 5 // how many promises per batch can run at the same time

const queue = new PromiseQueue(promises, 5)

const response = await queue.run<Data, Err>()

```