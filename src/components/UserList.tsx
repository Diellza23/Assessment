import axios from "axios"
import { useEffect, useState } from "react";


interface UserInfo {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    maidenName: string;
    age: number;
}

const UserList = () => {

    const [data, setData] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                await axios.get('https://dummyjson.com/users').then(res => {
                    setData(res.data.users);
                    // return data;
                })
            }
            catch (error) {
                setError("Error fetching userss data");
            } finally {
                setLoading(false);
            }
        }
        fetchUsersData()
    }, [])

    if (error) {
        return <>Some Error fetching data occurred</>
    }

    const getUserDataById = async (id: number) => {
        try {
            await axios.get(`https://dummyjson.com/posts?id=${id}`).then((post) => {
                const userPost = post.data;
                console.log(userPost, 'user post')
            })
        } catch (error) {
            console.log(error, "error here")
        }
    }

    return (
        <div style={{ width: '75%', margin: 'auto' }}>
            <h2>Users list</h2>
            <input placeholder="Search..." style={{ float: 'right', marginBottom: '10px' }} />
            {loading ? <p>Loading</p>
                :
                <table id="customers">
                    <tr>
                        <th>Name</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Details</th>
                    </tr>
                    {data && data.map((user) => (
                        <tr>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => getUserDataById(user.id)}>
                                    User posts
                                </button>
                            </td>
                        </tr>
                    ))}
                </table>
            }
        </div>
    )
}

export default UserList