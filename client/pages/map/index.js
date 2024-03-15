import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Stack, Image } from 'react-bootstrap'
import DiButton from '@/components/post/defaultButton'
import { FaWind } from 'react-icons/fa'
import { TiWeatherCloudy } from 'react-icons/ti'
import { LuWaves } from 'react-icons/lu'
import ImageViewModal from '@/components/map/imageViewModal'
import styles from './svg.module.scss'
import TaiwanSvg from '@/components/map/taiwanSvg'

// const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY
const AUTHORIZATION_KEY = 'CWA-12A9C569-394E-4169-AD84-A7592FBBEAF1'

export default function Test() {
  const [mapData, setMapData] = useState([])
  const [aboutData, setAboutData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedDis, setSelectedDis] = useState(null) //被選的區的id
  const [selectedDisName, setSelectedDisName] = useState('請點選地圖區域') //被選的區名 用來放標題
  const [disData, setDisData] = useState([]) //單個區的資料
  const [selectPoint, setSelectPointData] = useState([]) //被選的潛點的id
  const [selectedPointData, setSelectedPointData] = useState(null) //單潛點的資料

  // 圖片放大及關閉
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  // 取得data
  const getMap = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/map')
      const data = await res.json()

      if (data) {
        // 設定到狀態
        const { mapData, aboutData } = data
        setMapData(mapData)
        setAboutData(aboutData)

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    } catch (e) {
      console.error('Error fetching data from the server:', e)
    }
  }

  useEffect(() => {
    getMap()
  }, [])

  useEffect(() => {
    // 根據選中的地圖id篩選about.json的數據
    if (selectedDis) {
      //有區的id的話 改變單區的資料
      const filteredMapData = mapData.filter((item) => item.id === selectedDis)
      setDisData(filteredMapData)

      //抓到區的id然後去對照about的資料中map_id等於前者的資料
      const pointData = aboutData.filter((item) => item.map_id === selectedDis)
      setSelectedPointData(pointData) //改變單潛點的資料
    }
  }, [selectedDis])

  // 點擊地圖
  const handleMapClick = (e) => {
    const clickedMapId = e.target.getAttribute('data-id')

    //做效果用
    if (clickedMapId) {
      // 清除所有path的active狀態 //之後改成狀態=false或true
      document.querySelectorAll('path').forEach((path) => {
        path.classList.remove('same')
        // console.log(path)
      })
    }
    // 將點擊的path設置為active
    e.target.classList.add('same')
    // console.log(e.target)

    const clickedMap = mapData.find(
      //   //對照被點選的區id以及資料庫裡的區的id
      (item) => item.id === parseInt(clickedMapId)
    )

    // 更新選定的地圖
    setSelectedDis(clickedMap.id) //改變被選的區的id
    setSelectedDisName(clickedMap.name) //改變被選的區的名字
    // const newData = e.target.value
    setCurrentWeather({ ...currentWeather, StationID: clickedMap.station_id })
    console.log(clickedMap.station_id)
  }

  // 點擊潛點
  const handlePointButtonClick = (selectPoint) => {
    setSelectPointData(selectPoint) //改變潛點
  }
  // 圖片放大
  const handleCardImageClick = (imageSrc) => {
    setSelectedImage(imageSrc)
    setShowModal(true)
  }
  // 關閉圖片放大
  const closeModal = () => {
    setShowModal(false)
  }

  // 定義會使用到的資料狀態
  const [currentWeather, setCurrentWeather] = useState({
    StationName: '',
    StationID: '',
    WaveHeight: '',
    SeaTemperature: '',
    WindSpeed: '',
    WindDirection: '',
    WindDirectionDescription: 'N',
    DateTime: '',
  })

  useEffect(() => {
    const handleWeatherClick = () => {
      fetch(
        `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=${AUTHORIZATION_KEY}&format=JSON&StationID=${currentWeather.StationID}&WeatherElement=&sort=StationID`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data)

          // 取得 SeaSurfaceObs 的資料
          const seaSurfaceObs = data?.Records?.SeaSurfaceObs

          if (seaSurfaceObs) {
            // 取得第一個位置的氣象觀測時間資料
            const observationTimes =
              seaSurfaceObs.Location[0]?.StationObsTimes?.StationObsTime

            if (observationTimes && observationTimes.length > 0) {
              // 取得第一個觀測時間點的氣象元素資料
              const weatherElements = observationTimes[0]?.WeatherElements

              if (weatherElements) {
                // 取得風速和波高資訊
                // const dateTime = observationTimes[0]?.DateTime
                const windSpeed = weatherElements?.PrimaryAnemometer?.WindSpeed
                const WindDirectionDescription =
                  weatherElements?.PrimaryAnemometer?.WindDirectionDescription

                const waveHeight = weatherElements?.WaveHeight
                const SeaTemperature = weatherElements?.SeaTemperature

                // 解析並重新格式化日期
                const dateTimeString = observationTimes[0]?.DateTime
                const formattedDateTime = dateTimeString
                  .toString()
                  .replace(/T/, ' ')
                  .replace(/:00\+08:00/, '')

                setCurrentWeather((prevWeather) => ({
                  ...prevWeather,
                  DateTime: formattedDateTime,
                  WindSpeed: windSpeed,
                  WaveHeight: waveHeight,
                  SeaTemperature: SeaTemperature,
                  WindDirection: WindDirectionDescription,
                }))
              } else {
                console.error('找不到氣象元素資訊')
              }
            } else {
              console.error('找不到氣象觀測時間資訊')
            }
          } else {
            console.error('找不到 SeaSurfaceObs 資訊')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }

    if (currentWeather.StationID) {
      handleWeatherClick()
    }
  }, [currentWeather.StationID])

  return (
    <>
      <main className={styles['main']}>
        <ImageViewModal
          showModal={showModal}
          handleClose={closeModal}
          imageSrc={selectedImage}
          fullscreen={'xxl-down'}
        />
        {/* Modal↑ */}
        <Container className="my-5 p-3 border ">
          <button className={styles['tttest']}>test</button>
          <Row>
            <Col xs={12} md={6} lg={6} className="border-end">
              <div className={styles['box']}>
                <TaiwanSvg />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 480 600"
                  filter="url(#f3)"
                >
                  <defs>
                    <filter id="f3" width="120" height="120">
                      <feOffset in="SourceAlpha" dx="1" dy="1" />
                      <feGaussianBlur stdDeviation="4" />
                      <feBlend in="SourceGraphic" in2="blurOut" />
                    </filter>
                  </defs>
                  <g className="layer">
                    <g
                      className={styles['district']}
                      onClick={(e) => handleMapClick(e)}
                    >
                      {/* 1墾丁 */}
                      {/* <path
                        d="M197.48 454.08l.89-.12 1.15-1.51.22-1.28.46-.93.22-2.09.65-2.29.39-.54-.18-1.44-1.41-1.94h-.76l.04-8.8.18-1.98.47-1.98 1.05-1.16.68-2.13-.04-2.76.5-.93.11-8.52.65-1.87.94-3.39.54-3.39 1.09-.74 1.01.04.83.58.76-.04 1.55 1.24 1.7.08 1.98-.82 1.33.08 1.26.62 1.51.12 1.77-1.32.94-1.28.46-1.24.79-.82 2.16-1.36 2.45-2.1 1.98-.12 1.81-.46 1.66-.12.94.42.57 1.05.29 1.52.87.54 1.12.08 2.34-.58 1.09-.66.5-1.05.98-1.24 2.74.16 1.26.32 3.36 2.06 2.66 3.62 1.01.93h1.09l.72-.46 1.66-1.71.89-.36 1.73-1.71 1.51-.16 1.01.38 1.33 1.09 1.26-.46 1.83 1.39.55 2.81-.04 1.79.39.82 1.3.78 1.88.12 1.01.7.46.74v3.27l.39.62-.57.7-.33 1.13v2.99l-1.01 2.06-.11 1.59-1.12 1.44h-4.82l-.83.7-.9 2.06-.61.78-2.56.54-2.27.85-1.15-.12-.61.5v.85l-1.05 1.4-.5 1.79-2.31 3.31-.57 1.98-1.37 1.87v2.95l-1.05 1.55.37 1.75-1.44 3.3-.18 1.08 1.59 2.71.18 1.59 1.22 2.01.46 1.09.04 1.9-.26 1.01-.9.62-.61.89.15 1.32.39.77-.11.85 1.33 1.05 1.51 1.89 1.7 1.79.76 1.74-1.15 1.47-1.81.16-1.09.38-1.77 5-.47.74.04 1.2.87.62 1.81 1.83 1.66.73.9.04.5.89 1.44 1.31.15 3.26-1.51 1.09-.26.58 2.74 2.78.43 1.01-.79 1.47.07 1.27.9.35h1.3l2.38 1.24 1.19 1.23 2.45.42 2.27 2.09 1.01-.12 1.7-1.13 1.51-.24.17 1.46-.71 1.31-.04.91.41 1.4-.09 1.13-.88.95.17 2.26.34.91-.34 1.58.38 1.13-.34 1.81.67.63-.21.91-1.35 1v1.35l.59 1.94.42.54 1.39.54-.42.54-.09 1.31-1.01 1.26-.04 1.77.3.59.04 3.84 1.01 2.35-1.86 1.54v1.22l-1.6.81-.21 1.98-3.33 1.72-1.39.4-.13 1.17.3 1.17-.72 2.16.46 2.66 1.39 2.07 1.3 2.3-.08 1.21.88 1.17-.88.68h-1.26l-.67-.58-.38-2.35-.84.05-.97-.68-.3-.86-1.22-1.13-.42-.77-.84.32-.93-.09-.93-1.09-1.64-.63-1.47.09-.76-.81-1.13-.49-.5-.95-.97-.18-.71.86-.93.37-.63 1.35.21 1.94-1.01.72-.04 1.17-1.86.32-.46-.27-.93-1.4-.26-1.13-.8.23-.26-.63.34-3.12-.04-1.44.5-.95v-.95l-.46-1.13-.67-.63-.3-1.09-.63-.18-.89-.95-1.34-3.07-.17-1.67.67-1.09.89-.49-.26-1.44.5-1.04 1.01.04.34-.54.04-1.45-.67-2.12.3-.95.67-.05 1.26-.95-.3-2.17-.93-2.17.13-.67-1.26-1.44.17-.54-.76-.72.38-1.49-.63-.95.09-1.26-.46-1.22-.13-1.4-.76-1.77-.42-.45-.21-1.22.38-1.22-1.64-2.89-.67-1.67-1.43-1.54-1.73-1.31-.13-.32.42-2.17-.71-2.26-.63-1.4-.04-1.81-.97-1.77-2.61-2.76-1.89-1.63-.93-2.26-.67-1-.5-.18-.8-1.45-4.5-3.35-4.13-2.45-3.37-1.68-2.36-1.54-1.3-.54-1.77-1.05-2.44-1.81-.63-.32-1.77-2.03-.89-1.27-.21-.95-1.17-.59.03-9.22.05.05z"
                        data-id="1"
                        id="kenting"
                      ></path> */}
                      {/* 2綠島 */}
                      <path
                        d="M361.3643126487732 438.4882507324219L360.9342894554138 438.958251953125 360.0743041038513 438.728271484375 359.12429189682007 437.6382751464844 358.26430654525757 437.0982666015625 357.3343138694763 437.01824951171875 356.74428701400757 436.478271484375 356.74428701400757 433.7482604980469 355.38430166244507 432.8282470703125 355.52428579330444 431.4282531738281 357.04430532455444 431.3482666015625 357.90429067611694 430.8782653808594 359.0542845726013 430.8782653808594 359.49428701400757 431.3482666015625 361.51430654525757 431.4282531738281 362.0843138694763 431.96826171875 362.4543089866638 433.3682556152344 362.37429189682007 434.6082763671875 361.8042845726013 435.0782470703125 360.49428701400757 437.708251953125 361.3643126487732 438.4882507324219z"
                        data-id="2"
                      ></path>
                      {/* 3蘭嶼 */}
                      <path
                        d="M375.64431142807007 538.1082763671875L374.6143126487732 540.3882446289062 374.0743041038513 541.1582641601562 373.03429555892944 540.958251953125 372.4442992210388 540.4282836914062 371.00429677963257 540.3882446289062 370.1043028831482 539.4182739257812 369.9642882347107 538.73828125 369.02428579330444 537.5382690429688 366.04430532455444 537.3382568359375 365.41430044174194 536.9082641601562 364.0642943382263 535.0682373046875 362.7142882347107 534.3882446289062 361.3142943382263 533.3282470703125 361.3142943382263 529.4182739257812 360.1842894554138 527.6682739257812 360.49428701400757 527.1482543945312 361.5843138694763 527.6282348632812 370.7343077659607 527.478271484375 371.13430166244507 528.248291015625 370.78429555892944 529.0782470703125 371.6842894554138 530.8182373046875 371.6842894554138 531.8782348632812 370.50429677963257 531.8282470703125 370.50429677963257 533.8182373046875 372.26430654525757 535.8882446289062 375.64431142807007 538.1082763671875z"
                        data-id="3"
                      ></path>
                      {/* 4東部海岸 */}
                      <path
                        d="M286.76 306.57l.39-.52 1.62-.46 2.6-1.58.87-.3.27-.88-.05-1.17-1.24-1.35.7-1.06.22-1 1.29-2.23.92-.58.76-1.88.76-.64 1.84-.18 2.22-.65 1.18-.12 2.55 1.41 1.13-.36 1.13-1 1.24-.36v-4l.65-1.76.87-.59-.05-.58-1.03-2.75.54-.36 1.29-.12 1.09.24.87-.3 2.46-1.82 2.44-.12 1.73-2.87.76-5.11.54-2.29.33-2.64 1.03-3.46-.05-3.84-1.19-2.05-.06-1.41-.65-1-1.35-1.53-1.24-.52-.48-.65.11-1.23.76-1 1.03-.18 1.29-1.17.06-1.35-.54-1.53 1.79-1.77.59-4.59.98-1.12.87-2.35.54-.94 1.4-.59.65-.77.11-1.47-.98-1.89.33-.82 1.73-1.59.16-.94-.81-1.66.11-6.83-.38-1.23-.87-.59-.11-1.83 2-4.12.76-1.13.22-1.41.11-2.88.59-1.35 1.3-.77.92-1.06 1.94-1.65.65-1.17.33-1.17v-2.11l-.76-.95-1.19-.06-1.24-2.3-.98-.76-1.41-.41-.48-1.29v-2.12l1.41-3.19 1.4-.47 2-1.29.76-1.17 1.57-1.07 2.33-.3.54-.65-.06-1.47-.65-.65-.16-.9 1.03-.53.49-.83-.17-1.07.81-1.07 2.11-.71 1.08-.65.65-1.01-.11-3.6.59-.71 1.24-.36 1.19-1.89.98-1.07 2.65-.65.81-1.13.81-2.06.54-2v-1.77l.38-.71 1.46-.89.3-.54 1.65 1.51 3.62 1.71 5.57.59 2.11.59 2.22 1.18 2 1.65 4.87 1.13 1.19-.59.16-.83-1.19-1.41.54-.71 2.86-.89h1.13l.65-.41-.16-.71-.7-.71-.27-1.07.43-1.3.98.12 1.63 1.66 2.65.89 2.97 2.24 4.38 1.59 2.75.18 2 .53 2.27 1.3 2.13-.06-.09 1.08-1.39 1.84-1.05.73-1.13 1.61-.63 2.06-.08 1.38-1.56 1.75-1.47 1.19-1.52.41-1.02 1.7-.21.92-2.53 1.42-.84.87-1.56.59-1.3 1.92-.8 1.84-.34 1.38.26 2.29.67 1.14.21 2.01-.42 1.61-1.13 1.97-1.05 1.01-1.64.97-1.52 1.33-1.47 2.79-.3 1.47.04 2.34.8 2.7 1.77 3.21 1.73 1.37.5 1.84-1.6 2.06-1.01 1.74-.67.37.26.82-1.13-.05-.59.37-.38 1.19-.93.92-.21 1.6.5 1.19.34 2.1-.71 2.06-.38 1.6.17 1.6-.54 4.12-1.22 4.9-1.39 2.83v.78l-.54 1.28-.97 1.06-.38 1.51-.17 2.52-.17.32.09 2.38.38 1.1-.08.87-.8 1.79v.55l-.93 1.42-.17.87-.93.68-.72 1.55v1.65l.46 1.88-.93 2.56.17.73-.46.78-.34 1.6v1.14l-.54.14-.72 1.6-.59 2.78.04 4.71-.26.64-.3 2.38-1.51 2.97-.72 1.05-.46 1.78-.08 1.83-.38.28-.3 1.51.26 1.69-.09.87.63 2 .59-.05.3.82-.93 2.42-.84 1.1-.63-.18-.76.64 1.1.45-.5 1.88-.3 2.97-.84 1.17-1.28-.92-.9-.93-2.93-.49-1.89.35-.58.63-1.35.43-.9 1.03-.63 1.51-1.39 2.49-1.13 3.61.23 1.66 1.93 1.13.18.83-1.21 2.25-1.17 1.81-1.3 1.71-.72 1.77-1.62 1.61-.27 1.46-.05 2.88-.9.93-1.17.78-.58 2.93-1.81 3.37-1.13 3.85-.58 1.41-.95 1.41-1.4 1.32-.54 1.05-.14 9.01-1.93 1.16-2.53.1-1.62 1.13-1.13-.1-.77-.58-.23-1.76-.54-1.41-.77-.68-3.2-.83-1.44-1.31-1.3-.58-.7-2.29-1.81-1.51-.32-1.71.05-1.76-.72-.59-.68-1.46-1.26-.68-.49-.63h-1.3l-1.81 1.41-.77.29-2.21-1.07-.58-1.32-.86-1.03-1.49-.93-1.76-.53-1.72-.83-1.71-.3-1.13-1.03-1.71-3.22-.49-1.66.05-2-1.21-1.81-.37-1.36-.62-.61.32-.31.15-1.64-.29-1.21-4.69-3.43-1.59-.7-1.01-.86-1.98-.98.72-2.11.83-.5 1.44-2.42 2.02-.78 1.01-.58.22-3.17-.43-1.29-1.01-.16-.43-1.09-.06.06.02-.03z"
                        data-id="4"
                      ></path>
                      {/* 5澎湖 */}
                      <path
                        d="M62.89 296.21l.19 1-1.24 1.01-3.33.37.05-1.18 1.6.37 1.39-1.14 1.35-.41h-.01v-.02zm-4.2 37l.26 1.12-.8-.09-.42-1.01.97-.02h-.01zm-10.32 8.4l.98.23-.71 1.05-.08 2.32-.82-.23-1.15.86.34 1.31-2.1-.67.3-1.87-1.51-1.46-.04-.45 1.86-.59 2.98-.5h-.05zm14.45-25.42l.67.77-.26 1.14-1.69.23-.26.82-1.1-.14-.04-1.23.76.19.26-1.01 1.21-.18.42-.59h.03zm10.69-40.47l1.06.54v1.01l-.41 1.01-1.35-.28-.97-.96.8-.41.88-.91h-.01zm10.56 59.01l.5.51-1.47 2.77-.89-1.1.42-.77-.17-1.05 1.6-.38v.02h.01zm-23.9-.24l.46.66-.93.81-.17-1.23.63-.25.01.01zm21.71-65.73l.59.92-1.86.09.42-.78.84-.23h.01zm-11.99-1.96l.8.92.76.09.42-.73 1.35 1.14-.13.73.8 1.74.17 1.19-.97-.32-.34 1.18 1.25.87.05.55-1.01.5.17.59-.59.64-1.6-.32-.5-.45 1.06-.96-.21-1.41-1.69-1.14-.13-1.06-.49-1.06-1.02-.13-.8 1.18-1.93-.18-1.73 2.33.21.78-.59.87-1.04-.19-.47.55-1.64.04.54 2.42-.3.68.54.87-.71 1.83-.85.28.55 1.1-.67 1.01.45.73-.25.96.21.96-3.37-.59-.41.78-1.13-.14-1.13.68-1.3-.32.3-.78 1.34-.59.51-1.1 1.25.86h.55l1.43-1.32.21-1.6-.84-.68-.89-.23-.21-.91 1.56-.55.66-1.28-1-1.69.72-.78-.38-.68.34-1.06.59-.11.97-3 1.51-.05.04.87-.63.45.3.69 1.6.73 1.26-.64 1.01-1.23.97-3.16 1.43-.23 2.05-.65 1.02-.5h-.01v.03h.01zm-9.39 26.75l-.26 1.12-.93-.23.26-.87.93-.02zm14.35 42.85l.71.07-.08 1.36-.59.32-1.3-.91.08-.45 1.17-.38h.01v-.01zm5.3-58.54l.98.6-.21 1.37.84.28-.26 1.01.93-.1.38-1.78.59.87.84.28-.09.92.76 1.06-.34 1.6.59 1.55 1.53.5.03.8-1.6.8h-1.26l.13-1.14-1.18-.59-.67.37-2.23-.09-.63-.23-1.47 1.55-.09.92-1.48.26-1.93 2.01-.97.64-.09.91.97.14-.59 1.41.13.97-1.26-.19-.26-.44-1.6-.2-.67.68-1.26.32-.84-.37.46-1.32-.17-.82-1.1-.68-1.35.5-.72-1.55-.46.05-1.3-1.6.26-.91.67-.04.59-.83.34 1.96.85.5-.3 1.13.3.63 1.01-1.18.93.18.76.91 1.13-1.1 1.17.32.08-1.05.97-.55.13-1.1-1.77-.28-1.51.64-.71-.28-1.56-.05.12-1.23h1.53l.97-1.27-.76-.55-1.09.88-.8-.05-.21-.87.97-1.05-.13-.73-.76-1.1 1.64-.23 1.47-1.27.84.5v.87l.54 1.91 1.18-.41-.34-2.01 1.51.37-.08-1.33-.59-.78.63-1.1 1.22.5 1.93-.96.67.54-.67.68.42 1.05-.5 1.32.72.5.42-1.12-.08-.94.75-.6.59.15.21 1.37h1.1v-.73l-.63-.59.79-1.92v.03zm-6.01-24.42l.17.94 1.43.59.17.94-1.06 1.16-1.22-.23-.55.96-1.51-.82.43-.78.7-.27 1.43-2.5h.01v.01zm-44.19 56.88l1.47.82.26.59-.46.82-1.94.4-.3-1.05.97-1.6-.01.02h.01zm26.43 2.59l.63.92 1.47.04.13 3.25.97-.05v.87l-1.17.28.46 1.91-3.2.14-.38-.82 1.06-1.61-.3-.44.17-1.14-.26-.87.5-.5-.5-1.27.42-.7h-.01l.01-.01z"
                        data-id="5"
                      ></path>
                      {/* 東沙環礁6 */}
                      <path
                        d="M89.56 546.6c.2-.9.46-1.78.74-2.64.13-.4.24-.82.38-1.22.15-.41.46-.66.75-.93.21-.2.45-.37.66-.56.12-.1.27-.14.39-.2.95-.51 1.95-.91 2.88-1.44.6-.34 1.26-.47 1.93-.58.43-.08.86-.08 1.3-.08 1.08 0 2.15.01 3.23 0 .74-.01 1.45-.16 2.15-.38.32-.1.62-.25.97-.13.08.03.15.04.2.1.28.42.63.78.95 1.17.33.41.5.9.68 1.39.32.89.55 1.81.81 2.71.15.51.16 1.05.27 1.57.15.74.15 1.5.13 2.25-.02.66-.17 1.3-.39 1.94-.31.9-.78 1.72-1.38 2.43-.64.76-1.37 1.45-2.2 2.04-.66.47-1.33.93-2.09 1.22-.74.28-1.51.43-2.29.56-.47.08-.94.15-1.42.13-.87-.05-1.75-.08-2.6-.27-.53-.12-1.02-.4-1.5-.66-.67-.36-1.33-.73-1.94-1.21-.51-.4-1.03-.81-1.51-1.26-.32-.3-.62-.62-.85-1-.16-.27-.29-.56-.31-.89-.03-.6-.16-1.19-.13-1.78.04-.75.1-1.51.17-2.29l.02.01z"
                        data-id="6"
                      ></path>
                      {/* 7東北角 */}
                      {/* <path
                        d="M437.24 45.94l-1.98-.35-2.21-1.43-1.13-.2-1.26 1.33-1.53.15-2.25-1.78-.81-.94v-4.7l-1.09-1.48-1.17-.59-.18-1.33.54-2.72.67-.64-.05-1.04-.49-1.64.67-1.04-.36-.89-1.26.54-.54.59-1.26.05-.58.54-1.81.1-1.53-.64-4.78-.05-.72-.54-1.85.49-.63.44-.81-.3-.27-2.03-1.11.19-.51 1.39-1.4 2.08-.81.47-1.41-.95-1.62.77-1.68 2.2-.22 1.29v-.05l.21-1.31 1.68-2.2 1.62-.77 1.41.95.81-.47 1.4-2.08.51-1.39-1.25-.46-.17-.69.42-1.25-1.73-.05-.25.6-.89-.33-.5-.97-.8.05-1.69-1.89h-.71l-.72.65.8 1.34-1.64 2.08.04-2.13-.21-.88-1.43-.09-1.56-1.07-2.1-.37-1.35.23-.13-1.38v-.08l-.02.05-1.47-.97-1.18-.45-.22-.83.33-1.07.7-.47.43-1.67-1.89.65-2.81-.12-1.73-1.61-.76-1.01.16-1.55-.38-.65-1.57-.59-.7-1.13-.11-1.85-1.6-3.09-.92-.89-1.57-1.08-1.41-.41-2.05-1.01-.76-1.19-.7-.36-.76.36-.87 1.43-2.81-.06-.98-.71L364.8.66l-2.7-.18-.87.36-.7.89-3.36 1.9-.98 2.56-.48.47h-1.29l-1.35.36-.81.59-1.46 4.22-1.79 1.79-1.03 2.97-1.63 1.01 1.24 1.07 1.4.36 1.35.71-1.51.73-1.13-.47-1.46.24-1.06 2.08-1.62 1.43-3.79 1.79-1.13 1.01-2.33 1.18-1.03.36-2.64.24-2.55-.3-1.4.06-1.91 1.16 1.09 1.34 1.29 1.03 3.53.71 1.59.95 1.44.63.79 1.5.43 1.34.57.79 3.25.47 2.23.08 1.01.63.72 1.5-.22 1.26.22 1.74 1.15.71.37.71-.29.79-1.44.79.57 1.11-.07 1.03-1.22.95-1.08.32-.72 1.34-1.08 1.11h-6.7l-.43.87.29.95.15 3.09-.72.87-.22 1.26.22 1.03 1.51.47-.22.79-.87.87-.43.95.22 1.03 1.09 1.58 1.01.63.87 1.34.57 1.82.07 1.34.94 1.18-.29.47-1.29.24.15.74 2.23.79 1.44.79h1.59l1.22-.47h1.52l1.88.79 1.09 1.03 1.37 1.74 1.22 1.18.65 1.82.79 1.34.65.47-.29 1.26-1.01 1.11-1.52 1.26-.5 1.26.22 1.89 1.01 1.66 2.45 4.9 1.44 1.66 1.09.47 1.01 1.03-.07 1.89.69.79.53-.24 1.66.24 1.15-.16.94-.87 1.73-.16 3.1-1.74 1.88-2.29 3.39-.47 1.44-1.5.87-.24.72-.71.87-1.97-.07-1.89-1.15-1.34-.15-.95 1.15-1.42.15-2.53 1.59-1.18 1.3-.16 1.01.26.72-1.97.57-.79 2.66-.16 4.62-1.18 1.15-.55 1.15-.87.5-1.11 1.08-.79 2.02-.55 1.52-2.05 1.22-.55 2.31.55 1.94-.16 1.29-.55.72-1.03.15-1.34.5-2.13 2.53-2.61 1.94-.39 2.02-.08 2.38-1.18.94-.95.5-1.42-.29-1.26-.87-1.03-.57-1.18.65-2.29 1.15-.63 1.09-.16 1.66.63 1.73.24 1.51-.55 1.37-1.26.79-1.03 1.66-.63h2.16l2.38-1.18 1.4.3h.02l-.01.06 2.2-.09 1.89-1.43 1.09-.1 2.39-1.18.67-.79.14-.79-.49-.79h-.02z"
                        data-id="7"
                      ></path>{' '} */}
                      {/* 小琉球8 */}
                      <path
                        d="M192.70429372787476 479.65826416015625L193.404305934906 481.28826904296875 191.894296169281 482.0982666015625 189.24430227279663 485.2382507324219 187.894296169281 485.1782531738281 187.62430715560913 484.2482604980469 188.71430349349976 482.7982482910156 188.82431936264038 481.91827392578125 189.414315700531 480.6982727050781 190.76432180404663 479.4282531738281 192.70429372787476 479.66827392578125 192.70429372787476 479.65826416015625z"
                        data-id="8"
                      ></path>
                    </g>
                  </g>
                  {/* 八區以外的台灣 */}
                  <g>
                    <path
                      d="M418.9 97c-7.8 8.9-6.7 16.9-7.3 28.4-.3 5.2 1.1 11.8 4.8 15.4 1.4 1.4 3.8 3.8 5.9 3.5 0 4.2.7 4.7-2 7-2.4 2.1-3.6 3.3-4.2 6.7-.8 4.1-1.2 6.2-3.8 9.5-3.1 3.9-4.4 5.5-6.1 10-1.4 4-4 8.2-4.6 12.4-.6 3.8.1 5.8-2.6 8.7-1.4 1.6-3 2.9-5 3.6-2.4.8-3.5.4-4.7 2.5-1 1.6-1.2 5.1-1.3 6.9 0 11-5.7 23.9-7.5 34.8-.8 4.6-1.6 9.3-2.8 13.8-.9 3.6-3.2 7.2-3.8 10.7-1.5 8.1-2.1 16.4-3.8 24.7-1.6 7.8-2.7 15.9-5.6 23.4-.8 2-1.6 3.5-1.9 5.8-1.1 8.6 1.5 17.1-1.8 25.5-2.1 5.4-7.2 8.7-7.3 14.9 6 9.3-11.3 34.4-18 40.7-3.6 3.5-6.7 5.6-10.1 8.2-5.1 3.9-3.4 1.2-5.6 7.2-1.2 3.4-.8 7-2.8 10.4-2.3 3.9-7.1 6.6-9.9 10.4-2.1 2.8-3.4 6-5.9 8.5-4.4 4.3-14.3 6.9-17.3 12.3-2.5 4.4-1.3 13.2-1.5 18.2-.6 12-8.3 32.6-8.3 32.7-1.7 9.5 5.1 19.9-.4 28.5.1 1.1-.2 23-.5 23.3-3.7 5.7-10.4-4.5-14.3-5.9-7-2.5-10.1-1-11.1-11-1.2-11.6 1.5-15.8-5.3-25.7-12.1-17.7-25.9-32.4-44.5-42.4-10.5-5.7-29.9-17.3-33.7-29.8-1.4-4.7 1.2-8 .9-13.3-.2-4.4-2.2-8.8-3.8-12.7-3.8-9.1-9.6-16.7-15.6-24.2-4.3-5.5-12.3-13.7-13.5-20.2-1.4-7.7 2.7-17.9 3.7-25.6 2.5-18.2 3.9-37 7.7-54.4 3.1-14.5 11.7-26.5 19.4-38.8-.2 0-.3 0-.5-.1 1.2-2 2.5-3.9 3.6-5.9 15.6-6.7 26.5-30.9 33.3-45.6 5.3-11.6 11.3-23.1 16.7-34.4 5.1-10.6 10.2-21.4 19.5-28.9 7.7-6.3 23.7-15.7 27.2-25.4 4.8-13.4 9.9-26.1 19.5-35.6l.1.1c0 .1.1.1.2.2 2.7-2.7 5.8-5.1 9.5-7.2 8.7-5 16-9.2 25.7-11.9 6.2-1.7 21.3-3.4 25.8-8.9 1.8-2.2 3.1-7.7 4.5-9.1 2.7-2.6 7.4-2.8 10.4-4.5 2.7-1.5 3.9-4.5 7.3-5.5 7.5-2.2 4.6-.1 8.7 3.3 3.5 2.9 6.7 7.5 10.2 10.7 1.5 1.4 4.1 1.9 5.7 3.2 11.2 9.8 8.1 10.9 23.8 11.8 5.9 5 13.7 10.2 20.8 13.9.2 1.1 0 2.1-.4 3h.6c-2.8 5.2-12.8 8-16.4 12.2z"
                      className="st1"
                    ></path>
                  </g>
                  <g>
                    <g className={styles['ctaSvg']}>
                      <g>
                        {/* 東沙環礁 */}

                        {/* mask方法跟 clipPath方法 mask會有三層 一層遮罩一層mask*/}
                        {/* clipPath Everything outside the circle will be clipped and therefore invisible.*/}
                        <clipPath id="myClip">
                          <path
                            className={styles['diveSvg']}
                            d="M115.37 530.53l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                          ></path>
                        </clipPath>
                        {/* 東沙的圓↓ The original black heart, for reference */}
                        {/* <circle
                          id="circle1"
                          cx="123.92"
                          cy="517.75"
                          r="15.43"
                          className={styles['same']}
                        /> */}
                        <circle
                          id="circle1"
                          cx="123.92"
                          cy="517.75"
                          r="15.43"
                          className={styles['same']}
                        ></circle>
                        {/* 複製的圓 Only the portion inside the clip circle is visible.*/}
                        <use
                          clipPath="url(#myClip)"
                          href="#circle1"
                          className={styles['use']}
                        />
                      </g>
                      <g>
                        {/* 東部海岸 */}
                        <circle cx="398.42" cy="213.5" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M389.87 226.28l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                      <g>
                        {/* 東北角 */}
                        <circle cx="450.17" cy="48" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M441.62 60.78l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                      <g>
                        {/* 澎湖*/}
                        <circle cx="91.92" cy="308" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M83.37 320.78l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                      <g>
                        {/* 墾丁 */}
                        <circle cx="280.17" cy="551.75" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M271.62 564.53l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                      <g>
                        {/* 綠島 */}
                        <circle cx="372.92" cy="411.5" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M364.37 424.28l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                      <g>
                        {/* 蘭嶼 */}
                        <circle cx="385.92" cy="507.25" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M377.37 520.03l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                      <g>
                        {/* 小琉球 */}
                        <circle cx="203.67" cy="497.75" r="15.43" />
                        <path
                          className={styles['diveSvg']}
                          d="M195.12 510.53l-1.76-1.32 3.13-4.17.85-4.89q.08-.66.52-1.17t1.13-.67l10.4-3.16 2.2-4.39 3.29-3.29 1.1 1.1-2.75 3.18-1.65 5.05-5.49 3.84-6.42 2.03-1.26 3.46-3.29 4.39zm-1.1-8.78q-.91 0-1.55-.65t-.65-1.55q0-.91.65-1.55t1.55-.65q.91 0 1.55.65t.65 1.55q0 .91-.65 1.55t-1.55.65zm6.48-5.38q-.66.19-1.25-.15t-.78-1q-.19-.66.15-1.26t1-.77l5-1.32.85 3.18-4.97 1.32z"
                        ></path>
                      </g>
                    </g>
                  </g>
                  <rect x="48" y="480" width="120" height="100" />
                </svg>
              </div>
            </Col>
            <Col className={styles['weather']}>
              <h3>{selectedDisName}</h3>
              <h4>{currentWeather.StationName}</h4>
              {/* <button onClick={handleWeatherClick}>取得氣象API</button> */}
              <div>
                {/* 時間 */}觀測時間: {currentWeather.DateTime}
              </div>
              <Stack
                direction="horizontal"
                gap={4}
                className={styles['weather-detail']}
              >
                <div>
                  {/* 風向 */}風向
                  <FaWind />
                  {currentWeather.WindDirection}
                </div>
                <div>
                  {/* 浪高 */}浪高
                  <LuWaves />
                  {currentWeather.WaveHeight}
                </div>
                <div>
                  {/* 海溫 */}海溫
                  <TiWeatherCloudy />
                  {Math.round(currentWeather.SeaTemperature)}
                </div>
                <div>
                  {/* 風速 */}風速
                  {currentWeather.WindSpeed}
                </div>
              </Stack>
              <div>
                <Container>
                  {disData.map((v) => {
                    const fileNames = v.image.split(',')
                    return (
                      <React.Fragment key={v.id}>
                        {fileNames.map((fileName, index) => (
                          <Image
                            thumbnail
                            fluid
                            key={index}
                            src={`/images/map/${fileName.trim()}`}
                            alt={v.image}
                            onClick={() =>
                              handleCardImageClick(
                                `/images/map/${fileName.trim()}`
                              )
                            }
                          />
                        ))}
                      </React.Fragment>
                    )
                  })}
                </Container>
              </div>
            </Col>
            {/* 試動畫區塊 */}
            <div style={{ backgroundColor: 'yellow', height: '10px' }}>
              <div className={styles['eclipse']}></div>
            </div>
            {/* 試動畫區塊^^^ */}
          </Row>
          <hr />
          <div className="bg-light text-center">
            {selectedPointData &&
              selectedPointData.map((v) => (
                <DiButton
                  key={v.id}
                  text={v.name}
                  color={'#013c64'}
                  onClick={() => handlePointButtonClick(v.id)}
                />
              ))}
          </div>
          <Container>
            <Stack direction="horizontal" gap={3}>
              <div className="p-2">
                <Button variant="secondary">相關課程</Button> <div></div>
                <div>
                  {' '}
                  {selectedPointData &&
                    selectedPointData
                      .filter((data) => data.id === selectPoint)
                      .map((v) => {
                        const fileNames = v.image.split(',')
                        return (
                          <React.Fragment key={v.id}>
                            {fileNames.map((fileName, index) => (
                              <Image
                                fluid
                                key={index}
                                src={`/images/map/${fileName.trim()}`}
                                alt={v.image}
                                onClick={() =>
                                  handleCardImageClick(
                                    `/images/map/${fileName.trim()}`
                                  )
                                }
                              />
                            ))}
                          </React.Fragment>
                        )
                      })}
                </div>
              </div>
            </Stack>
          </Container>
        </Container>
      </main>
    </>
  )
}
