import agent from "./learning/blueskyApi";


function getTimeLine() {
    /* 
        ditto.updateTimelineCache(agent.getTimeline)
        .catch ( oh well we must be offline)

        return ditto.getTimeline()
    */
}

function post() {
    // agent.post
    /*
        ditto.makeAPost()

        try {
            bskyAgent.makeAPost()
        }
        catch () {
            need to make a post whenever we can get online. Or the post can live in ditto (or a more appropriate p2p mesh module if dittos not made for this) forever and we just don't ever post it to other bluesky instances

            or the ditto big peer can federate its data with bsky according to the atprotocol
            see note later down
        }
    */
}
/*
    so the model now is to replicate all of bluesky's functionality in a p2p mesh library/service namely ditto, using ditto's js apis. Idk if ditto was designed for a social media app vs only a local buisness, but if its a probelem we could swap it out for something or hypothetically make our own service.
    
    then merge in data from the real bluesky (/ multiple other bluesky atproto data-owning instances )
    and merge out data from our users into the real bluesky
    this could be done by the mesh networks bigpeer server

    merging in/out data could be done one of two ways
    - bluesky sdk (might be impossible to make a post from the past?)
        - for reading we can cache all queries to bluesky in ditto maybe? then distribute them to our peers. and original data we can just distribute to our peers and then push changes back to bluesky
    - proper atproto sync protocol (has not been done yet)

    obviously reimplementing everything would potentially require a lot of grunt work including keeping up with changes to the bsky/atproto api/protocol, so this approach might not be ideal

    besides that im trying to think if theres anything it misses, I feel like there might be.
    but basically the idea is to make our own social media that is exactly like bluesky, but is p2p mesh based, and then also sync with the real bluesky from it


    Here is someone elses idea, my understanding of it is the idea is replicate the whole bsky backend on each client and have them communicate with each other using the proper atproto sync protocol (I think?), plus a networking solution (lib/framework called dumbpipe which wraps iroh) to actually get the clients to talk p2p. vs my (initial) idea was to use a p2p framework that comes with its own sync & networking & storage protocol coupled together.
    https://bsky.app/profile/b5.bsky.social/post/3lc4bm433t22z
    https://bsky.app/profile/b5.bsky.social/post/3lbvkspkphc2z
    
    there idea seems potentially better, assuming that its possible/practical to run atproto servers on clients. It seems like it actually might be.

    I'm not an expert on how the protocol works yet btw, need to do more research. 

    one thing i need to think about is how the storage is broken up. each peer can't really store everything that's gone on on bluesky (even for just one day as that could be 200gb I think). but yeah each PDS does not use that much data, according to the docs. I don't yet understand how it is split up and combined, and how that could be done in a p2p enviornment, need to learn more about the protocol
    
*/