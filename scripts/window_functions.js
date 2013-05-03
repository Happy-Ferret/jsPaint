/*
LIST OF AVAILABLE PARAMETERS:

title				string			Sets caption of the window

content				string			ID of the div, that contains data

canMinimize			bool			Is `minimize` system button visible
canMaximize			bool			Is `maximize` system button visible
canClose			bool			Is `close` system button visible

resizable			bool			Is window resizable

icon				string			Path to the icon image

id					string			Replace window_template_%blockname% by %id%_%blockname%

width				int				Window width
height				int				Window height

*/

var draggableWindow = null;
var offsetX;
var offsetY;

function changeIDRec(node, id) {
	if (node.id != null && node.id == "window_template")
		node.id = id;
	else if (node.id != null && node.id.substring(0, 3) == "wt_")
		node.id = id + "_" + node.id.substring(3);
			
	var children = node.childNodes;

    for (var i = 0;i < children.length; i++)
        changeIDRec(children[i], id);
}

function createWindow(args) {
	var root = getElement('window_template').cloneNode(true);
	
	var id = args.id;
	changeIDRec(root, id);
	
	getElement('app').appendChild(root);
	
	if (args.width != null)
		getElement(id).style.width = args.width;
		
	if (args.height != null)
		getElement(id).style.height = args.height;
	
	var textNode = document.createTextNode(args.title);
	getElement(id + '_title').appendChild(textNode);
	
	var contentBlock = getElement(args.content);
	contentBlock.style.display = "block";
	
	getElement('app').removeChild(contentBlock);
	getElement(id + '_content').appendChild(contentBlock);
	
	getElement(id + '_minimize_button').style.display = args.canMinimize == null || !args.canMinimize ? "none" : "block";
	getElement(id + '_maximize_button').style.display = args.canMaximize == null || !args.canMaximize ? "none" : "block";
	getElement(id + '_close_button').style.display = args.canClose == null || args.canClose ? "block" : "none";	
}

function closeWindow(element){
    var elem = element;

    while (!elementIsClass(elem, 'outer_border'))
        elem = elem.parentNode;

    elem.style.display = "none";
}

function drag(e) {
	if (draggableWindow == null)
		return;
		
	var coords = getAbsoluteMousePos(e);
	draggableWindow.style.left = coords.x - offsetX;
	draggableWindow.style.top = coords.y - offsetY;
}

function beginDrag(event, window) {
	var mouseCoords = getAbsoluteMousePos(event);
	var windowCoords = getAbsoluteElementPosition(window);
	
	draggableWindow = window.parentNode.parentNode;
	offsetX = mouseCoords.x - windowCoords.x;
	offsetY = mouseCoords.y - windowCoords.y;
}

function endDrag() {
	draggableWindow = null;
}