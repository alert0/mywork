import {connect} from 'react-redux'
import {Modal} from 'antd';
import {changeBirthVisible} from '../actions/head'
import '../css/birthinfo.css';

class BirthModal extends React.Component {
	changeVisible() {
		const {dispatch,birthvisible} = this.props
		dispatch(changeBirthVisible(!birthvisible))
	}
	shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
	render() {
		const {birthdata,birthvisible} = this.props
		const {bgimg,textcolor,usercolor,curdate,userlist,congratulation}=birthdata.toJSON()
		let bgStyle = {
			"background": "url('" + bgimg + "') center center"
		}
		return <div>
			<Modal title="生日提醒"  onCancel={this.changeVisible.bind(this)}
	          visible={birthvisible} width="499px" footer="" wrapClassName="css-hrmbirth">
		        <div className="css-hrmbirth-containner" style={bgStyle}>
					<BirthTextArea color={textcolor} usercolor={usercolor} curdate={curdate} congratulation ={congratulation}/>
					<BirthUserInfo color={usercolor} userlist ={userlist}/>
				</div>
	        </Modal>
		</div>
	}
}
const BirthTextArea =({curdate,congratulation,color,usercolor})=>(
	<div className="css-hrmbirth-text" style={{"color":"#"+color}}>
		<div className="css-hrmbirth-text-cong" dangerouslySetInnerHTML={{__html: congratulation}}></div>
		<div className="css-hrmbirth-text-date" style={{"color":"#"+usercolor}}>{curdate}</div>
	</div>
)
const BirthUserInfo =({userlist,color})=>{
	let items = [];
	let line = 0
	userlist.forEach((item) => {
		items.push(<BirthUserInfoLine key={"birthinfo-"+line++} data={item}/>)
	})
	return <div className="css-hrmbirth-userinfo"  style={{"color":"#"+color}}>
		<div className="css-hrmbirth-user-container">{items}</div>
	</div>
}
const BirthUserInfoLine =({data})=>(
	<div  className="css-hrmbirth-user-item">
		<span className="css-hrmbirth-user">{data.lastname}</span>
		<span className="css-hrmbirth-detp">{data.detialInfo}</span>
	</div>
)
const mapStateToProps = state => {
    const {PortalHeadStates}=state
    return {birthdata:PortalHeadStates.get("birthdata"),
    		birthvisible:PortalHeadStates.get("birthvisible")}
}
module.exports = connect(mapStateToProps)(BirthModal)