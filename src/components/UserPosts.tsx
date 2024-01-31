import React, { useEffect, useState } from 'react';
import '../style/style.css'
import { Link, useParams } from 'react-router-dom';
import { getUserDataById, handleApiError } from '../utils/apiCalls';
import { AxiosError } from 'axios';

interface Props {
    id: number;
    title: string;
    body: string;
    tags: string[],
    reactions: number
}

const UserPosts: React.FC<Props> = () => {
    const { userId } = useParams<{ userId: string }>();
    const [posts, setPosts] = useState<Props[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userPosts = await getUserDataById(Number(userId));
                setPosts(userPosts);
                console.log(userPosts);
            } catch (error) {
                handleApiError(error as AxiosError);
                throw error
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    return (
        <>
            <Link to='/' className='link'>Back</Link>
            <div className='postContainer'>
                {!loading && posts ? (posts.map((post) => (
                    <div key={post.id} className="post">
                        <h3>Title: {post.title}</h3>
                        <p> {post.body}</p>
                        <p>Tags: {post.tags.join(', ')}</p>
                        <p>Reactions: {post.reactions}</p>
                    </div>
                )))
                    :
                    <div className='loading'>
                        Loading...
                    </div>
                }
            </div>
        </>
    )
}

export default UserPosts;