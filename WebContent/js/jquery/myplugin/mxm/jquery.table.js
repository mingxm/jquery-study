/**
 * 
 */

(function($) {
	$.succezBI = $.succezBI || {};
	$.succezBI.jTable = function(setting) {
		var defaultSetting = {
			rowCount			   : 10,
			colCount			   : 10,
			defaultRowHeight	: 24,
			defaultColWidth		: 72,
			renderTo			   : $(document.body)
		}
		
		this.cellsStateArray = [];
 		this.selectSection = false;
		
		this.selectDom = $("<div/>").addClass("rubbered");
 		this.selectPanel = $("<div/>").addClass("selected");
		this.config = $.extend({}, defaultSetting, setting);
		this.init();
		this.initEvent();
	}

	$.succezBI.jTable.prototype.init = function() {
		var totalWidth = this.config.colCount*this.config.defaultColWidth;
		this.config.renderTo.css("width",totalWidth);
		this.table = $("<table></table>").addClass("mytable").css("width",totalWidth).appendTo(this.config.renderTo);
		var cg = $("<colgroup></colgroup>").appendTo(this.table);
		for (var i = 0; i < 10; i++) {
			var row = $("<tr></tr>").css("height",24).appendTo(this.table);
			var cells = [];
			for (var j = 0; j < 10; j++) {
				$("<td></td>").appendTo(row);
				if (i == 0) {
					$("<tc></tc>").css("width",this.config.defaultColWidth).appendTo(cg);
				}
				cells.push(0);
			}
			this.cellsStateArray.push(cells);
		}
		this.table.attr("frame","border");
		this.table.attr("rules","all");
	};

	/**
	 * 初始化消息处理函数
	 */
	$.succezBI.jTable.prototype.initEvent = function() {
		if (!this.bindMouseDown) {
			this.bindMouseDown = this.doMouseDown.bind(this);
		}
		var editor = this;
		this.config.renderTo.bind("mousedown", this.bindMouseDown);
		this.config.renderTo.bind("contextmenu", this.doRClick.bind(this));
		this.config.renderTo.bind("dblclick", this.doDblClick.bind(this));
	}

	/**
	 * 获取编辑器
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getTextEditor = function() {
		return null;
	}

	/**
	 * 双击事件
	 * @param {} e
	 */
	$.succezBI.jTable.prototype.doDblClick = function(e) {
		if (!this.selectSection || !ptInRect({
			    x	: e.pageX,
			    y	: e.pageY
		    }, this.getRectBySection(this.selectSection))) {
			return;
		}
		var editor = this;
		$(".selected").hide();
		var ed = this.getTextEditor();
		var cell = this.getCellByPos(e.pageX, e.pageY);
		if (cell) {
			this.beginEdit(cell);
		}
	}

	/**
	 * 点击右键菜单
	 * @param {} e
	 */
	$.succezBI.jTable.prototype.doRClick = function(e) {
		if (this.selectSection && ptInRect({
			    x	: e.pageX,
			    y	: e.pageY
		    }, this.getRectBySection(this.selectSection))) {
			e.stopEvent();
			this.contextMenu.showAt(e.getXY());
		}
	}

	/**
	 * 开始编辑
	 * @param {} cell
	 */
	$.succezBI.jTable.prototype.beginEdit = function(cell) {
		this.editCell = cell;
		var editor = this.getTextEditor();
		Ext.get('edit').setLeftTop(cell.offsetLeft, cell.offsetTop);
		editor.setHeight(cell.offsetHeight);
		editor.setWidth(cell.offsetWidth);
		editor.setValue(cell.outerText);
		cell.innerText = "";
		editor.show();
	}

	/**
	 * 结束编辑
	 */
	$.succezBI.jTable.prototype.endEdit = function() {
		if (!this.isEditing())
			return;
		var editor = this.getTextEditor();
		this.editCell.innerText = editor.getValue();
		this.editCell = false;
		editor.reset();
		editor.hide();
	}

	/**
	 * 是否正在编辑表元
	 * @return {}
	 */
	$.succezBI.jTable.prototype.isEditing = function() {
		return !!this.editCell;
	}

	/**
	 * 获取第rowIndex行第colIndex列表元因为之前的合并表元而产生的偏移量。
	 * @param {} colIndex
	 * @param {} rowIndex
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getOffsetCellBeforeColByRowIndex = function(colIndex, rowIndex) {
		var count = 0;
		for (var i = 0; i < colIndex; i++) {
			if (typeof this.cellsStateArray[rowIndex][i] == "object") {
				count++;
			}
		}
		return count;
	}

	/**
	 * 合并或者拆分后刷新整张表，可能需要增加或者删除表元
	 * @param {} fr
	 * @param {} er
	 * @param {} fc
	 * @param {} ec
	 * @param {} isCombin
	 */
	$.succezBI.jTable.prototype.updateTable = function(fr, er, fc, ec, isCombin) {
		this.table.find(">tbody>tr").each(function(i,row){
			if(i<fr){
				return true;
			}else if(i>er){
				return false;
			}
			var count = this.getOffsetCellBeforeColByRowIndex(fc,i);
			for (var j = fc; j <= ec; j++) {
				if (i == fr) {
					if (j == fc) {
						continue;
					}
					else if (isCombin) {
						row.find(">td").eq(fc - count + 1).remove();
					}
					else {
						row.find(">td").eq(j-count).after("<td></td>");
					}
				}
				else {
					if (isCombin) {
						row.find(">td").eq(fc - count).remove();
					}
					else {
						row.find(">td").eq(j-count).after("<td></td>");
					}
				}
			}
		});
	}

	/**
	 * 
	 * @param {} fr
	 * @param {} er
	 * @param {} fc
	 * @param {} ec
	 * @return {Boolean}
	 */
	$.succezBI.jTable.prototype.beforeCombinCell = function(fr, er, fc, ec) {
		var self = this;
		$.each(this.cellsStateArray,function(i,arr){
			if(i<fr){
				return true;;
			}else if(i>er){
				return false;
			}
			$.each(arr,function(j,value){
				if(j<fc){
					return true;;
				}else if(j>ec){
					return false;
				}
				if(value == 1){
					self.splitCell(i,j);
				}else if(typeof value == "object"){
					return false;
				}
			});
		});
	}

	/**
	 * 合并表元
	 */
	$.succezBI.jTable.prototype.combinCell = function() {
		if (!this.selectSection)
			return;
		var self = this;
		with (this.selectSection) {
			if (!this.beforeCombinCell(top, bottom, left, right)) {
				return;
			}
			this.table.find(">tbody>tr").each(function(i,row){
				if(i<top){
					return true;
				}else if(i>bottom){
					return false;
				}
				$.each(self.cellsStateArray[i],function(j,value){
					if(j<left){
						return true;
					}else if(j>right){
						return false;
					}
					if(i == top && j == left){
						self.cellsStateArray[i][j] = 1;
					}else {
						self.cellsStateArray[i][j] = [top - i, left - j];
					}
				});
			});
			var cell = this.getCell(top, left);
			cell.attr("rowSpan",bottom - top + 1);
			cell.attr("colSpan",right - left + 1);
			this.updateTable(top, bottom, left, right, true);
		}
	}

	/**
	 * 拆分合并表元
	 * @param {} r
	 * @param {} c
	 */
	$.succezBI.jTable.prototype.splitCell = function(r, c) {
		var cell = this.getCell(r, c);
		var rs = cell.attr("rowSpan");
		var cs = cell.attr("colSpan");
		if (rs == 1 && cs == 1) {
			return;
		}
		for (var i = r; i < rs + r; i++) {
			var row = this.table.rows[i];
			for (var j = c; j < cs + c; j++) {
				this.cellsStateArray[i][j] = 0;
			}
		}
		cell.attr("rowSpan",1);
		cell.attr("colSpan",1);
		this.updateTable(r, r + rs - 1, c, c + cs - 1, false);
	}

	/**
	 * 是否是合并表元
	 * @param {} i
	 * @param {} j
	 * @return {}
	 */
	$.succezBI.jTable.prototype.isCombinCell = function(i, j) {
		return this.cellsStateArray[i][j] != 0;
	}

	/**
	 * 是否是合并表元的主表元
	 * @param {} i
	 * @param {} j
	 * @return {}
	 */
	$.succezBI.jTable.prototype.isMainCell = function(i, j) {
		return this.cellsStateArray[i][j] == 1;
	}

	/**
	 * 根据行列行获取表元对象，由于合并表元而导致的偏移量此处会自动处理
	 * @param {} rowIndex
	 * @param {} colIndex
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getCell = function(rowIndex, colIndex) {
		if (!this.isCombinCell(rowIndex, colIndex) || this.isMainCell(rowIndex, colIndex)) {
			return this.table.find(">tbody>tr").eq(rowIndex).find(">td")
					.eq(colIndex - this.getOffsetCellBeforeColByRowIndex(colIndex, rowIndex));
		}
		else {
			var offXY = this.cellsStateArray[rowIndex][colIndex];
			var i = rowIndex + offXY[0];
			var j = colIndex + offXY[1];
			return this.table.find(">tbody>tr").eq(i).find(">td").eq(j - this.getOffsetCellBeforeColByRowIndex(j, i));
		}
	}

	/**
	 * 根据坐标位置获取表元
	 * @param {} x
	 * @param {} y
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getCellByPos = function(x, y) {
		var row = this.getRowIndexByPosition(y);
		var col = this.getColIndexByPosition(x);
		return this.getCell(row, col);
	}

	/**
	 * 增删行列后如果遇到合并表元需要刷新表元状态数组cellsStateArray中记录的偏移量
	 * @param {} fr 开始行
	 * @param {} fc 开始列
	 * @param {} er 结束行
	 * @param {} ec 结束列
	 * @param {} count 增删的行列总数
	 * @param {} isRow 是否行
	 */
	$.succezBI.jTable.prototype.updateCellStateByAddOrDelete = function(fr, fc, er, ec, count, isRow) {
		for (var i = fr; i < er; i++) {
			for (var j = fc; j < ec; j++) {
				if (this.cellsStateArray[i][j] == 1) {
					continue;
				}
				if (isRow) {
					this.cellsStateArray[i][j][0] += count;
				}
				else {
					this.cellsStateArray[i][j][1] += count;
				}
			}
		}
	}

	/**
	 * 添加行
	 * @param {} index 增加行的起始行号
	 * @param {} count 增加行的总数
	 */
	$.succezBI.jTable.prototype.addRow = function(index, count) {
		var rs = this.cellsStateArray[index];
		var row = this.table.find(">tbody>tr").eq(index + 1).after("<tr></tr>").css("height",this.config.defaultRowHeight);
		var cs = [];
		$.each(this.cellsStateArray[index],function(i,value){
			var cell =  this.getCell(index,i);
			var rspan = cell.attr("rowSpan");
			var cspan = cell.attr("colSpan");
			if(value == 0){
				cs.push(0);
				row.find(">td").append("<td></td>");
			}else if(value == 1){
				if (rspan > 1) {
					cell.attr("rowSpan",rspan+1);
					this.updateCellStateByAddOrDelete(index + 1, i, index + rspan, i + cspan, 0 - count, true);
					cs.push([-1, 0]);
				}
				else {
					row.insertCell(0);
					cs.push(0);
				}
			}else if (typeof rs[i] == "object") {
				if (rs[i][0] == 0) {
					row.insertCell(0);
					cs.push([-1, rs[i][1]]);
				}
				else if (rs[i][1] == 0) {
					cell.rowSpan += 1;
					this.updateCellStateByAddOrDelete(index + 1, i, index + rs[i][0] + cell.rowSpan, i + cell.colSpan, 0 - count, true);
					cs.push([rs[i][0] - 1, 0]);
				}
				else {
					cs.push([rs[i][0] - 1, rs[i][1]]);
				}
			}
		});
		
		
		
		for (var i = 0; i < rs.length; i++) {
			var cell = this.getCell(index, i);
			if (rs[i] == 0) {
				cs.push(0);
				row.insertCell(0);
			}
			else if (rs[i] == 1) {
				if (cell.rowSpan > 1) {
					cell.rowSpan += 1;
					this.updateCellStateByAddOrDelete(index + 1, i, index + cell.rowSpan, i + cell.colSpan, 0 - count, true);
					cs.push([-1, 0]);
				}
				else {
					row.insertCell(0);
					cs.push(0);
				}
			}
			else if (typeof rs[i] == "object") {
				if (rs[i][0] == 0) {
					row.insertCell(0);
					cs.push([-1, rs[i][1]]);
				}
				else if (rs[i][1] == 0) {
					cell.rowSpan += 1;
					this.updateCellStateByAddOrDelete(index + 1, i, index + rs[i][0] + cell.rowSpan, i + cell.colSpan, 0 - count, true);
					cs.push([rs[i][0] - 1, 0]);
				}
				else {
					cs.push([rs[i][0] - 1, rs[i][1]]);
				}
			}
		}
		this.cellsStateArray.splice(index + 1, 0, cs);
	}

	/**
	 * 删除行
	 * @param {} index 需要删除行的起始号 
	 * @param {} count
	 */
	$.succezBI.jTable.prototype.deleteRow = function(index, count) {
		var rs = this.cellsStateArray[index];
		var nr = this.table.rows[index + 1];
		for (var i = 0; i < rs.length; i++) {
			var cell = this.getCell(index, i);
			/**
			 * 当删除行遇到了合并表元的主表元时，并且该合并表元跨越多行，那么就将主表元下面的表元设置为主表元，
			 * 因为会将该行的所有表元都删除，所以合并表元的主表元的rowSpan就会减1,并且该行下面所有属于该合并
			 * 表元的偏移量都需要调整，这就是调用updateCellStateByAddOrDelete的目的
			 */
			if (rs[i] == 1 && cell.rowSpan > 1) {
				var offset = this.getOffsetCellBeforeColByRowIndex(i, index);
				var c = nr.insertCell(i - offset);
				c.rowSpan = cell.rowSpan - 1;
				c.colSpan = cell.colSpan;
				this.cellsStateArray[index + 1][i] = 1;
				this.updateCellStateByAddOrDelete(index + 1, i, index + cell.rowSpan, i + cell.colSpan, count, true);
			}
			else if (typeof rs[i] == "object" && rs[i][1] == 0) {
				/**
				 * 当删除行遇到了合并表元的非主表元，并且跟主表元在同一列的时候需要将主表元的rowSpan减1,并调整
				 * 该行下面所有属于该合并表元的偏移量
				 */
				this.updateCellStateByAddOrDelete(index + 1, i, index + rs[i][0] + cell.rowSpan, i + cell.colSpan, count, true);
				cell.rowSpan -= 1;
			}
		}
		this.table.deleteRow(index);
		this.cellsStateArray.splice(index, 1);
	}

	$.succezBI.jTable.prototype.addCol = function(index, count) {
		// TODO
		var len = this.getRowCount();
		for (var i = 0; i < len; i++) {
			var rs = this.cellsStateArray[i];
			var row = this.table.rows[i];
			if (rs[index] == 0) {
				row.insertCell(index + 1);
				rs.splice(index + 1, 0, 0);
			}
			else if (rs[index] == 1) {

			}
			else if (typeof rs[index] == "object") {

			}
		}
	}

	$.succezBI.jTable.prototype.deleteCol = function(index, count) {
		// TODO
	}

	$.succezBI.jTable.prototype.doMouseDown = function(e) {
		if (e.button != 0) {
		//	return true;
		}
		if (this.selectSection && ptInRect({
			    x	: e.pageX,
			    y	: e.pageY
		    }, this.getRectBySection(this.selectSection))) {
			return;
		}
		this.endEdit();
		this.selectX = e.pageX;
		this.selectY = e.pageY;
		if (!this.bindMouseMove) {
			this.bindMouseMove = this.doMouseMove.bind(this);
		}
		if (!this.bindMouseUp) {
			this.bindMouseUp = this.doMouseUp.bind(this);
		}
		this.config.renderTo.bind("mousemove", this.bindMouseMove);
		this.config.renderTo.bind("mouseup", this.bindMouseUp);
	}

	$.succezBI.jTable.prototype.doMouseUp = function(e) {
		this.selectDom.hide();
		this.config.renderTo.unbind("mousemove", this.bindMouseMove);
		this.config.renderTo.unbind("mouseup", this.bindMouseUp);
		var r = {};
		r.left = Math.min(this.selectX, e.pageX);
		r.top = Math.min(this.selectY, e.pageY);
		r.right = Math.max(this.selectX, e.pageX);
		r.bottom = Math.max(this.selectY, e.pageY);
		this.selectRect(r);
	}

	$.succezBI.jTable.prototype.getRowCount = function() {
		return this.cellsStateArray.length;;
	}

	$.succezBI.jTable.prototype.getColCount = function() {
		return this.cellsStateArray.length > 0 ? this.cellsStateArray[0].length : 0;
	}

	$.succezBI.jTable.prototype.doMouseMove = function(e) {
		var x = e.pageX;
		var y = e.pageY;
		this.selectDom.show();
		this.selectDom.css("left",(x > this.selectX ? this.selectX : x));
		this.selectDom.css("top",(y > this.selectY ? this.selectY : y));
		this.selectDom.css("width",Math.abs(x - this.selectX));
		this.selectDom.css("height",Math.abs(y - this.selectY));
	}

	/**
	 * 获取某点所在的行号
	 * @param {} p
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getRowIndexByPosition = function(p) {
		var count = this.table.offsetTop;
		if (count > p) {
			return -1;
		}
		for (var i = 0; i < this.getRowCount(); i++) {
			count += this.getRowHeight(i);
			if (count >= p) {
				return i;
			}
		}
		return this.getRowCount();
	}

	/**
	 * 获取行高
	 * @param {} index
	 * @return {Number}
	 */
	$.succezBI.jTable.prototype.getRowHeight = function(index) {
		if (index < 0 || index >= this.getRowCount()) {
			return 0;
		}
		else {
			for (var i = 0; i < this.getColCount(); i++) {
				if (this.cellsStateArray[index][i] == 0) {
					return this.getCell(index, i).height();
				}
			}
			return this.table.find(">tbody>tr").eq(index).height();
		}
	}

	/**
	 * 获取列宽
	 * @param {} index
	 * @return {Number}
	 */
	$.succezBI.jTable.prototype.getColWidth = function(index) {
		if (index < 0 || index >= this.getColCount()) {
			return 0;
		}
		else {
			for (var i = 0; i < this.getRowCount(); i++) {
				if (this.cellsStateArray[i][index] == 0) {
					return this.getCell(i, index).width();
				}
			}
			return 0;
		}
	}

	/**
	 * 获取某行的位置
	 * @param {} index
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getRowPosByIndex = function(index) {
		var pos = this.table.offset().top;
		for (var i = 0; i < Math.min(index, this.getRowCount()); i++) {
			pos += this.getRowHeight(i);
		}
		return pos;
	}

	/**
	 * 获取某点所在的列号
	 * @param {} p
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getColIndexByPosition = function(p) {
		var count = this.table.offset().left;
		if (count > p) {
			return -1;
		}
		for (var i = 0; i < this.getColCount(); i++) {
			count += this.getColWidth(i);
			if (count >= p) {
				return i;
			}
		}
		return this.getColCount();
	}

	/**
	 * 获取某列的位置
	 * @param {} index
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getColPosByIndex = function(index) {
		var pos = this.table.offset().left;
		for (var i = 0; i < Math.min(index, this.getColCount()); i++) {
			pos += this.getColWidth(i);
		}
		return pos;
	}

	/**
	 * 获取选取区域的坐标范围
	 * @param {} section
	 * @return {}
	 */
	$.succezBI.jTable.prototype.getRectBySection = function(section) {
		return {
			left		: this.getColPosByIndex(section.left),
			right		: this.getColPosByIndex(section.right + 1),
			top			: this.getRowPosByIndex(section.top),
			bottom	: this.getRowPosByIndex(section.bottom + 1)
		};
	}

	/**
	 * 选取区域
	 * @param {} r
	 */
	$.succezBI.jTable.prototype.selectRect = function(r) {
		this.selectSection = {
			top			: this.getRowIndexByPosition(r.top),
			bottom	: this.getRowIndexByPosition(r.bottom),
			left		: this.getColIndexByPosition(r.left),
			right		: this.getColIndexByPosition(r.right)
		}
		if (!isIntersect(this.selectSection, {
			    left		: 0,
			    top			: 0,
			    right		: this.getColCount() - 1,
			    bottom	: this.getRowCount() - 1
		    })) {
			this.selectPanel.hide();
			this.selectSection = false;
			return;
		}
		else {
			with (this.selectSection) {
				top = Math.max(top, 0);
				left = Math.max(left, 0);
				right = Math.min(right, this.getColCount() - 1);
				bottom = Math.min(bottom, this.getRowCount() - 1);
			}
		}
		var rt = this.getRectBySection(this.selectSection);
		this.selectPanel.show();
		this.selectPanel.css("left",rt.left);
		this.selectPanel.css("top",rt.top);
		this.selectPanel.css("width",rt.right - rt.left - 1);
		this.selectPanel.css("height",rt.bottom - rt.top);
	}

	function addEvent(obj, eventType, fp, cap) {
		if (eventType == "contextmenu" && !isMSIE) {
			/**
			 * BUG:非Ie浏览器在右键标签页时没有显示标签页上的右键菜单
			 * BUG:非Ie浏览器在右键导航树中的结点时没有显示相应的右键菜单
			 * 
			 * 现象：
			 * 	非Ie浏览器（Firefox、Sarari、Chrome、Opera）中右键时，自定义的行为会被原有行为覆盖
			 * 
			 * 原因：
			 * 	设置oncontextmenu事件的方式不正确，参考系统管理页中的各显示区块，只有欢迎页中的右键菜单显示行为是正确的，而其它区块中的右键行为就不正确了，
			 * 	综合各区块中对右键的处理，发现通过addEventListener设置的右键无法停止原有的右键行为（停止原有事件中的行为是通过return false来完成的），而
			 * 	直接对事件进行赋值的就是正确的，如：xx.oncontextmenu = function(e){return false};
			 * 
			 * 解决方法：
			 * 	将右键事件的处理全部更改为直接赋值的方式，这样就能够保证所有的浏览器都能够正确处理自定义的右键行为。
			 * 
			 * --20101025 cjb
			 */
			obj.oncontextmenu = fp;
			return;
		}

		if (typeof(cap) != "boolean")
			cap = false;
		if (obj.attachEvent)
			obj.attachEvent("on" + eventType, fp);
		else if (obj.addEventListener)
			obj.addEventListener(eventType, fp, cap);
	}

	function removeEvent(obj, eventType, fp, cap) {
		if (eventType == "contextmenu" && !isMSIE) {
			obj.oncontextmenu = null;
			return;
		}

		if (typeof(cap) != "boolean")
			cap = false;
		if (obj && obj.detachEvent)
			obj.detachEvent("on" + eventType, fp);
		else if (obj && obj.removeEventListener)
			obj.removeEventListener(eventType, fp, cap);
	}

	/**
	 * 判断一个点是否在一个矩形区域内部
	 * @param {} pt 代表一个点的结构{x,y}
	 * @param {} rt 代表一个矩形的结构{left,right,top,bottom}
	 * @return {}
	 */
	function ptInRect(pt, rt) {
		return (rt.right >= pt.x) && (pt.x >= rt.left) && (rt.bottom >= pt.y) && (pt.y >= rt.top);
	}

	/**
	 * 判断两个矩形是否相交
	 * @param {} rt1 矩形结构{left,right,top,bottom}
	 * @param {} rt2 矩形结构{left,right,top,bottom}
	 * @return {}
	 */
	function isIntersect(rt1, rt2) {
		return ptInRect({
			    x	: rt1.left,
			    y	: rt1.top
		    }, rt2) || ptInRect({
			    x	: rt1.right,
			    y	: rt1.top
		    }, rt2) || ptInRect({
			    x	: rt1.left,
			    y	: rt1.bottom
		    }, rt2) || ptInRect({
			    x	: rt1.right,
			    y	: rt1.bottom
		    }, rt2);
	}

	Function.prototype.bind = function(context) {
		var args = Array.prototype.slice.call(arguments, 1);
		// this.context = context;

		/**
		 * 创建200次参数面板，每个参数面板有10个edit，IE6，7，8会有20M内存的涨幅。如果把context设置为空，IE内存基本上不变。
		 * 
		 * 测试用例：xui/ctrls/test/testmemleak/testcalcparams/cp-edit.html
		 */
		// context = null;
		/**
		 * 把参数不能直接赋值在this指针上，如果同一个函数调用多次bind，会导致始终记录的是最后一次bind的对象
		 */

		var __method = this;
		return function() {
			return __method.apply(context, args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	};
})(jQuery)