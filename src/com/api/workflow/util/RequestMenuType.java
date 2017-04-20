package com.api.workflow.util;

/**
 * 按钮类型
 * @author jhy Apr 18, 2017
 *
 */
public enum RequestMenuType {
	BTN_DEFAULT(0,false),
	BTN_SUBMIT(1, true), 
	BTN_DRAFT(2, true), 
	BTN_SUBBACKNAME(3, true), 
	BTN_WFSAVE(4, true), 
	BTN_FREEWF(5, true), 
	BTN_SUBNOBACKNAME(6, true), 
	BTN_FORWARD(7, true), 
	BTN_FORWARDBACK3(8, true), 
	BTN_REJECTNAME(9, true), 
	BTN_PRINT(10, true), 
	BTN_SUPERVISE(11, true), 
	BTN_DOINTERVENOR(12, true),
	BTN_DORETRACT(13,false),
	BTN_END(14,false),
	BTN_BACKSUBSCRIBLE(15,false),
	BTN_DOVIEWMODIFYLOG(16,false),
	BTN_NEXT(17,false),
	BTN_EXCEL(18,false),
	BTN_RELATECWORK(19,false),
	BTN_COLLECT(20,false),
	BTN_VERSION(21,false),
	BTN_FORWARDNOBACKE3(22,false),
	BTN_DOREOPEN(23,false),
	BTN_NEWSMSNAME(24,false),
	BTN_DODRAWBACK(25,false),
	BTN_DODELETE(26,false),
	BTN_NEWWFNAME(27,false),
	BTN_NEWCHATSNAME(28,false);

	private int id;
	private boolean isTop;

	private RequestMenuType(int id, boolean isTop) {
		this.id = id;
		this.isTop = isTop;
	}

	public int getId() {
		return id;
	}

	public boolean isTop() {
		return isTop;
	}
}
