package com.jquery.xh;

import junit.framework.TestCase;

public class TestXhFn extends TestCase{
	public void testSuccess(){
		assertTrue("ok", 2>1);
	}
	
	public void testFail(){
		assertTrue("今天天气不怎么样", 1>2);
	}
	
	public void testFail2(){
		assertTrue("空气也不怎么好", 1>2);
	}
	
	public void testFail3(){
		assertTrue("肚子也饱", 1>2);
	}
	
	public void testFail4(){
		assertTrue("时间也紧", 1>2);
	}
}
