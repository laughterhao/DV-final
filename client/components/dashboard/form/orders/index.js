import React, { useState, useEffect } from 'react'
import styles from '../styles.module.scss'
import usePagination from '@/hooks/use-pagination'
import Pagination from '../pagination'
import LoaderPing from '@/components/post/loaderPing'

export default function Form({ order = [] }) {
  const { currentPage, pageItem, handlePage, getPageNumbers } = usePagination(
    order,
    10
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])
  return (
    <>
      <div className={`col-sm-8 p-0 rounded-end ${styles['form-container']}`}>
        <div className="container my-4">
          <h2 className="fw-medium fs-5 d-flex py-3 m-0">訂單記錄</h2>
          <div className="accordion-body overflow-auto">
            {isLoading ? <LoaderPing /> : <div className="bg-info h-100"></div>}
          </div>
        </div>
      </div>
    </>
  )
}
