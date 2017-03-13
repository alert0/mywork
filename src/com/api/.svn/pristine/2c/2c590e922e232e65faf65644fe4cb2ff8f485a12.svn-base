package com.api.workflow.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.alibaba.fastjson.JSONObject;

import java.util.*;

import weaver.conn.RecordSet;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;
import weaver.systeminfo.SystemEnv;

@Path("/workflow/phrases")
public class WorkflowPhrasesService {
	
	@GET
	@Path("/getPhrases")
	@Produces(MediaType.TEXT_PLAIN)
	public String getPhrases(@Context HttpServletRequest request, @Context HttpServletResponse response){
		User user = HrmUserVarify.getUser(request, response);
		RecordSet rs = new RecordSet();
		
		List<Map<String,String>> phrasesdatas = new ArrayList<Map<String,String>>();
		boolean isSuccess  = rs.executeProc("sysPhrase_selectByHrmId", ""+user.getUID());
		if(isSuccess){
			while(rs.next()){
				Map<String,String> item = new HashMap<String,String>();
				item.put("short", Util.null2String(rs.getString("phraseShort")));
				String desc = Util.toHtml(Util.null2String(rs.getString("phrasedesc")));
				desc = Util.delHtml(desc).replaceAll("%nbsp;", " ");
				item.put("desc", desc);
				phrasesdatas.add(item);
			}
		}
		Map<String,Object> apidatas = new HashMap<String,Object>();
		apidatas.put("phrasesDatas", phrasesdatas);
		return JSONObject.toJSONString(apidatas);
	}
}
