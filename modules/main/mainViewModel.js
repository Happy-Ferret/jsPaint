function ApplicationState() {
    var self = this;

    self.PrimaryColor = ko.observable('#000000');
    self.SecondaryColor = ko.observable('#FFFFFF');
    self.IsPrimaryColorSelected = ko.observable(true);

    self.RulersVisible = ko.observable(false);
    self.GridlinesVisible = ko.observable(false);
    self.StatusbarVisible = ko.observable(true);

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
}

function MainViewModel() {
    var self = this;

    self.State = new ApplicationState();

    this.ShowProperties = function () {
        Application.CreateWindow({}, 'propertiesWindowTemplate');
    };

    this.ShowAbout = function () {
        Application.CreateWindow({}, 'aboutWindowTemplate');
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
        new MainMenuItemViewModel('Print', 'menu-icon-print'),
        new MainMenuItemViewModel('From scanner or camera', 'menu-icon-from-scanner'),
        new MainMenuItemViewModel('Send in e-mail', 'menu-icon-send-mail'),
        new MainMenuItemViewModel('Set as desktop background', 'menu-icon-set-background'),
        new MainMenuItemViewModel('Properties', 'menu-icon-properties', self.ShowProperties),
        new MainMenuItemViewModel('About Paint', 'menu-icon-about', self.ShowAbout),
        new MainMenuItemViewModel('Exit', 'menu-icon-exit')
    ]);

    self.Canvas = new CanvasViewModel(self.State);

    this.RenderCompleted = function () {
        self.InitHorizontalRuler();
        self.InitVerticalRuler();
        if (self.Canvas.RenderCompleted) {
            self.Canvas.RenderCompleted();
        }
    };
}