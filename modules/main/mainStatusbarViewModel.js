function MainStatusbarViewModel(state) {
    var self = this;

    self.State = state;

    self.Coordinates = ko.computed(function () {
        return '' + self.State.MousePosition().X() + 'x' + self.State.MousePosition().Y();
    });

    self.SelectionSize = ko.computed(function () {

    });

    self.CanvasSize = ko.computed(function () {

    });

    self.FileSize = ko.computed(function () {

    });

    self.ZoomValue = ko.computed(function () {
        return '' + self.State.ZoomValue() + '%';
    });
}