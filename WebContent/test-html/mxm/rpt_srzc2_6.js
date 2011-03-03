/**
 * 
 */
 
 function initBody(){
 	var northPanel = $("<div></div>").appendTo($(document.body));
 	northPanel.addClass("outter-center");
 	var centerPanel = $("<div></div>").appendTo($(document.body));
 	centerPanel.addClass("ui-layout-center");
 	var westPanel = $("<div></div>").appendTo($(document.body));
 	westPanel.addClass("ui-layout-west");
 	var eastPanel = $("<div></div>").appendTo($(document.body));
 	eastPanel.addClass("ui-layout-east");
 	$("body").layout({
 		north__paneSelector:'.outter-center',
		north__size:100,
		south__size:0
 	});
 	spiltPanel(northPanel,{north:30,west:50});
 }
 
 function spiltPanel(obj,sizes){
 	if(!obj) return;
 	obj.addClass("outter-center");
 	sizes = sizes || {
 		north:100,
 		center:100
 	};
 	var arr = {};
 	$.each(sizes,function(key,value){
 		arr[key] = $("<div></div>").appendTo($(obj)).addClass("ui-layout-"+key);
 	});
 	 var config = {applyDefaultStyles: true};
 	 $.each(arr,function(key,value){
 	 	config[key+"__size"] = sizes[key];
 	 })
 	
 	obj.layout(config);
 }