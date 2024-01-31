import React, { MouseEventHandler } from 'react';
import '../style/style.css'

interface props {
    usersPerPage: number;
    totalUsers: number;
    paginate: (pageNumber: number) => void;
    previousPage: MouseEventHandler<HTMLButtonElement>;
    nextPage: MouseEventHandler<HTMLButtonElement>;
    activePage: number;
}


const Pagination: React.FC<props> = ({ usersPerPage, totalUsers, paginate, previousPage, nextPage, activePage }) => {

    const paginationNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        paginationNumbers.push(i)
    }

    return (
        <div className="list">
            <button onClick={previousPage} disabled={activePage === 1} className='arrows'>
                {"<"}
            </button>
            <div className='pagination'>
                {paginationNumbers.map((number) => (
                    <button key={number}
                        className={activePage === number ? 'active' : 'notActive'}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <button onClick={nextPage} disabled={activePage === paginationNumbers.length} className='arrows'>
                {">"}
            </button>
        </div >
    )
}

export default Pagination