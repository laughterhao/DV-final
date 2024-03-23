// npm install quill react-quill
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Menu from '@/components/dashboard/menu'
import styles from '@/components/dashboard/form/styles.module.scss'
import postStyle from '@/components/post/post-list.module.scss'
import { Form, InputGroup, Stack, Container } from 'react-bootstrap'
import DiButton from '@/components/post/defaultButton'
import QuillEditor from '@/components/post/quill'
import TagGenerator from '@/components/post/tagGenerator'
import CancelAlert from '@/components/post/cancelAlert'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/auth'
import Image from 'next/image'
import { BiImageAdd } from 'react-icons/bi'
import LoaderPing from '@/components/post/loaderPing'

export default function Index() {
  const router = useRouter()
  const { auth } = useAuth()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 選擇的檔案
  const [selectedFile, setSelectedFile] = useState(null)
  // 預覽圖片
  const [preview, setPreview] = useState('')
  // 當選擇檔案更動時建立預覽圖

  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }
    // createObjectURL產生一個臨時性的URL 預覽用
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    setFormData({ ...postFormData, images: selectedFile })

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const changeHandler = (e) => {
    //有檔案上傳時
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const [postFormData, setFormData] = useState({
    user_id: `${auth.id}`,
    title: '',
    images: '',
    content: '',
    tags: '',
  })

  useEffect(() => {
    setEditorLoaded(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  //formData內容 onChange隨時更新
  const handleFormDataChange = (fieldName) => (value) => {
    setFormData({ ...postFormData, [fieldName]: value })
    console.log(postFormData)
  }

  //提交數據
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('user_id', postFormData.user_id)
    formData.append('title', postFormData.title)
    formData.append('content', postFormData.content)
    formData.append('tags', postFormData.tags)
    formData.append('images', selectedFile) //將文件添加到 FormData中
    console.log([...formData])
    try {
      const res = await fetch('http://localhost:3005/api/post/new', {
        method: 'POST',
        body: formData,
      })
      console.log('Submitting data:', formData)
      //成功的話跳alert
      if (res.status === 201) {
        Swal.fire({
          title: '新增成功',
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
          },
          backdrop: `
          rgba(0,0,123,0.4)
          url("/images/post/swimmingdog.gif")
          top
          no-repeat
        `,
        })
        //跳轉
        router.push('/dashboard/posts')
      }
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }

  const loader = <LoaderPing />

  const display = (
    <Container>
      <Form className="my-3" onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Text>文章標題</InputGroup.Text>
          <Form.Control
            onChange={(e) => handleFormDataChange('title')(e.target.value)}
            required
          />
        </InputGroup>
        <div>
          <label htmlFor="file" className={postStyle['myLabel']}>
            {' '}
            <span>檔案上傳</span>
            <BiImageAdd className={postStyle['icon']} />
            <input
              style={{ display: 'none' }}
              type="file"
              name="file"
              id="file"
              accept="image/*"
              onChange={changeHandler}
              required
            />
          </label>
          {selectedFile && (
            <div
              className="my-2"
              style={{ width: '100%', height: '400px', position: 'relative' }}
            >
              <div>預覽圖片:</div>
              <Image
                src={preview}
                alt="images"
                fill={true}
                style={{ objectFit: 'contain' }}
                priority={false}
              ></Image>
            </div>
          )}
        </div>
        <TagGenerator
          onTagsChange={(newTags) => {
            handleFormDataChange('tags')(newTags.join(','))
          }}
        />
        <br />
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
          required
        >
          <div className="h-screen w-screen flex items-center flex-col">
            <QuillEditor
              editorLoaded={editorLoaded}
              onChange={(value) => handleFormDataChange('content')(value)}
            />
          </div>
        </Form.Group>
        <Stack direction="horizontal" gap={3}>
          <div className="p-2 mx-auto">
            <CancelAlert
              title={'確定取消嗎？'}
              text={'您的更改將不會保存。'}
              icon={'warning'}
              showCancelButton={true}
              confirmButtonColor={'#3085d6'}
              cancelButtonColor={'#d33'}
              href={'/dashboard/posts'}
            />
            <DiButton type={'submit'} text={'送出'} color={'#013c64'} />{' '}
          </div>
        </Stack>
      </Form>
    </Container>
  )

  return (
    <>
      <Head>
        <title>新增文章</title>
      </Head>
      <Menu />
      <div className={`col-sm-8 p-0 rounded-end ${styles['form-container']}`}>
        <div className="container my-4">
          <div className="accordion">
            <div className="accordion-header">
              <h2 className="fw-medium fs-5 d-flex py-3 m-0">新增文章</h2>
            </div>
            <div className="accordion-body overflow-auto">
              {isLoading ? loader : display}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
