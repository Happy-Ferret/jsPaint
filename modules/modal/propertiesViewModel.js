function PropertiesViewModel(state) {
    var self = this;

    self.State = state;

    self.DefaultSize = ko.observable({
        Width: 820,
        Height: 460
    });

    self.CanvasSize = ko.observable({
        Width: ko.observable(state.CanvasSize().Width()),
        Height: ko.observable(state.CanvasSize().Height())
    });

    self.SelectedColor = ko.observable('Color');
    self.SelectedUnit = ko.observable('Pixels');

    this.ResetSize = function () {
        self.CanvasSize(self.DefaultSize());
    };

    this.SaveChanges = function (closeCallback) {
        self.State.CanvasSize(self.CanvasSize());
        self.State.SelectedColor(self.SelectedColor());
        self.State.SelectedUnit(self.SelectedUnit());

        if (closeCallback) {
            closeCallback();
        }
    };
}