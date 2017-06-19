class MarqueeCom extends React.Component {
    componentDidMount() {
		const { eid, scolltype, height } = this.props;
        if(this.isMarquee(scolltype)){
            this.addMarqueeAttrs(eid,scolltype,height);
        }
    }
    isMarquee(scolltype){
        const arr = ['up','down','left','right'];
        return arr.contains(scolltype);
    }
    addMarqueeAttrs(eid, scolltype,height) {
		var attrs = {
            direction: scolltype,
            onmouseover: 'this.stop()',
            onmouseout: 'this.start()',
            scrolldelay: '200'
        };
        if (scolltype === 'up' || scolltype === 'down') {
            attrs['width'] = '100%';
            attrs['height'] = height;
        }
        $("#webjx_" + eid).attr(attrs);
    }
    render() {
        const { eid, children, scolltype } = this.props;
        if(this.isMarquee(scolltype)) 
        	return <marquee id={`webjx_${eid}`}> { children } </marquee>
    	else 
    		return children;
    }
}

export default MarqueeCom;