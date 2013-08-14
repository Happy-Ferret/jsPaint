var ResizeStatus = {
    None: 0,
    North: 1,
    West: 2,
    South: 3,
    East: 4,
    NorthWest: 5,
    NorthEast: 6,
    SouthWest: 7,
    SouthEast: 8
};

function CanvasViewModel(state) {
    var self = this;

    self.State = state;

    self.CanvasPixelWidth = ko.observable(500);
    self.CanvasPixelHeight = ko.observable(500);

    this.InitGridlines = function () {
        if (self.State.GridlinesVisible() == false) {
            return;
        }

        var step = 10;

        var gridlinesCanvasElement = getElement('gridlines');
        var canvasElement = getElement('canv');

        var width = self.State.CanvasPixelWidth();
        var height = self.State.CanvasPixelHeight();
        var pixelWidth = width + 'px';
        var pixelHeight = height + 'px';

        canvasElement.style.width = pixelWidth;
        gridlinesCanvasElement.style.width = pixelWidth;
        canvasElement.width = width;
        gridlinesCanvasElement.width = width;

        canvasElement.style.height = pixelHeight;
        gridlinesCanvasElement.style.height = pixelHeight;
        canvasElement.height = height;
        gridlinesCanvasElement.height = height;

        gridlinesCanvasElement.style.marginTop = '-' + pixelHeight;

        var gridlinesCanvas = gridlinesCanvasElement.getContext("2d");

        gridlinesCanvas.setLineDash([0.5, 1]);
        gridlinesCanvas.lineWidth = 0.75;
        gridlinesCanvas.strokeStyle = '#000000';
        for (var x = 0.5; x < gridlinesCanvasElement.width; x += step) {
            gridlinesCanvas.beginPath();
            gridlinesCanvas.moveTo(x, 0);
            gridlinesCanvas.lineTo(x, gridlinesCanvasElement.height);
            gridlinesCanvas.stroke();
        }

        for (var y = 0.5; y < gridlinesCanvasElement.height; y += step) {
            gridlinesCanvas.beginPath();
            gridlinesCanvas.moveTo(0, y);
            gridlinesCanvas.lineTo(gridlinesCanvasElement.width, y);
            gridlinesCanvas.stroke();
        }
    };

    self.CanvasPixelWidth.subscribe(self.InitGridlines);
    self.CanvasPixelHeight.subscribe(self.InitGridlines);

    this.Init = function () {
        state.GridlinesVisible.subscribe(function (newValue) {
            if (newValue == true) {
                getElement('gridlines').style.display = 'block';
                self.InitGridlines();
            } else {
                getElement('gridlines').style.display = 'none';
            }
        });

        state.CanvasPixelHeight.subscribe(self.InitGridlines);
        state.CanvasPixelWidth.subscribe(self.InitGridlines);
    };

    self.ResizeMode = ResizeStatus.None;
    this.BeginResize = function () {
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

        getElement('canv').parentElement.appendChild(newCanvas);
    };

    this.StartResizeEast = function () {
        self.ResizeMode = ResizeStatus.East;
        self.BeginResize();
    };

    this.StartResizeSE = function () {
        self.ResizeMode = ResizeStatus.SouthEast;
        self.BeginResize();
    };

    this.StartResizeSouth = function () {
        self.ResizeMode = ResizeStatus.South;
        self.BeginResize();
    };

    this.ProcessResize = function (d, event) {
        if (self.ResizeMode == ResizeStatus.None)
            return;

        var app = document.body;
        var coords = getRelativeMousePos(app, event);

        var resizingCanvas = getElement('resizing_canvas');

        var x = coords.x - parseInt(resizingCanvas.style.left);
        var y = coords.y - parseInt(resizingCanvas.style.top);

        if (self.ResizeMode == ResizeStatus.East) {
            resizingCanvas.width = x;
            resizingCanvas.height = getElement('canv').height;
        } else if (self.ResizeMode == ResizeStatus.South) {
            resizingCanvas.height = y;
            resizingCanvas.width = getElement('canv').width;
        } else if (self.ResizeMode == ResizeStatus.SouthEast) {
            resizingCanvas.width = x;
            resizingCanvas.height = y;
        }
    };

    this.EndResize = function () {
        if (self.ResizeMode == ResizeStatus.None) {
            return;
        }

        var canvas = getElement('canv');
        var resizingCanvas = getElement('resizing_canvas');

        canvas.style.width = resizingCanvas.width;
        canvas.style.height = resizingCanvas.height;

        self.State.CanvasPixelWidth(resizingCanvas.width);
        self.State.CanvasPixelHeight(resizingCanvas.height);

        canvas.width = parseInt(canvas.style.width) / self.State.DecimalZoom();
        canvas.height = parseInt(canvas.style.height) / self.State.DecimalZoom();

        canvas.parentElement.removeChild(resizingCanvas);

        self.ResizeMode = ResizeStatus.None;
    };

    this.RenderCompleted = function () {
        self.InitGridlines();
    };

    self.Init();
}