ace.define("ace/ext/rtl",["require","exports","module","ace/lib/dom","ace/lib/lang","ace/editor","ace/config"],function(e,i,t){"use strict";var n=e("ace/lib/dom");var r=e("ace/lib/lang");var o=[{name:"leftToRight",bindKey:{win:"Ctrl-Alt-Shift-L",mac:"Command-Alt-Shift-L"},exec:function(e){e.session.$bidiHandler.setRtlDirection(e,false)},readOnly:true},{name:"rightToLeft",bindKey:{win:"Ctrl-Alt-Shift-R",mac:"Command-Alt-Shift-R"},exec:function(e){e.session.$bidiHandler.setRtlDirection(e,true)},readOnly:true}];var s=e("../editor").Editor;e("../config").defineOptions(s.prototype,"editor",{rtlText:{set:function(e){if(e){this.on("change",d);this.on("changeSelection",l);this.renderer.on("afterRender",c);this.commands.on("exec",a);this.commands.addCommands(o)}else{this.off("change",d);this.off("changeSelection",l);this.renderer.off("afterRender",c);this.commands.off("exec",a);this.commands.removeCommands(o);f(this.renderer)}this.renderer.updateFull()}},rtl:{set:function(e){this.session.$bidiHandler.$isRtl=e;if(e){this.setOption("rtlText",false);this.renderer.on("afterRender",c);this.session.$bidiHandler.seenBidi=true}else{this.renderer.off("afterRender",c);f(this.renderer)}this.renderer.updateFull()}}});function l(e,i){var t=i.getSelection().lead;if(i.session.$bidiHandler.isRtlLine(t.row)){if(t.column===0){if(i.session.$bidiHandler.isMoveLeftOperation&&t.row>0){i.getSelection().moveCursorTo(t.row-1,i.session.getLine(t.row-1).length)}else{if(i.getSelection().isEmpty())t.column+=1;else t.setPosition(t.row,t.column+1)}}}}function a(e){e.editor.session.$bidiHandler.isMoveLeftOperation=/gotoleft|selectleft|backspace|removewordleft/.test(e.command.name)}function d(e,i){var t=i.session;t.$bidiHandler.currentRow=null;if(t.$bidiHandler.isRtlLine(e.start.row)&&e.action==="insert"&&e.lines.length>1){for(var n=e.start.row;n<e.end.row;n++){if(t.getLine(n+1).charAt(0)!==t.$bidiHandler.RLE)t.doc.$lines[n+1]=t.$bidiHandler.RLE+t.getLine(n+1)}}}function c(e,i){var t=i.session;var n=t.$bidiHandler;var r=i.$textLayer.$lines.cells;var o=i.layerConfig.width-i.layerConfig.padding+"px";r.forEach(function(e){var i=e.element.style;if(n&&n.isRtlLine(e.row)){i.direction="rtl";i.textAlign="right";i.width=o}else{i.direction="";i.textAlign="";i.width=""}})}function f(e){var i=e.$textLayer.$lines;i.cells.forEach(t);i.cellCache.forEach(t);function t(e){var i=e.element.style;i.direction=i.textAlign=i.width=""}}});(function(){ace.require(["ace/ext/rtl"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();