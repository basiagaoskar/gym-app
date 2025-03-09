import React from 'react';

const services = [
    {
        title: "Personal Training",
        description: "Get customized workout plans and one-on-one coaching from expert trainers.",
        image: "/images/homePage/svg-3.svg",
    },
    {
        title: "Online Coaching",
        description: "Access professional workout and nutrition plans anytime, anywhere.",
        image: "/images/homePage/svg-4.svg",
    },
    {
        title: "Strength & Conditioning",
        description: "Boost your endurance and power with specialized training programs.",
        image: "/images/homePage/svg-7.svg",
    },
    {
        title: "Premium Membership",
        description: "Exclusive benefits, free group classes, and priority booking for our members.",
        image: "/images/homePage/svg-5.svg",
    },
    {
        title: "Exclusive Membership",
        description: "Enjoy premium access to advanced classes, events, and VIP perks.",
        image: "/images/homePage/svg-8.svg",
    },
];

function ServicesSection() {
    return (
        <section id="services" className="bg-gradient-to-b from-base-200 to-base-100 min-h-screen flex items-center px-6 py-16">
            <div className="text-center mx-auto w-full max-w-7xl">
                <h2 className="text-3xl text-base-content lg:text-5xl font-extrabold mb-14">
                    What We Offer
                </h2>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-neutral-content text-neutral rounded-xl shadow-lg p-8 w-full sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <img src={service.image} alt={service.title} className="w-20 h-20 md:w-28 md:h-28 object-contain" />
                            <h3 className="text-lg md:text-xl font-semibold mt-5 text-neutral">{service.title}</h3>
                            <p className="text-sm md:text-base mt-3 text-neutral">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;