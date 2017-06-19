const ComVar = {
  Week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  Type: {
    none: {
      name: "none",
      icon: "",
      tip: ""
    },
    current: {
      name: "current",
      icon: "",
      tip: "编辑中 "
    },
    normal: {
      name: "normal",
      icon: "check",
      tip: "提交于 "
    },
    expired: {
      name: "expired",
      icon: "question",
      tip: "补交于 "
    },
    white: {
      name: "white",
      icon: "exclamation",
      tip: "未提交 "
    }
  },
  Format:{
    invalid: "invalid",
    current:"current",
    week:"week",
    month:"month",
    year:"year"
  },
  PrefixCls: 'wea-timeline',
  Offset: 5
}

export default ComVar