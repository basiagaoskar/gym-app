import React, { useEffect, useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Menu, X } from 'lucide-react';

function NavBar() {
    const [showMenu, setShowMenu] = useState(false)
    const [navOffset, setNavOffset] = useState(-window.innerHeight * 0.06);

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    useEffect(() => {
        const handleResize = () => setNavOffset(-window.innerHeight * 0.06);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <nav className='bg-neutral w-full min-h-[calc(6vh)] px-8 py-4 flex justify-center items-center sticky top-0 z-50'>
                <div className='w-full text-xl flex justify-between items-center container mx-auto'>
                    <ScrollLink to="home" smooth={true} duration={500} offset={navOffset}>
                        <h1 className='text-primary-content font-bold text-2xl md:text-3xl lg:text-4xl cursor-pointer'>Ziutki Gym</h1>
                    </ScrollLink>

                    {/* Bigger devices menu*/}
                    <ul className='text-primary-content hidden md:flex gap-12 '>
                        <li><ScrollLink to="about" smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>About</ScrollLink></li>
                        <li><ScrollLink to="discover" smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>Discover</ScrollLink></li>
                        <li><ScrollLink to="services" smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>Services</ScrollLink></li>
                        <li><ScrollLink to="signup" smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>Sign Up</ScrollLink></li>
                    </ul>
                    <button className='hidden md:block btn btn-primary text-2xl rounded-full px-5'>Sign In</button>

                    <Menu className='md:hidden cursor-pointer' onClick={toggleMenu} />
                </div>
            </nav>

            {/* Smaller devices menu*/}
            <div className={`fixed top-0 w-full h-screen bg-neutral flex flex-col items-center justify-evenly gap-8 text-white z-50 
            text-xl md:hidden transition-all duration-300 ${showMenu ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"}`}
            >
                <X className='absolute top-5 right-8 text-white cursor-pointer text-3xl' onClick={toggleMenu} />
                <div className='text-primary-content flex flex-col items-center gap-8 text-2xl'>
                    <ScrollLink to="about" onClick={toggleMenu} smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>About</ScrollLink>
                    <ScrollLink to="discover" onClick={toggleMenu} smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>Discover</ScrollLink>
                    <ScrollLink to="services" onClick={toggleMenu} smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>Services</ScrollLink>
                    <ScrollLink to="signup" onClick={toggleMenu} smooth={true} duration={500} offset={navOffset} className='hover:text-secondary cursor-pointer'>Sign Up</ScrollLink>
                </div>
                <button className='btn btn-primary text-2xl rounded-full py-7 px-15'>Sign In</button>
            </div>
        </>
    )
}

export default NavBar