package com.jquery.xh;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;

public class AjaxTestAction extends HttpServlet{

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String action = req.getParameter("action");
		if("getparam".equalsIgnoreCase(action)){
			getParam(req, resp);
		}else if("getcodes".equalsIgnoreCase(action)){
			getCode(resp);
		}else{
			throw new RuntimeException("不支持 action--"+action);
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doGet(req, resp);
	}

	private void getParam(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String name = req.getParameter("name");
		String value;
		if("USERNAME".equalsIgnoreCase(name)){
			value = System.getenv("username");
		}else if("java.version".equalsIgnoreCase(name)){
			value = System.getProperty("java.version");
		}else if(req.getParameterMap().containsKey(name)){
			value = req.getParameter(name);
		}else{
			throw new RuntimeException("不支持参数--"+name);
		}
		resp.getOutputStream().print(value);
	}

	private void getCode(HttpServletResponse resp) throws IOException {
		String dir = "D:/esendev/study/jquery-study/WebContent/"; //html文件所在的路径。
		
		Document doc = XhFn.getFileStruct(dir);
		doc.setXMLEncoding("utf-8");
		String xml = doc.asXML();
		System.out.println(xml);
		resp.setContentType("text/xml;charset=utf-8");
		resp.getOutputStream().print(xml);
	}

}
