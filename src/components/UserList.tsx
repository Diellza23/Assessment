import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import '../style/style.css'
import { useNavigate } from 'react-router-dom'
import { fetchUsersData, getUserDataById } from "../utils/apiCalls";

interface UserInfo {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    maidenName: string;
    age: number;
}


const UserList = () => {
    const history = useNavigate();
    const [data, setData] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null | any>(null)
    const [activePage, setActivePage] = useState(1);
    const [usersPerPage] = useState(9);
    const indexOfLastUser = activePage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const [filteredData, setFilteredData] = useState<UserInfo[]>([]);
    const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
    const [filterValues, setFilterValues] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    const previousPage = () => {
        if (activePage !== 1) {
            setActivePage(activePage - 1);
        };
    }

    const nextPage = () => {
        if (activePage !== Math.ceil(data.length / usersPerPage)) {
            setActivePage(activePage + 1);
        }
    }

    const paginate = (pageNum: number) => {
        setActivePage(pageNum);
    }

    // Create a simple function to handle all the filtering for all the attributes 
    //without having to create a function for each attribute
    const handleInputChange = (e: any, attribute: any) => {
        setFilterValues({
            ...filterValues,
            [attribute]: e.target.value,
        });
    };

    // This method filters based on filteredData length since there are 10 users per page and when the user is found on the original data array >
    //it sets the activePage and displays the found user
    useEffect(() => {
        const filterUsers = data.filter(user => {
            const firstNameMatch = user.firstName.toLowerCase().includes(filterValues.firstName.toLowerCase());
            const lastNameMatch = user.lastName.toLowerCase().includes(filterValues.lastName.toLowerCase());
            const emailMatch = user.email.toLowerCase().includes(filterValues.email.toLowerCase());
            return firstNameMatch && lastNameMatch && emailMatch;
        });

        setFilteredData(filterUsers);
        setActivePage(1);
    }, [data, filterValues]);


    // API to retrieve users
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                await fetchUsersData().then(res => setData(res))
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            }
        }

        getUserInfo()
    }, [])

    if (error) {
        return <>Some Error fetching data occurred</>
    }


    const getUserPosts = async (id: number) => {
        try {
            await getUserDataById(id);
            history(`/user-posts/${id}`);
        } catch (error) {
            setError(error)
        }
    };

    return (
        <>
            <div className="main">
                <h2>Users list</h2>
                {!loading && data ? (
                    <>
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th style={{ color: '#263849', fontWeight: '600' }}>Id</th>
                                    <th style={{ color: '#263849', fontWeight: '600' }}>Name</th>
                                    <th style={{ color: '#263849', fontWeight: '600' }}>Last Name</th>
                                    <th style={{ color: '#263849', fontWeight: '600' }}>Email</th>
                                    <th style={{ color: '#263849', fontWeight: '600' }}>Details</th>
                                </tr>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        <input type="text" onChange={(e) => handleInputChange(e, 'firstName')} placeholder="John..." className='inputStyle' />
                                    </th>
                                    <th>
                                        <input type="text" onChange={(e) => handleInputChange(e, 'lastName')} placeholder="Doe.." className='inputStyle' />
                                    </th>
                                    <th>
                                        <input type="text" onChange={(e) => handleInputChange(e, 'email')} placeholder="@gmail..." className='inputStyle' />
                                    </th>
                                    <th>
                                    </th>
                                </tr>
                                {currentUsers.length === 0 ? (
                                    <div className="paragraph">No user with these records was found.</div>
                                ) : currentUsers?.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button className='button'
                                                onClick={() => getUserPosts(user.id)}
                                            >
                                                Posts
                                            </button>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            usersPerPage={usersPerPage}
                            totalUsers={data.length}
                            paginate={paginate}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            activePage={activePage}
                        />
                    </>
                ) : (
                    <div className="loading">Loading...</div>
                )}
            </div>
        </>
    )
}

export default UserList