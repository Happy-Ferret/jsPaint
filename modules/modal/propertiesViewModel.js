function PropertiesViewModel(state) {
    var self = this;

    self.State = state;

    self.DefaultSize = {
        Width: 820,
        Height: 460
    };

    self.CanvasPixelWidth = ko.observable(state.CanvasPixelWidth());
    self.CanvasPixelHeight = ko.observable(state.CanvasPixelHeight());

    self.SelectedColor = ko.observable('Color');
    self.SelectedUnit = ko.observable('Pixels');

    this.ResetSize = function () {
        self.CanvasPixelWidth(self.DefaultSize.Width);
        self.CanvasPixelHeight(self.DefaultSize.Height);
    };

    this.SaveChanges = function (closeCallback) {
        self.State.CanvasPixelWidth(self.CanvasPixelWidth());
        self.State.CanvasPixelHeight(self.CanvasPixelHeight());

        self.State.SelectedColor(self.SelectedColor());
        self.State.SelectedUnit(self.SelectedUnit());

        if (closeCallback) {
            closeCallback();
        }
    };
}