function ApplicationState() {
    var self = this;

    self.PrimaryColor = ko.observable();
    self.SecondaryColor = ko.observable();
    self.IsPrimaryColorSelected = ko.observable(true);
}

function MainViewModel() {
    var self = this;

    self.State = new ApplicationState();

    self.Ribbon = new RibbonViewModel([
        new RibbonTabViewModel('Home', 'homeRibbonTabTemplate', new HomeTabViewModel(self.State), true),
        new RibbonTabViewModel('View', 'viewRibbonTabTemplate', new ViewTabViewModel(self.State), false)
    ]);

    self.Canvas = new CanvasViewModel();
}