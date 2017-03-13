export const ErrorInfo =({msg,url,btntext})=>(
    <span>
        {msg}
        {url != ""?<span className="login-msg-link" onClick={()=>showDialog(url, title)}>{btntext}</span> :"" }
    </span>
)