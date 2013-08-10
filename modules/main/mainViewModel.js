function MainViewModel() {
    var self = this;

    self.Ribbon = new RibbonViewModel([
        new RibbonTabViewModel('Home', 'homeRibbonTabTemplate', new HomeTabViewModel(), true),
        new RibbonTabViewModel('View', 'viewRibbonTabTemplate', new ViewTabViewModel(), false)
    ]);

    self.Canvas = new CanvasViewModel();
}