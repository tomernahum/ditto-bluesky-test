import { useQuery } from "@tanstack/react-query";
import ditto from "./ditto";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { getFollowingFeedSample } from "./blueskyApi";

export default function Demo() {

    return (
        <>
            <h1 className="text-3xl font-bold">Hello</h1>
            <br />
            <BlueSkyApiDemo />
            <br />
            <br />
            <DittoPostsDemo />

        </>
    )
}


function DittoPostsDemo() {
    // get posts from local store using react query for async state management
    // ditto also has a  query observer w/ callback function that we could use instead
    const postsQuery = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await ditto.store.execute("SELECT * FROM posts"); // WHERE isDeleted = false
            
            const allItems = res.items.map(item => item.value)
            
            return {
                lazyLoadedItems: res.items,
                allItems
            }
        },
    })
    
    const [posts, setPosts] = useState<any>(null)
    useEffect(() => {
        const observer = ditto.store.registerObserver(
            `SELECT * FROM posts`, //  WHERE isDeleted = false
            (result) => {
                setPosts({
                    lazyLoadedItems: result.items,
                    allItems: result.items.map(item => item.value)
                })
            }
        )
        return () => {
            observer.cancel()
        }
    }, [])


    async function addPost() {

        await ditto.store.execute(
            `
                INSERT INTO posts
                DOCUMENTS (:newPost)
            `,
            {
                newPost: {
                    postBody: faker.hacker.phrase(),
                    postedTimestamp: Date.now(), // not currently validated iykwim, not sure if its possible for peer to peer. except for when they would sync they wont accept posts in the future
                    isDeleted: false
                }
            }

        )

        postsQuery.refetch()

    }

    async function deleteAllPosts() {
        await ditto.store.execute(`
            UPDATE posts
            SET isDeleted = true
        `)

        postsQuery.refetch()
    }

    async function evictAllPosts() {
        await ditto.store.execute("EVICT FROM posts WHERE true") // deletes posts from local store, does not delete from sync. If we are still listening to evicted posts in ditto.sync (see ditto.ts), they will repopulate
    }

    return (
        <>
            <h1 className="font-bold text-lg">Ditto Posts:</h1>
            
            <div className="flex gap-2">
                <button onClick={() => postsQuery.refetch()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-1">
                    refresh
                </button>
                <br />
                <button onClick={addPost} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-1'>
                    Make a post
                </button>
                <button onClick={deleteAllPosts} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-1'>
                    Delete All
                </button>
                <button onClick={evictAllPosts} className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded my-1'>
                    Evict All
                </button>
            </div>
            <br />

            
            {postsQuery.isLoading && <div>Loading...</div>}            
            {postsQuery.isError && <div>Error: {postsQuery.error.message}</div>}
            {postsQuery.isSuccess && <>
                    <p>Fetched Posts:</p>
                    <pre className="text-sm font-mono overflow-scroll max-h-[30svh]">
                        {JSON.stringify(postsQuery.data?.allItems, null, 4)}
                    </pre>
                </>
            }

            <br />

            <h1> Posts View 2 </h1>
            {posts && <>
                    <pre className="text-sm font-mono overflow-scroll max-h-[30svh]">
                        {JSON.stringify(posts?.allItems, null, 4)}
                    </pre>
                </>
            }

            


        </>
    )
}

function BlueSkyApiDemo(){
    const feedSampleQuery = useQuery({
        queryKey: ['bsky-following-feed-sample'],
        queryFn: async () => {
            const res = await getFollowingFeedSample({limit: 10});
            console.log(res)
            return res
        }
    })

    const feedSample = feedSampleQuery.data?.data?.feed

    
    return (
        <>
            <h1 className=" font-bold">Bluesky Following Feed:</h1>
            <button onClick={() => feedSampleQuery.refetch()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-1"> Refetch </button>
            {feedSample?.map(postData => (
                <div key={postData.post.cid} className="flex items-center my-2">
                    <img 
                        src={postData.post.author.avatar} alt="avatar" 
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                        {postData.post.record?.text}
                    </div>
                </div>
                
            ))} 
        </>
    )
}