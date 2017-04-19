import Input from '../../_antd1.11.2/input'
import cloneDeep from 'lodash/cloneDeep'
import trim from 'lodash/trim'
import classNames from 'classnames'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:props.value ?props.value:""
        };
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.value!==nextProps.value) {
            this.setState({
                value:nextProps.value
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
                nextProps.viewattr!==this.state.viewattr ||
                nextState.value !== this.state.value;
    }
    render() {
        const {value} = this.state;
        let {viewattr, style} = this.props;
        let theProps = cloneDeep(this.props);
        delete theProps.style;
        theProps.value = value;
        let eles;
        const req = classNames({
            'required': viewattr === 3 || viewattr === '3' && trim(value).length === 0,
        });
        if (viewattr === 1 || viewattr === '1') {
            eles = <span className="text">{value}</span>
        } else {
            eles = <Input type="text" {...theProps} onChange={this.setText.bind(this)} onBlur={this.onBlur.bind(this)} onFocus={this.onFocus.bind(this)} />
        }
        return (
            <div className={`wea-input-ctrl ${req}`} style={style}>
                {eles}
            </div>
        )
    }
    setText(e) {
        if (this.props.length && trim(e.target.value).length > this.props.length) {
            alert(`最长不能超过${this.props.length}`);
        }
        this.setState({
            value:e.target.value
        });
        this.props.onChange && this.props.onChange(e);
    }
    onBlur(e) {
        this.props.onBlur && this.props.onBlur(e);
    }
    onFocus(e) {
        this.props.onFocus && this.props.onFocus(e);
    }
}

export default Main;