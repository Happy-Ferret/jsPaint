/*
* Get absolute coordinates of the element
*/
function getAbsoluteElementPosition(element) {
	var obj = element;
	
	var coords = {
		x: 0,
		y: 0
	};

    if (!element)
        return coords;
	
	do {
		coords.x += obj.offsetLeft;
		coords.y += obj.offsetTop;
	} while (obj = obj.offsetParent);
		
	return coords;
}

function getElementPositionInWindow(element) {
    var obj = element;

    var coords = {
        x: 0,
        y: 0
    };

    do {
        coords.x += obj.offsetLeft;
        coords.y += obj.offsetTop;
    } while ((obj = obj.offsetParent) && (!elementIsClass(obj, 'outer_border')));

    return coords;
}

/*
* Get coordinates of the mouse cursor relative to an element
*/
function getRelativeMousePos(element, evt) {
	var mouseX = evt.pageX - element.offsetLeft;
	var mouseY = evt.pageY - element.offsetTop;
	
	return {
	  x: mouseX,
	  y: mouseY
	};
}

/*
* Get absolute mouse coordinates
*/
function getAbsoluteMousePos(evt) {
	return {
		x: evt.pageX,
		y: evt.pageY
	};
}