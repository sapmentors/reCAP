ace.define("ace/snippets",["require","exports","module","ace/lib/oop","ace/lib/event_emitter","ace/lib/lang","ace/range","ace/anchor","ace/keyboard/hash_handler","ace/tokenizer","ace/lib/dom","ace/editor"],function(e,t,n){"use strict";var i=e("./lib/oop");var r=e("./lib/event_emitter").EventEmitter;var s=e("./lib/lang");var a=e("./range").Range;var o=e("./anchor").Anchor;var c=e("./keyboard/hash_handler").HashHandler;var h=e("./tokenizer").Tokenizer;var u=a.comparePoints;var l=function(){this.snippetMap={};this.snippetNameMap={}};(function(){i.implement(this,r);this.getTokenizer=function(){function e(e,t,n){e=e.substr(1);if(/^\d+$/.test(e)&&!n.inFormatString)return[{tabstopId:parseInt(e,10)}];return[{text:e}]}function t(e){return"(?:[^\\\\"+e+"]|\\\\.)"}l.$tokenizer=new h({start:[{regex:/:/,onMatch:function(e,t,n){if(n.length&&n[0].expectIf){n[0].expectIf=false;n[0].elseBranch=n[0];return[n[0]]}return":"}},{regex:/\\./,onMatch:function(e,t,n){var i=e[1];if(i=="}"&&n.length){e=i}else if("`$\\".indexOf(i)!=-1){e=i}else if(n.inFormatString){if(i=="n")e="\n";else if(i=="t")e="\n";else if("ulULE".indexOf(i)!=-1){e={changeCase:i,local:i>"a"}}}return[e]}},{regex:/}/,onMatch:function(e,t,n){return[n.length?n.shift():e]}},{regex:/\$(?:\d+|\w+)/,onMatch:e},{regex:/\$\{[\dA-Z_a-z]+/,onMatch:function(t,n,i){var r=e(t.substr(1),n,i);i.unshift(r[0]);return r},next:"snippetVar"},{regex:/\n/,token:"newline",merge:false}],snippetVar:[{regex:"\\|"+t("\\|")+"*\\|",onMatch:function(e,t,n){n[0].choices=e.slice(1,-1).split(",")},next:"start"},{regex:"/("+t("/")+"+)/(?:("+t("/")+"*)/)(\\w*):?",onMatch:function(e,t,n){var i=n[0];i.fmtString=e;e=this.splitRegex.exec(e);i.guard=e[1];i.fmt=e[2];i.flag=e[3];return""},next:"start"},{regex:"`"+t("`")+"*`",onMatch:function(e,t,n){n[0].code=e.splice(1,-1);return""},next:"start"},{regex:"\\?",onMatch:function(e,t,n){if(n[0])n[0].expectIf=true},next:"start"},{regex:"([^:}\\\\]|\\\\.)*:?",token:"",next:"start"}],formatString:[{regex:"/("+t("/")+"+)/",token:"regex"},{regex:"",onMatch:function(e,t,n){n.inFormatString=true},next:"start"}]});l.prototype.getTokenizer=function(){return l.$tokenizer};return l.$tokenizer};this.tokenizeTmSnippet=function(e,t){return this.getTokenizer().getLineTokens(e,t).tokens.map(function(e){return e.value||e})};this.$getDefaultValue=function(e,t){if(/^[A-Z]\d+$/.test(t)){var n=t.substr(1);return(this.variables[t[0]+"__"]||{})[n]}if(/^\d+$/.test(t)){return(this.variables.__||{})[t]}t=t.replace(/^TM_/,"");if(!e)return;var i=e.session;switch(t){case"CURRENT_WORD":var r=i.getWordRange();case"SELECTION":case"SELECTED_TEXT":return i.getTextRange(r);case"CURRENT_LINE":return i.getLine(e.getCursorPosition().row);case"PREV_LINE":return i.getLine(e.getCursorPosition().row-1);case"LINE_INDEX":return e.getCursorPosition().column;case"LINE_NUMBER":return e.getCursorPosition().row+1;case"SOFT_TABS":return i.getUseSoftTabs()?"YES":"NO";case"TAB_SIZE":return i.getTabSize();case"FILENAME":case"FILEPATH":return"";case"FULLNAME":return"Ace"}};this.variables={};this.getVariableValue=function(e,t){if(this.variables.hasOwnProperty(t))return this.variables[t](e,t)||"";return this.$getDefaultValue(e,t)||""};this.tmStrFormat=function(e,t,n){var i=t.flag||"";var r=t.guard;r=new RegExp(r,i.replace(/[^gi]/,""));var s=this.tokenizeTmSnippet(t.fmt,"formatString");var a=this;var o=e.replace(r,function(){a.variables.__=arguments;var e=a.resolveVariables(s,n);var t="E";for(var i=0;i<e.length;i++){var r=e[i];if(typeof r=="object"){e[i]="";if(r.changeCase&&r.local){var o=e[i+1];if(o&&typeof o=="string"){if(r.changeCase=="u")e[i]=o[0].toUpperCase();else e[i]=o[0].toLowerCase();e[i+1]=o.substr(1)}}else if(r.changeCase){t=r.changeCase}}else if(t=="U"){e[i]=r.toUpperCase()}else if(t=="L"){e[i]=r.toLowerCase()}}return e.join("")});this.variables.__=null;return o};this.resolveVariables=function(e,t){var n=[];for(var i=0;i<e.length;i++){var r=e[i];if(typeof r=="string"){n.push(r)}else if(typeof r!="object"){continue}else if(r.skip){a(r)}else if(r.processed<i){continue}else if(r.text){var s=this.getVariableValue(t,r.text);if(s&&r.fmtString)s=this.tmStrFormat(s,r);r.processed=i;if(r.expectIf==null){if(s){n.push(s);a(r)}}else{if(s){r.skip=r.elseBranch}else a(r)}}else if(r.tabstopId!=null){n.push(r)}else if(r.changeCase!=null){n.push(r)}}function a(t){var n=e.indexOf(t,i+1);if(n!=-1)i=n}return n};this.insertSnippetForSelection=function(e,t){var n=e.getCursorPosition();var i=e.session.getLine(n.row);var r=e.session.getTabString();var s=i.match(/^\s*/)[0];if(n.column<s.length)s=s.slice(0,n.column);t=t.replace(/\r/g,"");var a=this.tokenizeTmSnippet(t);a=this.resolveVariables(a,e);a=a.map(function(e){if(e=="\n")return e+s;if(typeof e=="string")return e.replace(/\t/g,r);return e});var o=[];a.forEach(function(e,t){if(typeof e!="object")return;var n=e.tabstopId;var i=o[n];if(!i){i=o[n]=[];i.index=n;i.value=""}if(i.indexOf(e)!==-1)return;i.push(e);var r=a.indexOf(e,t+1);if(r===-1)return;var s=a.slice(t+1,r);var c=s.some(function(e){return typeof e==="object"});if(c&&!i.value){i.value=s}else if(s.length&&(!i.value||typeof i.value!=="string")){i.value=s.join("")}});o.forEach(function(e){e.length=0});var c={};function h(e){var t=[];for(var n=0;n<e.length;n++){var i=e[n];if(typeof i=="object"){if(c[i.tabstopId])continue;var r=e.lastIndexOf(i,n-1);i=t[r]||{tabstopId:i.tabstopId}}t[n]=i}return t}for(var u=0;u<a.length;u++){var l=a[u];if(typeof l!="object")continue;var p=l.tabstopId;var d=a.indexOf(l,u+1);if(c[p]){if(c[p]===l)c[p]=null;continue}var g=o[p];var m=typeof g.value=="string"?[g.value]:h(g.value);m.unshift(u+1,Math.max(0,d-u));m.push(l);c[p]=l;a.splice.apply(a,m);if(g.indexOf(l)===-1)g.push(l)}var v=0,b=0;var x="";a.forEach(function(e){if(typeof e==="string"){var t=e.split("\n");if(t.length>1){b=t[t.length-1].length;v+=t.length-1}else b+=e.length;x+=e}else{if(!e.start)e.start={row:v,column:b};else e.end={row:v,column:b}}});var S=e.getSelectionRange();var _=e.session.replace(S,x);var w=new f(e);var y=e.inVirtualSelectionMode&&e.selection.index;w.addTabstops(o,S.start,_,y)};this.insertSnippet=function(e,t){var n=this;if(e.inVirtualSelectionMode)return n.insertSnippetForSelection(e,t);e.forEachSelection(function(){n.insertSnippetForSelection(e,t)},null,{keepOrder:true});if(e.tabstopManager)e.tabstopManager.tabNext()};this.$getScope=function(e){var t=e.session.$mode.$id||"";t=t.split("/").pop();if(t==="html"||t==="php"){if(t==="php"&&!e.session.$mode.inlinePhp)t="html";var n=e.getCursorPosition();var i=e.session.getState(n.row);if(typeof i==="object"){i=i[0]}if(i.substring){if(i.substring(0,3)=="js-")t="javascript";else if(i.substring(0,4)=="css-")t="css";else if(i.substring(0,4)=="php-")t="php"}}return t};this.getActiveScopes=function(e){var t=this.$getScope(e);var n=[t];var i=this.snippetMap;if(i[t]&&i[t].includeScopes){n.push.apply(n,i[t].includeScopes)}n.push("_");return n};this.expandWithTab=function(e,t){var n=this;var i=e.forEachSelection(function(){return n.expandSnippetForSelection(e,t)},null,{keepOrder:true});if(i&&e.tabstopManager)e.tabstopManager.tabNext();return i};this.expandSnippetForSelection=function(e,t){var n=e.getCursorPosition();var i=e.session.getLine(n.row);var r=i.substring(0,n.column);var s=i.substr(n.column);var a=this.snippetMap;var o;this.getActiveScopes(e).some(function(e){var t=a[e];if(t)o=this.findMatchingSnippet(t,r,s);return!!o},this);if(!o)return false;if(t&&t.dryRun)return true;e.session.doc.removeInLine(n.row,n.column-o.replaceBefore.length,n.column+o.replaceAfter.length);this.variables.M__=o.matchBefore;this.variables.T__=o.matchAfter;this.insertSnippetForSelection(e,o.content);this.variables.M__=this.variables.T__=null;return true};this.findMatchingSnippet=function(e,t,n){for(var i=e.length;i--;){var r=e[i];if(r.startRe&&!r.startRe.test(t))continue;if(r.endRe&&!r.endRe.test(n))continue;if(!r.startRe&&!r.endRe)continue;r.matchBefore=r.startRe?r.startRe.exec(t):[""];r.matchAfter=r.endRe?r.endRe.exec(n):[""];r.replaceBefore=r.triggerRe?r.triggerRe.exec(t)[0]:"";r.replaceAfter=r.endTriggerRe?r.endTriggerRe.exec(n)[0]:"";return r}};this.snippetMap={};this.snippetNameMap={};this.register=function(e,t){var n=this.snippetMap;var i=this.snippetNameMap;var r=this;if(!e)e=[];function a(e){if(e&&!/^\^?\(.*\)\$?$|^\\b$/.test(e))e="(?:"+e+")";return e||""}function o(e,t,n){e=a(e);t=a(t);if(n){e=t+e;if(e&&e[e.length-1]!="$")e=e+"$"}else{e=e+t;if(e&&e[0]!="^")e="^"+e}return new RegExp(e)}function c(e){if(!e.scope)e.scope=t||"_";t=e.scope;if(!n[t]){n[t]=[];i[t]={}}var a=i[t];if(e.name){var c=a[e.name];if(c)r.unregister(c);a[e.name]=e}n[t].push(e);if(e.tabTrigger&&!e.trigger){if(!e.guard&&/^\w/.test(e.tabTrigger))e.guard="\\b";e.trigger=s.escapeRegExp(e.tabTrigger)}if(!e.trigger&&!e.guard&&!e.endTrigger&&!e.endGuard)return;e.startRe=o(e.trigger,e.guard,true);e.triggerRe=new RegExp(e.trigger);e.endRe=o(e.endTrigger,e.endGuard,true);e.endTriggerRe=new RegExp(e.endTrigger)}if(e&&e.content)c(e);else if(Array.isArray(e))e.forEach(c);this._signal("registerSnippets",{scope:t})};this.unregister=function(e,t){var n=this.snippetMap;var i=this.snippetNameMap;function r(e){var r=i[e.scope||t];if(r&&r[e.name]){delete r[e.name];var s=n[e.scope||t];var a=s&&s.indexOf(e);if(a>=0)s.splice(a,1)}}if(e.content)r(e);else if(Array.isArray(e))e.forEach(r)};this.parseSnippetFile=function(e){e=e.replace(/\r/g,"");var t=[],n={};var i=/^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;var r;while(r=i.exec(e)){if(r[1]){try{n=JSON.parse(r[1]);t.push(n)}catch(e){}}if(r[4]){n.content=r[4].replace(/^\t/gm,"");t.push(n);n={}}else{var s=r[2],a=r[3];if(s=="regex"){var o=/\/((?:[^\/\\]|\\.)*)|$/g;n.guard=o.exec(a)[1];n.trigger=o.exec(a)[1];n.endTrigger=o.exec(a)[1];n.endGuard=o.exec(a)[1]}else if(s=="snippet"){n.tabTrigger=a.match(/^\S*/)[0];if(!n.name)n.name=a}else{n[s]=a}}}return t};this.getSnippetByName=function(e,t){var n=this.snippetNameMap;var i;this.getActiveScopes(t).some(function(t){var r=n[t];if(r)i=r[e];return!!i},this);return i}}).call(l.prototype);var f=function(e){if(e.tabstopManager)return e.tabstopManager;e.tabstopManager=this;this.$onChange=this.onChange.bind(this);this.$onChangeSelection=s.delayedCall(this.onChangeSelection.bind(this)).schedule;this.$onChangeSession=this.onChangeSession.bind(this);this.$onAfterExec=this.onAfterExec.bind(this);this.attach(e)};(function(){this.attach=function(e){this.index=0;this.ranges=[];this.tabstops=[];this.$openTabstops=null;this.selectedTabstop=null;this.editor=e;this.editor.on("change",this.$onChange);this.editor.on("changeSelection",this.$onChangeSelection);this.editor.on("changeSession",this.$onChangeSession);this.editor.commands.on("afterExec",this.$onAfterExec);this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler)};this.detach=function(){this.tabstops.forEach(this.removeTabstopMarkers,this);this.ranges=null;this.tabstops=null;this.selectedTabstop=null;this.editor.removeListener("change",this.$onChange);this.editor.removeListener("changeSelection",this.$onChangeSelection);this.editor.removeListener("changeSession",this.$onChangeSession);this.editor.commands.removeListener("afterExec",this.$onAfterExec);this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);this.editor.tabstopManager=null;this.editor=null};this.onChange=function(e){var t=e;var n=e.action[0]=="r";var i=e.start;var r=e.end;var s=i.row;var a=r.row;var o=a-s;var c=r.column-i.column;if(n){o=-o;c=-c}if(!this.$inChange&&n){var h=this.selectedTabstop;var l=h&&!h.some(function(e){return u(e.start,i)<=0&&u(e.end,r)>=0});if(l)return this.detach()}var f=this.ranges;for(var p=0;p<f.length;p++){var d=f[p];if(d.end.row<i.row)continue;if(n&&u(i,d.start)<0&&u(r,d.end)>0){this.removeRange(d);p--;continue}if(d.start.row==s&&d.start.column>i.column)d.start.column+=c;if(d.end.row==s&&d.end.column>=i.column)d.end.column+=c;if(d.start.row>=s)d.start.row+=o;if(d.end.row>=s)d.end.row+=o;if(u(d.start,d.end)>0)this.removeRange(d)}if(!f.length)this.detach()};this.updateLinkedFields=function(){var e=this.selectedTabstop;if(!e||!e.hasLinkedRanges)return;this.$inChange=true;var n=this.editor.session;var i=n.getTextRange(e.firstNonLinked);for(var r=e.length;r--;){var s=e[r];if(!s.linked)continue;var a=t.snippetManager.tmStrFormat(i,s.original);n.replace(s,a)}this.$inChange=false};this.onAfterExec=function(e){if(e.command&&!e.command.readOnly)this.updateLinkedFields()};this.onChangeSelection=function(){if(!this.editor)return;var e=this.editor.selection.lead;var t=this.editor.selection.anchor;var n=this.editor.selection.isEmpty();for(var i=this.ranges.length;i--;){if(this.ranges[i].linked)continue;var r=this.ranges[i].contains(e.row,e.column);var s=n||this.ranges[i].contains(t.row,t.column);if(r&&s)return}this.detach()};this.onChangeSession=function(){this.detach()};this.tabNext=function(e){var t=this.tabstops.length;var n=this.index+(e||1);n=Math.min(Math.max(n,1),t);if(n==t)n=0;this.selectTabstop(n);if(n===0)this.detach()};this.selectTabstop=function(e){this.$openTabstops=null;var t=this.tabstops[this.index];if(t)this.addTabstopMarkers(t);this.index=e;t=this.tabstops[this.index];if(!t||!t.length)return;this.selectedTabstop=t;if(!this.editor.inVirtualSelectionMode){var n=this.editor.multiSelect;n.toSingleRange(t.firstNonLinked.clone());for(var i=t.length;i--;){if(t.hasLinkedRanges&&t[i].linked)continue;n.addRange(t[i].clone(),true)}if(n.ranges[0])n.addRange(n.ranges[0].clone())}else{this.editor.selection.setRange(t.firstNonLinked)}this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler)};this.addTabstops=function(e,t,n){if(!this.$openTabstops)this.$openTabstops=[];if(!e[0]){var i=a.fromPoints(n,n);g(i.start,t);g(i.end,t);e[0]=[i];e[0].index=0}var r=this.index;var s=[r+1,0];var o=this.ranges;e.forEach(function(e,n){var i=this.$openTabstops[n]||e;for(var r=e.length;r--;){var c=e[r];var h=a.fromPoints(c.start,c.end||c.start);d(h.start,t);d(h.end,t);h.original=c;h.tabstop=i;o.push(h);if(i!=e)i.unshift(h);else i[r]=h;if(c.fmtString){h.linked=true;i.hasLinkedRanges=true}else if(!i.firstNonLinked)i.firstNonLinked=h}if(!i.firstNonLinked)i.hasLinkedRanges=false;if(i===e){s.push(i);this.$openTabstops[n]=i}this.addTabstopMarkers(i)},this);if(s.length>2){if(this.tabstops.length)s.push(s.splice(2,1)[0]);this.tabstops.splice.apply(this.tabstops,s)}};this.addTabstopMarkers=function(e){var t=this.editor.session;e.forEach(function(e){if(!e.markerId)e.markerId=t.addMarker(e,"ace_snippet-marker","text")})};this.removeTabstopMarkers=function(e){var t=this.editor.session;e.forEach(function(e){t.removeMarker(e.markerId);e.markerId=null})};this.removeRange=function(e){var t=e.tabstop.indexOf(e);e.tabstop.splice(t,1);t=this.ranges.indexOf(e);this.ranges.splice(t,1);this.editor.session.removeMarker(e.markerId);if(!e.tabstop.length){t=this.tabstops.indexOf(e.tabstop);if(t!=-1)this.tabstops.splice(t,1);if(!this.tabstops.length)this.detach()}};this.keyboardHandler=new c;this.keyboardHandler.bindKeys({Tab:function(e){if(t.snippetManager&&t.snippetManager.expandWithTab(e)){return}e.tabstopManager.tabNext(1)},"Shift-Tab":function(e){e.tabstopManager.tabNext(-1)},Esc:function(e){e.tabstopManager.detach()},Return:function(e){return false}})}).call(f.prototype);var p={};p.onChange=o.prototype.onChange;p.setPosition=function(e,t){this.pos.row=e;this.pos.column=t};p.update=function(e,t,n){this.$insertRight=n;this.pos=e;this.onChange(t)};var d=function(e,t){if(e.row==0)e.column+=t.column;e.row+=t.row};var g=function(e,t){if(e.row==t.row)e.column-=t.column;e.row-=t.row};e("./lib/dom").importCssString(".ace_snippet-marker {    -moz-box-sizing: border-box;    box-sizing: border-box;    background: rgba(194, 193, 208, 0.09);    border: 1px dotted rgba(211, 208, 235, 0.62);    position: absolute;}");t.snippetManager=new l;var m=e("./editor").Editor;(function(){this.insertSnippet=function(e,n){return t.snippetManager.insertSnippet(this,e,n)};this.expandSnippet=function(e){return t.snippetManager.expandWithTab(this,e)}}).call(m.prototype)});ace.define("ace/ext/emmet",["require","exports","module","ace/keyboard/hash_handler","ace/editor","ace/snippets","ace/range","resources","resources","tabStops","resources","utils","actions","ace/config","ace/config"],function(e,t,n){"use strict";var i=e("ace/keyboard/hash_handler").HashHandler;var r=e("ace/editor").Editor;var s=e("ace/snippets").snippetManager;var a=e("ace/range").Range;var o,c;function h(){}h.prototype={setupContext:function(e){this.ace=e;this.indentation=e.session.getTabString();if(!o)o=window.emmet;var t=o.resources||o.require("resources");t.setVariable("indentation",this.indentation);this.$syntax=null;this.$syntax=this.getSyntax()},getSelectionRange:function(){var e=this.ace.getSelectionRange();var t=this.ace.session.doc;return{start:t.positionToIndex(e.start),end:t.positionToIndex(e.end)}},createSelection:function(e,t){var n=this.ace.session.doc;this.ace.selection.setRange({start:n.indexToPosition(e),end:n.indexToPosition(t)})},getCurrentLineRange:function(){var e=this.ace;var t=e.getCursorPosition().row;var n=e.session.getLine(t).length;var i=e.session.doc.positionToIndex({row:t,column:0});return{start:i,end:i+n}},getCaretPos:function(){var e=this.ace.getCursorPosition();return this.ace.session.doc.positionToIndex(e)},setCaretPos:function(e){var t=this.ace.session.doc.indexToPosition(e);this.ace.selection.moveToPosition(t)},getCurrentLine:function(){var e=this.ace.getCursorPosition().row;return this.ace.session.getLine(e)},replaceContent:function(e,t,n,i){if(n==null)n=t==null?this.getContent().length:t;if(t==null)t=0;var r=this.ace;var o=r.session.doc;var c=a.fromPoints(o.indexToPosition(t),o.indexToPosition(n));r.session.remove(c);c.end=c.start;e=this.$updateTabstops(e);s.insertSnippet(r,e)},getContent:function(){return this.ace.getValue()},getSyntax:function(){if(this.$syntax)return this.$syntax;var e=this.ace.session.$modeId.split("/").pop();if(e=="html"||e=="php"){var t=this.ace.getCursorPosition();var n=this.ace.session.getState(t.row);if(typeof n!="string")n=n[0];if(n){n=n.split("-");if(n.length>1)e=n[0];else if(e=="php")e="html"}}return e},getProfileName:function(){var e=o.resources||o.require("resources");switch(this.getSyntax()){case"css":return"css";case"xml":case"xsl":return"xml";case"html":var t=e.getVariable("profile");if(!t)t=this.ace.session.getLines(0,2).join("").search(/<!DOCTYPE[^>]+XHTML/i)!=-1?"xhtml":"html";return t;default:var n=this.ace.session.$mode;return n.emmetConfig&&n.emmetConfig.profile||"xhtml"}},prompt:function(e){return prompt(e)},getSelection:function(){return this.ace.session.getTextRange()},getFilePath:function(){return""},$updateTabstops:function(e){var t=1e3;var n=0;var i=null;var r=o.tabStops||o.require("tabStops");var s=o.resources||o.require("resources");var a=s.getVocabulary("user");var c={tabstop:function(e){var s=parseInt(e.group,10);var a=s===0;if(a)s=++n;else s+=t;var o=e.placeholder;if(o){o=r.processText(o,c)}var h="${"+s+(o?":"+o:"")+"}";if(a){i=[e.start,h]}return h},escape:function(e){if(e=="$")return"\\$";if(e=="\\")return"\\\\";return e}};e=r.processText(e,c);if(a.variables["insert_final_tabstop"]&&!/\$\{0\}$/.test(e)){e+="${0}"}else if(i){var h=o.utils?o.utils.common:o.require("utils");e=h.replaceSubstring(e,"${0}",i[0],i[1])}return e}};var u={expand_abbreviation:{mac:"ctrl+alt+e",win:"alt+e"},match_pair_outward:{mac:"ctrl+d",win:"ctrl+,"},match_pair_inward:{mac:"ctrl+j",win:"ctrl+shift+0"},matching_pair:{mac:"ctrl+alt+j",win:"alt+j"},next_edit_point:"alt+right",prev_edit_point:"alt+left",toggle_comment:{mac:"command+/",win:"ctrl+/"},split_join_tag:{mac:"shift+command+'",win:"shift+ctrl+`"},remove_tag:{mac:"command+'",win:"shift+ctrl+;"},evaluate_math_expression:{mac:"shift+command+y",win:"shift+ctrl+y"},increment_number_by_1:"ctrl+up",decrement_number_by_1:"ctrl+down",increment_number_by_01:"alt+up",decrement_number_by_01:"alt+down",increment_number_by_10:{mac:"alt+command+up",win:"shift+alt+up"},decrement_number_by_10:{mac:"alt+command+down",win:"shift+alt+down"},select_next_item:{mac:"shift+command+.",win:"shift+ctrl+."},select_previous_item:{mac:"shift+command+,",win:"shift+ctrl+,"},reflect_css_value:{mac:"shift+command+r",win:"shift+ctrl+r"},encode_decode_data_url:{mac:"shift+ctrl+d",win:"ctrl+'"},expand_abbreviation_with_tab:"Tab",wrap_with_abbreviation:{mac:"shift+ctrl+a",win:"shift+ctrl+a"}};var l=new h;t.commands=new i;t.runEmmetCommand=function e(n){try{l.setupContext(n);var i=o.actions||o.require("actions");if(this.action=="expand_abbreviation_with_tab"){if(!n.selection.isEmpty())return false;var r=n.selection.lead;var s=n.session.getTokenAt(r.row,r.column);if(s&&/\btag\b/.test(s.type))return false}if(this.action=="wrap_with_abbreviation"){return setTimeout(function(){i.run("wrap_with_abbreviation",l)},0)}var a=i.run(this.action,l)}catch(i){if(!o){t.load(e.bind(this,n));return true}n._signal("changeStatus",typeof i=="string"?i:i.message);console.log(i);a=false}return a};for(var f in u){t.commands.addCommand({name:"emmet:"+f,action:f,bindKey:u[f],exec:t.runEmmetCommand,multiSelectAction:"forEach"})}t.updateCommands=function(e,n){if(n){e.keyBinding.addKeyboardHandler(t.commands)}else{e.keyBinding.removeKeyboardHandler(t.commands)}};t.isSupportedMode=function(e){if(!e)return false;if(e.emmetConfig)return true;var t=e.$id||e;return/css|less|scss|sass|stylus|html|php|twig|ejs|handlebars/.test(t)};t.isAvailable=function(e,n){if(/(evaluate_math_expression|expand_abbreviation)$/.test(n))return true;var i=e.session.$mode;var r=t.isSupportedMode(i);if(r&&i.$modes){try{l.setupContext(e);if(/js|php/.test(l.getSyntax()))r=false}catch(e){}}return r};var p=function(e,n){var i=n;if(!i)return;var r=t.isSupportedMode(i.session.$mode);if(e.enableEmmet===false)r=false;if(r)t.load();t.updateCommands(i,r)};t.load=function(t){if(typeof c=="string"){e("ace/config").loadModule(c,function(){c=null;t&&t()})}};t.AceEmmetEditor=h;e("ace/config").defineOptions(r.prototype,"editor",{enableEmmet:{set:function(e){this[e?"on":"removeListener"]("changeMode",p);p({enableEmmet:!!e},this)},value:true}});t.setCore=function(e){if(typeof e=="string")c=e;else o=e}});(function(){ace.require(["ace/ext/emmet"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();