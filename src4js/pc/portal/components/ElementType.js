import { Element } from '../elements/'
export default class ElementType extends React.Component{
	componentDidMount(){
		const { eid } = this.props.ele.item;
		global_all_eids[window.global_hpid][eid+''] = eid;
	}
    render(){
         const { ele } = this.props;
         return <Element key={'item_'+ele.item.eid} config={ele}/>
    }
}
