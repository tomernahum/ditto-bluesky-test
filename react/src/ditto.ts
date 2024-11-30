import { init, Ditto } from "@dittolive/ditto";


async function setupDitto() {
    await init();
    const ditto = new Ditto({
        type: "onlinePlayground",
        appID: "6b4618be-5a8d-4706-9ded-aa222ee8f1bc",
        token: "29fc3391-f3f8-4e0c-acd5-855974edfc74",
    });

    // Enable mutating DQL statements and ensure you only sync with peers using version 4.0 or higher of the Ditto SDK:
    await ditto.disableSyncWithV3();

    // Initialize the sync process:
    ditto.startSync();

    return ditto
}

// According to the docs, Ditto must be instantiated at the top level scope to avoid accidental garbage collection
const ditto = await setupDitto()

// for now I'm putting here to run once. maybe later on its better for each component to register its own subscriptions
// not yet tested with multiple devices
async function setupSubscriptions(){
    // register a sync subscription, this will keep local store updated and update peers on changes to data targeted by the query
    ditto.sync.registerSubscription(`
        SELECT *
        FROM posts
    `);



}
setupSubscriptions()




export default ditto
