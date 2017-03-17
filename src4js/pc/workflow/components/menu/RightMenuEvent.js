import Forward from './Forward'

class RightMenuEvent extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render(){
			const {rightMenuStatus,actions} = this.props;
			const showForward = rightMenuStatus.get('showForward');
			
			return (
				<div className='wea-req-right-menus'>
						<div className='wea-req-right-menu-forward'>
							<Forward showForward={showForward} actions={actions}/>
						</div>
				</div>
				
			)
	}

}

export default RightMenuEvent