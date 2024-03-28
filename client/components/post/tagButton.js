export default function TagButton({ type, text, onClick, color }) {
  return (
    <>
      <button type={type} onClick={onClick}>
        {text}
      </button>
      <style jsx>{`
        button {
          margin: 4px 6px;
          font-size: 16px
          letter-spacing: 0.05rem;
          color: #ffffff;
          background-color: #013c64;
          border-radius: 17px;
          padding: 0.1rem 0.5rem;
          border: 1px solid #0003;
          border-color: #feebef;
        }
        button:hover {
          color: #013c64;
          background-color: #0000;
          border: 1px solid #0003;
        } 
        `}</style>
    </>
  )
}
