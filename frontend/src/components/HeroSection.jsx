import React from "react";

function HeroSection() {
  return (
    <section id="home" className="relative min-h-[calc(100vh-72px)] flex flex-col justify-center items-center text-center overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="/videos/HomePageVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="z-10 max-w-4xl px-10">
        <h2 className="text-4xl md:text-8xl font-bold mb-20">Workout Smarter<br /> Not Harder</h2>
        <p className="mt-4 text-3xl mb-20">Register today to create custom workout routines and stay on top of your fitness goals!</p>
        <button className="btn btn-primary text-2xl rounded-full md:text-4xl p-8 mt-6">
          Get Started
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
