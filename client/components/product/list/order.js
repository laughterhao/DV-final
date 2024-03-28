import { useMemo, useState } from 'react'

import { MdReplyAll } from 'react-icons/md'
import { MdFiberNew } from 'react-icons/md'
import { FaSortNumericDownAlt } from 'react-icons/fa'
import { FaSortNumericUpAlt } from 'react-icons/fa'

export default function OrderProduct({ setSorting }) {
  return (
    <>
      <div className="d-flex p-3 justify-content-between align-items-center">
        <div className="toolbar">
          <button className="btn" id="sidebarToggle">
            隱藏篩選區塊 <i className="bi bi-toggles"></i>
          </button>
        </div>

        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            商品排序
          </button>
          <ul className="dropdown-menu">
            <li>
              <div className="dropdown-item" onClick={() => setSorting('all')}>
                <MdReplyAll /> 所有商品
              </div>
            </li>
            <li>
              <div
                className="dropdown-item"
                onClick={() => setSorting('createdAt')}
              >
                <MdFiberNew /> 最新上架商品
              </div>
            </li>
            <li>
              <div
                className="dropdown-item"
                onClick={() => setSorting('descending')}
              >
                <FaSortNumericDownAlt /> 價格：由高至低
              </div>
            </li>
            <li>
              <div
                className="dropdown-item"
                onClick={() => setSorting('ascending')}
              >
                <FaSortNumericUpAlt /> 價格：由低至高
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
