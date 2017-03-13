import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Element from './Element';
import * as ElementAction from '../../actions/element'
//布局组件
class ElementIndex extends React.Component {
    componentWillMount() {
        const { ele, actions } = this.props;
        actions.getEDatas(ele);
    }
    render() {
        return <Element ele = { this.props.ele }
        key = { _uuid() }
        />
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return { actions: bindActionCreators(ElementAction, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(ElementIndex);
