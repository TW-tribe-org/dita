 
(function($) { 
var maxZ = 0; 
$.fn.easyDrag = function(params) { 
if(params == "kill"){ 
this.each(function(){ var self = $(this); 
var handle = self.data('handle'); 
handle.off('mousedown', easyDrag_onMouseDown); 
handle.off('touchstart', easyDrag_onTouchStart); 
handle.css('cursor', ''); 
self.removeClass('easydrag_enabled'); 
}); 
} else if(params == 'killall'){ 
$('.easydrag_enabled').easyDrag('kill'); 
} else { 
params = $.extend({ 
handle: '.handle', 
axis: false, 
container: false, 
start: function(){}, 
drag: function(){}, 
stop: function(){}, 
cursor: 'move', 
ontop: true, 
clickable: true 
}, params); 
this.each(function(){ var self = $(this); 
if(!self.hasClass('easydrag_enabled')){ 
if(params.handle == 'this' || self.find(params.handle).length==0){ 
var handle = self; 
} else { 
var handle = self.find(params.handle); 
} 
if(params.cursor != ''){ handle.css('cursor', params.cursor); } 
handle.data(params); 
var boulet = self; 
boulet.addClass('easydrag_enabled'); 
boulet.data('handle', handle); 
handle.data('boulet', boulet); 
if(self.css('z-index')!='auto' && params.ontop){ 
maxZ = Math.max(maxZ, self.css('z-index')); 
}; 
if(self.css('position') != 'absolute' && self.css('position') != 'fixed'){ 
if(self.css('left') == 'auto'){ self.css('left', '0'); } 
if(self.css('top') == 'auto'){ self.css('top', '0'); } 
self.css('position', 'relative'); 
} 
handle.on('mousedown', easyDrag_onMouseDown); 
handle.on('touchstart', easyDrag_onTouchStart); 
} 
}); 
} 
return this; 
}; 
var self, t, boulet, initItemX, initItemY, initEventX, initEventY, axis, container, refX, refY; 
function easyDrag_onMouseDown(event){ event.preventDefault(); 
t = Date.now(); 
self = $(this); 
boulet = self.data('boulet'); 
initItemX = parseInt(boulet.css('left')); 
initItemY = parseInt(boulet.css('top')); 
axis = self.data('axis'); 
container = self.data('container'); 
initEventX = event.pageX; 
initEventY = event.pageY; 
if(container.length){ 
refX = self.offset().left; 
refY = self.offset().top; 
} 
self.data('start').call(boulet); 
$(document).on('mousemove', easyDrag_onMouseMove); 
$(document).on('click', easyDrag_onMouseUp); 
if(self.data('ontop')){ 
maxZ++; 
boulet.css('z-index', maxZ); 
} 
} 
function easyDrag_onMouseMove(e){ e.preventDefault(); 
self.data('drag').call(boulet); 
var nextX = initItemX + e.pageX-initEventX; 
var nextY = initItemY + e.pageY-initEventY; 
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); } 
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); } 
easyDrag_contain(); 
} 
function easyDrag_onMouseUp(e){ 
$(document).off('mousemove', easyDrag_onMouseMove); 
$(document).off('click', easyDrag_onMouseUp); 
self.data('stop').call(boulet); 
var d = Date.now() - t; 
if(d>300 || !self.data('clickable')){ 
e.preventDefault(); 
e.stopPropagation(); 
} 
} 
function easyDrag_onTouchStart(event){ event.preventDefault(); 
t = Date.now(); 
self = $(this); 
boulet = self.data('boulet'); 
initItemX = parseInt(boulet.css('left')); 
initItemY = parseInt(boulet.css('top')); 
axis = self.data('axis'); 
container = self.data('container'); 
if(container.length){ 
refX = self.offset().left; 
refY = self.offset().top; 
} 
var touch = event.originalEvent.changedTouches[0]; 
initEventX = touch.pageX; 
initEventY = touch.pageY; 
self.data('start').call(boulet); 
$(document).on('touchmove', easyDrag_onTouchMove); 
$(document).on('touchend', easyDrag_onTouchEnd); 
if(self.data('ontop')){ 
maxZ++; 
boulet.css('z-index', maxZ); 
} 
} 
function easyDrag_onTouchMove(e){ e.preventDefault(); 
self.data('drag').call(boulet); 
var touch = e.originalEvent.changedTouches[0]; 
var nextX = initItemX + touch.pageX-initEventX; 
var nextY = initItemY + touch.pageY-initEventY; 
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); } 
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); } 
easyDrag_contain(); 
} 
function easyDrag_onTouchEnd(e){ 
$(document).off('touchmove', easyDrag_onTouchMove); 
$(document).off('touchend', easyDrag_onTouchEnd); 
self.data('stop').call(boulet); 
var d = Date.now() - t; 
if(d>300 || !self.data('clickable')){ 
e.preventDefault(); 
e.stopPropagation(); 
} 
} 
function easyDrag_contain(){ 
if(container.length){ 
var cur_offset = boulet.offset(); 
var container_offset = container.offset(); 
var limite1 = container_offset.left; 
var limite2 = limite1+container.width()-boulet.innerWidth(); 
limite1 += parseInt(boulet.css('margin-left')); 
if(cur_offset.left<limite1){ 
boulet.offset({left: limite1}); 
} else if(cur_offset.left>limite2){ 
boulet.offset({left: limite2}); 
} 
var limite1 = container_offset.top; 
var limite2 = limite1+container.height()-boulet.innerHeight(); 
limite1 += parseInt(boulet.css('margin-top')); 
if(cur_offset.top<limite1){ 
boulet.offset({top: limite1}); 
} else if(cur_offset.top>limite2){ 
boulet.offset({top: limite2}); 
} 
} 
}; 
})(jQuery); 
 
jQuery.extend({ 
highlight: function (node, re, nodeName, className) { 
if (node.nodeType === 3) { 
var match = node.data.match(re); 
if (match) { 
var highlight = document.createElement(nodeName || 'span'); 
highlight.className = className || 'highlight'; 
var wordNode = node.splitText(match.index); 
wordNode.splitText(match[0].length); 
var wordClone = wordNode.cloneNode(true); 
highlight.appendChild(wordClone); 
wordNode.parentNode.replaceChild(highlight, wordNode); 
return 1; 
} 
} else if ((node.nodeType === 1 && node.childNodes) && 
!/^(script|style|text|tspan|textpath)$|(^svg:)/i.test(node.tagName) && 
!(node.tagName === nodeName.toUpperCase() && node.className === className)) { 
for (var i = 0; i < node.childNodes.length; i++) { 
i += jQuery.highlight(node.childNodes[i], re, nodeName, className); 
} 
} 
return 0; 
} 
}); 
jQuery.fn.unhighlight = function (options) { 
var settings = { className: 'highlight', element: 'span' }; 
jQuery.extend(settings, options); 
return this.find(settings.element + "." + settings.className).each(function () { 
var parent = this.parentNode; 
parent.replaceChild(this.firstChild, this); 
parent.normalize(); 
}).end(); 
}; 
jQuery.fn.highlight = function (words, options) { 
var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false }; 
jQuery.extend(settings, options); 
if (words.constructor === String) { 
words = [words]; 
} 
words = jQuery.grep(words, function(word, i){ 
return word != ''; 
}); 
words = jQuery.map(words, function(word, i) { 
return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); 
}); 
if (words.length == 0) { return this; }; 
var flag = settings.caseSensitive ? "" : "i"; 
var pattern = "(" + words.join("|") + ")"; 
if (settings.wordsOnly) { 
pattern = "\\b" + pattern + "\\b"; 
} 
var re = new RegExp(pattern, flag); 
return this.each(function () { 
jQuery.highlight(this, re, settings.element, settings.className); 
}); 
}; 
 
;(function ($) { 
var methods = { 
init: function (options) { 
var settings = $.extend({ checked: false, ontoggle: null }, 
options); 
var toggle = this.first(); 
toggle.addClass("toggle-toggle"); 
toggle.removeData("toggleState"); 
toggle.click(function (event) { 
event.preventDefault(); 
methods.check.call(toggle, "toggle"); 
}); 
if (typeof settings.ontoggle === "function") { 
toggle.data("onChangeState", settings.ontoggle); 
} 
methods.check.call(toggle, settings.checked); 
return toggle; 
}, 
check: function (checked) { 
var toggle = this.first(); 
var isChecked = toggle.data("toggleState"); 
if (checked === "toggle") { 
if (typeof isChecked === "boolean") { 
checked = !isChecked; 
} else { 
checked = false; 
} 
} 
if (typeof checked === "boolean") { 
var toggle = this.first(); 
if ((typeof isChecked === "undefined") || 
checked !== isChecked) { 
if (checked) { 
toggle.addClass("toggle-checked"); 
} else { 
toggle.removeClass("toggle-checked"); 
} 
toggle.data("toggleState", checked); 
if (toggle.data("onChangeState")) { 
toggle.data("onChangeState").call(toggle, checked); 
} 
} 
return toggle; 
} else { 
return isChecked; 
} 
}, 
}; 
$.fn.toggle = function (method) { 
if (methods[method]) { 
return methods[method].apply( 
this, 
Array.prototype.slice.call(arguments, 1)); 
} else if ((typeof method === "object") || !method) { 
return methods.init.apply(this, arguments); 
} else { 
$.error("Method '" + method + "' does not exist in jQuery.toggle"); 
return this; 
} 
}; 
})(jQuery); 
 
 
;(function ($) { 
var methods = { 
init: function (options) { 
var settings = $.extend({ selected: 0, onselect: null }, 
options); 
var tabs = this.first(); 
tabs.addClass("tabs-tabs"); 
tabs.children("li").each(function (itemIndex) { 
$(this).addClass("tabs-tab"); 
var links = $(this).children("a[href]"); 
$(this).add(links).click(function (event) { 
event.preventDefault(); 
event.stopImmediatePropagation(); 
methods.select.call(tabs, itemIndex); 
}); 
}); 
if (typeof settings.onselect === "function") { 
tabs.data("onSelectTab", settings.onselect); 
} 
methods.select.call(tabs, settings.selected); 
return tabs; 
}, 
select: function (index) { 
var tabs = this.first(); 
if (typeof index === "number") { 
var items = tabs.children("li"); 
if (index < 0) { 
index = 0; 
} else if (index >= items.length) { 
index = items.length - 1; 
} 
tabs.removeData("selectedTab"); 
var selected = false; 
items.each(function (itemIndex) { 
var panel = methods.getPanel.call(tabs, $(this)); 
if (itemIndex === index) { 
$(this).addClass("tabs-selected"); 
panel.show(); 
selected = true; 
} else { 
$(this).removeClass("tabs-selected"); 
panel.hide(); 
} 
}); 
if (selected) { 
tabs.data("selectedTab", index); 
if (tabs.data("onSelectTab")) { 
tabs.data("onSelectTab").call(tabs, index); 
} 
} 
return tabs; 
} else { 
return tabs.data("selectedTab"); 
} 
}, 
getPanel: function (item) { 
var href = item.children("a[href]").first().attr("href"); 
if (href && href.indexOf("#") === 0) { 
return $(href); 
} else { 
return $(); 
} 
}, 
}; 
$.fn.tabs = function (method) { 
if (methods[method]) { 
return methods[method].apply( 
this, 
Array.prototype.slice.call(arguments, 1)); 
} else if ((typeof method === "object") || !method) { 
return methods.init.apply(this, arguments); 
} else { 
$.error("Method '" + method + "' does not exist in jQuery.tabs"); 
return this; 
} 
}; 
})(jQuery); 
 
;(function ($) { 
var methods = { 
init: function (options) { 
var settings = $.extend({ initiallyCollapsed: false }, options); 
var toc = this.first(); 
toc.addClass("toc-toc"); 
toc.data("toc", settings); 
var collapsible = methods.getCollapsibleEntries.call(toc); 
if (collapsible.length > 0) { 
var hasSingleRoot = (toc.children("li").length === 1); 
methods.restoreCollapsibleEntries.call(toc, collapsible, 
hasSingleRoot); 
var clickEndX = NaN; 
var paddingLeft = collapsible.css("padding-left"); 
if (paddingLeft.substr(-2) === "px") { 
clickEndX = 
parseInt(paddingLeft.substring(0, paddingLeft.length-2)); 
} 
if (isNaN(clickEndX)) { 
clickEndX = 16; 
} 
collapsible.click(function (event) { 
var entry = $(this); 
var x = event.pageX - entry.offset().left; 
if (x >= 0 && x < clickEndX) { 
event.stopImmediatePropagation(); 
var contents = entry.children("ul"); 
if (entry.hasClass("toc-collapsed")) { 
entry.removeClass("toc-collapsed") 
.addClass("toc-expanded"); 
contents.show(); 
} else { 
entry.removeClass("toc-expanded") 
.addClass("toc-collapsed"); 
contents.hide(); 
} 
methods.saveCollapsibleEntries.call(toc, collapsible); 
} 
}); 
} 
return toc; 
}, 
expandCollapseAll: function (expand) { 
var toc = this.first(); 
var collapsible = methods.getCollapsibleEntries.call(toc); 
collapsible.each(function () { 
var entry = $(this); 
if (expand && entry.hasClass("toc-collapsed")) { 
entry.removeClass("toc-collapsed") 
.addClass("toc-expanded"); 
entry.children("ul").show(); 
} else if (!expand && entry.hasClass("toc-expanded")) { 
entry.removeClass("toc-expanded") 
.addClass("toc-collapsed"); 
entry.children("ul").hide(); 
} 
}); 
methods.saveCollapsibleEntries.call(toc, collapsible); 
return toc; 
}, 
showEntry: function (entry, scroll) { 
var toc = this.first(); 
entry.parents(toc, "li").each(function () { 
var e = $(this); 
if (e.hasClass("toc-collapsed")) { 
e.removeClass("toc-collapsed").addClass("toc-expanded"); 
e.children("ul").show(); 
} 
}); 
if (scroll && toc.is(":visible")) { 
var scrollable = methods.getScrollParent.call(toc); 
scrollable.scrollTop(entry.offset().top - 
scrollable.offset().top); 
} 
return toc; 
}, 
 
getScrollParent: function() { 
var position = this.css("position"); 
var excludeStaticParent = (position === "absolute"); 
var scrollParent = this.parents().filter(function() { 
var parent = $(this); 
if (excludeStaticParent && 
parent.css("position") === "static") { 
return false; 
} 
return (/(auto|scroll)/).test(parent.css("overflow") + 
parent.css("overflow-y") + 
parent.css("overflow-x")); 
}).eq(0); 
return (position === "fixed" || scrollParent.length === 0)? 
$(this[0].ownerDocument || document) : scrollParent; 
}, 
getCollapsibleEntries: function () { 
return $("li", this).filter(function () { 
return $(this).children("ul").length > 0; 
}); 
}, 
saveCollapsibleEntries: function (collapsible) { 
var settings = this.data("toc"); 
if (settings.storageKey) { 
var state = []; 
collapsible.each(function () { 
state.push($(this).hasClass("toc-collapsed")? 0 : 1); 
}); 
window.sessionStorage.setItem(settings.storageKey, 
state.join("")); 
} 
}, 
restoreCollapsibleEntries: function (collapsible, hasSingleRoot) { 
var fallback = true; 
var settings = this.data("toc"); 
if (settings.storageKey) { 
var storedValue = 
window.sessionStorage.getItem(settings.storageKey); 
if (storedValue) { 
var state = storedValue.split(""); 
if (state.length === collapsible.length) { 
fallback = false; 
collapsible.each(function (index) { 
var entry = $(this); 
var contents = entry.children("ul"); 
if (parseInt(state[index], 10) === 0) { 
entry.addClass("toc-collapsed"); 
contents.hide(); 
} else { 
entry.addClass("toc-expanded"); 
contents.show(); 
} 
}); 
} 
} 
} 
if (fallback) { 
if (settings.initiallyCollapsed) { 
collapsible.each(function (index) { 
var entry = $(this); 
if (hasSingleRoot && index === 0) { 
entry.addClass("toc-expanded"); 
} else { 
entry.addClass("toc-collapsed"); 
entry.children("ul").hide(); 
} 
}); 
} else { 
collapsible.each(function (index) { 
$(this).addClass("toc-expanded"); 
}); 
} 
} 
} 
}; 
$.fn.toc = function (method) { 
if (methods[method]) { 
return methods[method].apply( 
this, 
Array.prototype.slice.call(arguments, 1)); 
} else if ((typeof method === "object") || !method) { 
return methods.init.apply(this, arguments); 
} else { 
$.error("Method '" + method + "' does not exist in jQuery.toc"); 
return this; 
} 
}; 
})(jQuery); 
var wh = (function () {
var toc_entries = [
["\n         <span class=\"webhelp-toc-section1-entry\">Introduction to DITA</span>\n      ","c_Introduction_to_DITA.html#D1763",[
["\n            <span class=\"webhelp-toc-section2-entry\">DITA features</span>\n         ","c_DITA_Features.html#D1966",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Information typing</span>\n         ","c_Information_Types.html#concept_B83BDD2510714DC2A3B4B8959F2C628B",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Topic-based authoring</span>\n         ","c_Topic_Based_Authoring.html#D2064",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Modularity</span>\n         ","c_Modularity.html#Dc_Modularity",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Minimalism</span>\n         ","c_Minimalism.html#concept_4D6F168A500A4E2CAAD3510DC906FC06",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Structured authoring</span>\n         ","c_What_is_Structured_Authoring.html#concept_3EC0486995EC49A88542A99EFCB313D0",null],
["\n            <span class=\"webhelp-toc-section2-entry\">The separation of content and form</span>\n         ","c_Introduction_to_the_Separation_of_Content.html#D2209",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Where DITA fits...</span>\n         ","c_Where_DITA_Fits_In.html#D1835",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Inheritance</span>\n         ","c_Inheritance.html#D1799",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Conditions, filtering, variants and ditaval</span>\n         ","c_Conditions_Filtering_Variants_and_ditaval.html#concept_62DC88738DF34255844A153A04EA1981",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Techniques to learn</span>\n         ","c_Techniques.html#Dc_Techniques",null]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">Information types and topics</span>\n      ","c_Topics_and_Information_Types.html#concept_B56C7FF5E35949DEBBA2C6A43C09E956",[
["\n            <span class=\"webhelp-toc-section2-entry\">Content models and information types</span>\n         ","c_Content_Models_and_Info_Types.html#Dc_Content_Models_and_Info_Types",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Information types</span>\n         ","c_Information_Types_Explained.html#D1639",[
["\n               <span class=\"webhelp-toc-section3-entry\">Concept</span>\n            ","c_Concept.html#D2078",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Task</span>\n            ","c_Task.html#D2079",[
["\n                  <span class=\"webhelp-toc-section4-entry\">General Task</span>\n               ","c_General_Tasks.html#concept_411EB14DCE0C400E8C21C1A15E5B0926",null]
]],
["\n               <span class=\"webhelp-toc-section3-entry\">Reference</span>\n            ","c_Reference.html#D2080",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Topic (proto information type)</span>\n            ","c_Topic_Proto.html#concept_2CCD8FC2365240F08FE6DD53E871943B",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Identifying the information type</span>\n            ","c_Identifying_the_Information_Type.html#D1986",null]
]]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">DITA map files</span>\n      ","c_DITA_Map_Files.html#concept_9489AC2C522049FAA770DA63F54060F1",[
["\n            <span class=\"webhelp-toc-section2-entry\">Purpose of ditamap files</span>\n         ","c_Working_with_Map_Files.html#D1818",[
["\n               <span class=\"webhelp-toc-section3-entry\">Publication and collection defined</span>\n            ","c_Publication_Defined.html#D9363",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Anatomy of a ditamap file</span>\n            ","c_Anatomy_of_ditamap.html#D2622",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Generated relationship links</span>\n            ","c_Generated_Relationship_Links.html#D2624",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Topic manifest</span>\n         ","c_Topic_Manifest.html#concept_75DDC6623DAF476089F37844B51C0293",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Topic hierarchy</span>\n         ","c_Topic_Based_Architecture_Needs_TOC.html#D2619",[
["\n               <span class=\"webhelp-toc-section3-entry\">Designing a topic hierarchy</span>\n            ","c_Structuring_a_TOC.html#D2368",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Heading levels and ditamaps</span>\n            ","c_Output_Styling.html#D2834",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Controlling the top node (default topic)</span>\n            ","c_Controlling_Default_Page.html#Dc_Controlling_Default_Page",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Excluding topics from the output TOC</span>\n            ","c_Excluding_Map_Topics_from_TOC.html#concept_CB9DCCEEE29D42FEA8E053DB8A0D88E2",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Relationship tables</span>\n         ","c_Understanding_Relationship_Tables.html#D2068",[
["\n               <span class=\"webhelp-toc-section3-entry\">Types of relationship tables</span>\n            ","c_Types_of_Relationship_Tables.html#concept_25F815C1FFB641608A6175A42B2639E9",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Labels for reltable related topic links</span>\n            ","c_Labels_for_reltable_Links.html#D9191",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Link text for reltable related topic links</span>\n            ","c_Link_Text_for_Relationship_Tables.html#D2816",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Storing relationship tables in separate, embedded ditamaps</span>\n            ","c_Storing_Relationship_Table_Maps_Separately.html#D9381",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Linking relationships</span>\n         ","c_Linking_Relationships.html#concept_BCA83D783CB24AAE996C6948AA0E88D9",[
["\n               <span class=\"webhelp-toc-section3-entry\">Hierarchical linking relationships</span>\n            ","c_Hierarchical_Linking_Relationships.html#concept_0CB5962F42AA4B60AA77CC9B4708B493",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Collection types</span>\n            ","c_Collection_Types.html#D9214",[
["\n                  <span class=\"webhelp-toc-section4-entry\">Collection type examples</span>\n               ","c_Collection_Type_Examples.html#D2633",[
["\n                     <span class=\"webhelp-toc-section5-entry\">Collection type example: family</span>\n                  ","c_Collection_Type_Example_Family.html#D2634",null],
["\n                     <span class=\"webhelp-toc-section5-entry\">Collection type example: unordered</span>\n                  ","c_Collection_Type_Example_Unordered.html#D2638",null],
["\n                     <span class=\"webhelp-toc-section5-entry\">Collection type example: sequence</span>\n                  ","c_Collection_Type_Example_Sequence.html#D2636",null],
["\n                     <span class=\"webhelp-toc-section5-entry\">Collection type example: choice</span>\n                  ","c_Collection_Type_Example_Choice.html#D2640",null]
]]
]]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Embedded (or nested) ditamaps</span>\n         ","c_Embedded_Maps.html#D2069",null],
["\n            <span class=\"webhelp-toc-section2-entry\">The bookmap feature</span>\n         ","c_bookmap_application.html#D2067",[
["\n               <span class=\"webhelp-toc-section3-entry\">Sample bookmap file</span>\n            ","c_bookmap_example.html#D2682",null]
]]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">Syntax and mark-up</span>\n      ","c_Syntax_and_Markup.html#concept_C2D35D1DA62446AE842ED5205A7596E1",[
["\n            <span class=\"webhelp-toc-section2-entry\">Organisation of DITA elements</span>\n         ","c_Organisation_of_DITA_Elements.html#D1980",[
["\n               <span class=\"webhelp-toc-section3-entry\">Block and phrase elements</span>\n            ","c_Phrases_and_Blocks.html#concept_F8F837BABC264A4482883B4D707557B4",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Topic elements</span>\n            ","c_Topic_Elements.html#D2469",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Map elements</span>\n            ","c_Map_Elements.html#concept_8FEC51A86D17452EADDDCB301E91BE16",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Body elements</span>\n            ","c_Body_Elements.html#D2470",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Prolog elements</span>\n            ","c_Prolog_Elements.html#D2468",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Domain elements</span>\n            ","c_Domain_Elements.html#D1989",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Specialisation elements</span>\n            ","c_Specialisation_Elements.html#concept_25BED1F979EF41FC8B53C613B06D07F5",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Element domains</span>\n         ","c_List_of_Domains.html#D2995",[
["\n               <span class=\"webhelp-toc-section3-entry\">Programming domain</span>\n            ","c_Programming_Domain.html#concept_7EFF0744D5144C8180FD9433AE4BD361",[
["\n                  <span class=\"webhelp-toc-section4-entry\">Programming domain elements</span>\n               ","c_Programming_Domain.html#reference_6FB31F18C6F749D78832DB80AA363731",null]
]],
["\n               <span class=\"webhelp-toc-section3-entry\">User interface domain</span>\n            ","c_User_Interface_Domain.html#concept_5D5C4AC88F44413C9B57B95C18B04FB1",[
["\n                  <span class=\"webhelp-toc-section4-entry\">User interface domain elements</span>\n               ","c_User_Interface_Domain.html#reference_6FB31F18C6F749D78832DB80AA363731-2",null]
]],
["\n               <span class=\"webhelp-toc-section3-entry\">Software domain</span>\n            ","c_Software_Domain.html#concept_2EC329120E184EF98A46651F0C1D3590",[
["\n                  <span class=\"webhelp-toc-section4-entry\">Software domain elements</span>\n               ","c_Software_Domain.html#reference_6FB31F18C6F749D78832DB80AA363731-3",null]
]],
["\n               <span class=\"webhelp-toc-section3-entry\">Utilities domain</span>\n            ","c_Utilities_Domain.html#concept_0281586C69A74F0FAA1CD3481FCE5F14",[
["\n                  <span class=\"webhelp-toc-section4-entry\">Utilities domain elements</span>\n               ","c_Utilities_Domain.html#reference_6FB31F18C6F749D78832DB80AA363731-4",null]
]],
["\n               <span class=\"webhelp-toc-section3-entry\">Metadata domain</span>\n            ","c_Other_Domains.html#concept_016C23D8A0184B85A9913BEA5215E21C",[
["\n                  <span class=\"webhelp-toc-section4-entry\">Metadata domain elements</span>\n               ","c_Other_Domains.html#reference_6FB31F18C6F749D78832DB80AA363731-5",null]
]],
["\n               <span class=\"webhelp-toc-section3-entry\">Typographic (highlighting) domain</span>\n            ","c_Typographical_Domain.html#D3783",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Short descriptions</span>\n         ","c_Short_Descriptions.html#concept_0AB1120C7BD84716978E34C3ED98A611",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Lists</span>\n         ","c_Lists.html#concept_54C988164E0541BB8CB1E9AB000C5287",[
["\n               <span class=\"webhelp-toc-section3-entry\">Types of lists</span>\n            ","c_Choosing_a_List_Type.html#concept_154220B965BB4734A1029A994B5DC554",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Definition lists versus tables</span>\n            ","c_Definition_Lists_vs_Tables.html#concept_A52FECBCB9924DC7B4F26FA7C097B888",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Lists within paragraphs</span>\n            ","c_Lists_within_Paragraphs.html#D3781",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Controlling number (enumeration) type</span>\n            ","c_Controlling_Enumeration_Type.html#D9196",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Listing user interface buttons</span>\n            ","c_Limiting_User_Interface_Buttons.html#D9150",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Parameter lists</span>\n            ","c_Parameter_Lists.html#concept_89CD6D153FD84BBA88C394DA0715DC87",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Choice lists</span>\n            ","c_Choice_Lists.html#concept_B3C37DED7AF14E05B86CBE49DAC86C14",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Paragraphs</span>\n         ","c_Paragraphs.html#concept_E497B4D555794C5CB0EBEF9D2B66753B",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Procedures and steps</span>\n         ","c_Procedures.html#concept_6F8F642B68DD45FCBE9DF0F97E767C2A",[
["\n               <span class=\"webhelp-toc-section3-entry\">Semantics in steps</span>\n            ","c_Semantics_in_Steps.html#Dc_Semantics_in_Steps",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Separating procedures into granular steps</span>\n            ","c_Separating_Procedures_Into_Granular_Steps.html#D9079",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Restricting tasks to one procedure only</span>\n            ","c_Two_Tasks_on_One_Task_Topic.html#D5031",null],
["\n               <span class=\"webhelp-toc-section3-entry\">The prereq element</span>\n            ","c_Sentence_Syntax_in_prereq.html#D4704",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Substeps within steps</span>\n            ","c_Sub_Steps.html#D9242",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Single step procedure</span>\n            ","c_Single_Step_Procedure.html#D9165",null],
["\n               <span class=\"webhelp-toc-section3-entry\">The command element</span>\n            ","c_The_command_Element.html#concept_0A6D0A2A3523459F9FA9D5FF1E6757F0",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Required and optional steps</span>\n            ","c_Required_and_Optional_Steps.html#concept_2686B9CDFBD64B64A3B3422B6BDA4F48",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Complex nested tasks</span>\n            ","c_Complex_Nested_Tasks.html#D9095",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Notes and extra information in a step</span>\n            ","c_Notes_in_Steps.html#D5112",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Images within steps</span>\n            ","c_Images_within_Steps.html#D9193",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Choice tables</span>\n            ","c_Choice_Tables.html#D9081",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Non-sequential procedural steps</span>\n            ","c_Steps_and_Steps_Informal.html#D9164",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Tables</span>\n         ","c_Tables.html#concept_6884C7A0BBBF4792B2CF765F85CFB261",[
["\n               <span class=\"webhelp-toc-section3-entry\">Types of tables</span>\n            ","c_Types_of_Tables.html#concept_004AF201DB18436098E65BA6670EA8CA",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Working with tables</span>\n            ","c_Working_with_Tables.html#D9212",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Column and row headers</span>\n            ","c_Row_Headers.html#concept_568DD52E5D4D4879ADD0AA7C9D02617D",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Special characters</span>\n         ","c_Special_Characters_and_Dates.html#concept_B467B8254BA24147BAF963529F1AC78A",[
["\n               <span class=\"webhelp-toc-section3-entry\">Non-breaking spaces and special characters</span>\n            ","c_Non_Breaking_Spaces.html#D9202",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Dates</span>\n            ","c_Dates.html#concept_842A1B4B509945A49A119E7B7922BD3C",null]
]]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">Graphics and figures</span>\n      ","c_Working_with_Graphics_and_Figures.html#concept_44C535ACF8BD4650A40F472900B49F9A",[
["\n            <span class=\"webhelp-toc-section2-entry\">Figures and images</span>\n         ","c_Figures_or_Images.html#D2978",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Image file formats</span>\n         ","c_Image_File_Types.html#D9167",[
["\n               <span class=\"webhelp-toc-section3-entry\">Image file management</span>\n            ","c_Image_File_Management.html#D9336",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Different graphics for different published media</span>\n            ","c_Different_Graphics_for_Different_Outputs.html#D9345",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Image alignment, placement, and sizing</span>\n         ","c_Image_Alignment_and_Placement.html#concept_141498CD15574429BC13C95911FC8B60",null]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">Cross-referencing</span>\n      ","c_Cross-referencing.html#concept_05723D99BDA9446C95835E79454CC32B",[
["\n            <span class=\"webhelp-toc-section2-entry\">Types of cross-references</span>\n         ","c_Types_of_CrossReferences.html#concept_0D4E2C09D8D54D17A857954732B0C79A",null],
["\n            <span class=\"webhelp-toc-section2-entry\">The xref element</span>\n         ","c_The_xref_Element.html#concept_1976AE4D9BD0406695EE4ECDBF53CE90",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Cross-referencing topics and external resources</span>\n         ","c_Cross-referencing_Topics_and_External_Resources.html#concept_13B5790CDDCB4467A547F8C01220CF11",[
["\n               <span class=\"webhelp-toc-section3-entry\">Links to non-DITA resources</span>\n            ","c_Links_to_non-DITA_Resources.html#concept_A2EED5F6282845D3BC523F71BDA21DFD",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Linking in a new window</span>\n            ","c_Scope_Attribute.html#D5135",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Indirect linking with keys</span>\n            ","c_Indirection_with_keyref.html#D9338",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Cross-referencing elements in a topic</span>\n         ","c_Cross-referencing_Elements_in_a_Topic.html#concept_CFFB1D0AE8D04CBB96EF2A2630FCECFC",[
["\n               <span class=\"webhelp-toc-section3-entry\">Cross-referencing figures</span>\n            ","c_Cross_Referencing_Figures.html#D5129",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Cross-referencing tables</span>\n            ","c_Cross_Referencing_Tables.html#D5129-2",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Cross-referencing a step</span>\n            ","c_Referencing_Step_Numbers.html#D9148",null]
]],
["\n            <span class=\"webhelp-toc-section2-entry\">Sample topic - cross-references</span>\n         ","c_Cross-references_Sample_Topic.html#concept_sample_xref",null]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">Content re-use</span>\n      ","c_Content_Re-use.html#concept_FDC4B91535A64A78A123DD45D2AEECA1",[
["\n            <span class=\"webhelp-toc-section2-entry\">The content reference (conref) attribute</span>\n         ","c_Content_Reference.html#D1987",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Variables</span>\n         ","c_Variables.html#concept_9D578ED756174EF49F8DB3F080C0E050",[
["\n               <span class=\"webhelp-toc-section3-entry\">Variables using conref and filtering</span>\n            ","c_Variables_in_DITA.html#concept_BDCD39B6997048C9B6DD72DFF5DBADBC",null],
["\n               <span class=\"webhelp-toc-section3-entry\">Variables using indirection</span>\n            ","c_Variables_Using_keydef.html#concept_7016766027BF414AAC785D0B409FE71E",null]
]]
]],
["\n         <span class=\"webhelp-toc-section1-entry\">The DITA documentation process</span>\n      ","c_The_DITA_Publishing_Process.html#concept_0113DE9C06F4454D8111459C7BA2030B",[
["\n            <span class=\"webhelp-toc-section2-entry\">Structured authoring documentation stages</span>\n         ","c_Structured_Authoring_Process.html#D1734",null],
["\n            <span class=\"webhelp-toc-section2-entry\">The DITA publishing process</span>\n         ","c_DITA_Publishing_Process.html#D9120",null],
["\n            <span class=\"webhelp-toc-section2-entry\">Content Management Systems</span>\n         ","c_Content_Management_Systems.html#concept_888615C9ABDC4B7B9EEB8024675FF79E",null]
]]];
var toc_initiallyCollapsed = false;
 
var messages = [ 
"Contents", 
"Index", 
"Search", 
"Collapse All", 
"Expand All", 
"Previous Page", 
"Next Page", 
"Print Page", 
"Toggle search result highlighting", 
"No results found for %W%.", 
"1 result found for %W%.", 
"%N% results found for %W%.", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"See", 
"See also" 
]; 
var messageTranslations = { 
"de": [ 
"Inhalt", 
"Index", 
"Suchen", 
"Alle ausblenden", 
"Alle einblenden", 
"Vorherige Seite", 
"Nächste Seite", 
"Print Page", 
"Hervorhebung von Suchergebnissen ein-/ausschalten", 
"Keine Ergebnisse für %W% gefunden.", 
"1 Ergebnis für %W% gefunden.", 
"%N% Ergebnisse für %W% gefunden.", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"Siehe", 
"Siehe auch" 
], 
"es": [ 
"Contenido", 
"Índice", 
"Buscar", 
"Contraer todo", 
"Expandir todo", 
"Página anterior", 
"Página siguiente", 
"Print Page", 
"Alternar el resaltado de los resultados de la búsqueda", 
"No se ha encontrado ningún resultado para %W%.", 
"Se ha encontrado un resultado para %W%.", 
"Se han encontrado %N% resultados para %W%.", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"Ver", 
"Ver también" 
], 
"fr": [ 
"Sommaire", 
"Index", 
"Rechercher", 
"Replier Tout", 
"Déplier Tout", 
"Page Précédente", 
"Page Suivante", 
"Imprimer Page", 
"Basculer la mise en surbrillance", 
"Aucun résultat trouvé pour %W%.", 
"1 résultat trouvé pour %W%.", 
"%N% résultats trouvés pour %W%.", 
"Arrêter de rechercher", 
"Ouvrir le panneau de navigation", 
"Fermer le panneau de navigation", 
"terme", 
"mot", 
"Atteindre", 
"Voir", 
"Voir aussi" 
], 
"it": [ 
"Sommario", 
"Indice", 
"Ricerca", 
"Comprimi tutto", 
"Espandi tutto", 
"Pagina precedente", 
"Pagina successiva", 
"Print Page", 
"Attiva/Disattiva evidenziazione risultati ricerca", 
"Nessun risultato trovato per %W%.", 
"1 risultato trovato per %W%.", 
"%N% risultati trovati per %W%.", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"Vedere", 
"Vedere anche" 
], 
"ja": [ 
"目次", 
"索引", 
"検索", 
"すべて折りたたむ", 
"すべて展開", 
"前のページ", 
"次のページ", 
"Print Page", 
"検索キーワードをハイライト表示", 
"%W% の検索結果は見つかりませんでした。", 
"%W% の検索結果が 1 件見つかりました。", 
"%W% の検索結果が%N% 件見つかりました。%N%", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"参照：", 
"その他参照：" 
], 
"pl": [ 
"Spis treści", 
"Indeks", 
"Wyszukaj", 
"Zwiń wszystko", 
"Rozwiń wszystko", 
"Poprzednia strona", 
"Następna strona", 
"Print Page", 
"Przełącz wyróżnianie wyników wyszukiwania", 
"Brak wyników dla %W%.", 
"Znaleziono 1 wynik dla %W%.", 
"Znaleziono następującą liczbę wyników dla %W%: %N%", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"Zobacz", 
"Zobacz również" 
], 
"ru": [ 
"Содержание", 
"Указатель", 
"Поиск", 
"Свернуть все", 
"Развернуть все", 
"Предыдущая", 
"Следующая", 
"Print Page", 
"Выделение результатов поиска", 
"Ничего не найдено по запросу \"%W%\".", 
"Найдено результатов по запросу \"%W%\": 1.", 
"Найдено результатов по запросу \"%W%\": %N%.", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"См.", 
"См. также" 
], 
"zh-cn": [ 
"目录", 
"索引", 
"搜索", 
"全部折叠", 
"全部展开", 
"上一页", 
"下一页", 
"Print Page", 
"切换搜索结果高亮", 
"未找到有关 %W% 的结果。", 
"找到 1 条有关 %W% 的结果。", 
"找到 %N% 条有关 %W% 的结果。", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"See", 
"See also" 
], 
"zh-tw": [ 
"目錄", 
"索引", 
"搜尋", 
"收合全部", 
"展開全部", 
"上一頁", 
"下一頁", 
"Print Page", 
"反白顯示切換搜尋結果", 
"找不到 %W% 的結果。", 
"找到 １ 個 %W% 的結果。", 
"找到 %N% 個 %W% 的結果。", 
"Stop searching", 
"Open navigation pane", 
"Close navigation pane", 
"term", 
"word", 
"Go", 
"See", 
"See also" 
] 
}; 
 
var preferredUserLanguage = null; 
function getUserLanguage(lang) { 
if (lang === null) { 
lang = window.navigator.userLanguage || window.navigator.language; 
} 
if (lang) { 
lang = lang.toLowerCase(); 
if (lang.length > 5) { 
lang = lang.substring(0, 5); 
} 
if (lang.indexOf("_") >= 0) { 
lang = lang.replace(/_/g, "-"); 
} 
if (lang in messageTranslations) { 
return lang; 
} else { 
var pos = lang.indexOf("-"); 
if (pos > 0) { 
lang = lang.substring(0, pos); 
} 
if (lang in messageTranslations) { 
return lang; 
} else { 
return null; 
} 
} 
} else { 
return null; 
} 
} 
var userLanguage = getUserLanguage(preferredUserLanguage); 
function msg(message) { 
if (userLanguage !== null) { 
var translation = messageTranslations[userLanguage]; 
if (translation !== undefined) { 
var index = -1; 
var count = messages.length; 
for (var i = 0; i < count; ++i) { 
if (messages[i] === message) { 
index = i; 
break; 
} 
} 
if (index >= 0) { 
message = translation[index]; 
} 
} 
} 
return message; 
} 
var storageId = "lw2txk3kfu0d-1kisda8dvwjbq";
function storageSet(key, value) { 
window.sessionStorage.setItem(key + storageId, String(value)); 
} 
function storageGet(key) { 
return window.sessionStorage.getItem(key + storageId); 
} 
function storageDelete(key) { 
window.sessionStorage.removeItem(key + storageId); 
} 
function initMenu() { 
var menu = $("#wh-menu"); 
menu.attr("title", msg("Open navigation pane")); 
menu.click(function () { 
if (menu.hasClass("wh-icon-menu")) { 
openNavigation(); 
} else { 
closeNavigation(); 
} 
}); 
} 
function openNavigation() { 
var menu = $("#wh-menu"); 
menu.removeClass("wh-icon-menu").addClass("wh-icon-close"); 
menu.attr("title", msg("Close navigation pane")); 
var glass = $('<div id="wh-body-glass"></div>'); 
glass.css({ "position": "absolute", 
"top": "0px", 
"left": "0px", 
"z-index": "50", 
"width": "100%", 
"height": "100%", 
"background-color": "#808080", 
"opacity": "0.5" }); 
$("body").append(glass); 
glass.click(closeNavigation); 
var top = menu.position().top; 
top += menu.outerHeight( false); 
var height = $("#wh-body").height() - top; 
var nav = $("#wh-navigation"); 
nav.css({ "position": "absolute", 
"top": top + "px", 
"right": "0px", 
"z-index": "100", 
"width": "66%", 
"height": height + "px", 
"border-style": "solid", 
"display": "flex" }); 
} 
function closeNavigation() { 
var menu = $("#wh-menu"); 
menu.removeClass("wh-icon-close").addClass("wh-icon-menu"); 
menu.attr("title", msg("Open navigation pane")); 
$("#wh-body-glass").remove(); 
var nav = $("#wh-navigation"); 
nav.css({ "position": "", 
"top": "", 
"right": "", 
"z-index": "", 
"width": "", 
"height": "", 
"border-style": "", 
"display": "" }); 
var position = parseInt(storageGet("whSeparatorPosition"), 10); 
if (!isNaN(position)) { 
nav.width(position); 
} 
} 
function initSeparator() { 
var navigation = $("#wh-navigation"); 
var separator = $("#wh-separator"); 
var content = $("#wh-content"); 
separator.easyDrag({ 
axis: "x", 
container: $("#wh-body"), 
clickable: false, 
cursor: "", 
start: function() { 
$(this).data("startDragLeftOffset", $(this).offset().left); 
}, 
stop: function() { 
var delta = 
$(this).offset().left - $(this).data("startDragLeftOffset"); 
if (delta !== 0) { 
var availableW = $("#wh-body").width(); 
var reservedW = 1 + getPad(navigation,  false)/2 + 
separator.outerWidth( true) + 
getPad(content,  false)/2; 
var maxW = availableW - reservedW; 
var w = navigation.width() + delta; 
if (w < reservedW) { 
w = reservedW; 
} else if (w > maxW) { 
w = maxW; 
} 
saveSeparatorPosition(separator, w); 
navigation.width(w); 
} 
} 
}); 
var position = parseInt(storageGet("whSeparatorPosition"), 10); 
if (isNaN(position)) { 
position = navigation.width(); 
} 
saveSeparatorPosition(separator, position); 
navigation.width(position); 
} 
function getPad(pane, vertical) { 
if (vertical) { 
return pane.outerHeight( true) - pane.height(); 
} else { 
return pane.outerWidth( true) - pane.width(); 
} 
} 
function saveSeparatorPosition(separator, position) { 
separator.css("left", "0px"); 
storageSet("whSeparatorPosition", position.toString()); 
} 
function populateTOC() { 
var tocPane = $("#wh-toc-pane"); 
var list = $("<ul id='wh-toc'></ul>"); 
tocPane.append(list); 
if (typeof toc_entries !== "undefined") { 
var count = toc_entries.length; 
for (var i = 0; i < count; ++i) { 
addTOCEntry(toc_entries[i], list); 
} 
toc_entries = undefined; 
} 
} 
function addTOCEntry(entry, list) { 
var text = entry[0]; 
var href = entry[1]; 
var children = entry[2]; 
var count = (children !== null)? children.length : 0; 
var item = $("<li></li>"); 
list.append(item); 
if (href !== null) { 
var link = $("<a></a>"); 
link.attr("href", href); 
link.html(text); 
item.append(link); 
} else { 
item.html(text); 
} 
if (count > 0) { 
var sublist = $("<ul></ul>"); 
item.append(sublist); 
for (var i = 0; i < count; ++i) { 
addTOCEntry(children[i], sublist); 
} 
} 
} 
function doInitTOC() { 
populateTOC(); 
var toc = $("#wh-toc"); 
var tocOptions = { storageKey: ("whTOCState" + storageId) }; 
if ((typeof toc_initiallyCollapsed !== "undefined") && 
toc_initiallyCollapsed) { 
tocOptions.initiallyCollapsed = true; 
} 
toc.toc(tocOptions); 
} 
var fieldKeys = { 
ENTER: 13, 
ESCAPE: 27, 
UP: 38, 
DOWN: 40 
}; 
function startSearch(field) { 
stopSearch(field); 
var query = $.trim(field.val()); 
if (query.length === 0) { 
field.val(""); 
return null; 
} 
var words = splitWords(query); 
if (words === null) { 
field.val(""); 
return null; 
} 
return [query, words]; 
} 
function splitWords(query) { 
var split = query.split(/\s+/); 
var words = []; 
for (var i = 0; i < split.length; ++i) { 
var segment = split[i]; 
if (stringStartsWith(segment, '"') || stringStartsWith(segment, "'")) { 
segment = segment.substring(1); 
} 
if (stringEndsWith(segment, '"') || stringEndsWith(segment, "'")) { 
segment = segment.substring(0, segment.length-1); 
} 
if (segment.length > 0) { 
words.push(segment.toLowerCase()); 
} 
} 
if (words.length === 0) { 
words = null; 
} 
return words; 
} 
function stringStartsWith(text, prefix) { 
return (text.indexOf(prefix) === 0); 
} 
function stringEndsWith(text, suffix) { 
return (text.substr(-suffix.length) === suffix); 
} 
function stopSearch(field) { 
$("#wh-search-results").empty(); 
var pane = $("#wh-search-pane"); 
pane.scrollTop(0); 
var words = pane.removeData("whSearchedWords2"); 
if (words !== null) { 
unhighlightSearchedWords(); 
} 
clearSearchState(); 
} 
function highlightSearchedWords(words) { 
$("#wh-content").highlight(words, 
{ caseSensitive: false, 
className: "wh-highlighted" }); 
} 
function unhighlightSearchedWords() { 
$("#wh-content").unhighlight({ className: "wh-highlighted" }); 
} 
function doSearch(query, words) { 
var searchResults = $("#wh-search-results"); 
var searchedWords = []; 
var resultIndices = findWords(words, searchedWords); 
displaySearchResults(query, words, searchedWords, 
resultIndices, searchResults); 
saveSearchState(query, words, searchedWords, resultIndices); 
} 
function displaySearchResults(query, words, searchedWords, 
resultIndices, searchResults) { 
searchResults.empty(); 
if (resultIndices === null || resultIndices.length === 0) { 
searchResults.append(searchResultHeader(0, words)); 
return; 
} 
searchResults.append(searchResultHeader(resultIndices.length, words)); 
searchResults.append(searchResultList(resultIndices)); 
var resultLinks = $("#wh-search-result-list a"); 
highlightSearchedWordsImmediately(searchedWords, resultLinks); 
var currentPage = trimFragment(window.location.href); 
resultLinks.click(function (event) { 
if (this.href === currentPage) { 
event.preventDefault(); 
} 
}); 
} 
function findWords(words, searchedWords) { 
var pageCount = wh.search_baseNameList.length; 
var hits = new Array(pageCount); 
var i, j, k; 
for (i = 0; i < pageCount; ++i) { 
hits[i] = 0; 
} 
var wordCount = words.length; 
for (i = 0; i < wordCount; ++i) { 
var indices; 
var fallback = true; 
var word = words[i]; 
if (wh.search_stemmer !== null && 
word.search(/^[-+]?\d/) < 0) { 
var stem = wh.search_stemmer.stemWord(word); 
if (stem != word) { 
indices = wh.search_wordMap[stem]; 
if (indices !== undefined) { 
fallback = false; 
searchedWords.push(stem); 
if (word.indexOf(stem) < 0) { 
searchedWords.push(word); 
} 
} 
} 
} 
if (fallback) { 
indices = wh.search_wordMap[word]; 
searchedWords.push(word); 
} 
if (indices !== undefined) { 
var hitPageCount = 0; 
var indexCount = indices.length; 
for (j = 0; j < indexCount; ++j) { 
var index = indices[j]; 
if ($.isArray(index)) { 
hitPageCount += index.length; 
} else { 
++hitPageCount; 
} 
} 
var unit = 100.0 * ((pageCount - hitPageCount + 1)/pageCount); 
for (j = 0; j < indexCount; ++j) { 
var index = indices[j]; 
if ($.isArray(index)) { 
var hitIncr = 
10000.0 + (((indexCount - j)/indexCount) * unit); 
for (k = 0; k < index.length; ++k) { 
hits[index[k]] += hitIncr; 
} 
} else { 
hits[index] += 
10000.0 + (((indexCount - j)/indexCount) * unit); 
} 
} 
} else { 
return null; 
} 
} 
var resultIndices = []; 
var minHitValue = 10000.0 * wordCount; 
for (i = 0; i < pageCount; ++i) { 
if (hits[i] > minHitValue) { 
resultIndices.push(i); 
} 
} 
if (resultIndices.length === 0) { 
resultIndices = null; 
} else if (resultIndices.length > 1) { 
function comparePageIndices(i, j) { 
var delta = hits[j] - hits[i]; 
if (delta !== 0) { 
return delta; 
} else { 
return (i - j); 
} 
}; 
resultIndices.sort(comparePageIndices); 
} 
return resultIndices; 
} 
function searchResultHeader(resultCount, words) { 
var header = $("<div id='wh-search-result-header'></div>"); 
var message; 
switch (resultCount) { 
case 0: 
message = msg("No results found for %W%."); 
break; 
case 1: 
message = msg("1 result found for %W%."); 
break; 
default: 
message = 
msg("%N% results found for %W%.").replace(new RegExp("%N%", "g"), 
resultCount.toString()); 
} 
message = escapeHTML(message); 
var spans = ""; 
for (var i = 0; i < words.length; ++i) { 
if (i > 0) { 
spans += " "; 
} 
spans += "<span class='wh-highlighted'>"; 
spans += escapeHTML(words[i]); 
spans += "</span>"; 
} 
header.html(message.replace(new RegExp("%W%", "g"), spans)); 
return header; 
} 
function escapeHTML(text) { 
return text.replace(/&/g, "&amp;") 
.replace(/</g, "&lt;") 
.replace(/>/g, "&gt;") 
.replace(/"/g, "&quot;"); 
} 
function searchResultList(resultIndices) { 
var list = $("<ul id='wh-search-result-list'></ul>"); 
var resultCount = resultIndices.length; 
for (var i = 0; i < resultCount; ++i) { 
var index = resultIndices[i]; 
var item = $("<li class='wh-search-result-item'></li>"); 
if ((i % 2) === 1) { 
item.addClass("wh-odd-item"); 
} 
list.append(item); 
var link = $("<a></a>"); 
link.attr("href", wh.search_baseNameList[index]); 
link.html(wh.search_titleList[index]); 
item.append(link); 
} 
return list; 
} 
function highlightSearchedWordsImmediately(searchedWords, resultLinks) { 
var currentPage = trimFragment(window.location.href); 
var resultLink = resultLinks.filter(function () { 
return this.href === currentPage; 
}); 
if (resultLink.length === 1) { 
$("#wh-search-pane").data("whSearchedWords2", searchedWords); 
var highlightToggle = $("#wh-search-highlight"); 
if (highlightToggle.length === 0 || highlightToggle.toggle("check")) { 
highlightSearchedWords(searchedWords); 
} 
} 
} 
function saveSearchState(query, words, searchedWords, resultIndices) { 
storageSet("whSearchQuery", query); 
storageSet("whSearchedWords", words.join(" ")); 
storageSet("whSearchedWords2", searchedWords.join(" ")); 
storageSet("whSearchResults", 
((resultIndices === null || resultIndices.length === 0)? 
"" : resultIndices.join(","))); 
} 
function clearSearchState() { 
storageDelete("whSearchQuery"); 
storageDelete("whSearchedWords"); 
storageDelete("whSearchedWords2"); 
storageDelete("whSearchResults"); 
} 
function restoreSearchState(field) { 
var query = storageGet("whSearchQuery"); 
if (query) { 
var words = storageGet("whSearchedWords"); 
var searchedWords = storageGet("whSearchedWords2"); 
var list = storageGet("whSearchResults"); 
if (query.length > 0 && 
words !== undefined && 
searchedWords !== undefined && 
list !== undefined) { 
words = words.split(" "); 
if (words.length > 0) { 
searchedWords = searchedWords.split(" "); 
if (searchedWords.length > 0) { 
var resultIndices = []; 
if (list.length > 0) { 
var items = list.split(","); 
var count = items.length; 
for (var i = 0; i < count; ++i) { 
var index = parseInt(items[i], 10); 
if (index >= 0) { 
resultIndices.push(index); 
} else { 
return; 
} 
} 
} 
field.val(query); 
displaySearchResults(query, words, searchedWords, 
resultIndices, $("#wh-search-results")); 
} 
} 
} 
} 
} 
function initContent() { 
selectTOCEntry(window.location.href); 
$("#wh-toc a[href], #wh-content a[href]").click(function () { 
if (trimFragment(this.href) === trimFragment(window.location.href)) { 
selectTOCEntry(this.href); 
} 
}); 
} 
function trimFragment(href) { 
var hash = href.lastIndexOf("#"); 
if (hash >= 0) { 
return href.substring(0, hash); 
} else { 
return href; 
} 
} 
function selectTOCEntry(url) { 
var links = $("#wh-toc a"); 
links.removeClass("wh-toc-selected"); 
var selectable = links.filter(function () { 
return (this.href === url); 
}); 
var hash; 
if (selectable.length === 0 && (hash = url.lastIndexOf("#")) >= 0) { 
url = url.substring(0, hash); 
selectable = links.filter(function () { 
return (this.href === url); 
}); 
} 
if (selectable.length === 0) { 
selectable = links.filter(function () { 
return (trimFragment(this.href) === url); 
}); 
} 
if (selectable.length > 0) { 
selectable = selectable.first(); 
selectable.addClass("wh-toc-selected"); 
var entry = selectable.parent("li"); 
$("#wh-toc").toc("showEntry", entry,  false); 
var pane = $("#wh-toc-pane"); 
if (pane.is(":visible")) { 
pane.removeData("whPendingScroll"); 
pane.scrollTop(entry.offset().top - pane.offset().top); 
} else { 
pane.data("whPendingScroll", { container: pane, component: entry }); 
} 
} 
} 
function processPendingScroll(pane) { 
var scroll = pane.data("whPendingScroll"); 
if (scroll !== undefined) { 
pane.removeData("whPendingScroll"); 
scroll.container.scrollTop(scroll.component.offset().top - 
scroll.container.offset().top); 
} 
} 
function layout(resizeEvent) { 
var menu = $("#wh-menu"); 
if (menu.hasClass("wh-icon-close")) { 
if (resizeEvent === null) { 
closeNavigation(); 
} else if (window.matchMedia("(max-width: 575.98px)").matches) { 
var top = menu.position().top; 
top += menu.outerHeight( false); 
var height = $("#wh-body").height() - top; 
$("#wh-navigation").css("height", height + "px"); 
} else { 
closeNavigation(); 
} 
} 
var h = $(window).height(); 
var pane = $("#wh-header"); 
if (pane.length > 0 && pane.is(":visible")) { 
h -= pane.outerHeight( true); 
} 
pane = $("#wh-footer"); 
if (pane.length > 0 && pane.is(":visible")) { 
h -= pane.outerHeight( true); 
} 
var body = $("#wh-body"); 
body.outerHeight(h,  true); 
} 
function scrollToFragment() { 
 
var fragment = getFragment(window.location.href); 
if (fragment !== null) { 
fragment = fragment.replace(/\./g, "\\."); 
var anchor = $(fragment); 
if (anchor) { 
var content = $("#wh-content"); 
content.scrollTop(anchor.offset().top - content.offset().top + 
content.scrollTop()); 
 
} 
} 
} 
function getFragment(href) { 
var hash = href.lastIndexOf("#"); 
if (hash >= 0) { 
return href.substring(hash);  
} else { 
return null; 
} 
} 
 
 function initPage() { 
initMenu(); 
initSeparator(); 
initNavigation(); 
initTOC(); 
var hasIndex = ($("#wh-index-container").length === 1); 
var indexField = null; 
if (hasIndex) { 
indexField = $("#wh-index-field"); 
initIndex(indexField); 
} 
var searchField = $("#wh-search-field"); 
initSearch(searchField); 
initContent(); 
$(window).resize(layout); 
layout( null); 
if (hasIndex) { 
restoreIndexTerm(indexField); 
} 
restoreSearchState(searchField); 
scrollToFragment(); 
} 
function initNavigation() { 
var indexTab = $("#wh-index-tab"); 
if ($("#wh-toc-tab > a").css("font-weight") > 
$("#wh-toc-tab").css("font-weight")) { 
$("#wh-toc-tab > a").text(msg("Contents")); 
if (indexTab.length === 1) { 
$("#wh-index-tab > a").text(msg("Index")); 
} 
$("#wh-search-tab > a").text(msg("Search")); 
} else { 
$("#wh-toc-tab").attr("title", msg("Contents")); 
if (indexTab.length === 1) { 
indexTab.attr("title", msg("Index")); 
} 
$("#wh-search-tab").attr("title", msg("Search")); 
} 
var index = 0; 
var tabsState = storageGet("whTabsState"); 
if (tabsState) { 
index = parseInt(tabsState); 
} 
$("#wh-tabs").tabs({ selected: index, onselect: tabSelected }); 
} 
function tabSelected(index) { 
var index = $("#wh-tabs").tabs("select"); 
storageSet("whTabsState", index); 
var pane; 
switch (index) { 
case 0: 
pane = $("#wh-toc-pane"); 
break; 
case 1: 
pane = $("#wh-index-pane"); 
if (pane.length === 1) { 
$("#wh-index-field").focus(); 
break; 
} 
case 2: 
pane = $("#wh-search-pane"); 
$("#wh-search-field").focus(); 
break; 
} 
processPendingScroll(pane); 
} 
function initTOC() { 
doInitTOC(); 
initTOCButtons(); 
} 
function initTOCButtons() { 
var toc = $("#wh-toc"); 
var button = $("#wh-toc-collapse-all"); 
button.attr("title", msg("Collapse All")) 
.click(function (event) { 
event.preventDefault(); 
toc.toc("expandCollapseAll", false); 
}); 
button = $("#wh-toc-expand-all"); 
button.attr("title", msg("Expand All")) 
.click(function (event) { 
event.preventDefault(); 
toc.toc("expandCollapseAll", true); 
}); 
button = $("#wh-toc-previous"); 
button.attr("title", msg("Previous Page")) 
.click(function (event) { 
goTo(true); 
}); 
button = $("#wh-toc-next"); 
button.attr("title", msg("Next Page")) 
.click(function (event) { 
goTo(false); 
}); 
button = $("#wh-toc-print"); 
button.attr("title", msg("Print Page")) 
.click(function (event) { 
print(); 
}); 
} 
function goTo(previous) { 
var anchors = $("#wh-toc a[href]"); 
var currentPage = trimFragment(window.location.href); 
var currentAnchor = anchors.filter(function (index) { 
return (trimFragment(this.href) === currentPage); 
}); 
var target = null; 
if (currentAnchor.length > 0) { 
if (previous) { 
currentAnchor = currentAnchor.first(); 
} else { 
currentAnchor = currentAnchor.last(); 
} 
var index = anchors.index(currentAnchor); 
if (index >= 0) { 
if (previous) { 
--index; 
} else { 
++index; 
} 
if (index >= 0 && index < anchors.length) { 
target = anchors.get(index); 
} 
} 
} else if (anchors.length > 0) { 
if (previous) { 
target = anchors.last().get(0); 
} else { 
target = anchors.first().get(0); 
} 
} 
if (target !== null) { 
window.location.href = trimFragment(target.href); 
} 
} 
function print() { 
var anchors = $("#wh-toc a[href]"); 
var currentPage = trimFragment(window.location.href); 
var currentAnchor = anchors.filter(function (index) { 
return (trimFragment(this.href) === currentPage); 
}); 
if (currentAnchor.length > 0) { 
currentAnchor = currentAnchor.first(); 
var currenTitle = currentAnchor.text(); 
var popup = 
window.open("", "whPrint", 
"left=0,top=0,height=400,width=600" + 
",resizable=yes,scrollbars=yes,status=yes"); 
if (popup) { 
var doc = popup.document; 
doc.open(); 
doc.write("<html><head><title>"); 
doc.write(escapeHTML(currenTitle)); 
doc.write("</title>"); 
doc.write("<base href=\""); 
doc.write(currentPage); 
doc.write("\">"); 
$("head > link[rel='stylesheet'][href], head > style").each( 
function (index) { 
if (!$(this).is("link") || 
$(this).attr("href").indexOf("_wh/wh.css") < 0) { 
var div = $("<div></div>").append($(this).clone()); 
doc.write(div.html()); 
} 
}); 
doc.write("</head><body>"); 
doc.write($("#wh-content").html()); 
doc.write("</body></html>"); 
doc.close(); 
popup.setTimeout(function() { popup.print(); popup.close(); }, 250); 
} 
} 
} 
function populateIndex() { 
var indexPane = $("#wh-index-pane"); 
var list = $("<ul id='wh-index'></ul>"); 
indexPane.append(list); 
if (typeof index_entries !== "undefined") { 
var count = index_entries.length; 
for (var i = 0; i < count; ++i) { 
addIndexEntry(index_entries[i], list); 
} 
index_entries = undefined; 
} 
} 
 
function addIndexEntry(entry, list) { 
var item = $("<li class='wh-index-entry'></li>"); 
list.append(item); 
var term = $("<span class='wh-index-term'></span>"); 
term.html(entry.term); 
item.append(term); 
var i; 
var terms = entry.see; 
if (terms !== undefined) { 
var seeList = $("<ul class='wh-index-entries'></ul>"); 
item.append(seeList); 
addSee("see", terms, seeList); 
} else { 
var hrefs = entry.anchor; 
if (hrefs !== undefined) { 
var j = 0; 
var hrefCount = hrefs.length; 
for (i = 0; i < hrefCount; i += 2) { 
var href = hrefs[i]; 
var href2 = hrefs[i+1]; 
item.append("\n"); 
var link = $("<a class='wh-index-anchor'></a>"); 
link.attr("href", href); 
++j; 
link.text("[" + j + "]"); 
item.append(link); 
if (href2 !== null) { 
item.append("&#8212;"); 
var link2 = $("<a class='wh-index-anchor'></a>"); 
link2.attr("href", href2); 
++j; 
link2.text("[" + j + "]"); 
item.append(link2); 
} 
} 
} 
var entries = entry.entry; 
terms = entry.seeAlso; 
if (entries !== undefined || terms !== undefined) { 
var subList = $("<ul class='wh-index-entries'></ul>"); 
item.append(subList); 
if (entries !== undefined) { 
var entryCount = entries.length; 
for (i = 0; i < entryCount; ++i) { 
addIndexEntry(entries[i], subList); 
} 
} 
if (terms !== undefined) { 
addSee("see-also", terms, subList); 
} 
} 
} 
} 
function addSee(refType, terms, list) { 
var termCount = terms.length; 
for (var i = 0; i < termCount; ++i) { 
var term = terms[i]; 
var item = $("<li></li>"); 
item.addClass("wh-index-" + refType); 
item.html("\n" + term); 
list.append(item); 
var see = $("<span class='wh-index-ref-type'></span>"); 
see.text((refType === "see")? msg("See") : msg("See also")); 
see.prependTo(item); 
} 
} 
function initIndex(field) { 
populateIndex(); 
$("#wh-index > li:odd").addClass("wh-odd-item"); 
field.attr("autocomplete", "off").attr("spellcheck", "false") 
.attr("placeholder", msg("term")); 
var allItems = $("#wh-index li"); 
field.keyup(function (event) { 
switch (event.which) { 
case fieldKeys.ENTER: 
goSuggestedIndexEntry(field, allItems); 
break; 
case fieldKeys.ESCAPE: 
cancelSuggestIndexEntry(field, allItems); 
break; 
case fieldKeys.UP: 
autocompleteIndexEntry(field, allItems, true); 
break; 
case fieldKeys.DOWN: 
autocompleteIndexEntry(field, allItems, false); 
break; 
default: 
suggestIndexEntry(field, allItems); 
} 
}); 
$("#wh-go-page").attr("title", msg("Go")) 
.click(function (event) { 
goSuggestedIndexEntry(field, allItems); 
}); 
$("#wh-index a.wh-index-anchor").click(function (event) { 
selectIndexEntry(this, field, allItems); 
}); 
} 
var indexEntries = null; 
function suggestIndexEntry(field, allItems) { 
cancelSuggestIndexItem(field, allItems); 
var prefix = normalizeTerm(field.val()); 
if (prefix.length > 0) { 
if (indexEntries === null) { 
initIndexEntries(); 
} 
var entryCount = indexEntries.length; 
for (var i = 0; i < entryCount; i += 2) { 
if (indexEntries[i].indexOf(prefix) === 0) { 
suggestIndexItem(indexEntries[i+1]); 
break; 
} 
} 
} 
} 
function normalizeTerm(term) { 
if (term.length > 0) { 
term = term.replace(/^\s+|\s+$/g, "") 
.replace(/\s{2,}/g, " ") 
.toLowerCase(); 
} 
return term; 
} 
function initIndexEntries() { 
indexEntries = []; 
collectIndexEntries($("#wh-index > li"), null, indexEntries); 
} 
function collectIndexEntries(items, parentTerm, list) { 
items.each(function () { 
var termSpan = $(this).children("span.wh-index-term"); 
if (termSpan.length === 1) { 
var term = normalizeTerm(termSpan.text()); 
if (parentTerm !== null) { 
term = parentTerm + " " + term; 
} 
list.push(term); 
list.push(this); 
var subItems = $(this).children("ul.wh-index-entries") 
.children("li.wh-index-entry"); 
if (subItems.length > 0) { 
collectIndexEntries(subItems, term, list); 
} 
} 
}); 
} 
function suggestIndexItem(item) { 
var suggest = $(item); 
suggest.addClass("wh-suggested-item"); 
var pane = $("#wh-index-pane"); 
if (pane.is(":visible")) { 
pane.removeData("whPendingScroll"); 
pane.scrollTop(suggest.offset().top - pane.offset().top); 
} else { 
pane.data("whPendingScroll", { container: pane, component: suggest }); 
} 
} 
function cancelSuggestIndexEntry(field, allItems) { 
field.val(""); 
cancelSuggestIndexItem(field, allItems); 
} 
function cancelSuggestIndexItem(field, allItems) { 
storageDelete("whIndexTerm"); 
allItems.removeClass("wh-suggested-item"); 
var pane = $("#wh-index-pane"); 
pane.scrollTop(0); 
pane.removeData("whPendingScroll"); 
} 
function goSuggestedIndexEntry(field, allItems) { 
var item = allItems.filter(".wh-suggested-item"); 
if (item.length === 1) { 
var anchors = item.children("a.wh-index-anchor"); 
if (anchors.length > 0) { 
var anchor = anchors.get(0); 
selectIndexEntry(anchor, field, allItems); 
window.location.href = anchor.href; 
} 
} 
} 
function autocompleteIndexEntry(field, allItems, previous) { 
cancelSuggestIndexItem(field, allItems); 
var term = null; 
var item = null; 
if (indexEntries === null) { 
initIndexEntries(); 
} 
var prefix = normalizeTerm(field.val()); 
if (prefix.length > 0) { 
var entryCount = indexEntries.length; 
var i; 
for (i = 0; i < entryCount; i += 2) { 
if (indexEntries[i] === prefix) { 
var index; 
if (previous) { 
index = i - 2; 
} else { 
index = i + 2; 
} 
if (index >= 0 && index+1 < entryCount) { 
term = indexEntries[index]; 
item = indexEntries[index+1]; 
} else { 
term = indexEntries[i]; 
item = indexEntries[i+1]; 
} 
break; 
} 
} 
if (item === null) { 
for (i = 0; i < entryCount; i += 2) { 
if (indexEntries[i].indexOf(prefix) === 0) { 
term = indexEntries[i]; 
item = indexEntries[i+1]; 
break; 
} 
} 
} 
} else { 
term = indexEntries[0]; 
item = indexEntries[1]; 
} 
if (item !== null) { 
field.val(term); 
suggestIndexItem(item); 
} 
} 
function selectIndexEntry(anchor, field, allItems) { 
var term = null; 
var item = $(anchor).parent().get(0); 
if (indexEntries === null) { 
initIndexEntries(); 
} 
var entryCount = indexEntries.length; 
for (var i = 0; i < entryCount; i += 2) { 
if (indexEntries[i+1] === item) { 
term = indexEntries[i]; 
break; 
} 
} 
if (term === null) { 
storageDelete("whIndexTerm"); 
} else { 
storageSet("whIndexTerm", term); 
field.val(term); 
allItems.removeClass("wh-suggested-item"); 
$(item).addClass("wh-suggested-item"); 
} 
} 
function restoreIndexTerm(field) { 
var term = storageGet("whIndexTerm"); 
if (term) { 
field.val(term); 
if (indexEntries === null) { 
initIndexEntries(); 
} 
var entryCount = indexEntries.length; 
for (var i = 0; i < entryCount; i += 2) { 
if (indexEntries[i] === term) { 
suggestIndexItem(indexEntries[i+1]); 
break; 
} 
} 
} 
} 
function initSearch(field) { 
field.attr("autocomplete", "off").attr("spellcheck", "false") 
.attr("placeholder", msg("word")); 
field.keyup(function (event) { 
switch (event.which) { 
case fieldKeys.ENTER: 
search(field); 
break; 
case fieldKeys.ESCAPE: 
cancelSearch(field); 
break; 
} 
}); 
$("#wh-do-search").attr("title", msg("Search")) 
.click(function (event) { 
search(field); 
}); 
$("#wh-cancel-search").attr("title", msg("Stop searching")) 
.click(function (event) { 
cancelSearch(field); 
}); 
var toggle = $("#wh-search-highlight"); 
toggle.attr("title", msg("Toggle search result highlighting")); 
toggle.toggle({ checked: storageGet("whHighlightOff")? false : true, 
ontoggle: toggleHighlight }); 
} 
function toggleHighlight(checked) { 
if (checked) { 
storageDelete("whHighlightOff"); 
} else { 
storageSet("whHighlightOff", "1"); 
} 
var words = $("#wh-search-pane").data("whSearchedWords2"); 
if (words !== undefined) { 
if (checked) { 
highlightSearchedWords(words); 
} else { 
unhighlightSearchedWords(); 
} 
} 
} 
function search(field) { 
var pair = startSearch(field); 
if (pair === null) { 
return; 
} 
doSearch(pair[0], pair[1]); 
} 
function cancelSearch(field) { 
field.val(""); 
stopSearch(field); 
} 
return {
initPage: initPage,
}
})();
 
$(document).ready(function() { 
wh.initPage(); 
$("#wh-body").css({ "visibility": "visible", "opacity": "1" }); 
}); 
