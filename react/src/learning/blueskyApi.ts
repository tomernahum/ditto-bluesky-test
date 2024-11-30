// import { BskyAgent } from "@atproto/api";
import { AtpAgent } from '@atproto/api'
import { bskyAppPassword } from '../secrets-and-config';

const agent = new AtpAgent({ 
    service: 'https://bsky.social' // idk how atproto works lol
})

// Login with app password
// TODO: this method is deprecated in favor of OAuth based session management which bluesky has packages for
// for now just hard logging in with my password each time, gotten from bsky.app settings
await agent.login({
    identifier: 'ttools.io',
    password: bskyAppPassword,
});



const { data } = await agent.getTimeline({cursor: '', limit: 2});

console.log(JSON.stringify(data, null, 2));

export async function getFollowingFeedSample({limit=3}: {limit: number}) {
    return await agent.getTimeline({cursor: '', limit: limit});
}
