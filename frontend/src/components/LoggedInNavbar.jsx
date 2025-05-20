import { Dumbbell, House, LogOut, Settings, ShieldCheck, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/useAuthStore'

function LoggedInNavbar() {
    const { authUser, foundProfiles, isSearchingUser, logout, searchProfile } = useAuthStore()
    const [searchValue, setSearchValue] = useState("");

    const menuItems = [
        { text: "home", link: "home", icon: House },
        { text: "profile", link: `user/${authUser?.username}`, icon: User },
        { text: "routines", link: "routines", icon: Dumbbell },
        { text: "settings", link: "settings", icon: Settings },
    ]

    useEffect(() => {
        const findUser = setTimeout(() => {
            if (searchValue.length > 0) {
                console.log("Searching for: ", searchValue);
                searchProfile(searchValue);
            };
        }, 500);

        return () => {
            clearTimeout(findUser);
        }
    }, [searchValue, searchProfile], 300);

    function handleResultClick() {
        setSearchValue("");
    }
    const navigate = useNavigate()

    return (
        <>
            <nav className='bg-neutral w-full min-h-[calc(6vh)] px-8 py-4 flex justify-center items-center fixed top-0 z-50'>
                <div className='w-full text-xl flex justify-between items-center container mx-auto'>
                    <Link to="/home" >
                        <h1 className='text-neutral-content font-bold text-2xl md:text-3xl lg:text-4xl cursor-pointer'>Ziutki Gym</h1>
                    </Link>

                    <div className="flex gap-2">
                        <input type="text" placeholder="Search" value={searchValue} className="input input-bordered w-24 md:w-auto" onChange={(e) => setSearchValue(e.target.value)} />
                        {false && (
                            <span className="absolute top-full mt-1 left-0 right-0 flex justify-center p-1 bg-base-200 rounded-b-md shadow-lg z-50">
                                <span className="loading loading-spinner loading-xs"></span>
                            </span>
                        )}
                        {searchValue.length > 0 && foundProfiles.length > 0 && !isSearchingUser && (
                            <ul className="absolute top-full mt-1 w-full max-w-[150px] md:max-w-[190px] menu bg-base-100 rounded-box">
                                {foundProfiles.map((foundUser) => (
                                    <li key={foundUser._id} onClick={() => handleResultClick()}>
                                        <Link to={`/user/${foundUser.username}`} className="flex items-center gap-2">
                                            <div className="avatar">
                                                <div className="w-7 rounded-full">
                                                    <img src={foundUser.profilePic || '/images/avatar.png'} alt={foundUser.username} />
                                                </div>
                                            </div>
                                            <div>
                                                <span className='text-md font-semibold'>{foundUser.username}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img alt="Profile picture" src={authUser.profilePic || "/images/avatar.png"} />
                                </div>
                            </div>
                            <ul className="menu menu-sm dropdown-content bg-base-100 text-2xl rounded-box z-1 mt-3 w-52 p-2 shadow">
                                {authUser?.role === 'admin' && (
                                    <li>
                                        <button
                                            onClick={() => navigate(`/admin`)}
                                            className="capitalize hover:bg-base-300 text-base"
                                        >
                                            <ShieldCheck className="size-5" />
                                            Admin Panel
                                        </button>
                                    </li>
                                )}
                                {menuItems.map((section) => (
                                    <li key={section.text}>
                                        <button
                                            onClick={() => navigate(`/${section.link}`)}
                                            className="capitalize hover:bg-base-300 text-base"
                                        >
                                            <section.icon className="size-5" />
                                            {section.text}
                                        </button>

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