import './Message.css';

const Message = (props) => {
  return (
    <div className={`message ${props.type}`}>
        <p>{props.msg}</p>
    </div>
  )
}

export default Message