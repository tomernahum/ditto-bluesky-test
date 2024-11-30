import ditto from "./ditto";
import { faker } from '@faker-js/faker';

// dont run this file

// register a sync subscription, this will keep local store updated and update peers on changes to data targeted by the query
ditto.sync.registerSubscription(`
    SELECT *
    FROM tasks
    WHERE isDeleted = false
`);

// register a listener to the local store
ditto.store.registerObserver(
    `
        SELECT *
        FROM tasks
        WHERE isDeleted = false
    `,
    (result) => {
        console.log(`Tasks have been updated: ${JSON.stringify(result.items, null, 4)}`);
    }
)



const newTask = {
    isCompleted: false,
    isDeleted: false,
    body: "hello world"
}

// insert a new document into the local store. If it matches the sync subscription query, it should be sent to peers by ditto
await ditto.store.execute(`
    INSERT INTO tasks
    DOCUMENTS (:newTask)`,
    { newTask }
)
await ditto.store.execute(`
    INSERT INTO tasks
    DOCUMENTS (:newTask)`,
    {
        newTask: {
            isCompleted: false,
            isDeleted: false,
            body: faker.hacker.phrase()
        }
    }
)



const getThing = async () => {
    const res = await ditto.store.execute("SELECT * FROM tasks");
    const item = res.items[0]
    const itemValue = item.value
    const itemValueBody = item.value["body"]


    return {
        item0: {
            item,
            itemValue,
            itemValueColor: itemValueBody
        },
        items: res.items.map(item => item.value["body"])
    }

    // need to do all this because ditto automatically does not keep results in memory to save memory, so you have to access them explicitly (can't do json.stringify results for example)
}
export default getThing