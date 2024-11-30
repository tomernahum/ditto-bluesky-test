import { useQuery } from "@tanstack/react-query";
import ditto from "./ditto";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";

export default function Demo() {

    // get posts from local store using react query for async state management
    // ditto also has a  query observer w/ callback function that we could use instead
    const postsQuery = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await ditto.store.execute("SELECT * FROM posts");
            
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
            `SELECT * FROM posts`,
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
                    postedTimestamp: Date.now() // not currently validated iykwim, not sure if its possible for peer to peer. except for when they would sync they wont accept posts in the future
                }
            }

        )

        postsQuery.refetch()

    }

    return (
        <>
            <h1 className="text-3xl font-bold">Hello</h1>
            <br />

            <button onClick={() => postsQuery.refetch()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-1">
                refresh
            </button>
            <br />
            <button onClick={addPost} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                Make a post
            </button>

            <br />
            <br />

            <h1 className="text-3xl font-bold">Posts</h1>
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

            <h1> Posts 2 </h1>
            {posts && <>
                    <pre className="text-sm font-mono overflow-scroll max-h-[30svh]">
                        {JSON.stringify(posts?.allItems, null, 4)}
                    </pre>
                </>
            }

            


        </>
    )
}