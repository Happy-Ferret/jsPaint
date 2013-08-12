function ApplicationState() {
    var self = this;

    self.PrimaryColor = ko.observable('#000000');
    self.SecondaryColor = ko.observable('#FFFFFF');
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
        if (self.IsPrimaryColorSelected == true) {
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

function MainViewModel(state) {
    var self = this;

    self.State = state;

    this.Print = function () {
        function cloneCanvas(oldCanvas) {
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');

            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;

            context.drawImage(oldCanvas, 0, 0);

            return newCanvas;
        }

        var canvasClone = document.getElementById('printing_canvas');

        if (canvasClone) {
            document.getElementById('application').removeChild(canvasClone);
        }

        canvasClone = cloneCanvas(document.getElementById('canv'));
        canvasClone.id = 'printing_canvas';

        document.getElementById('application').appendChild(canvasClone);

        window.print();
    };

    this.ShowProperties = function () {
        Application.CreateWindow({}, { windowTemplate: 'propertiesWindowTemplate' });
    };

    this.ShowAbout = function () {
        Application.CreateWindow({
            title: 'About Paint',
            iconClass: 'systemAppIcon',
            size: {
                width: 458,
                height: 374
            }
        }, {
            windowTemplate: 'aboutWindowTemplate'
        });
    };

    this.Exit = function () {
        window.open('', '_self', '');
        window.close();
    };

    this.InitVerticalRuler = function () {
        var canvasElement = getElement('vertical_ruler');
        var canvas = canvasElement.getContext("2d");

        canvasElement.height = getElement('application').clientHeight;

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
    };

    this.InitHorizontalRuler = function () {
        var canvasElement = getElement('horizontal_ruler');
        var canvas = canvasElement.getContext("2d");

        canvasElement.width = getElement('application').clientWidth;

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
    };

    self.Ribbon = new RibbonViewModel([
        new RibbonTabViewModel('Home', 'homeRibbonTabTemplate', new HomeTabViewModel(self.State), true),
        new RibbonTabViewModel('View', 'viewRibbonTabTemplate', new ViewTabViewModel(self.State), false)
    ], [
        new MainMenuItemViewModel('New', 'menu-icon-new'),
        new MainMenuItemViewModel('Open', 'menu-icon-open'),
        new MainMenuItemViewModel('Save', 'menu-icon-save'),
        new MainMenuItemViewModel('Save as', 'menu-icon-save-as'),
        new MainMenuItemViewModel('Print', 'menu-icon-print', self.Print),
        new MainMenuItemViewModel('From scanner or camera', 'menu-icon-from-scanner'),
        new MainMenuItemViewModel('Send in e-mail', 'menu-icon-send-mail'),
        new MainMenuItemViewModel('Set as desktop background', 'menu-icon-set-background'),
        new MainMenuItemViewModel('Properties', 'menu-icon-properties', self.ShowProperties),
        new MainMenuItemViewModel('About Paint', 'menu-icon-about', self.ShowAbout),
        new MainMenuItemViewModel('Exit', 'menu-icon-exit', self.Exit)
    ]);

    self.Canvas = new CanvasViewModel(self.State);

    this.RenderCompleted = function () {
        self.InitHorizontalRuler();
        self.InitVerticalRuler();
        if (self.Canvas.RenderCompleted) {
            self.Canvas.RenderCompleted();
        }
    };

    this.Init = function () {
        document.addEventListener('keyup', function (e) {
            if (e.which == 122) {
                if (self.State.IsFullScreened() == true) {
                    self.State.IsFullScreened(false);
                } else {
                    self.State.IsFullScreened(true);
                    self.State.GoFullScreen();
                }
            }
        });
    };

    self.Init();
}