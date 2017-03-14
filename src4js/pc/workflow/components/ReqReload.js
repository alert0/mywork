import PropTypes from 'react-router/lib/PropTypes'

class ReqReload extends React.Component {
    static contextTypes = {
        router: PropTypes.routerShape
    }
    componentDidMount() {
        const {requestid,preloadkey,comemessage} = this.props.location.query;
        const {router} = this.context;
        router.push("/main/workflow/Req?requestid="+requestid+"&preloadkey="+preloadkey+"&comemessage="+comemessage);
    }
    render() {
        return (
            <div></div>
        )
    }
}

export default ReqReload