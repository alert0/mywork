import DatePicker from '../../_antd1.11.2/date-picker'
import Select from '../../_antd1.11.2/select'
import cloneDeep from 'lodash/cloneDeep'
const Option = Select.Option;

class main extends React.Component {
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
                nextProps.options !== this.props.options ||
                nextProps.layout !== this.props.layout ||
                nextState.value !== this.state.value;
    }
    render() {
        const {options, layout, style} = this.props;
        const {value} = this.state;
        let theProps = cloneDeep(this.props);
        return (
            <div class="wea-select-ctrl">
                <Select {...theProps} style={style} getPopupContainer={() => (layout || document.body)} defaultValue={value} value={value} onChange={this.setValue.bind(this)}>
                {
                    options.map((data)=>{
                        return (
                            <Option value={data.value}>{data.showname}</Option>
                        )
                    })
                }
                </Select>
            </div>
        )
    }
    setValue(value) {
        this.setState({
            value: value
        });
        this.props.onChange && this.props.onChange(value);
    }
}

export default main