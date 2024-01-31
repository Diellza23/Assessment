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
    const [sortKey, setSortKey] = useState<keyof UserInfo | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


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

    useEffect(() => {
        const sortedData = [...data].sort((a, b) => {
            if (sortKey && sortKey in a && sortKey in b) {
                const comparison = a[sortKey as keyof UserInfo].toString().localeCompare(b[sortKey as keyof UserInfo].toString());
                return sortOrder === 'asc' ? comparison : -comparison;
            }
            return 0;
        });
        setFilteredData(sortedData)
    }, [data, sortKey, sortOrder])

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

    const handleSort = (key: keyof UserInfo) => {
        if (sortKey === key) {
            setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <>

            <div className="main">
                <h2>Users list</h2>
                {!loading && data ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th className="tableHeader">Id</th>
                                    <th className="tableHeader">Name</th>
                                    <th className="tableHeader">Last Name</th>
                                    <th className="tableHeader">Email</th>
                                    <th className="tableHeader">Details</th>
                                </tr>
                                <tr>
                                    <th>#</th>
                                    <th >
                                        <div className="inputContainer">
                                            <input type="text" onChange={(e) => handleInputChange(e, 'firstName')} placeholder="John..." className='inputStyle' />
                                            {sortKey === 'firstName' && sortOrder === 'asc' ? (
                                                <svg onClick={() => handleSort('firstName')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-sort-alpha-down svg" viewBox="0 0 16 16" >
                                                    <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                                </svg>
                                            ) :
                                                <svg onClick={() => handleSort('firstName')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-sort-alpha-up-alt svg" viewBox="0 0 16 16">
                                                    <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
                                                    <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z" />
                                                    <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z" />
                                                </svg>
                                            }
                                        </div>
                                    </th>
                                    <th>
                                        <div className="inputContainer">
                                            <input type="text" onChange={(e) => handleInputChange(e, 'lastName')} placeholder="Doe.." className='inputStyle' />
                                            {sortKey === 'lastName' && sortOrder === 'asc' ? (
                                                <svg onClick={() => handleSort('lastName')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-sort-alpha-down svg" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                                </svg>
                                            ) :
                                                <svg onClick={() => handleSort('lastName')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-sort-alpha-up-alt svg" viewBox="0 0 16 16">
                                                    <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
                                                    <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z" />
                                                    <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z" />
                                                </svg>
                                            }
                                        </div>
                                    </th>
                                    <th>
                                        <div className="inputContainer">
                                            <input type="text" onChange={(e) => handleInputChange(e, 'email')} placeholder="@gmail..." className='inputStyle' />
                                            {sortKey === 'email' && sortOrder === 'asc' ? (
                                                <svg onClick={() => handleSort('email')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-sort-alpha-down svg" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                                </svg>
                                            ) :
                                                <svg onClick={() => handleSort('email')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-sort-alpha-up-alt svg" viewBox="0 0 16 16">
                                                    <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
                                                    <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z" />
                                                    <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z" />
                                                </svg>
                                            }
                                        </div>
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
                    </div>
                ) : (
                    <div className="loading">Loading...</div>
                )}
            </div>
        </>
    )
}

export default UserList