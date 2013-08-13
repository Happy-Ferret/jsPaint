function ApplicationState() {
    var self = this;

    self.PrimaryColor = ko.observable(new ColorModel(0, 0, 0));
    self.SecondaryColor = ko.observable(new ColorModel(255, 255, 255));
    self.IsPrimaryColorSelected = ko.observable(true);

    self.RulersVisible = ko.observable(false);
    self.GridlinesVisible = ko.observable(false);
    self.StatusbarVisible = ko.observable(true);

    self.MousePosition = ko.observable({
        X: ko.observable(0),
        Y: ko.observable(0)
    });

    self.SelectionSize = ko.observable({
        Width: ko.observable(0),
        Height: ko.observable(0)
    });

    self.CanvasSize = ko.observable({
        Width: ko.observable(500),
        Height: ko.observable(500)
    });

    self.FileSize = ko.observable(0);

    self.MinZoom = 25;
    self.MaxZoom = 800;
    self.ZoomStep = 25;
    self.DefaultZoom = 100;
    self.ZoomValue = ko.observable(self.DefaultZoom);
    self.DecimalZoom = ko.computed(function () {
        return self.ZoomValue() / 100.0;
    });

    this.ActivatePrimaryColor = function () {
        self.IsPrimaryColorSelected(true);
    };

    this.ActivateSecondaryColor = function () {
        self.IsPrimaryColorSelected(false);
    };

    this.ChangeColor = function (newColor) {
        if (self.IsPrimaryColorSelected() == true) {
            self.PrimaryColor(newColor);
        } else {
            self.SecondaryColor(newColor);
        }
    };

    this.ZoomIn = function () {
        self.ZoomValue(Math.min(self.MaxZoom, self.ZoomValue() + self.ZoomStep));

        /*var canvas = getElement('canv');
         canvas.style.width = parseInt(canvas.width) * zoomValue / 100.0;
         canvas.style.height = parseInt(canvas.height) * zoomValue / 100.0;*/
    };

    this.ZoomOut = function () {
        self.ZoomValue(Math.max(0, self.ZoomValue() - self.ZoomStep));

        /*var canvas = getElement('canv');
         canvas.style.width = parseInt(canvas.width) * zoomValue / 100.0;
         canvas.style.height = parseInt(canvas.height) * zoomValue / 100.0;*/
    };

    this.ResetZoom = function () {
        self.ZoomValue(self.DefaultZoom);
    };

    self.IsFullScreened = ko.observable(false);
    this.GoFullScreen = function () {
        var element = getElement('canv');

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    };
}