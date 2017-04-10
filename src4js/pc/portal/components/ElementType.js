import { Element } from '../../elements/'
export default class ElementType extends React.Component{
    render(){
         const { ele } = this.props;
         return <Element key={_uuid()} config={ele}/>
    }
}
