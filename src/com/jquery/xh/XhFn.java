package com.jquery.xh;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import org.dom4j.Document;
import org.dom4j.DocumentFactory;
import org.dom4j.Element;

public class XhFn {
	/**
	 * 获取目录dir下面的文件结构，是一个树形。返回用xml表示的树形。
	 * @param dir
	 * @return
	 */
	public static Document getFileStruct(String dir){
		File f = new File(dir);
		Document doc = DocumentFactory.getInstance().createDocument();
		
		getFileStruct(doc.addElement("files"), f, dir);
		return doc;
	}
	
	private static void getFileStruct(Element dirE, File dir, String rootdir){
		if(!dir.isDirectory()) return;
		File[] fs = dir.listFiles();
		for (int i = 0; i < fs.length; i++) {
			Element e;
			if(fs[i].isDirectory()){
				e = dirE.addElement("fold");
				e.addAttribute("name", fs[i].getName());
			}else{
				String path = fs[i].getPath();
				if(!path.endsWith(".js") && !path.endsWith(".css") && !path.endsWith(".html")) continue;
				
				e = dirE.addElement("file");
				
				path = path.substring(rootdir.length());
				path = path.replaceAll("\\\\", "/");
				e.addAttribute("name", path);
				
				if(path.endsWith(".html")){
					String title = getHtmlTitle(fs[i]);
					e.addAttribute("title", title);
				}
			}
			
			getFileStruct(e, fs[i], rootdir);
		}
	}
	
	/**
	 * 获取html文件的title
	 * @param f
	 * @return
	 */
	private static String getHtmlTitle(File f){
		try{
			FileReader is = new FileReader(f);
			BufferedReader bf = new BufferedReader(is, 1024*1024);
			try{
				String line;
				while((line = bf.readLine())!=null){
					int i = line.indexOf("<title>");
					int j = line.indexOf("</title>");
					if(i!=-1 && j!=-1){
						return line.substring(i+7, j);
					}
				}
				return "";
			}finally{
				bf.close();
			}
		}catch(Exception e){
			e.printStackTrace();
			return "";
		}
	}
}
