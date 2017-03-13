export const FreqUseMenuItem=({name,menuid,url,iconurl,icon,className,type,onClick})=>(
	<li className={className} data-url={url} data-type={type}  title={name} 
		onClick={onClick}>
		{ (iconurl !=null && iconurl!=undefined)? <img src={iconurl}/> : icon}
		<span>{name}</span>
	</li>
)