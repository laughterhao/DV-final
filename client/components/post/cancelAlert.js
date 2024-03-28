import Link from 'next/link'
import React from 'react'
import Swal from 'sweetalert2'
import DiButton from './defaultButton'

export default function CancelAlert({
  title,
  text,
  icon,
  showCancelButton,
  confirmButtonColor,
  cancelButtonColor,
  href,
}) {
  const handleCancel = (e) => {
    e.preventDefault()

    Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: `${icon}`,
      showCancelButton: `${showCancelButton}`,
      confirmButtonColor: `${confirmButtonColor}`,
      cancelButtonColor: `${cancelButtonColor}`,
      confirmButtonText: '確定',
      cancelButtonText: '取消',

      customClass: {
        confirmButton: 'confirm-button-class',
        title: 'title-class',
        icon: 'icon-class',
      },
      background: '#d9d9d9',
      iconColor: '#ff9720',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `${href}`
      }
    })
  }

  return (
    <>
      <Link href={'/dashboard/posts'}>
        <DiButton text={'取消'} color={'#dc5151'} onClick={handleCancel} />
      </Link>
    </>
  )
}
