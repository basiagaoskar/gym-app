import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()
    return (
        <div className="h-screen bg-base-100 flex flex-col items-center justify-center text-center px-5">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
                404 - Page Not Found
            </h1>
            <p className="text-base md:text-lg text-base-contnet mt-2">
                Oops! The page you are looking for does not exist.
            </p>
            <button className='btn btn-primary mt-10 text-2xl py-7' onClick={() => { navigate('/') }}>
                Go Back Home
            </button>
        </div>
    )
}

export default NotFoundPage