import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import HeroSection from '../components/HeroSection'
import InfoSection from '../components/InfoSection'
import { homeObjOne, homeObjTwo, homeObjThree } from '../components/InfoSection/Data'
import ServicesSection from '../components/ServicesSection'
import Footer from '../components/Footer'

function HomePage() {
    return (
        <>
            <NavBar />
            <HeroSection />
            <InfoSection {...homeObjOne} />
            <InfoSection {...homeObjTwo} />
            <ServicesSection />
            <InfoSection {...homeObjThree} />
            <Footer />
        </>
    )
}

export default HomePage