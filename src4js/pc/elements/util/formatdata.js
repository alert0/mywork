const formatData = (obj, esetting) => {
  const { imgSymbol, linkmode, isremind, widths, titles, ebaseid, eid } = esetting;
  const columns = new Array;
  var i = 0;
  //加载行小图标 
  if (imgSymbol) {
    const iObj = {
      dataIndex: 'imgSymbol',
      key: 'imgSymbol',
      width: '8',
      render: () => <img style={{marginBottom:'4px'}} name='esymbol' src={imgSymbol}/>
    }
    columns.push(iObj);
  }
  for (var k in obj) {
    var colObj = new Object;
    const kv = obj[k];
    if (typeof kv === 'object' && kv.constructor === Object) {
      colObj = {
        dataIndex: k,
        className:'reqdetail',
        key: k,
        render: (text) => loadRemind(text, linkmode, isremind)
      }
    } else if (typeof kv === 'object' && kv.constructor === Array) {
      colObj = {
        dataIndex: k,
        key: k,
        render: (text) => loadListName(text, linkmode)
      }
    } else {
      colObj = {
        dataIndex: k,
        key: k,
        render: (text) => {
         if(isHtml(text)){
          return <font className="font" dangerouslySetInnerHTML={{__html:text}}></font>
        }else{
            return <font className="font">{text}</font>
          }
        }
      }
    }
    if (titles) {
      colObj['title'] = titles[i];
    }
    if (widths) {
      colObj['width'] = widths[i];
    }
    columns.push(colObj);
    i += 1;
  }
  if(ebaseid==='8'){
     const iObj = {
        dataIndex: '"imgdetail"',
        key: '"imgdetail"',
        width: '10',
        render: () => <img className="imgdetail" style={{cursor:'pointer', display:'none',marginLeft:'-8px',marginBottom:'-1px'}} src="/images/ecology8/homepage/req_wev8.png" width="12px" height="12px"/>
    }
    columns.push(iObj);
  }
  return columns;
}


      
const loadListName = (list, linkmode) => {
  if (_isEmpty(list)) return <span></span>
  let html = list.map((obj, o) => {
    var dotstr = o === 0 ? "" : " , ";
    var href = "void(0)";
    if (obj.constructor === Object) {
      var openUrlWin = openLinkUrl.bind(this, obj.link, linkmode);
      if (obj.userid) {
        //openUrlWin =  showHrmCard.bind(this, );
        openUrlWin = pointerXY.bind(this);
        href = "openhrm(" + obj.userid + ")";
      }
      return <font>{dotstr}<a href={`javascript:${href};`} onClick={openUrlWin}><font className="font">{obj.name}</font></a></font>
    } else if (obj.constructor === Array) {
      let shtml = obj.map((sobj, s) => {
        var openUrlWin = openLinkUrl.bind(this, sobj.link, linkmode);
        if (sobj.userid) {
          // openUrlWin = showHrmCard.bind(this, sobj['userid']);
          openUrlWin = pointerXY.bind(this);
          href = "openhrm(" + obj.userid + ")";
        }
        return <a href={`javascript:${href};`} onClick={openUrlWin}><font className={`font`}>{sobj.name}</font></a>
      });
      return <font>{dotstr}{shtml}</font>;
    }
  });
  return <span className="td-span-formmodecustomsearch">{html}</span>
}

const loadRemind = (obj, linkmode, isremind) => {
  var openUrlWin = openLinkUrl.bind(this, obj.link, linkmode);
  var href = "void(0)";
  var spanClass = "td-span";
  if (obj.userid) {
    // openUrlWin = showHrmCard.bind(this, obj['userid']);
    openUrlWin = pointerXY.bind(this);
    href = "openhrm(" + obj.userid + ")";
    spanClass = "";
  }
  var nametitle = obj.name;
  if (obj.pretitle) nametitle = obj.pretitle + nametitle;
  if (obj.lasttitle) nametitle = nametitle + obj.lasttitle;
  var showName = <font dangerouslySetInnerHTML={{__html:obj.name}}></font>
  if (obj.img) {
    if (isremind) {
      var style = {};
      var tempremind = "";
      if (isremind.indexOf("#") > -1) {
        tempremind = isremind.substring(0, isremind.indexOf("#") - 1);
      } else {
        tempremind = isremind;
      }
      if (tempremind.indexOf("1") !== -1) {
        style['fontWeight'] = 'bold';
      }
      if (tempremind.indexOf("2") !== -1) {
        style['fontStyle'] = 'italic';
      }
      if (tempremind.indexOf("3") !== -1) {
        var color = isremind.substr(isremind.indexOf("#"));
        style['color'] = color + ' !important';
      }
      if (tempremind.indexOf("0") === -1) {
        return <span className={spanClass}><a href={`javascript:${href};`} onClick={openUrlWin} data-link={obj.link} data-requestid={obj.requestid} title={nametitle}><font className="font" style={style}>{obj.pretitle ? obj.pretitle:''}{showName}{obj.lasttitle ? <b style={{fontWeight:'bold'}}>{obj.lasttitle}</b>:null}</font></a></span>
      } else {
        return <span className={spanClass}><a href={`javascript:${href};`} onClick={openUrlWin} data-link={obj.link} data-requestid={obj.requestid} title={nametitle}><font className="font" style={style}>{obj.pretitle ? obj.pretitle:''}{showName}{obj.lasttitle ? <b style={{fontWeight:'bold'}}>{obj.lasttitle}</b>:null}</font>&nbsp;</a><img className="wfremindimg" src={obj.img}/></span>
      }
    }
    return <span className={spanClass}><a href={`javascript:${href};`} onClick={openUrlWin} data-link={obj.link} data-requestid={obj.requestid} title={nametitle}><font className="font">{obj.pretitle ? obj.pretitle:''}{showName}{obj.lasttitle ? <b style={{fontWeight:'bold'}}>{obj.lasttitle}</b>:null}</font>&nbsp;</a><img className="wfremindimg" src={obj.img}/></span>
  }
  return <span className={spanClass}><a href={`javascript:${href};`} onClick={openUrlWin} data-link={obj.link} data-requestid={obj.requestid} title={nametitle}><font className="font">{obj.pretitle ? obj.pretitle:''}{showName}{obj.lasttitle ? <b style={{fontWeight:'bold'}}>{obj.lasttitle}</b>:null}</font></a></span>
}

module.exports = {
  formatData,
  loadRemind
};