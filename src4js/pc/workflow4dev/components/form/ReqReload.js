import PropTypes from 'react-router/lib/PropTypes'

class ReqReload extends React.Component {
    static contextTypes = {
        router: PropTypes.routerShape
    }
    componentDidMount() {
        const {requestid,preloadkey,comemessage,isaffirmance,reEdit} = this.props.location.query;
        const {router} = this.context;
        let tempURL = "/main/workflow/Req?requestid="+requestid;
        if(preloadkey) tempURL += "&preloadkey="+preloadkey;
        if(comemessage) tempURL += "&comemessage="+comemessage;
        if(isaffirmance) tempURL += "&isaffirmance="+isaffirmance;
        if(reEdit) tempURL += "&reEdit="+reEdit;
        router.push(tempURL);
    }
    render() {
        return (
            <div></div>
        )
    }
}

export default ReqReload