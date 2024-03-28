import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css' // Import Quill styles
import dynamic from 'next/dynamic'
const QuillEditor = dynamic(() => import('react-quill'), { ssr: false })

export default function Quill({ initialContent, onChange }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    // Set the initial content when the component mounts
    setContent(initialContent || '')
  }, [initialContent])

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }],
      ['link'],
      [{ align: [] }],
      [{ color: [] }],
      [{ background: [] }],
      ['clean'],
    ],
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'code-block',
    'background',
  ]

  const handleContentChange = (newContent) => {
    setContent(newContent)
    // 调用父组件传递的回调函数，将新内容传递给父组件
    onChange(newContent)
  }

  return (
    <>
      <QuillEditor
        modules={quillModules}
        formats={quillFormats}
        value={content}
        // onChange={(data) => {
        //   console.log(data)
        // }}
        onChange={handleContentChange}
      />
    </>
  )
}
