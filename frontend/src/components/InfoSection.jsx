import { Link } from 'react-router-dom'
import React from 'react'

function InfoSection({ id, background, fontcolor, topLine, topLineColor, headline, description, buttonLabel, buttonColor, target, imgStart, img, alt }) {
  return (
    <div id={id} className={`h-[calc(100vh-6vh)] w-full ${background} flex items-center`}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* text section */}
        <div className={`${imgStart ? 'order-1' : 'order-0'} max-w-xl`}>
          <h3 className={`text-2xl lg:text-3xl ${topLineColor} font-semibold`}>{topLine}</h3>
          <h2 className={`text-4xl lg:text-6xl ${fontcolor} font-bold mt-4 leading-tight`}>{headline}</h2>
          <p className={`text-lg lg:text-2xl ${fontcolor} text-s-content mt-4`}>{description}</p>
          <Link to={target}>
            <button className={`btn ${buttonColor} text-xl lg:text-2xl rounded-full p-4 lg:p-6 mt-6`}>{buttonLabel}</button>
          </Link>
        </div>

        {/* img section */}
        <div className="flex justify-center">
          <img src={img} alt={alt} className="w-200" />
        </div>
      </div>
    </div>
  )
}

export default InfoSection