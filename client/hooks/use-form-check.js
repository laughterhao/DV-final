import { useState } from 'react'

// 表單使用的錯誤訊息
export default function useFormCheck() {
  // 初始化
  const initUserProfile = {
    name: '',
    email: '',
    birth: '',
    tel: '',
    address: '',
  }

  const initPWD = {
    origin: '',
    newPWD: '',
    rePWD: '',
  }

  const initMsg = {
    nameErr: '',
    emailErr: '',
    originErr: '',
    newPWDErr: '',
    rePWDErr: '',
  }

  // 表單驗證的status
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [password, setPWD] = useState(initPWD)
  const [errorMsg, setMsg] = useState(initMsg)

  // Rule
  const nameRegex = /[0-9]/
  const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}/

  // Error module
  const errText = {
    empty: '必填欄位',
    syntax: '輸入格式錯誤',
    different: '密碼不符',
    reuse: '重複使用相同密碼',
  }
  // 抓取改變的欄位
  const handleChangeProfile = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value })
  }
  const handleChangePWD = (e) => {
    setPWD({ ...password, [e.target.name]: e.target.value })
  }

  // 表單驗證
  const handleProfileCheck = () => {
    switch (true) {
      case userProfile.name.trim() === '':
        setMsg({ ...errorMsg, nameErr: errText.empty })
        break
      case userProfile.email.trim() === '':
        setMsg({ ...errorMsg, emailErr: errText.empty })
        break
      default:
        return true
    }
  }

  const handlePWDCheck = () => {
    switch (true) {
      case password.origin.trim() === '':
        setMsg({ ...errorMsg, originErr: errText.empty })
        break
      case password.newPWD.trim() === '':
        setMsg({ ...errorMsg, newPWDErr: errText.empty })
        break
      case !passwordRegex.test(password.newPWD):
        setMsg({ ...errorMsg, newPWDErr: errText.syntax })
        break
      case password.origin === password.newPWD:
        setMsg({ ...errorMsg, newPWDErr: errText.reuse })
        break
      case password.rePWD.trim() === '':
        setMsg({ ...errorMsg, rePWDErr: errText.empty })
        break
      case password.newPWD !== password.rePWD:
        setMsg({ ...errorMsg, rePWDErr: errText.different })
        break
      default:
        return true
    }
  }

  return {
    handleProfileCheck,
    handlePWDCheck,
    handleChangeProfile,
    handleChangePWD,
    userProfile,
    setUserProfile,
    errorMsg,
    setMsg,
    initMsg,
    password,
  }
}
