import { LogOut, Settings, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { useAuthStore } from '../store/useAuthStore'

const menuItems = [
    { text: "profile", icon: User },
    { text: "settings", icon: Settings },
]

function LoggedInNavbar() {
    const { logout } = useAuthStore()
    
    return (
        <>
            <nav className='bg-neutral w-full min-h-[calc(6vh)] px-8 py-4 flex justify-center items-center fixed top-0 z-50'>
                <div className='w-full text-xl flex justify-between items-center container mx-auto'>
                    <Link to="/" >
                        <h1 className='text-neutral-content font-bold text-2xl md:text-3xl lg:text-4xl cursor-pointer'>Ziutki Gym</h1>
                    </Link>

                    <div className="flex gap-2">
                        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img alt="Profile picture" src="/images/avatar.png" />
                                </div>
                            </div>
                            <ul className="menu menu-sm dropdown-content bg-base-100 text-2xl rounded-box z-1 mt-3 w-52 p-2 shadow">
                                {menuItems.map((section) => (
                                    <li key={section.text}>
                                        <Link to={"/" + section.text} className="hover:bg-base-300 text-base ">
                                            <section.icon className='size-5' />
                                            {section.text.charAt(0).toUpperCase() + section.text.slice(1)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <button className='hover:bg-base-300 text-base hover:text-primary-100' onClick={logout}>
                                        <LogOut className='size-5' />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default LoggedInNavbar