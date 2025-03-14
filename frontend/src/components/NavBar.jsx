import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';

function NavBar() {
    const [showMenu, setShowMenu] = useState(false)
    const [navOffset, setNavOffset] = useState(-window.innerHeight * 0.06)
    const [activeSection, setActiveSection] = useState('home')

    const toggleMenu = () => setShowMenu(!showMenu)

    useEffect(() => {
        const handleResize = () => setNavOffset(-window.innerHeight * 0.06)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["home", "about", "discover", "services", "signup"];
            let currentSection = "home";

            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 650 && rect.bottom >= 650) {
                        currentSection = section;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className='bg-neutral w-full min-h-[calc(6vh)] px-8 py-4 flex justify-center items-center sticky top-0 z-50'>
                <div className='w-full text-xl flex justify-between items-center container mx-auto'>
                    <ScrollLink to="home" smooth={true} duration={500} offset={navOffset}>
                        <h1 className='text-neutral-content font-bold text-2xl md:text-3xl lg:text-4xl cursor-pointer'>Ziutki Gym</h1>
                    </ScrollLink>

                    {/* Bigger devices menu */}
                    <ul className='hidden xl:flex gap-12'>
                        {["about", "discover", "services", "sign up"].map((section) => (
                            <li key={section}>
                                <ScrollLink
                                    to={section}
                                    smooth={true}
                                    duration={500}
                                    offset={navOffset}
                                    className={`${activeSection === section ? "text-secondary" : "text-neutral-content"} hover:text-secondary cursor-pointer`}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>

                    <Link to="/login">
                        <button className='btn btn-primary hidden xl:block text-2xl rounded-full px-5'>Sign In</button>
                    </Link>

                    <Menu className='xl:hidden absolute top-5 right-8 text-primary-content cursor-pointer ' onClick={toggleMenu} />
                </div>
            </nav>

            {/* Smaller devices menu */}
            <div className={`fixed top-0 w-full h-screen bg-neutral flex flex-col items-center justify-evenly gap-8 text-white z-50 
            text-xl xl:hidden transition-all duration-300 ${showMenu ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"}`}>
                <X className='absolute top-5 right-8 text-primary-content cursor-pointer text-3xl' onClick={toggleMenu} />
                <div className='text-primary-content flex flex-col items-center gap-8 text-2xl'>
                    {["about", "discover", "services", "signup"].map((section) => (
                        <ScrollLink
                            key={section}
                            to={section}
                            onClick={toggleMenu}
                            smooth={true}
                            duration={500}
                            offset={navOffset}
                            className='hover:text-secondary cursor-pointer'
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </ScrollLink>
                    ))}
                </div>
                <Link to="/login">
                    <button className='btn btn-primary text-2xl rounded-full py-7 px-15'>Sign In</button>
                </Link>
            </div>
        </>
    )
}

export default NavBar