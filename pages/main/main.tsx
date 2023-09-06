import React from 'react';

import { useState, useEffect } from 'react';

import { getDocs, collection } from 'firebase/firestore';
import { db } from "../../config/firebase";

import { Post } from './post';

export interface Post{
    title: string;
    description: string;
    username: string;
    userId: string;
    id: string;
}

export const Main = () => {
    const postsRef = collection(db, "posts");
    const [postsList, setPostsList] = useState<Post[] | null>(null);

    const getPosts = async () => {
        const data = await getDocs(postsRef);
        setPostsList(data.docs.map(doc => ({...doc.data(), id: doc.id})) as Post[] );
    }

    useEffect (() => {
        getPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            {postsList?.map(post => (
                <Post post={post}/>
                )
            )}
        </div>
    );
}
