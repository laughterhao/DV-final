import React, { useEffect, useState } from 'react'
import { Badge, Col, Form, InputGroup, Row, Button } from 'react-bootstrap'

export default function TagGenerator({ onTagsChange, initialTags }) {
  // 確保渲染完成後才調用 onTagsChange 函式，渲染期間不要觸發狀態更新
  const [tags, setTags] = useState([])

  // 確保初次渲染時賦值給 tags 狀態
  useEffect(() => {
    if (initialTags) {
      const initialTagsArray = initialTags.split(',').map((tag) => tag.trim())
      setTags(initialTagsArray)
      onTagsChange(initialTagsArray) // 確保初次渲染時也能觸發
    }
  }, [initialTags])

  const [newTag, setNewTag] = useState('')

  const handleAddTag = (e) => {
    e.preventDefault()

    //異步
    if (newTag.trim() !== '' && !tags.includes(newTag)) {
      setTags((prevTags) => {
        const updatedTags = [...prevTags, newTag]
        onTagsChange(updatedTags) // 在這裡調用
        return updatedTags
      })
      setNewTag('')
    }
  }

  //點按移除
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags)
    onTagsChange(updatedTags) // 在這裡調用
  }

  return (
    <>
      <InputGroup className="my-2">
        <InputGroup.Text>標籤</InputGroup.Text>
        <Form.Control
          placeholder="新增標籤... (選填)"
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleAddTag}>
          新增
        </Button>
      </InputGroup>
      <div>
        {tags.map((tag) => (
          <Badge
            key={tag}
            pill
            bg="primary"
            className="me-1 p-2"
            onClick={() => handleRemoveTag(tag)}
            style={{ fontSize: 14 }}
            title="點按即可移除"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </>
  )
}
