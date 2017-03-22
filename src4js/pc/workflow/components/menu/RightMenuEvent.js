import Forward from './Forward'

class RightMenuEvent extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render(){
			const {rightMenuStatus,actions,titleName,requestid} = this.props;
			const showForward = rightMenuStatus.get('showForward');
			return (
				<div className='wea-req-right-menus'>
						<div className='wea-req-right-menu-forward'>
							<Forward showForward={showForward} actions={actions} requestid={requestid} titleName={titleName}/>
						</div>
				</div>
				
			)
	}
}

export default RightMenuEvent