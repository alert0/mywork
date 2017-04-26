package com.api.portal.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import weaver.page.interfaces.ElementsInterface;
import weaver.page.interfaces.commons.PageInterfaceFactory;

/**
 * @Comment : 元素请求Action，获取门户元素的设置信息和显示的数据
 * @author : qingsg
 * @date : 2017年3月7日
 * @version 1.0
 */
@Path("/portal/element")
public class ElementsAction {
	/**
	 * 元素接口类
	 */
	private ElementsInterface ei = new PageInterfaceFactory<ElementsInterface>().getImplementByInterface(ElementsInterface.class.getName());
	/**
	 * 获取元素设置信息和数据通用方法，返回json串
	 * 
	 */
	@POST
	@Path("/edata")
	@Produces(MediaType.TEXT_PLAIN)
	public String getElementsDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 * 获取元素tab设置信息和数据通用方法，返回json串
	 * 
	 */
	@POST
	@Path("/tabdata")
	@Produces(MediaType.TEXT_PLAIN)
	public String getElementsTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取流程中心元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/workflow")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWorkflowDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 * 获取流程中心元素tab设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/workflowtab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWorkflowTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取流程中心元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/custompage")
	@Produces(MediaType.TEXT_PLAIN)
	public String getCustomPageDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 * 获取流程中心元素tab设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/custompagetab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getCustomPageTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/mycalendar")
	@Produces(MediaType.TEXT_PLAIN)
	public String getMyCalendarDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/rss")
	@Produces(MediaType.TEXT_PLAIN)
	public String getRssDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/rsstab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getRssTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/news")
	@Produces(MediaType.TEXT_PLAIN)
	public String getNewsDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/newstab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getNewsTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	
	@POST
	@Path("/reportform")
	@Produces(MediaType.TEXT_PLAIN)
	public String getReportFormDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/reportformtab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getReportFormTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	
	@POST
	@Path("/outdata")
	@Produces(MediaType.TEXT_PLAIN)
	public String getOutDataDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/outdatatab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getOutDataTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	
	@POST
	@Path("/formmodecustomsearch")
	@Produces(MediaType.TEXT_PLAIN)
	public String getFormModeCustomSearchDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/formmodecustomsearchtab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getFormModeCustomSearchTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/view")
	@Produces(MediaType.TEXT_PLAIN)
	public String getViewDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/mail")
	@Produces(MediaType.TEXT_PLAIN)
	public String getMailDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/morenews")
	@Produces(MediaType.TEXT_PLAIN)
	public String getMoreNewsDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/magazine")
	@Produces(MediaType.TEXT_PLAIN)
	public String getMagazineDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/stock")
	@Produces(MediaType.TEXT_PLAIN)
	public String getStockDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/doccontent")
	@Produces(MediaType.TEXT_PLAIN)
	public String getDocContentDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/worktask")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWorkTaskDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/task")
	@Produces(MediaType.TEXT_PLAIN)
	public String getTaskDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/tasktab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getTaskTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/audio")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAudioDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/blogstatus")
	@Produces(MediaType.TEXT_PLAIN)
	public String getBlogStatusDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/favourite")
	@Produces(MediaType.TEXT_PLAIN)
	public String getFavouriteDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/flash")
	@Produces(MediaType.TEXT_PLAIN)
	public String getFlashDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/custommenu")
	@Produces(MediaType.TEXT_PLAIN)
	public String getCustomMenuDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/picture")
	@Produces(MediaType.TEXT_PLAIN)
	public String getPictureDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/searchengine")
	@Produces(MediaType.TEXT_PLAIN)
	public String getSearchEngineDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/slide")
	@Produces(MediaType.TEXT_PLAIN)
	public String getSlideDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/video")
	@Produces(MediaType.TEXT_PLAIN)
	public String getVideoDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/weather")
	@Produces(MediaType.TEXT_PLAIN)
	public String getWeatherDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/scratchpad")
	@Produces(MediaType.TEXT_PLAIN)
	public String getScratchpadDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/datacenter")
	@Produces(MediaType.TEXT_PLAIN)
	public String getDataCenterDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/plan")
	@Produces(MediaType.TEXT_PLAIN)
	public String getPlanDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/plantab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getPlanTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/jobsinfo")
	@Produces(MediaType.TEXT_PLAIN)
	public String getJobsinfoDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/outtersys")
	@Produces(MediaType.TEXT_PLAIN)
	public String getOutterSysDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/contacts")
	@Produces(MediaType.TEXT_PLAIN)
	public String getContactsDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/contactstab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getContactsTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/addwf")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAddWfDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/addwftab")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAddWfTabDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementTabContentDataJson(request, response);
	}
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/imgslide")
	@Produces(MediaType.TEXT_PLAIN)
	public String getImgSlideDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/newnotice")
	@Produces(MediaType.TEXT_PLAIN)
	public String getNewNoticeDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
	
	/**
	 *  获取日历日程元素设置信息和数据方法，返回json串
	 * 
	 */
	@POST
	@Path("/notice")
	@Produces(MediaType.TEXT_PLAIN)
	public String getNoticeDataJson(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception{
		return ei.getElementJson(request, response);
	}
}
