function ApplicationState() {
    var self = this;

    self.PrimaryColor = ko.observable('#000000');
    self.SecondaryColor = ko.observable('#FFFFFF');
    self.IsPrimaryColorSelected = ko.observable(true);

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
        new MainMenuItemViewModel('Properties', 'menu-icon-properties'),
        new MainMenuItemViewModel('About Paint', 'menu-icon-about'),
        new MainMenuItemViewModel('Exit', 'menu-icon-exit')
    ]);

    self.Canvas = new CanvasViewModel();
}