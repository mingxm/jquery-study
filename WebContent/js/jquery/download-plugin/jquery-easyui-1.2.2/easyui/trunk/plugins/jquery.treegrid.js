/**
 * jQuery EasyUI 1.2.3
 * 
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2010 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($){
function _1(_2){
var _3=$.data(_2,"treegrid").options;
$(_2).datagrid($.extend({},_3,{url:null,onLoadSuccess:function(){
},onResizeColumn:function(_4,_5){
_e(_2);
_3.onResizeColumn.call(_2,_4,_5);
},onBeforeEdit:function(_6,_7){
if(_3.onBeforeEdit.call(_2,_7)==false){
return false;
}
},onAfterEdit:function(_8,_9,_a){
_d(_2);
_3.onAfterEdit.call(_2,_9,_a);
},onCancelEdit:function(_b,_c){
_d(_2);
_3.onCancelEdit.call(_2,_c);
}}));
};
function _e(_f,_10){
var _11=$.data(_f,"datagrid").options;
var _12=$.data(_f,"datagrid").panel;
var _13=_12.children("div.datagrid-view");
var _14=_13.children("div.datagrid-view1");
var _15=_13.children("div.datagrid-view2");
if(_11.rownumbers||(_11.frozenColumns&&_11.frozenColumns.length>0)){
if(_10){
_16(_10);
_15.find("tr[node-id="+_10+"]").next("tr.treegrid-tr-tree").find("tr[node-id]").each(function(){
_16($(this).attr("node-id"));
});
}else{
_15.find("tr[node-id]").each(function(){
_16($(this).attr("node-id"));
});
if(_11.showFooter){
var _17=$.data(_f,"datagrid").footer||[];
for(var i=0;i<_17.length;i++){
_16(_17[i][_11.idField]);
}
$(_f).datagrid("resize");
}
}
}
if(_11.height=="auto"){
var _18=_14.children("div.datagrid-body");
var _19=_15.children("div.datagrid-body");
var _1a=0;
var _1b=0;
_19.children().each(function(){
var c=$(this);
if(c.is(":visible")){
_1a+=c.outerHeight();
if(_1b<c.outerWidth()){
_1b=c.outerWidth();
}
}
});
if(_1b>_19.width()){
_1a+=18;
}
_18.height(_1a);
_19.height(_1a);
_13.height(_15.height());
}
_15.children("div.datagrid-body").triggerHandler("scroll");
function _16(_1c){
var tr1=_14.find("tr[node-id="+_1c+"]");
var tr2=_15.find("tr[node-id="+_1c+"]");
tr1.css("height","");
tr2.css("height","");
var _1d=Math.max(tr1.height(),tr2.height());
tr1.css("height",_1d);
tr2.css("height",_1d);
};
};
function _1e(_1f){
var _20=$.data(_1f,"treegrid").options;
if(!_20.rownumbers){
return;
}
$(_1f).datagrid("getPanel").find("div.datagrid-view1 div.datagrid-body div.datagrid-cell-rownumber").each(function(i){
$(this).html(i+1);
});
};
function _d(_21){
var _22=$.data(_21,"treegrid").options;
var _23=$(_21).datagrid("getPanel");
var _24=_23.find("div.datagrid-body");
_24.find("span.tree-hit").unbind(".treegrid").bind("click.treegrid",function(){
var tr=$(this).parent().parent().parent();
var id=tr.attr("node-id");
_8b(_21,id);
return false;
}).bind("mouseenter.treegrid",function(){
if($(this).hasClass("tree-expanded")){
$(this).addClass("tree-expanded-hover");
}else{
$(this).addClass("tree-collapsed-hover");
}
}).bind("mouseleave.treegrid",function(){
if($(this).hasClass("tree-expanded")){
$(this).removeClass("tree-expanded-hover");
}else{
$(this).removeClass("tree-collapsed-hover");
}
});
_24.find("tr[node-id]").unbind(".treegrid").bind("mouseenter.treegrid",function(){
var id=$(this).attr("node-id");
_24.find("tr[node-id="+id+"]").addClass("datagrid-row-over");
}).bind("mouseleave.treegrid",function(){
var id=$(this).attr("node-id");
_24.find("tr[node-id="+id+"]").removeClass("datagrid-row-over");
}).bind("click.treegrid",function(){
var id=$(this).attr("node-id");
if(_22.singleSelect){
_27(_21);
_75(_21,id);
}else{
if($(this).hasClass("datagrid-row-selected")){
_79(_21,id);
}else{
_75(_21,id);
}
}
_22.onClickRow.call(_21,_3e(_21,id));
}).bind("dblclick.treegrid",function(){
var id=$(this).attr("node-id");
_22.onDblClickRow.call(_21,_3e(_21,id));
}).bind("contextmenu.treegrid",function(e){
var id=$(this).attr("node-id");
_22.onContextMenu.call(_21,e,_3e(_21,id));
});
_24.find("div.datagrid-cell-check input[type=checkbox]").unbind(".treegrid").bind("click.treegrid",function(e){
var id=$(this).parent().parent().parent().attr("node-id");
if(_22.singleSelect){
_27(_21);
_75(_21,id);
}else{
if($(this).attr("checked")){
_75(_21,id);
}else{
_79(_21,id);
}
}
e.stopPropagation();
});
var _25=_23.find("div.datagrid-header");
_25.find("input[type=checkbox]").unbind().bind("click.treegrid",function(){
if(_22.singleSelect){
return false;
}
if($(this).attr("checked")){
_26(_21);
}else{
_27(_21);
}
});
};
function _28(_29,_2a){
var _2b=$.data(_29,"treegrid").options;
var _2c=$(_29).datagrid("getPanel").children("div.datagrid-view");
var _2d=_2c.children("div.datagrid-view1");
var _2e=_2c.children("div.datagrid-view2");
var tr1=_2d.children("div.datagrid-body").find("tr[node-id="+_2a+"]");
var tr2=_2e.children("div.datagrid-body").find("tr[node-id="+_2a+"]");
var _2f=$(_29).datagrid("getColumnFields",true).length+(_2b.rownumbers?1:0);
var _30=$(_29).datagrid("getColumnFields",false).length;
_31(tr1,_2f);
_31(tr2,_30);
function _31(tr,_32){
$("<tr class=\"treegrid-tr-tree\">"+"<td style=\"border:0px\" colspan=\""+_32+"\">"+"<div></div>"+"</td>"+"</tr>").insertAfter(tr);
};
};
function _33(_34,_35,_36,_37){
var _38=$.data(_34,"treegrid").options;
var _39=$.data(_34,"datagrid").panel;
var _3a=_39.children("div.datagrid-view");
var _3b=_3a.children("div.datagrid-view1");
var _3c=_3a.children("div.datagrid-view2");
var _3d=_3e(_34,_35);
if(_3d){
var _3f=_3b.children("div.datagrid-body").find("tr[node-id="+_35+"]");
var _40=_3c.children("div.datagrid-body").find("tr[node-id="+_35+"]");
var cc1=_3f.next("tr.treegrid-tr-tree").children("td").children("div");
var cc2=_40.next("tr.treegrid-tr-tree").children("td").children("div");
}else{
var cc1=_3b.children("div.datagrid-body").children("div.datagrid-body-inner");
var cc2=_3c.children("div.datagrid-body");
}
if(!_37){
$.data(_34,"treegrid").data=[];
cc1.empty();
cc2.empty();
}
if(_38.view.onBeforeRender){
_38.view.onBeforeRender.call(_38.view,_34,_35,_36);
}
_38.view.render.call(_38.view,_34,cc1,true);
_38.view.render.call(_38.view,_34,cc2,false);
if(_38.showFooter){
_38.view.renderFooter.call(_38.view,_34,_3b.find("div.datagrid-footer-inner"),true);
_38.view.renderFooter.call(_38.view,_34,_3c.find("div.datagrid-footer-inner"),false);
}
if(_38.view.onAfterRender){
_38.view.onAfterRender.call(_38.view,_34);
}
_38.onLoadSuccess.call(_34,_3d,_36);
_e(_34);
_1e(_34);
_41();
_d(_34);
function _41(){
var _42=_3a.find("div.datagrid-header");
var _43=_3a.find("div.datagrid-body");
var _44=_42.find("div.datagrid-header-check");
if(_44.length){
var ck=_43.find("div.datagrid-cell-check");
if($.boxModel){
ck.width(_44.width());
ck.height(_44.height());
}else{
ck.width(_44.outerWidth());
ck.height(_44.outerHeight());
}
}
};
};
function _45(_46,_47,_48,_49,_4a){
var _4b=$.data(_46,"treegrid").options;
var _4c=$(_46).datagrid("getPanel").find("div.datagrid-body");
if(_48){
_4b.queryParams=_48;
}
var _4d=$.extend({},_4b.queryParams);
var row=_3e(_46,_47);
if(_4b.onBeforeLoad.call(_46,row,_4d)==false){
return;
}
if(!_4b.url){
return;
}
var _4e=_4c.find("tr[node-id="+_47+"] span.tree-folder");
_4e.addClass("tree-loading");
$.ajax({type:_4b.method,url:_4b.url,data:_4d,dataType:"json",success:function(_4f){
_4e.removeClass("tree-loading");
_33(_46,_47,_4f,_49);
if(_4a){
_4a();
}
},error:function(){
_4e.removeClass("tree-loading");
_4b.onLoadError.apply(_46,arguments);
if(_4a){
_4a();
}
}});
};
function _50(_51){
var _52=_53(_51);
if(_52.length){
return _52[0];
}else{
return null;
}
};
function _53(_54){
return $.data(_54,"treegrid").data;
};
function _55(_56,_57){
var row=_3e(_56,_57);
if(row._parentId){
return _3e(_56,row._parentId);
}else{
return null;
}
};
function _58(_59,_5a){
var _5b=$.data(_59,"treegrid").options;
var _5c=$(_59).datagrid("getPanel").find("div.datagrid-view2 div.datagrid-body");
var _5d=[];
if(_5a){
_5e(_5a);
}else{
var _5f=_53(_59);
for(var i=0;i<_5f.length;i++){
_5d.push(_5f[i]);
_5e(_5f[i][_5b.idField]);
}
}
function _5e(_60){
var _61=_3e(_59,_60);
if(_61&&_61.children){
for(var i=0,len=_61.children.length;i<len;i++){
var _62=_61.children[i];
_5d.push(_62);
_5e(_62[_5b.idField]);
}
}
};
return _5d;
};
function _63(_64){
var _65=_66(_64);
if(_65.length){
return _65[0];
}else{
return null;
}
};
function _66(_67){
var _68=[];
var _69=$(_67).datagrid("getPanel");
_69.find("div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected").each(function(){
var id=$(this).attr("node-id");
_68.push(_3e(_67,id));
});
return _68;
};
function _6a(_6b,_6c){
if(!_6c){
return 0;
}
var _6d=$.data(_6b,"treegrid").options;
var _6e=$(_6b).datagrid("getPanel").children("div.datagrid-view");
var _6f=_6e.find("div.datagrid-body tr[node-id="+_6c+"]").children("td[field="+_6d.treeField+"]");
return _6f.find("span.tree-indent,span.tree-hit").length;
};
function _3e(_70,_71){
var _72=$.data(_70,"treegrid").options;
var _73=$.data(_70,"treegrid").data;
var cc=[_73];
while(cc.length){
var c=cc.shift();
for(var i=0;i<c.length;i++){
var _74=c[i];
if(_74[_72.idField]==_71){
return _74;
}else{
if(_74["children"]){
cc.push(_74["children"]);
}
}
}
}
return null;
};
function _75(_76,_77){
var _78=$(_76).datagrid("getPanel").find("div.datagrid-body");
var tr=_78.find("tr[node-id="+_77+"]");
tr.addClass("datagrid-row-selected");
tr.find("div.datagrid-cell-check input[type=checkbox]").attr("checked",true);
};
function _79(_7a,_7b){
var _7c=$(_7a).datagrid("getPanel").find("div.datagrid-body");
var tr=_7c.find("tr[node-id="+_7b+"]");
tr.removeClass("datagrid-row-selected");
tr.find("div.datagrid-cell-check input[type=checkbox]").attr("checked",false);
};
function _26(_7d){
var tr=$(_7d).datagrid("getPanel").find("div.datagrid-body tr[node-id]");
tr.addClass("datagrid-row-selected");
tr.find("div.datagrid-cell-check input[type=checkbox]").attr("checked",true);
};
function _27(_7e){
var tr=$(_7e).datagrid("getPanel").find("div.datagrid-body tr[node-id]");
tr.removeClass("datagrid-row-selected");
tr.find("div.datagrid-cell-check input[type=checkbox]").attr("checked",false);
};
function _7f(_80,_81){
var _82=$.data(_80,"treegrid").options;
var _83=$(_80).datagrid("getPanel").find("div.datagrid-body");
var row=_3e(_80,_81);
var tr=_83.find("tr[node-id="+_81+"]");
var hit=tr.find("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
if(_82.onBeforeCollapse.call(_80,row)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
row.state="closed";
tr=tr.next("tr.treegrid-tr-tree");
var cc=tr.children("td").children("div");
if(_82.animate){
cc.slideUp("normal",function(){
_e(_80,_81);
_82.onCollapse.call(_80,row);
});
}else{
cc.hide();
_e(_80,_81);
_82.onCollapse.call(_80,row);
}
};
function _84(_85,_86){
var _87=$.data(_85,"treegrid").options;
var _88=$(_85).datagrid("getPanel").find("div.datagrid-body");
var tr=_88.find("tr[node-id="+_86+"]");
var hit=tr.find("span.tree-hit");
var row=_3e(_85,_86);
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
if(_87.onBeforeExpand.call(_85,row)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var _89=tr.next("tr.treegrid-tr-tree");
if(_89.length){
var cc=_89.children("td").children("div");
_8a(cc);
}else{
_28(_85,row[_87.idField]);
var _89=tr.next("tr.treegrid-tr-tree");
var cc=_89.children("td").children("div");
cc.hide();
_45(_85,row[_87.idField],{id:row[_87.idField]},true,function(){
_8a(cc);
});
}
function _8a(cc){
row.state="open";
if(_87.animate){
cc.slideDown("normal",function(){
_e(_85,_86);
_87.onExpand.call(_85,row);
});
}else{
cc.show();
_e(_85,_86);
_87.onExpand.call(_85,row);
}
};
};
function _8b(_8c,_8d){
var _8e=$(_8c).datagrid("getPanel").find("div.datagrid-body");
var tr=_8e.find("tr[node-id="+_8d+"]");
var hit=tr.find("span.tree-hit");
if(hit.hasClass("tree-expanded")){
_7f(_8c,_8d);
}else{
_84(_8c,_8d);
}
};
function _8f(_90,_91){
var _92=$.data(_90,"treegrid").options;
var _93=_58(_90,_91);
if(_91){
_93.unshift(_3e(_90,_91));
}
for(var i=0;i<_93.length;i++){
_7f(_90,_93[i][_92.idField]);
}
};
function _94(_95,_96){
var _97=$.data(_95,"treegrid").options;
var _98=_58(_95,_96);
if(_96){
_98.unshift(_3e(_95,_96));
}
for(var i=0;i<_98.length;i++){
_84(_95,_98[i][_97.idField]);
}
};
function _99(_9a,_9b){
var _9c=$.data(_9a,"treegrid").options;
var ids=[];
var p=_55(_9a,_9b);
while(p){
var id=p[_9c.idField];
ids.unshift(id);
p=_55(_9a,id);
}
for(var i=0;i<ids.length;i++){
_84(_9a,ids[i]);
}
};
function _9d(_9e,_9f){
var _a0=$.data(_9e,"treegrid").options;
if(_9f.parent){
var _a1=$(_9e).datagrid("getPanel").find("div.datagrid-body");
var tr=_a1.find("tr[node-id="+_9f.parent+"]");
if(tr.next("tr.treegrid-tr-tree").length==0){
_28(_9e,_9f.parent);
}
var _a2=tr.children("td[field="+_a0.treeField+"]").children("div.datagrid-cell");
var _a3=_a2.children("span.tree-icon");
if(_a3.hasClass("tree-file")){
_a3.removeClass("tree-file").addClass("tree-folder");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_a3);
if(hit.prev().length){
hit.prev().remove();
}
}
}
_33(_9e,_9f.parent,_9f.data,true);
};
function _a4(_a5,_a6){
var _a7=$.data(_a5,"treegrid").options;
var _a8=$(_a5).datagrid("getPanel").find("div.datagrid-body");
var tr=_a8.find("tr[node-id="+_a6+"]");
tr.next("tr.treegrid-tr-tree").remove();
tr.remove();
var _a9=del(_a6);
if(_a9){
if(_a9.children.length==0){
tr=_a8.find("tr[node-id="+_a9[_a7.treeField]+"]");
var _aa=tr.children("td[field="+_a7.treeField+"]").children("div.datagrid-cell");
_aa.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
_aa.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(_aa);
}
}
_1e(_a5);
function del(id){
var cc;
var _ab=_55(_a5,_a6);
if(_ab){
cc=_ab.children;
}else{
cc=$(_a5).treegrid("getData");
}
for(var i=0;i<cc.length;i++){
if(cc[i][_a7.treeField]==id){
cc.splice(i,1);
break;
}
}
return _ab;
};
};
$.fn.treegrid=function(_ac,_ad){
if(typeof _ac=="string"){
return $.fn.treegrid.methods[_ac](this,_ad);
}
_ac=_ac||{};
return this.each(function(){
var _ae=$.data(this,"treegrid");
if(_ae){
$.extend(_ae.options,_ac);
}else{
$.data(this,"treegrid",{options:$.extend({},$.fn.treegrid.defaults,$.fn.treegrid.parseOptions(this),_ac),data:[]});
}
_1(this);
_45(this);
});
};
$.fn.treegrid.methods={options:function(jq){
return $.data(jq[0],"treegrid").options;
},resize:function(jq,_af){
return jq.each(function(){
$(this).datagrid("resize",_af);
});
},fixRowHeight:function(jq,_b0){
return jq.each(function(){
_e(this,_b0);
});
},loadData:function(jq,_b1){
return jq.each(function(){
_33(this,null,_b1);
});
},reload:function(jq,id){
return jq.each(function(){
if(id){
var _b2=$(this).treegrid("find",id);
if(_b2.children){
_b2.children.splice(0,_b2.children.length);
}
var _b3=$(this).datagrid("getPanel").find("div.datagrid-body");
var tr=_b3.find("tr[node-id="+id+"]");
tr.next("tr.treegrid-tr-tree").remove();
var hit=tr.find("span.tree-hit");
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
_84(this,id);
}else{
_45(this);
}
});
},reloadFooter:function(jq,_b4){
return jq.each(function(){
var _b5=$.data(this,"treegrid").options;
var _b6=$(this).datagrid("getPanel").children("div.datagrid-view");
var _b7=_b6.children("div.datagrid-view1");
var _b8=_b6.children("div.datagrid-view2");
if(_b4){
$.data(this,"treegrid").footer=_b4;
}
if(_b5.showFooter){
_b5.view.renderFooter.call(_b5.view,this,_b7.find("div.datagrid-footer-inner"),true);
_b5.view.renderFooter.call(_b5.view,this,_b8.find("div.datagrid-footer-inner"),false);
if(_b5.view.onAfterRender){
_b5.view.onAfterRender.call(_b5.view,this);
}
$(this).treegrid("fixRowHeight");
}
});
},getData:function(jq){
return $.data(jq[0],"treegrid").data;
},getFooterRows:function(jq){
return $.data(jq[0],"treegrid").footer;
},getRoot:function(jq){
return _50(jq[0]);
},getRoots:function(jq){
return _53(jq[0]);
},getParent:function(jq,id){
return _55(jq[0],id);
},getChildren:function(jq,id){
return _58(jq[0],id);
},getSelected:function(jq){
return _63(jq[0]);
},getSelections:function(jq){
return _66(jq[0]);
},getLevel:function(jq,id){
return _6a(jq[0],id);
},find:function(jq,id){
return _3e(jq[0],id);
},select:function(jq,id){
return jq.each(function(){
_75(this,id);
});
},unselect:function(jq,id){
return jq.each(function(){
_79(this,id);
});
},selectAll:function(jq){
return jq.each(function(){
_26(this);
});
},unselectAll:function(jq){
return jq.each(function(){
_27(this);
});
},collapse:function(jq,id){
return jq.each(function(){
_7f(this,id);
});
},expand:function(jq,id){
return jq.each(function(){
_84(this,id);
});
},toggle:function(jq,id){
return jq.each(function(){
_8b(this,id);
});
},collapseAll:function(jq,id){
return jq.each(function(){
_8f(this,id);
});
},expandAll:function(jq,id){
return jq.each(function(){
_94(this,id);
});
},expandTo:function(jq,id){
return jq.each(function(){
_99(this,id);
});
},append:function(jq,_b9){
return jq.each(function(){
_9d(this,_b9);
});
},remove:function(jq,id){
return jq.each(function(){
_a4(this,id);
});
},refresh:function(jq,id){
return jq.each(function(){
var _ba=$.data(this,"treegrid").options;
_ba.view.refreshRow.call(_ba.view,this,id);
});
},beginEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("beginEdit",id);
$(this).treegrid("fixRowHeight",id);
});
},endEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("endEdit",id);
});
},cancelEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("cancelEdit",id);
});
}};
$.fn.treegrid.parseOptions=function(_bb){
var t=$(_bb);
return $.extend({},$.fn.datagrid.parseOptions(_bb),{treeField:t.attr("treeField"),animate:(t.attr("animate")?t.attr("animate")=="true":undefined)});
};
var _bc=$.extend({},$.fn.datagrid.defaults.view,{render:function(_bd,_be,_bf){
var _c0=$.data(_bd,"treegrid").options;
var _c1=$(_bd).datagrid("getColumnFields",_bf);
var _c2=this;
var _c3=_c4(_bf,this.treeLevel,this.treeNodes);
$(_be).append(_c3.join(""));
function _c4(_c5,_c6,_c7){
var _c8=["<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_c7.length;i++){
var row=_c7[i];
if(row.state!="open"&&row.state!="closed"){
row.state="open";
}
var _c9=_c0.rowStyler?_c0.rowStyler.call(_bd,row):"";
var _ca=_c9?"style=\""+_c9+"\"":"";
_c8.push("<tr node-id="+row[_c0.idField]+" "+_ca+">");
_c8=_c8.concat(_c2.renderRow.call(_c2,_bd,_c1,_c5,_c6,row));
_c8.push("</tr>");
if(row.children&&row.children.length){
var tt=_c4(_c5,_c6+1,row.children);
var v=row.state=="closed"?"none":"block";
_c8.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan="+(_c1.length+(_c0.rownumbers?1:0))+"><div style=\"display:"+v+"\">");
_c8=_c8.concat(tt);
_c8.push("</div></td></tr>");
}
}
_c8.push("</tbody></table>");
return _c8;
};
},renderFooter:function(_cb,_cc,_cd){
var _ce=$.data(_cb,"treegrid").options;
var _cf=$.data(_cb,"treegrid").footer||[];
var _d0=$(_cb).datagrid("getColumnFields",_cd);
var _d1=["<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_cf.length;i++){
var row=_cf[i];
row[_ce.idField]=row[_ce.idField]||("foot-row-id"+i);
_d1.push("<tr node-id="+row[_ce.idField]+">");
_d1.push(this.renderRow.call(this,_cb,_d0,_cd,0,row));
_d1.push("</tr>");
}
_d1.push("</tbody></table>");
$(_cc).html(_d1.join(""));
},renderRow:function(_d2,_d3,_d4,_d5,row){
var _d6=$.data(_d2,"treegrid").options;
var cc=[];
if(_d4&&_d6.rownumbers){
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
}
for(var i=0;i<_d3.length;i++){
var _d7=_d3[i];
var col=$(_d2).datagrid("getColumnOption",_d7);
if(col){
var _d8=col.styler?(col.styler(row[_d7],row)||""):"";
var _d9=col.hidden?"style=\"display:none;"+_d8+"\"":(_d8?"style=\""+_d8+"\"":"");
cc.push("<td field=\""+_d7+"\" "+_d9+">");
var _d9="width:"+(col.boxWidth)+"px;";
_d9+="text-align:"+(col.align||"left")+";";
_d9+=_d6.nowrap==false?"white-space:normal;":"";
cc.push("<div style=\""+_d9+"\" ");
if(col.checkbox){
cc.push("class=\"datagrid-cell-check ");
}else{
cc.push("class=\"datagrid-cell ");
}
cc.push("\">");
if(col.checkbox){
if(row.checked){
cc.push("<input type=\"checkbox\" checked=\"checked\"/>");
}else{
cc.push("<input type=\"checkbox\"/>");
}
}else{
var val=null;
if(col.formatter){
val=col.formatter(row[_d7],row);
}else{
val=row[_d7]||"&nbsp;";
}
if(_d7==_d6.treeField){
for(var j=0;j<_d5;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
if(row.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
if(row.children&&row.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(row.iconCls?row.iconCls:"")+"\"></span>");
}
}
cc.push("<span class=\"tree-title\">"+val+"</span>");
}else{
cc.push(val);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},refreshRow:function(_da,id){
var row=$(_da).treegrid("find",id);
var _db=$.data(_da,"treegrid").options;
var _dc=$(_da).datagrid("getPanel").find("div.datagrid-body");
var _dd=_db.rowStyler?_db.rowStyler.call(_da,row):"";
var _de=_dd?"style=\""+_dd+"\"":"";
var tr=_dc.find("tr[node-id="+id+"]");
tr.attr("style",_de);
tr.children("td").each(function(){
var _df=$(this).find("div.datagrid-cell");
var _e0=$(this).attr("field");
var col=$(_da).datagrid("getColumnOption",_e0);
if(col){
var _e1=col.styler?(col.styler(row[_e0],row)||""):"";
var _e2=col.hidden?"style=\"display:none;"+_e1+"\"":(_e1?"style=\""+_e1+"\"":"");
$(this).attr("style",_e2);
var val=null;
if(col.formatter){
val=col.formatter(row[_e0],row);
}else{
val=row[_e0]||"&nbsp;";
}
if(_e0==_db.treeField){
_df.children("span.tree-title").html(val);
var cls="tree-icon";
var _e3=_df.children("span.tree-icon");
if(_e3.hasClass("tree-folder")){
cls+=" tree-folder";
}
if(_e3.hasClass("tree-folder-open")){
cls+=" tree-folder-open";
}
if(_e3.hasClass("tree-file")){
cls+=" tree-file";
}
if(row.iconCls){
cls+=" "+row.iconCls;
}
_e3.attr("class",cls);
}else{
_df.html(val);
}
}
});
$(_da).treegrid("fixRowHeight",id);
},onBeforeRender:function(_e4,_e5,_e6){
var _e7=$.data(_e4,"treegrid").options;
if(_e6.length==undefined){
if(_e6.footer){
$.data(_e4,"treegrid").footer=_e6.footer;
}
_e6=this.transfer(_e4,_e5,_e6.rows);
}else{
function _e8(_e9,_ea){
for(var i=0;i<_e9.length;i++){
var row=_e9[i];
row._parentId=_ea;
if(row.children&&row.children.length){
_e8(row.children,row[_e7.idField]);
}
}
};
_e8(_e6,_e5);
}
var _eb=_3e(_e4,_e5);
if(_eb){
if(_eb.children){
_eb.children=_eb.children.concat(_e6);
}else{
_eb.children=_e6;
}
}else{
$.data(_e4,"treegrid").data=$.data(_e4,"treegrid").data.concat(_e6);
}
this.treeNodes=_e6;
this.treeLevel=$(_e4).treegrid("getLevel",_e5);
},transfer:function(_ec,_ed,_ee){
var _ef=$.data(_ec,"treegrid").options;
var _f0=[];
for(var i=0;i<_ee.length;i++){
_f0.push(_ee[i]);
}
var _f1=[];
for(var i=0;i<_f0.length;i++){
var row=_f0[i];
if(!_ed){
if(!row._parentId){
_f1.push(row);
_f0.remove(row);
i--;
}
}else{
if(row._parentId==_ed){
_f1.push(row);
_f0.remove(row);
i--;
}
}
}
var _f2=[];
for(var i=0;i<_f1.length;i++){
_f2.push(_f1[i]);
}
while(_f2.length){
var _f3=_f2.shift();
for(var i=0;i<_f0.length;i++){
var row=_f0[i];
if(row._parentId==_f3[_ef.idField]){
if(_f3.children){
_f3.children.push(row);
}else{
_f3.children=[row];
}
_f2.push(row);
_f0.remove(row);
i--;
}
}
}
return _f1;
}});
$.fn.treegrid.defaults=$.extend({},$.fn.datagrid.defaults,{treeField:null,animate:false,singleSelect:true,view:_bc,editConfig:{getTr:function(_f4,id){
return $(_f4).datagrid("getPanel").find("div.datagrid-body tr[node-id="+id+"]");
},getRow:function(_f5,id){
return $(_f5).treegrid("find",id);
}},onBeforeLoad:function(row,_f6){
},onLoadSuccess:function(row,_f7){
},onLoadError:function(){
},onBeforeCollapse:function(row){
},onCollapse:function(row){
},onBeforeExpand:function(row){
},onExpand:function(row){
},onClickRow:function(row){
},onDblClickRow:function(row){
},onContextMenu:function(e,row){
},onBeforeEdit:function(row){
},onAfterEdit:function(row,_f8){
},onCancelEdit:function(row){
}});
})(jQuery);

