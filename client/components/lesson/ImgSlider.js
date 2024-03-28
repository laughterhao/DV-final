import React, { useEffect, useState } from 'react'
import movies from '@/data/lesson/movie.json'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import StyleSlider from '@/styles/lessonStyle/lessonSlider.module.scss'
// import Style from '@/styles/lessonStyle/slider.module.css'
import settings from './setting'
export default function ImgSlider({ getSliderID }) {
  const [img, setImg] = useState([])
  const api = 'http://localhost:3005/api/lesson'
  console.log(getSliderID)
  useEffect(() => {
    const sliderImg = async () => {
      try {
        const id = getSliderID
        const response = await fetch(`${api}/getlist/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const [data] = await response.json()
        const newarr = data.img.split(',')
        // const newA = newarr
        setImg(newarr)
        console.log(newarr)
        return data
      } catch (error) {
        console.error(
          `Failed to fetch data from ${api + '/' + 'sliderImg'}: ${
            error.message
          }`
        )
        return null
      }
    }
    sliderImg()
  }, [getSliderID])

  return (
    <>
      <div className={StyleSlider['Slider']}>
        <Slider {...settings}>
          {img.map((img, i) => (
            <div key={i} className=" ratio ratio-1x1 h-100">
              <img
                className="img-fluid  d-block"
                src={`/images/lesson/${img}.jpg`}
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  )
}
