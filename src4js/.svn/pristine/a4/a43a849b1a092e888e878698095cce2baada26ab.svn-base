import React, {Component} from 'react';

import 'antd-mobile/lib/popup/style';
import Popup from 'antd-mobile/lib/popup';

class NavbarExtend extends Component {
    componentDidMount() {
        // 展开父级菜单
        let currNode = document.getElementsByClassName("menu-select")[0];
        if (currNode) {
            while (currNode.parentNode && currNode.parentNode.className !== "menu-list-ul") {
                if (currNode.parentNode.className === "menu-sub-ul") {
                    currNode.parentNode.style.display = "block";
                    currNode.parentNode.previousSibling.style.display = "block";
                    currNode.parentNode.previousSibling.previousSibling.childNodes[1].className = "menu-extend";
                }

                currNode = currNode.parentNode;
            }
        }
    }

    getAllNavbar(menus, level) {
        let self = this;
        let pl = level * 20;
        let ml = (level - 1) * 20;
        let liHtml = menus.map(function (item, index) {
            let menuSelect = item.menuid === self.props.selected ? "menu-select" : "";
            if ("true" === item.isParent) {
                return (
                    <li key={index}>
                        <div className="menu-header"
                             style={{paddingLeft: pl + "px"}}
                             ref={"menu-" + item.menuid}
                             onClick={ () => {
                                 Popup.hide();
                                 self.props.onClickFun(item.href, item.menuid);
                             } }
                             onTouchStart={ () => {
                                 self.refs["menu-" + item.menuid].style.backgroundColor = "#eee";
                             } }
                             onTouchEnd={ () => {
                                 self.refs["menu-" + item.menuid].style.backgroundColor = "#fff";
                             } }
                        >
                            <div className="menu-title">{item.menuname}</div>
                            <div className="menu-shrink"
                                 ref={"menu-toggle-" + item.menuid}
                                 onClick={ (e) => {
                                     e.stopPropagation();
                                     let menuid = item.menuid;
                                     let className = self.refs["menu-toggle-" + menuid].className;
                                     if (className === "menu-extend") {
                                         self.refs["menu-toggle-" + menuid].className = "menu-shrink";
                                         self.refs["menu-sub-" + menuid].style.display = "none";
                                         self.refs["menu-divider-" + menuid].style.display = "none";
                                     } else {
                                         self.refs["menu-toggle-" + menuid].className = "menu-extend";
                                         self.refs["menu-sub-" + menuid].style.display = "block";
                                         self.refs["menu-divider-" + menuid].style.display = "block";
                                     }
                                 } }
                            ></div>
                            <div className={menuSelect} style={{width: "13px"}}></div>
                        </div>
                        <div className="menu-divider" ref={"menu-divider-" + item.menuid}
                             style={{marginLeft: ml + "px", display: "none"}}></div>
                        <ul className="menu-sub-ul" ref={"menu-sub-" + item.menuid}>
                            {self.getAllNavbar(item.child, level + 1)}
                        </ul>
                        <div className="menu-divider" style={{marginLeft: ml + "px"}}></div>
                    </li>
                );
            } else {
                return (
                    <li key={index}
                        ref={"menu-" + item.menuid}
                        onClick={ () => {
                            Popup.hide();
                            self.props.onClickFun(item.href, item.menuid);
                        } }
                        onTouchStart={ () => {
                            self.refs["menu-" + item.menuid].style.backgroundColor = "#eee";
                        } }
                        onTouchEnd={ () => {
                            self.refs["menu-" + item.menuid].style.backgroundColor = "#fff";
                        } }
                    >
                        <div className="menu-header" style={{paddingLeft: pl + "px"}}>
                            <div className="menu-title">{item.menuname}</div>
                            <div className={menuSelect}></div>
                        </div>
                        <div className="menu-divider" style={{marginLeft: ml + "px"}}></div>
                    </li>
                );
            }
        });

        return liHtml;
    }

    render() {
        return (
            <div className="navbar-extend">
                <div className="extend-header">
                    <div className="extend-header-title">门户</div>
                    <div className="extend-header-close"
                         onClick={ () => {
                             Popup.hide();
                         } }
                    ></div>
                </div>

                <div className="extend-list">
                    <ul className="menu-list-ul">
                        {this.getAllNavbar(this.props.data.menus, 1)}
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = NavbarExtend;


