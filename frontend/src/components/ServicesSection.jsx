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
        title: "Premium Membership",
        description: "Exclusive benefits, free group classes, and priority booking for our members.",
        image: "/images/homePage/svg-5.svg",
    },
];

function ServicesSection() {
    return (
        <section id="services" className="bg-base-100 h-[calc(100vh-6vh)] flex items-center px-4">
            <div className="text-center mx-auto w-full max-w-5xl">
                <h2 className="text-4xl text-primary-content lg:text-6xl font-bold md:mb-20">
                    Our Services
                </h2>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-primary-content text-black rounded-lg shadow-lg p-2 w-full max-w-sm flex flex-col items-center md:p-6"
                        >
                            <img src={service.image} alt={service.title} className="w-32 h-32" />
                            <h3 className="text-base font-semibold mt-4 md:text-xl">{service.title}</h3>
                            <p className="text-base mt-2 md:text-base">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;
