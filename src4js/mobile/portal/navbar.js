import React, {Component} from 'react';

import 'antd-mobile/lib/popup/style';
import Popup from 'antd-mobile/lib/popup';

import NavbarExtend from './navbar-extend.js';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                menus: [],
                menuCss: ""
            },
            selected: 0
        };
    }

    componentWillMount() {
        let hpid = this.props.hpid;
        let subCompanyId = this.props.subCompanyId;

        let localNavbar = JSON.parse(localStorage.getItem("navbar"));
        if (localNavbar) {
            let menuCss = localNavbar.menuCss;
            document.getElementById("navbarStyle").innerHTML = menuCss;

            this.setState({
                data: localNavbar,
                selected: hpid
            });
        }

        //let url = "/homepagemobile/json/navbar.json";
        //let url = "/page/interfaces/mobilePortalMenuToJson.jsp";
        let url = "/mobile/plugin/homepagemobile/interfaces/mobilePortalMenuToJson.jsp";
        fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include"
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    localStorage.setItem("navbar", JSON.stringify(data));

                    let menuCss = data.menuCss;
                    document.getElementById("navbarStyle").innerHTML = menuCss;

                    this.setState({
                        data: data,
                        selected: hpid
                    });
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
    }

    componentWillReceiveProps(nextProps) {
        let hpid = nextProps.hpid;
        this.setState({
            data: this.state.data,
            selected: hpid
        });
    }

    componentDidUpdate() {
        let navbarWidth = this.refs["navbarUl"].scrollWidth;
        this.refs["navbarScroller"].style.width = navbarWidth + "px";

        if (window.navbarScroll) {
            window.navbarScroll.destroy();
            window.navbarScroll = null;
        }
        let navbarScroll = new iScroll("navbarWrapper", {
            hScroll: true,
            vScroll: false,
            hScrollbar: false,
            vScrollbar: false,
            bounce: false
        });
        window.navbarScroll = navbarScroll;

        if (this.refs["menu-" + this.state.selected]) {
            let iw = window.innerWidth; // 屏幕宽度
            let bw = iw * 0.85; // 滑动区域宽度
            let ow = this.refs["menu-" + this.state.selected].offsetWidth; // 当前选中菜单宽度
            //let pow = this.refs["menu-" + this.state.selected].previousSibling ? this.refs["menu-" + this.state.selected].previousSibling.offsetWidth : 0; // 当前选中菜单上一个菜单宽度
            let now = this.refs["menu-" + this.state.selected].nextSibling ? this.refs["menu-" + this.state.selected].nextSibling.offsetWidth : 0; // 当前选中菜单下一个菜单宽度
            let ol = this.refs["menu-" + this.state.selected].offsetLeft; // 当前选中菜单左侧距离左侧的距离

            let pfl = ol + ow; // 当前选中菜单右侧距离左侧的距离

            if (pfl > bw) {
                window.navbarScroll.scrollTo(-Math.round(pfl - bw) - now, 0);
            }
        }
    }

    getShowMenus(menus, selected, showMenus) {
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].menuid === selected) {
                if (showMenus.length == 0) {
                    showMenus = menus;
                }
            } else if ("true" === menus[i].isParent) {
                if (showMenus.length == 0) {
                    showMenus = this.getShowMenus(menus[i].child, selected, showMenus);
                }
            }
        }

        return showMenus;
    }

    handleClick(url, menuid) {
        this.setState({
            data: this.state.data,
            selected: menuid,
        });

        window.location.hash = url;
    }

    onExtend() {
        Popup.show(
            <NavbarExtend
                data={this.state.data}
                selected={this.state.selected}
                onClickFun={this.handleClick.bind(this)}
            />
        );
    }

    render() {
        let self = this;
        let menus = this.state.data.menus;
        let selected = this.state.selected;
        let showMenus = this.getShowMenus(menus, selected, []);
        if (showMenus && showMenus.length == 0) {
            showMenus = menus;
        }
        let liHtml = showMenus.map(function (item, index) {
            let activeClass = item.menuid === selected ? "active" : "";
            return (
                <li key={index}
                    ref={"menu-" + item.menuid}
                    className={activeClass}
                    onClick={ () => {
                        self.handleClick(item.href, item.menuid);
                    } }
                >
                    {item.menuname}
                </li>
            )
        });

        return (
            <div className="navbar">
                <div className="navbar-content">
                    <div ref="navbarWrapper" className="navbar-wrapper" id="navbarWrapper">
                        <div ref="navbarScroller" id="navbarScroller">
                            <ul ref="navbarUl" className="navbar-ul">
                                {liHtml}
                            </ul>
                        </div>
                    </div>
                    <div className="menu-extend"
                         onClick={ () => {
                             self.onExtend()
                         } }
                    ></div>
                </div>
            </div>
        );
    }
}

module.exports = Navbar;