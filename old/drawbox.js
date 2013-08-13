var predefinedBrushWidth = [ 1, 2, 3, 4 ];
var predefinedEraserSize = [ 4, 6, 8, 10 ];

var oldX = 0;
var oldY = 0;

// brush variables section
var selectedBrushIndex = 1;

// resizing variables section
// 0 - not resized; 1 - east; 2 - south; 3 - south-east
var resizingStatus = 0;

// tools
// 0 - nether selected; 1 - pencil; 2 - fill; 3 - text; 4 - eraser; 5 - color picker; 6 - zooming
var selectedTool = 0;

function mouseMove(event) {
    var canvas = getElement('canvas_block');
    var coords = getRelativeMousePos(canvas, event);

    if (selectedTool == 4) {
        var eraser = getElement('eraser_cursor');
        var canvasPosition = getAbsoluteElementPosition(canvas);
        eraser.style.left = canvasPosition.x + coords.x;
        eraser.style.top = canvasPosition.y + coords.y;
    }

    if (isMouseDown) {
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

    updateCoords(coords);

    oldX = coords.x;
    oldY = coords.y;
}

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

    var pointColor = getPointColor(x, y);
    if (pointColor.red != color.red || pointColor.green != color.green || pointColor.blue != color.blue)
        return false;

    var tempX;
    for (tempX = x; tempX > 0; tempX--)
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

function pickColor(x, y) {
    var pixelData = getElement('canv').getContext("2d").getImageData(x, y, 1, 1).data;
    return {
        red: pixelData[0],
        green: pixelData[1],
        blue: pixelData[2]
    };
}

function initCanvas() {
    var canvas = getElement('canv');
    var drawingArea = canvas.getContext("2d");

    drawingArea.fillStyle = "#FFFFFF";
    drawingArea.fillRect(0, 0, canvas.width, canvas.height);
    drawingArea.stroke();
}

function tempMethod(e) {
    processResizing(e);
}

function _init() {
    getElement('application').onmousemove = tempMethod;
    getElement('canv').onmousemove = mouseMove;

    generate_palette();

    initCanvas();

    initPicker();
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
