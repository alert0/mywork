import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import {
	Table
} from 'antd';

class NewsSearchList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
		}
	}
	componentDidMount() {
		let url = '/page/interfaces/element/searchengine/NewsSearchInterface.jsp?eid=' + eid + '&keyword=' + keyword;
		fetch(url, {
			headers:  {
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			},
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					this.setState({
						data: data,
					});
				});
			} else {
				console.log("Looks like the response wasn't perfect, got status", response.status);
			}
		}).catch(e => console.log("Fetch failed!", e));
	}
	render() {
		let html = null;
		const data = this.state.data;
		if (!_isEmptyObject(data)) {
			const dataArr = dataConversion(data.data, data.titles);
			html = <Table columns={dataArr[0]} dataSource={dataArr[1]} size="small" />
		}
		return <div>
			{html}
		</div>;
	}
}

ReactDOM.render(<NewsSearchList />, document.body);

//数据格式转化，将获取的json数据转化为Table需要的数据格式
var dataConversion = function(list, titles) {
	var dataArr = new Array;
	var columns = new Array;
	var tabdata = new Array;
	for (var i = 0; i < list.length; i++) {
		var obj = new Object;
		obj.key = i;
		var index = 0;
		for (var s in list[i]) {
			obj[s] = list[i][s];
			if (i === 0) {
				var colObj = new Object;
				if (index === 0) {
					colObj = {
						dataIndex: s,
						key: s
							/*,
													render: (text, record) => <a href="javascript:void(0);" onClick={openLinkUrl.bind(this,record.linkUrl,'2')}>{text}</a>
											*/
					}
				} else {
					colObj = {
						dataIndex: s,
						key: s
					}
				}
				colObj['title'] = titles[index];
				columns.push(colObj);
				index += 1;
			}
		}
		tabdata.push(obj);
	}
	dataArr.push(columns);
	dataArr.push(tabdata);
	return dataArr;
}