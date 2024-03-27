export default function DefaultButton({ type, text, onClick, color }) {
  return (
    <>
      <button type={type} onClick={onClick} color={color} className="special">
        {text}
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <style jsx>{`
        .special {
          margin: 2px;
          margin-right: 15px;
          border-radius: 50px;
          display: inline-block;
          position: relative;
          z-index: 1;
          min-width: 200px;
          background: #ffffff;
          border: 1.5px solid ${color};
          color: ${color};
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          overflow: hidden;
          transition: 0.5s;
          padding: 10px 20px;
        }
        .special span {
          position: absolute;
          width: 25%;
          height: 100%;
          background-color: ${color};
          transform: translateY(150%);
          border-radius: 50%;
          left: calc((var(--n) - 1) * 25%);
          transition: 0.5s;
          transition-delay: calc((var(--n) - 1) * 0.1s);
          z-index: -1;
        }
        .special:hover {
          color: #fff;
        }
        .special:focus {
          color: #fff;
          background-color: ${color};
        }
        .special:hover span {
          transform: translateY(0) scale(2);
        }
        .special span:nth-child(1) {
          --n: 1;
        }
        .special span:nth-child(2) {
          --n: 2;
        }
        .special span:nth-child(3) {
          --n: 3;
        }
        .special span:nth-child(4) {
          --n: 4;
        }
      `}</style>
    </>
  )
}
