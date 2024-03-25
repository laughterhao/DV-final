import React from 'react'
import AutoTab from '@/components/cart/auto-tab'

import styles from '../cart.module.scss'

function CreditCardInput({ name, value, onChange, maxLength, placeholder }) {
  return (
    <div className="col-2">
      <input
        type="text"
        className="form-control autotab-4"
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default function CreditCard({
  handleInputChange,
  userInputs: {
    cCard_number1,
    cCard_number2,
    cCard_number3,
    cCard_number4,
    cCard_expirationMonth,
    cCard_expirationYear,
    cCard_securityCode,
    cCard_name,
    cCard_address,
  },
  setUserInputs,
  cUser,
}) {
  //勾選資料相同 收貨人
  const cardHolderChange = () => {
    setUserInputs((prevState) => ({
      ...prevState,
      cCard_name: cUser.name,
      cCard_address: cUser.address,
    }))
  }

  return (
    <>
      <div className="container credit-card-section">
        <div className={`w-100 ${styles.sectionName} text-center mb-3`}>
          <h5 className={`${styles.span}`}>信用卡付款資訊</h5>
        </div>
        <h6 className={`${styles.span} my-3`}>
          ※ 信用卡交易資訊 Credit Card Information
        </h6>
        <div className="row justify-content-between my-3">
          <p className="col-sm-2 col-3 fw-bold">信用卡卡號</p>
          <CreditCardInput
            name="cCard_number1"
            value={cCard_number1}
            onChange={handleInputChange}
            maxLength={4}
          />
          <CreditCardInput
            name="cCard_number2"
            value={cCard_number2}
            onChange={handleInputChange}
            maxLength={4}
          />
          <CreditCardInput
            name="cCard_number3"
            value={cCard_number3}
            onChange={handleInputChange}
            maxLength={4}
          />
          <CreditCardInput
            name="cCard_number4"
            value={cCard_number4}
            onChange={handleInputChange}
            maxLength={4}
          />
        </div>
        <div className="row justify-content-between my-3">
          <p className="col-sm-2 col-3 fw-bold">有效期限</p>
          <CreditCardInput
            name="cCard_expirationMonth"
            value={cCard_expirationMonth}
            onChange={handleInputChange}
            maxLength={2}
            placeholder="MM"
          />
          <CreditCardInput
            name="cCard_expirationYear"
            value={cCard_expirationYear}
            onChange={handleInputChange}
            maxLength={2}
            placeholder="YY"
          />
          <p className="col-2 fw-bold">安全碼</p>
          <div className="col-2">
            <input
              type="text"
              className="form-control"
              maxLength={3}
              name="cCard_securityCode"
              defaultValue={cCard_securityCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <h6 className={`${styles.span} my-3`}>
          ※ 持卡人資料 Cardholder Information{' '}
        </h6>
        <div className="d-flex my-3">
          <input
            type="checkbox"
            className="credit_cb"
            onClick={() => cardHolderChange()}
          />
          <h6 className="fw-bold">持卡人資料與會員資料相同</h6>
        </div>
        <div className="row justify-content-between">
          <div className="col-6">
            <p className="fw-bold">持卡人姓名</p>
            <input
              type="text"
              className="w-100 form-control cCard_name"
              name="cCard_name"
              defaultValue={cCard_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-6">
            <p className="fw-bold">帳單地址</p>
            <input
              type="text"
              className="w-100 form-control cCard_address"
              name="cCard_address"
              defaultValue={cCard_address}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
          margin: 0;
        }

        @media (max-width: 576px) {
          p {
            font-size: 14px;
          }
        }
      `}</style>
      <AutoTab className="autotab-4" maxLength={4} />
    </>
  )
}
