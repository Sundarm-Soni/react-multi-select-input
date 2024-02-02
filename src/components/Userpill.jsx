const Userpill = ({image, text, onPillClick}) => {
  return <span className="user-pill" onClick={onPillClick}>
    <img src={image} alt={text}/>
    <span>{text} &times;</span>
  </span>
}

export default Userpill;