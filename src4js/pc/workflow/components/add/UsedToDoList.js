import LinkCardItem from './LinkCardItem';
import Immutable from 'immutable'
const is = Immutable.is;

class UsedToDoList extends React.Component{
	shouldComponentUpdate(nextProps) {
        return !is(this.props.wfbeans, nextProps.wfbeans)
			|| !is(this.props.importDataShow, nextProps.importDataShow)
			|| this.props.showBeagenters !== nextProps.showBeagenters
			|| this.props.showImportWf !== nextProps.showImportWf;
    }
	render(){
		const {wfbeans,importDataShow,curOperWfid,showBeagenters,showImportWf,actions,user} = this.props;
		return (
			<div className="usedtodo">
				<ul>
					{
						wfbeans.map((wfbean,i) => 
							<li>
								<LinkCardItem user={user} wfbean={wfbean} importDataShow={importDataShow} iscommon={true} num={i} curOperWfid={curOperWfid} showBeagenters={showBeagenters} showImportWf={showImportWf} actions={actions} />
							</li>
						)
					}
				</ul>
			</div>
		)
	}
}

export default UsedToDoList