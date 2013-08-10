function MainViewModel() {
    var self = this;

    self.Ribbon = new RibbonViewModel([
        new RibbonTabViewModel('Home', true),
        new RibbonTabViewModel('View', false)
    ]);

    self.Canvas = new CanvasViewModel();
}