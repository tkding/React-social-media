import React, { useEffect, useState } from "react";

import { Post as IPost } from "./main";
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface PostProps {
    post: IPost;
}

interface Likes {
    userId: string;
    id: String;
}

export const Post = (props: PostProps) => {
    const { post } = props;
    const [ user ] = useAuthState(auth);
    const [ likes, setLikes ] = useState<Likes[] | null>(null);
    
    const likesRef = collection(db, "likes");
    
    const likesDoc = query(likesRef, where("postId", "==", post.id));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map(doc => ({userId: doc.data().userId, id: doc.id})) as Likes[] );
    }

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id,
            });

            if( user ){
                setLikes((prev) => 
                    prev ? [...prev, {userId: user.uid, id: newDoc.id}] : [{userId: user.uid, id: newDoc.id}]
                );
            }
        }
        catch (err) {
            console.log(err);
        }
    };
    
    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(
                likesRef, 
                where("userId", "==", user?.uid), 
                where("postId", "==", post.id)
            );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, "likes", likeId);
            await deleteDoc(likeToDelete);

            if( user ){
                setLikes((prev) => 
                    prev ? prev.filter((like) => like.id !== likeId) : []
                );
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    const hasLiked =  likes?.find((like) => like.userId === user?.uid);

    useEffect (() => {
        getLikes();
    }, []);

    return (
        <div className="Post">
            <div className="title">
                <h3>{post.title}</h3>
            </div>
            <div className="description">
                <p>{post.description}</p>
            </div>
            <div className="username">
                <p>@{post.username}</p>
            </div>
            <div className="likes">
                {hasLiked ? (
                        <button onClick={removeLike}> 👎unlike </button>
                    ) : (
                        <button onClick={addLike}> 👍like </button> 
                    )}
                
                {likes && <p> Likes: {likes.length} </p>}
            </div>
        </div>
    );
};

// <div key={post.id}>
//     <h3>{post.title}</h3>
//     <p>{post.description}</p>
//     <p>{post.username}</p>
// </div>)