/* GLOBAL VARIABLES */

var isMouseDown = false;

var predefinedBrushWidth = [ 1, 2, 3, 4 ];
var predefinedEraserSize = [ 4, 6, 8, 10 ];
var predefinedColors = [
						"#000000", "#7F7F7F", "#880015", "#ED1C24", "#FF7F27", "#FFF200", "#22B14C", "#00A2E8", "#3F48CC", "#A349A4",
						"#FFFFFF", "#C3C3C3", "#B97A57", "#FFAEC9", "#FFC90E", "#EFE4B0", "#B5E61D", "#B5E61D", "#7092BE", "#C8BFE7"
						];

var customColorIndex = 0;
var customColors = ["Transparent", "Transparent", "Transparent", "Transparent", "Transparent", "Transparent", "Transparent", "Transparent", "Transparent", "Transparent"];

var oldX = 0;
var oldY = 0;

// color variables section
var isPrimaryColorActive = true;
var primaryColor;
var secondaryColor;

// brush variables section
var selectedBrushIndex = 1;

// resizing variables section
// 0 - not resized; 1 - east; 2 - south; 3 - south-east
var resizingStatus = 0;

// tools
// 0 - nether selected; 1 - pencil; 2 - fill; 3 - text; 4 - eraser; 5 - color picker; 6 - zooming
var selectedTool = 0;

/* FUNCTIONS */

function mouseDown(){
	isMouseDown = true;
}

function mouseUp(){
	isMouseDown = false;
	
	if (resizingStatus != 0)
		endResizing();
}

function mouseMove(event) {
	var canvas = getElement('canvas_block');
	var coords = getRelativeMousePos(canvas, event);
	
	if (selectedTool == 4) {
		var eraser = getElement('eraser_cursor');
		var canvasPosition = getAbsoluteElementPosition(canvas);
		eraser.style.left = canvasPosition.x + coords.x;
		eraser.style.top = canvasPosition.y + coords.y;
	}
	
	if (isMouseDown){
		switch (selectedTool) {
			case 1:
				drawLine(oldX, oldY, coords.x, coords.y);
				break;
				
			case 2:
				fill(coords.x, coords.y);
				break;
				
			case 4:
				erase(coords.x, coords.y);
				break;
				
			case 5:
				var colorFromPicker = pickColor(coords.x, coords.y);				
				changeColor(toRgb(colorFromPicker.red, colorFromPicker.green, colorFromPicker.blue));
				
				activatePencil();
				break;
		}
	}	
	
	updateCoords (coords);
	
	oldX = coords.x;
	oldY = coords.y;
}

/* DRAWING FUNCTIONS */

function erase(x, y) {
	var canvas = getElement('canv').getContext("2d");
	
	var size = predefinedEraserSize[selectedBrushIndex];
	canvas.fillStyle = secondaryColor;
	canvas.fillRect(x, y, size, size);
	
	canvas.stroke();
}

/* PENCIL TOOL */
function drawLine(prevX, prevY, newX, newY) {
	var canvas = getElement('canv').getContext("2d");	
	
	canvas.lineWidth = predefinedBrushWidth[selectedBrushIndex];
	canvas.strokeStyle = primaryColor;
	
	canvas.beginPath();
	
	canvas.moveTo(prevX, prevY);
	canvas.lineTo(newX, newY);
	
	canvas.stroke();
}

/* FILL TOOL */
function getPointColor(x, y) {
	var imageData = getElement('canv').getContext("2d").getImageData(x, y, 1, 1);
	
	return {
		red: imageData.data[0],
		green: imageData.data[1],
		blue: imageData.data[2]
	};
}

function setPointColor(color, x, y) {
	var canvas = getElement('canv').getContext("2d");
	var imageData = canvas.createImageData(1, 1);
	
	imageData.data[0] = color.red;
	imageData.data[1] = color.green;
	imageData.data[2] = color.blue;
	imageData.data[3] = 255;
	
	canvas.putImageData(imageData, x, y);
}

function fillPoint(color, targetColor, x, y) {
	var pointColor = getPointColor(x, y);
		
	if (pointColor.red != color.red || pointColor.green != color.green || pointColor.blue != color.blue)
		return false;
		
	setPointColor(targetColor, x, y);
	
	return true;
}

function fillHorizontal(color, targetColor, x, y) {
	var canvas = getElement('canv');
	
	var pointColor = getPointColor(x, y);	if (pointColor.red != color.red || pointColor.green != color.green || pointColor.blue != color.blue)
		return false;

    var tempX;
	for (tempX = x; tempX > 0; tempX --)
		if (!fillPoint(color, targetColor, tempX, y))
			break;
		
	for (tempX = x + 1; tempX < canvas.width; tempX++)
		if (!fillPoint(color, targetColor, tempX, y))
			break;
			
	return true;	
}

function fillRec(color, targetColor, x, y) {
	var canvas = getElement('canv');

	fillHorizontal(color, targetColor, x, y);

    var tempY;
	for (tempY = y; tempY > 0; tempY--)
		if (!fillHorizontal(color, targetColor, x, tempY))
			break;
		
	for (tempY = y + 1; tempY < canvas.height; tempY++)
		if (!fillHorizontal(color, targetColor, x, tempY))
			break;
}

function fill(x, y) {
	var canvas = getElement('canv');
			
	var targetColor = {
		red: parseInt(primaryColor.substring(1, 3), 16),
		green: parseInt(primaryColor.substring(3, 5), 16),
		blue: parseInt(primaryColor.substring(5, 7), 16)
	};
	
	fillRec(getPointColor(x, y), targetColor, x, y);
}

/* PICK COLOR TOOL */
function pickColor(x, y) {
	var pixelData = getElement('canv').getContext("2d").getImageData(x, y, 1, 1).data;
	return {
		red: pixelData[0],
		green: pixelData[1],
		blue: pixelData[2]
	};
}

function generate_palette() {
	var table = getElement('palette');
	
	palette.innerHTML = "";
	
	var colcount = 10;

	var count = 0;
	for (var i = 0; i < predefinedColors.length; i++) {
		var row = count % colcount == 0 ? table.insertRow(table.rows.length) : table.rows[table.rows.length - 1];
		var cell = row.insertCell(count % colcount);
		
		var element = document.createElement('div');
		element.setAttribute("class", "color_in_palette");
		element.style.width = "16px";
		element.style.height = "16px";
		
		var innerElement = document.createElement('div');
		innerElement.innerHTML = "\xa0";
		innerElement.style.width = "16px";
		innerElement.style.height = "16px";
		innerElement.style.backgroundColor = predefinedColors[count];
		
		element.setAttribute("onclick", "changeColor('" + predefinedColors[count] + "')");
		
		element.appendChild(innerElement);
		cell.appendChild(element);
		
		count++;
	}

    var row = table.insertRow(table.rows.length);
    row.id = "custom_colors_row";
    customColorsChanged();
}

function initCanvas() {
	var canvas = getElement('canv');
	var drawingArea = canvas.getContext("2d");
	
	drawingArea.fillStyle = "#FFFFFF";
	drawingArea.fillRect(0, 0, canvas.width, canvas.height);
	drawingArea.stroke();
}

function tempMethod(e){
	processResizing(e);
	drag(e);
}

function initMiscWindows() {
	createWindow({title: 'Test', canMinimize: false, canMaximize: false, canClose: true, resizable: false, icon: null, content: 'canvas_resize_window_content', id: 'canvas_resize_window'});
	createWindow({title: 'Palette', canMinimize: false, canMaximize: false, canClose: true, resizable: false, icon: null, content: 'color_picker_window_content', id: 'color_picker_window'});
    createWindow({title: 'About Paint', canMinimize: false, canMaximize: false, canClose: true, resizable: false, icon: null, content: 'about_window_content', id: 'about_window'});
    createWindow({title: 'Image Properties', canMinimize: false, canMaximize: false, canClose: true, resizable: false, icon: null, content: 'properties_window_content', id: 'properties_window'});
}

function initVerticalRuler() {
    var canvasElement = getElement('vertical_ruler');
    var canvas = canvasElement.getContext("2d");

    canvasElement.height = getElement('app').clientHeight;

    var i;
    var maxHeight = parseInt(canvasElement.height);
    for (i = 0; i < maxHeight; i += 10) {
        canvas.beginPath();
        canvas.strokeStyle = '#8E9CAF';
        canvas.moveTo(canvasElement.width - 4, i);
        canvas.lineTo(canvasElement.width, i);
        canvas.stroke();
    }

    for (i = 0; i < maxHeight; i += 100) {
        canvas.beginPath();
        canvas.strokeStyle = '#8E9CAF';
        canvas.moveTo(0, i);
        canvas.lineTo(canvasElement.width, i);
        canvas.stroke();

        canvas.strokeText(i, 0, i);
    }
}

function initHorizontalRuler() {
    var canvasElement = getElement('horizontal_ruler');
    var canvas = canvasElement.getContext("2d");

    canvasElement.width = getElement('app').clientWidth;

    var i;
    var maxWidth = parseInt(canvasElement.width);
    for (i = 0; i < maxWidth; i += 10) {
        canvas.beginPath();
        canvas.strokeStyle = '#8E9CAF';
        canvas.moveTo(i, canvasElement.height - 4);
        canvas.lineTo(i, canvasElement.height);
        canvas.stroke();
    }

    for (i = 0; i < maxWidth; i += 100) {
        canvas.beginPath();
        canvas.strokeStyle = '#8E9CAF';
        canvas.moveTo(i, 0);
        canvas.lineTo(i, canvasElement.height);
        canvas.stroke();

        canvas.strokeText(i, i + 5, canvasElement.height / 2);
    }
}

function initRulers(){
    initVerticalRuler();
    initHorizontalRuler();
}

function init() {
	showRibbon('home');
	
	setPrimaryColor('#000000');
	setSecondaryColor('#FFFFFF');
	
	getElement('app').onmousemove = tempMethod;
	getElement('canv').onmousemove = mouseMove;
	
	generate_palette();
	
	initCanvas();
	initMiscWindows();
	
	initPicker();

    initRulers();
}

function updateCoords(coords) {
	getElement('statusbar_coords').innerHTML = coords.x + ", " + coords.y + "px";
}

function updateCanvasSize(size) {
	getElement('canvas_size_info').innerHTML = size.width + " x " + size.height + "px";
}

function chooseBrushWidth(index) {
	selectedBrushIndex = index;
	
	hideBrushWidthBlock();
}

function generateMarkup(size) {
	return "<div style='border-top-color: #000; border-top-width: " + size + "px; border-top-style: solid; margin-top: 20px;'>\xa0</div>";
}

function initBrushWidthBlock() {
	var block = getElement('brush_width_block');
	block.innerHTML = "";
	
	for (var i = 0; i < predefinedBrushWidth.length; i++) {
		var child = document.createElement('div');	
		var hr = document.createElement('hr');
		hr.setAttribute("class", "size_line");
		hr.style.borderBottomWidth = predefinedBrushWidth[i] + "px";
		hr.style.marginTop = (21 - (predefinedBrushWidth[i] / 2)) + "px";
		
		child.setAttribute("onclick", "chooseBrushWidth('" + i + "')");
		child.setAttribute("class", "size_button " + (selectedBrushIndex == i ? "common_button_selected" : "common_button"));

		child.appendChild(hr);
		block.appendChild(child);
	}	
}

function showBrushWidthBlock() {
	initBrushWidthBlock();
	
	var button = getElement('brush_width_button');
	var block = getElement('brush_width_block');
	
	var coords = getElementPositionInWindow(button);
	
	block.style.visibility = 'visible';
	block.style.left = coords.x;
	block.style.top = coords.y + button.clientHeight;
}

function setPrimaryColor(color) {
	primaryColor = color;
	getElement('primary_color_view').style.backgroundColor = color;
}

function setSecondaryColor(color) {
	secondaryColor = color;
	getElement('secondary_color_view').style.backgroundColor = color;
}

function hideBrushWidthBlock() {
	var block = getElement('brush_width_block');
	block.style.visibility = 'collapse';
}

function changeColor(color) {
	if (isPrimaryColorActive)
		setPrimaryColor(color);
	else 
		setSecondaryColor(color);
}

function makePrimaryColorActive() {
	isPrimaryColorActive = true;
	
	getElement('primary_color_button').setAttribute("class", "common_button_selected");
	getElement('secondary_color_button').setAttribute("class", "common_button");
}

function makeSecondaryColorActive() {
	isPrimaryColorActive = false;
	
	getElement('primary_color_button').setAttribute("class", "common_button");
	getElement('secondary_color_button').setAttribute("class", "common_button_selected");
}

/* RESIZING FUNCTIONS */
function initResizing() {
	var oldCanvas = getElement('canv');
	
	var newCanvas = document.createElement('canvas');
	newCanvas.setAttribute("class", "resizing_canvas");
	newCanvas.setAttribute("id", "resizing_canvas");
	
	var position = getAbsoluteElementPosition(oldCanvas);
	newCanvas.style.left = position.x;
	newCanvas.style.top = position.y;
	newCanvas.style.zIndex = "100";
	
	newCanvas.height = oldCanvas.style.height;
	newCanvas.width = oldCanvas.style.width;
	
	getElement('app').appendChild(newCanvas);
}

function startResizingEast() {
	initResizing();
	
	resizingStatus = 1;
}

function startResizingSouth() {
	initResizing();
	
	resizingStatus = 2;
}

function startResizingSe() {
	initResizing();
	
	resizingStatus = 3;
}

function processResizing(event) {
	if (resizingStatus == 0)
		return;
	
	var app = getElement('app');
	var coords = getRelativeMousePos(app, event);
	
	var resizingCanvas = getElement('resizing_canvas');
	
	var x = coords.x - parseInt(resizingCanvas.style.left);
	var y = coords.y - parseInt(resizingCanvas.style.top);
	
	updateCanvasSize({ width: x, height: y });

	if (resizingStatus == 1) {
		resizingCanvas.width = x;
        resizingCanvas.height = getElement('canv').height;
	} else if (resizingStatus == 2) {
		resizingCanvas.height = y;
        resizingCanvas.width = getElement('canv').width;
	} else if (resizingStatus == 3) {
		resizingCanvas.width = x;
		resizingCanvas.height = y;
	}
}

function endResizing() {
	var canvas = getElement('canv');
	var resizingCanvas = getElement('resizing_canvas');
	var app = getElement('app');

	canvas.style.width = resizingCanvas.width;
	canvas.style.height = resizingCanvas.height;
	
	canvas.width = parseInt(canvas.style.width) / getZoomValue();
	canvas.height = parseInt(canvas.style.height) / getZoomValue();

    getElement('workzone').style.height = canvas.height + "px";

	app.removeChild(resizingCanvas);
	
	resizingStatus = 0;
}


/* TOOLS */
function deactivateAll() {
	if (selectedTool == 0)
		return;
		
	getElement('tool_pencil').setAttribute("class", "tool_item_left button");
	getElement('tool_fill').setAttribute("class", "tool_item_center button");
	getElement('tool_text').setAttribute("class", "tool_item_right button");
	getElement('tool_eraser').setAttribute("class", "tool_item_left button");
	getElement('tool_picker').setAttribute("class", "tool_item_center button");
	getElement('tool_zoom').setAttribute("class", "tool_item_right button");
	
	removeEraserCursor();
}

function activatePencil() {
	deactivateAll();
	
	selectedTool = 1;
	getElement('tool_pencil').setAttribute("class", "tool_item_left tool_button_selected");
	getElement('canv').style.cursor = "url('img/cursors/pencil_cursor.png')";
}

function activateFill() {
	deactivateAll();
	
	selectedTool = 2;
	getElement('tool_fill').setAttribute("class", "tool_item_center tool_button_selected");
	getElement('canv').style.cursor = "url('img/cursors/fill_cursor.png')";
}

function activateEraser() {
	deactivateAll();
	
	selectedTool = 4;
	getElement('tool_eraser').setAttribute("class", "tool_item_left tool_button_selected");
	getElement('canv').style.cursor = "none";
	createEraserCursor();
}

function activateColorPicker() {
	deactivateAll();
	
	selectedTool = 5;
	getElement('tool_picker').setAttribute("class", "tool_item_center tool_button_selected");
	getElement('canv').style.cursor = "url('img/cursors/picker_cursor.png')";
}

function createEraserCursor() {
	if (selectedTool != 4)
		return;
	
	var cursor = getElement('eraser_cursor');
	
	cursor.style.width = predefinedEraserSize[selectedBrushIndex];
	cursor.style.height = predefinedEraserSize[selectedBrushIndex];
	cursor.style.backgroundColor = secondaryColor;
	cursor.style.visibility = "visible";
	
	return cursor;
}

function removeEraserCursor() {
	var cursor = getElement('eraser_cursor');
	cursor.style.visibility = "collapse";
}

/* ZOOM FUNCTIONS */
// get zoom value
function getZoomValue() {
	return getElement('zoom_value').value / 100.0;
}

function raiseZoomChanged() {
	var zoomValue = getZoomValue() * 100.0;
	getElement('zoom_text_value').innerHTML = zoomValue + "%";
	
	var canvas = getElement('canv');
	canvas.style.width = parseInt(canvas.width) * zoomValue / 100.0;
	canvas.style.height = parseInt(canvas.height) * zoomValue / 100.0;	
}

function showRotateBlock() {
	var button = getElement('rotate_block_button');
	var block = getElement('rotate_block');
	
	var buttonPosition = getElementPositionInWindow(button);
	
	button.setAttribute("class", "common_button_selected");
	block.style.visibility = 'visible';
	block.style.left = buttonPosition.x;
	block.style.top = buttonPosition.y + button.clientHeight;
}

function hideRotateBlock() {
	var block = getElement('rotate_block');
	block.style.visibility = 'collapse';
	
	var button = getElement('rotate_block_button');
	button.setAttribute("class", "common_button");
}

/* ROTATE FUNCTIONS */
function get1dIndex(rowIndex, columnIndex, width) {
	return (rowIndex * width + columnIndex) * 4;
}

function swapPixels(imageData, row1, column1, row2, column2, width, height) {
	for (var i = 0; i < 4; i++) {
		var firstIndex = get1dIndex(row1, column1, width);
		var secondIndex = get1dIndex(row2, column2, width);
		
		var tmpValue = imageData[firstIndex + i];
		imageData[firstIndex + i] = imageData[secondIndex + i];
		imageData[secondIndex + i] = tmpValue;
	}
}

function turnRight() {
	var canvas = getElement('canv');
	var context = canvas.getContext("2d");
	
	var oldImageData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	var oldWidth = canvas.width;
	var oldHeight = canvas.height;
	
	canvas.width = parseInt(oldHeight);
	canvas.height = parseInt(oldWidth);
	canvas.style.width = canvas.width;
	canvas.style.height = canvas.height;
	
	var newImageData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	for (var row = 0; row < oldImageData.height; row++) {
		for (var column = 0; column < oldImageData.width; column++) {
			for (var k = 0; k < 4; k++) {
				newImageData.data[get1dIndex(column, -row + oldHeight, canvas.width) + k] = oldImageData.data[get1dIndex(row, column, oldWidth) + k];
			}
		}
	}
	
	context.putImageData(newImageData, 0, 0);
	
	hideRotateBlock();
}

function turnLeft() {
	var canvas = getElement('canv');
	var context = canvas.getContext("2d");
	
	var oldImageData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	var oldWidth = canvas.width;
	var oldHeight = canvas.height;
	
	canvas.width = parseInt(oldHeight);
	canvas.height = parseInt(oldWidth);
	canvas.style.width = canvas.width;
	canvas.style.height = canvas.height;
	
	var newImageData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	for (var row = 0; row < oldImageData.height; row++) {
		for (var column = 0; column < oldImageData.width; column++) {
			for (var k = 0; k < 4; k++) {
				newImageData.data[get1dIndex(-column + oldWidth, row, canvas.width) + k] = oldImageData.data[get1dIndex(row, column, oldWidth) + k];
			}
		}
	}
	
	context.putImageData(newImageData, 0, 0);
	
	hideRotateBlock();
}

function rotate() {
	flipHorizontal();
	flipVertical();

	hideRotateBlock();
}

function flipHorizontal() {
	var canvas = getElement('canv');
	var context = canvas.getContext("2d");
	
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	var width = parseInt(canvas.width);
	var height = parseInt(canvas.height);
	
	for (var row = 0; row < height; row++) {
		for (var column = 0; column < width / 2; column++) {
			swapPixels(imageData.data, row, column, row, width - column - 1, width, height);
		}
	}
	
	context.putImageData(imageData, 0, 0);
	
	hideRotateBlock();
}

function flipVertical() {
	var canvas = getElement('canv');
	var context = canvas.getContext("2d");
	
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	var width = parseInt(canvas.width);
	var height = parseInt(canvas.height);
	
	for (var row = 0; row < height / 2; row++) {
		for (var column = 0; column < width; column++) {
			swapPixels(imageData.data, row, column, height - row - 1, column, width, height);
		}
	}
	
	context.putImageData(imageData, 0, 0);
	
	hideRotateBlock();
}

/* MAIN MENU */
function showMainMenu() {
	var mainMenu = getElement('main_menu');
	mainMenu.style.display = "block";
	
	var buttonPosition = getElementPositionInWindow(getElement('main_menu_button_block'));
	
	mainMenu.style.left = buttonPosition.x + "px";
	mainMenu.style.top = buttonPosition.y + "px";
	
	var loadButton = getElement('main_menu_open_image_button');
	var imagePicker = getElement('image_file_picker');
	
	imagePicker.style.width = loadButton.clientWidth;
	imagePicker.style.height = loadButton.clientHeight;
}

function hideMainMenu() {
	getElement('main_menu').style.display = "none";
	hideSaveAdditionalWindow();
}

/* CANVAS RESIZE WINDOW */
function showCanvasResizeWindow() {
	getElement('canvas_resize_window').style.display = "block";
}

/* COLOR PICKER */
function showColorPicker() {
	getElement('color_picker_window').style.display = "block";
}

/* RIBBON */
function showRibbon(ribbonName) {
	getElement('ribbon_home').style.display = "none";
	getElement('ribbon_view').style.display = "none";
	
	getElement('ribbon_'+ribbonName).style.display = "table";
}

/* */
function showSaveAdditionalWindow() {
	var element = getElement('save_as_additional_window');
	
	element.style.display = "block";
	element.style.top = 0;
	element.style.left = 0;
}

function hideSaveAdditionalWindow() {
	getElement('save_as_additional_window').style.display = "none";
}

function customColorsChanged() {
    var row = getElement('custom_colors_row');
    row.innerHTML = "";
    for (var i = 0; i < customColors.length; i++){
        var cell = row.insertCell(i);

        var element = document.createElement('div');
        element.setAttribute("class", "color_in_palette");
        element.style.width = "16px";
        element.style.height = "16px";

        var innerElement = document.createElement('div');
        innerElement.innerHTML = "\xa0";
        innerElement.style.width = "16px";
        innerElement.style.height = "16px";
        innerElement.style.backgroundColor = customColors[i];

        element.setAttribute("onclick", "changeColor('" + customColors[i] + "')");

        element.appendChild(innerElement);
        cell.appendChild(element);
    }
}

function chooseColorFromPalette(element) {
    var color = getCurrentColor();
    customColors[customColorIndex++] = color;
    if (customColorIndex == customColors.length)
        customColorIndex = 0;

    customColorsChanged();

    changeColor(color);
    closeWindow(element);
}

function changeRulersVisibility(isVisible) {
    getElement('horizontal_ruler_block').style.display = isVisible ? "block" : "none";
    getElement('vertical_ruler_block').style.display = isVisible ? "block" : "none";
}
