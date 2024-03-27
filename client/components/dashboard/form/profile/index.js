import React from 'react'
import styles from './styles.module.scss'
// password visibility hook
import useShow from '@/hooks/use-password-visibility'

export default function Form({
  userProfile = {},
  handleChangeProfile = () => {},
  handleUpdateProfile = () => {},
  handleChangePWD = () => {},
  handleUpdatePWD = () => {},
  errorMsg = {},
  auth = {},
}) {
  const { type, icon, handleToggle } = useShow()
  return (
    <>
      <div className={`col-sm-8 p-0 rounded-end ${styles['form-container']}`}>
        <div className="container my-4">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                {/* 按鈕需要下一個路徑判斷來顯示橘色背景 */}
                <button
                  className="fw-medium fs-5 accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  個人資料
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <form onSubmit={handleUpdateProfile}>
                  <div className="accordion-body">
                    <div className="row gy-4">
                      {/* 表單 */}
                      <div className="col-12 col-sm-6">
                        <div className="d-flex justify-content-between">
                          <label htmlFor="myName" className="form-label">
                            <span style={{ color: 'red' }}>*</span> 姓名
                          </label>
                          <span className="form-text text-danger pe-1 m-0">
                            {errorMsg.nameErr !== '' && errorMsg.nameErr}
                          </span>
                        </div>
                        <input
                          type="text"
                          id="myName"
                          className="form-control"
                          name="name"
                          placeholder="王小美"
                          value={userProfile.name}
                          onChange={handleChangeProfile}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label htmlFor="myBirth" className="form-label">
                          生日
                        </label>
                        <input
                          type="date"
                          id="myBirth"
                          className="form-control"
                          name="birth"
                          value={userProfile.birth}
                          onChange={handleChangeProfile}
                        />
                      </div>
                      {/* 改的話要再註冊驗證一次 */}
                      <div className="col-12 col-sm-6">
                        <div className="d-flex justify-content-between">
                          <label htmlFor="myEmail" className="form-label">
                            <span style={{ color: 'red' }}>*</span> 電子郵件
                          </label>
                          <span className="form-text text-danger pe-1 m-0">
                            {errorMsg.emailErr !== '' && errorMsg.emailErr}
                          </span>
                        </div>
                        <input
                          type="email"
                          id="myEmail"
                          className="form-control"
                          name="email"
                          placeholder="xxx@test.com.tw"
                          value={userProfile.email}
                          onChange={handleChangeProfile}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label htmlFor="myTel" className="form-label">
                          電話號碼
                        </label>
                        <input
                          type="tel"
                          id="myTel"
                          className="form-control"
                          name="tel"
                          placeholder="0987654321"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={userProfile.tel}
                          onChange={handleChangeProfile}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="address" className="form-label">
                          聯絡地址
                        </label>
                        <input
                          type="text"
                          id="address"
                          className="form-control"
                          name="address"
                          value={userProfile.address}
                          onChange={handleChangeProfile}
                        />
                      </div>
                      {/* 送出 */}
                      <div className="col-12 text-end">
                        <button
                          type="button"
                          className={`btn btn-outline-secondary me-3 ${styles['hover-style']} ㄍㄟ`}
                          // onClick={notify}
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="btn btn-secondary text-white"
                        >
                          儲存變更
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {!auth.isGoogle && (
              <>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="fw-medium fs-5 accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      密碼管理
                    </button>
                  </h2>
                  <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <form onSubmit={handleUpdatePWD}>
                      <div className="accordion-body">
                        <div className="row gy-1">
                          <div className="col-md-6 col-12 me-1 pb-4 position-relative">
                            <div className="d-flex justify-content-between">
                              <label htmlFor="origin" className="form-label">
                                舊密碼
                              </label>
                              {/* 警示訊息 */}
                              <span className="form-text text-danger pe-1 m-0">
                                {errorMsg.originErr !== '' &&
                                  errorMsg.originErr}
                              </span>
                            </div>
                            {/* END */}
                            <input
                              type="password"
                              id="origin"
                              name="origin"
                              className={`form-control pe-4 ${
                                errorMsg.originErr !== '' && 'border-danger'
                              }`}
                              maxLength={12}
                              onChange={handleChangePWD}
                            />
                          </div>
                          <div className="col-md-6 col-12 me-1 pb-4 position-relative">
                            <div className="d-flex justify-content-between">
                              <label htmlFor="newPWD" className="form-label">
                                新密碼
                              </label>
                              {/* 警示訊息 */}
                              <span className="form-text text-danger pe-1 m-0">
                                {errorMsg.newPWDErr !== '' &&
                                  errorMsg.newPWDErr}
                              </span>
                            </div>
                            {/* END */}
                            <div className="position-relative">
                              <input
                                type={type}
                                id="newPWD"
                                name="newPWD"
                                className={`form-control ${
                                  errorMsg.newPWDErr !== '' && 'border-danger'
                                }`}
                                style={{ paddingRight: '32px' }}
                                placeholder="請輸入8-12位(含大小寫英文字母)"
                                maxLength={12}
                                onChange={handleChangePWD}
                              />
                              <button
                                type="button"
                                className="fs-5 p-0 pe-1 pb-1 position-absolute"
                                style={{
                                  transform: 'translateY(-50%)',
                                  top: '50%',
                                  right: '4px',
                                  border: 'none',
                                  background: 'none',
                                }}
                                onClick={handleToggle}
                              >
                                {icon}
                              </button>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 me-1 pb-4 position-relative">
                            <div className="d-flex justify-content-between">
                              <label htmlFor="rePWD" className="form-label">
                                確認密碼
                              </label>
                              <span className="form-text text-danger pe-1 m-0 mb-1">
                                {errorMsg.rePWDErr !== '' && errorMsg.rePWDErr}
                              </span>
                            </div>
                            <input
                              type="password"
                              id="rePWD"
                              name="rePWD"
                              className={`form-control ${
                                errorMsg.rePWDErr !== '' && 'border-danger'
                              }`}
                              placeholder="請輸入8-12位(含大小寫英文字母)"
                              maxLength={12}
                              onChange={handleChangePWD}
                            />
                            <div
                              id="emailHelp"
                              className="form-text text-danger ps-1 position-absolute bottom-0 d-none"
                            >
                              密碼錯誤
                            </div>
                          </div>
                          <div className="col-12 text-end">
                            <button
                              type="submit"
                              className="btn btn-secondary text-white"
                            >
                              儲存變更
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
