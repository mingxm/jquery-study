package com.jquery.xh;

import java.io.File;
import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.dom4j.Document;
import org.dom4j.DocumentFactory;
import org.dom4j.Element;

public class AjaxTestAction implements Servlet{

	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	public ServletConfig getServletConfig() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getServletInfo() {
		// TODO Auto-generated method stub
		return null;
	}

	public void init(ServletConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

	public void service(ServletRequest req, ServletResponse resp)
			throws ServletException, IOException {
		String dir = "D:/esendev/study/jquery-study/WebContent/"; //html文件所在的路径。
		
		Document doc = XhFn.getFileStruct(dir);
		doc.setXMLEncoding("utf-8");
		String xml = doc.asXML();
		System.out.println(xml);
		resp.setContentType("text/xml;charset=utf-8");
		resp.getOutputStream().print(xml);
	}

}
