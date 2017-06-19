import { Row } from 'antd'
import { Col } from 'antd'
import { Button } from 'antd'
import { Icon } from 'antd'
import { message } from 'antd'

import plupload from 'plupload'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	containerId: new Date().getTime(), 
            listT: [],
            listB: [],
        }
    }
    componentDidMount() {
        const { datas = [] } = this.props;
        this.setState({listT: datas});
        this.initUploader()
    }
    componentWillReceiveProps(nextProps) {
        const { datas = [] } = this.props;
        const nextPropDatas  = nextProps.datas || [];
        if(datas.lenght == 0 && nextPropDatas.lenght > 0){
            this.setState({listT: nextPropDatas})
        }
    }
    componentDidUpdate() {
	    this.uploader.refresh();
	}
    initUploader(){
    	const { 
    		uploadUrl = '', 
    		limitValue = '',  
    		maxUploadSize = 0, 
    		isdetail = false
    	} = this.props;
    	const { containerId } = this.state;
    	const autoUpload = true;
    	const filters = {
            mime_types : limitValue ? [{ title : "limitType", extensions : limitValue}] : [],
            max_file_size : `${maxUploadSize || 5}mb`, //最大上传大小
            prevent_duplicates : true  //不允许选取重复文件
        }
    	this.uploader = new plupload.Uploader({
	      	container:  `container${containerId}`,
	      	browse_button: `browsebtn${containerId}`,
	      	runtimes: jQuery.browser.msie && parseInt(jQuery.browser.version) < 10 ? 'flash' : 'html5,flash,html4',
	      	multipart: true, // multipart/form-data的形式来上传文件
	      	chunk_size: '1mb', //分片上传大小
	      	url: uploadUrl || '/',
	      	flash_swf_url: '/cloudstore/resource/pc/plupload-2.3.1/js/Moxie.swf', 
	    	...filters
	    	//multi_selection: true //默认开启多选文件
    	});
    	//初始化
    	this.uploader.init();
    	//绑定主要事件,state同步

		//const uploadEvents = [
		//	'PostInit', 'Browse', 'Refresh', 'StateChanged', 'QueueChanged', 'OptionChanged',
		//	'BeforeUpload', 'UploadProgress', 'FileFiltered', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded',
		//	'UploadComplete', 'Destroy', 'Error'
		//];
		
		//新增上传
		this.uploader.bind('FilesAdded', (up, files) => {
			//先清除错误文件
			const { listT, listB } = this.state;
			let fListB = listB.filter(file => {
	    		file.error && this.uploader.removeFile(file.id);
	    	})
			let newListB = fListB.concat(files);
			this.setState({listB: newListB});
			autoUpload && this.uploader.start();
			this.onChange(listT, newListB);
		});
		//删除文件
		this.uploader.bind('FilesRemoved', (up, rmFiles) => {
			const { listT, listB } = this.state;
	      	let newListB = [].concat(listB);
	      	rmFiles.map(rf => {
	      		newListB = newListB.filter(file => rf.id !== file.id)
	      	});
			this.setState({listB: newListB});
		});
		//抛错
		this.uploader.bind('Error', (up, err) => {
			message.error(`文件上传出错: ${err.message} 请重试!`,3);
			console && console.log('文件上传出错 error: ',err);
			//if(err.file !== undefined){
			//	const { listT, listB } = this.state;
			//	let newListB = [].concat(listB);
			//	err.file.map(errf => {
			//		newListB = newListB.map(file => {
			//			if(errf.id !== file.id) {
			//				let newFile = {...file};
			//				newFile.error = errf.message
			//				return newFile
			//			}
			//		})
			//	});
			//	this.setState({listB: newListB});
			//}
		});
		//上传进度
		this.uploader.bind('UploadProgress', (up, pgfile) => {
			console.log('UploadProgress: ', pgfile);
			const { listT, listB } = this.state;
			let newListB = [].concat(listB);
			newListB = newListB.map(file => {
				if(pgfile.id == file.id) {
					let newFile = {...file};
					newFile.percent = pgfile.percent
					return newFile
				}
			}) 
	      	this.setState({listB: newListB});
	    });
    }
    doUpload(e) {
	    e.preventDefault();
	    this.uploader.start();
	}
    clearAllFiles() {
    	const { listB } = this.state;
    	listB.map(file => {
    		this.uploader.removeFile(file.id);
    	});
    	this.setState({listT: [], listB: []})
    	this.onChange([],[]);
  	}
    doDeleteT(fileid){
    	const { listT, listB } = this.state;
    	let newListT = [].concat(listT);
    	newListT = newListT.filter(file => fileid !== file.fileid);
    	this.setState({listT: newListT});
    	this.onChange(listT, newListT);
    }
    doDeleteB(id){
    	const { listT, listB } = this.state;
    	let newListB = [].concat(listB);
    	newListB = newListB.filter(file => id !== file.id);
    	this.uploader.removeFile(id);
    	this.setState({listB: newListB});
    	this.onChange(listT, newListB);
    }
    onChange(listT,listB){
    	let idsT = listT.map(t => t.fileid);
    	let idsB = listB.map(t => t.id);
		if(typeof this.props.onChange === 'function'){
    		this.props.onChange(`${idsT}`,`${idsB}`);
    	}
	}
    render() {
        const { 
        	uploadUrl = '', 
        	detailtype, 
        	viewAttr, 
        	fieldName = '', 
        	isDetail, 
        	category='',
        	showBatchLoad, 
        	value = '', 
        	maxUploadSize = 0,
        	filedatas = []
        } = this.props;
        const { listT, listB, containerId } = this.state;
//      const disabled = uploadUrl == '' || viewAttr === '1' || category === '';
        const disabled = false;
        const required = viewAttr =='3' && listB.length == 0 && listT.length == 0;
        const btnSize = isDetail ? 'small' : 'default';
        return (
			<div id={`container${containerId}`} className='wea-upload'>
				{this.renderlistT()}
				{ btnSize === 'small' ? 
					<span>
						<Button disabled={disabled} id={`browsebtn${containerId}`} type="ghost" shape="circle-outline" icon="upload" title='点击上传' style={{marginRight:8}} />
						{ !(listT.length == 0 && listB.length == 0) && 
							<Button type="ghost" shape="circle-outline" icon="cross" title='清除所有' style={{marginRight:8}} />
						}
						{ showBatchLoad && !(listT.length == 0 && listB.length == 0) &&
							<Button type="ghost" shape="circle-outline" icon="download" title='全部下载' onClick={()=>{console.log('全部下载')}}/>
						}	
					</span>
					:
					<span>
						<Button disabled={disabled} type="ghost" id={`browsebtn${containerId}`} style={{marginRight:8}}>
				    		<Icon type="upload" /> 点击上传
				    	</Button>
						{ !(listT.length == 0 && listB.length == 0) && 
						    <Button type="ghost" style={{marginRight:8}} onClick={this.clearAllFiles.bind(this)}>
						    	<Icon type="cross" /> 清除所有
						    </Button>
						}
					    { showBatchLoad && !(listT.length == 0 && listB.length == 0) &&
					    	<Button type="ghost" style={{marginRight:8}} onClick={()=>{console.log('全部下载')}}>
					    		<Icon type="download" /> 全部下载
					    	</Button>
					    }
				  	</span>
				}
				{ required && <span style={{color: '#f00',marginRight: 5}}>*</span> }
				{!!maxUploadSize && <span> 最大上传{maxUploadSize}M/个附件</span>}
				{this.renderlistB()}
				<input type='hidden' name={fieldName} id={fieldName} value={value} />
			</div>
		)
    }
    renderlistT(){
    	const { detailtype } = this.props;
    	const { listT } = this.state;
    	let imgheight = 100; 
       	let imgwidth = 100;
		//let listMock = [{
		//	fileid: 'ddd',
		//	imgSrc: '/sdfs',
		//	filelink: '/sdfhsdk',
		//	filename: 'mock数据.c',
		//	filesize: '4512',
		//	loadink: '/sddsdfsdf'
		//}];
    	return (
	    	<Row>
				<Col className='wea-upload-list' style={detailtype == 1 ? {paddingBottom: 10} : {padding: 5,marginBottom:10, maxHeight: 2 * ((imgheight || 50) + 112), overflow:'auto'}}>
					{
						listT.map(d => {
							const { fileid, imgSrc, filelink, filename, filesize, loadink } = d;
							return ( 
								detailtype == 1 ?
									<div className='ant-upload-list-item'>
										<div className='wea-upload-list-item-file'>
											<img src={imgSrc} style={{width:16,height:16}} />
											<a href={filelink} title={filename}>{filename}</a>
											<span className='wea-upload-list-item-ops'>
												<span style={{color:'#999'}}>{filesize}</span>
												<span style={{float:'right',margin:'0 10px',color:'#0e5990',cursor:'pointer'}} onClick={this.doDeleteT.bind(this,fileid)}>删除</span>
												<span style={{float:'right'}} ><a style={{color:'#0e5990'}} href={loadink} target='_blank'>下载 </a></span>
											</span>
										</div>
									</div>
								:
									<div className='wea-upload-imgs-item' style={{width: (imgwidth && imgwidth > 90 ? (imgwidth + 20) : 110)}}>
										<img src={imgSrc} style={{width:(imgwidth || 50),height:(imgheight || 50)}} />
										<p className='wea-upload-list-item-info'><a href={filelink}>{filename}</a></p>
										<p style={{fontSize:12,color:'#999'}}>{filesize}</p>
										<p style={{textAlign:'left',color:'#0e5990'}}>
											<span><a href={loadink} target='_blank' style={{color:'#0e5990'}}>下载 </a></span>
											<span style={{float:'right'}} onClick={this.doDeleteT.bind(this,fileid)}>删除</span>
										</p>
									</div>
							)
						})
					}
				</Col>
			</Row>
		)
    }
    renderlistB(){
    	const { listB } = this.state;
    	return (
	    	<Row>
				<Col className='wea-upload-list'>
					{
						listB.map(d => {
							const { name, id } = d;
							return (
								<div className='ant-upload-list-item'>
									<div className='wea-upload-list-item-file'>
										<Icon type="paper-clip" style={{marginRight:5}}/>
										{name}
										<Icon type="cross" className='wea-upload-list-item-del' style={{}} onClick={this.doDeleteB.bind(this,id)}/>
									</div>
								</div>
							)
						})
					}
				</Col>
			</Row>
		)
    }
}

export default Main;