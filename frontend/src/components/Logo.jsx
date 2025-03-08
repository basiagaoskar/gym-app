import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
    return (
        <>
            <Link to='/'>
                <div className='text-4xl absolute top-0 left-0 p-5 sm:text-4xl md:text-5xl font-bold text-primary-content'>
                    Ziutki Gym
                </div>
            </Link>
        </>
    )
}

export default Logo