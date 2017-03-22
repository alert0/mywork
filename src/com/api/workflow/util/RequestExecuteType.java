package com.api.workflow.util;

public enum RequestExecuteType {
	SEND_PAGE, // 无权限
	FAILD, // 处理失败，显示精确提示信息
	WF_LINK_TIP, // 出口提示
	R_CHROSE_OPERATOR, // 选择操作者
	DELETE, // 流程删除
	SUCCESS; // 成功
}
