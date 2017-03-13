import LinkCardItem from './LinkCardItem';
import {Card,Icon} from 'antd';
import Immutable from 'immutable'
const is = Immutable.is;

class OLinkCard extends React.Component{
	shouldComponentUpdate(nextProps) {
        return !is(this.props.types, nextProps.types)
			|| this.props.isAbc !== nextProps.isAbc
			|| !is(this.props.importDataShow, nextProps.importDataShow)
			|| this.props.showBeagenters !== nextProps.showBeagenters
			|| this.props.showImportWf !== nextProps.showImportWf;
    }
	render() {
		const {types,importDataShow,isAbc,curOperWfid,showBeagenters,showImportWf,actions} = this.props;
		return (
			<div>
			{
           		types.map((type)=>{
					const wfbeans = type.get("wfbeans");
					const icontype ="icon-base " +type.get("img");
					const color = type.get("color");
					const letter = type.get("letter");
					return (
						<Card id={letter} className='clearfix' style={type.get("selected") ? {"border-top-color":color,overflow:'visible',background:'#fff',boxShadow:'0 1px 6px hsla(0,0%,39%,.2)'} : {"border-top-color":color,overflow:'visible'}}>
							<div style={{"width":"100%","margin-bottom":"20px"}}>
								<div className="one-card-title">
									<div style={{"display": "table","height":"100%","width":"100%"}}>  
										<div style={{"display": "table-cell",padding:'5px 0 25px 0',textAlign:'center'}}>
											{isAbc ?
												<span style={{fontSize:26,color:color}}>{letter}</span>
												:
												<div className="wf-card-type-name">
													<span style={{color:color,fontSize:26,marginRight:10}}><i className={icontype}/></span>
													<span style={{height:36,lineHeight:'36px'}}>{type && type.get("typeName")}{wfbeans && ('(' + wfbeans.size + ')')}</span>
												</div>
											}
										</div>
									</div>
								</div>
								<div className="one-card-content">
									<ul>
										{
											wfbeans.map((obj)=>
												<li>
													<LinkCardItem wfbean={obj} importDataShow={importDataShow} iscommon={false} curOperWfid={curOperWfid} showBeagenters={showBeagenters} showImportWf={showImportWf} actions={actions} />
												</li>			
											)
										}
									</ul>
								</div>
							</div>
						</Card>
					)
           		})
            }
			</div>
		)
	}


}

export default OLinkCard