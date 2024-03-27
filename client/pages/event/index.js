import { useState, useEffect } from 'react'
import EventCarousel from '@/components/event/event-carousel'
import LatestNews from '@/components/event/latest-news'
import EventList from '@/components/event/event-list'
import Loading from '@/components/layout/loading/loading'
import { useEvent } from '@/hooks/use-eventData'

export default function Event() {
  const [loading, setLoading] = useState(false)
  const eventList = useEvent()
  console.log(eventList)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <EventCarousel />
          <LatestNews eventList={eventList} />
          <EventList eventList={eventList} />
        </>
      )}
    </>
  )
}
