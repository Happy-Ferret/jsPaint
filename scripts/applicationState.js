function ApplicationState() {
    var self = this;

    self.ColorTypes = {
        Color: 'Color',
        BlackAndWhite: 'Black and white'
    };
    self.Units = {
        Pixels: { name: 'Pixels', abbreviation: 'px' },
        Inches: { name: 'Inches', abbreviation: 'inches' },
        Centimeters: { name: 'Centimeters', abbreviation: 'cm' }
    };

    self.FileExtension = ko.observable(FileExtensions.png);

    self.DPI = ko.observable(96.0);

    self.PrimaryColor = ko.observable(new ColorModel(0, 0, 0));
    self.SecondaryColor = ko.observable(new ColorModel(255, 255, 255));
    self.IsPrimaryColorSelected = ko.observable(true);

    self.RulersVisible = ko.observable(false);
    self.GridlinesVisible = ko.observable(false);
    self.StatusbarVisible = ko.observable(true);

    self.SelectedColor = ko.observable(self.ColorTypes.Color);
    self.SelectedUnit = ko.observable(self.Units.Pixels);

    self.MousePosition = ko.observable({
        X: ko.observable(0),
        Y: ko.observable(0)
    });

    self.SelectionSize = ko.observable({
        Width: ko.observable(0),
        Height: ko.observable(0)
    });

    self.CanvasPixelWidth = ko.observable(500);
    self.CanvasWidth = ko.computed({
        read: function () {
            if (self.SelectedUnit() == self.Units.Pixels) {
                return self.CanvasPixelWidth();
            } else if (self.SelectedUnit() == self.Units.Inches) {
                return self.CanvasPixelWidth() / self.DPI();
            } else if (self.SelectedUnit() == self.Units.Centimeters) {
                return self.CanvasPixelWidth() * 2.54 / self.DPI();
            }
        },
        write: function (value) {
            if (self.SelectedUnit() == self.Units.Pixels) {
                self.CanvasPixelWidth(value);
            } else if (self.SelectedUnit() == self.Units.Inches) {
                self.CanvasPixelWidth(value * self.DPI());
            } else if (self.SelectedUnit() == self.Units.Centimeters) {
                self.CanvasPixelWidth(value * self.DPI() / 2.54);
            }
        }
    });

    self.CanvasPixelHeight = ko.observable(500);
    self.CanvasHeight = ko.computed({
        read: function () {
            if (self.SelectedUnit() == self.Units.Pixels) {
                return self.CanvasPixelHeight();
            } else if (self.SelectedUnit() == self.Units.Inches) {
                return self.CanvasPixelHeight() / self.DPI();
            } else if (self.SelectedUnit() == self.Units.Centimeters) {
                return self.CanvasPixelHeight() * 2.54 / self.DPI();
            }
        },
        write: function (value) {
            if (self.SelectedUnit() == self.Units.Pixels) {
                self.CanvasPixelHeight(value);
            } else if (self.SelectedUnit() == self.Units.Inches) {
                self.CanvasPixelHeight(value * self.DPI());
            } else if (self.SelectedUnit() == self.Units.Centimeters) {
                self.CanvasPixelHeight(value * self.DPI() / 2.54);
            }
        }
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