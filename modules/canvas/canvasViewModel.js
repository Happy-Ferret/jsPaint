function CanvasViewModel() {
    var self = this;

    self.CanvasWidth = ko.observable(500);
    self.CanvasHeight = ko.observable(500);

    this.BeginResize = function () {

    };

    this.StartResizeEast = function () {

    };

    this.StartResizeSE = function () {

    };

    this.StartResizeSouth = function () {

    };

    this.EndResize = function () {

    };
}

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

    getElement('application').appendChild(newCanvas);
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