function MainStatusbarViewModel(state) {
    var self = this;

    self.State = state;

    self.Coordinates = ko.computed(function () {
        return self.State.MousePositionX() && self.State.MousePositionY() ?
            '' + self.State.MousePositionX() + 'x' + self.State.MousePositionY() + ' ' + self.State.SelectedUnit().abbreviation :
            '';
    });

    self.SelectionSize = ko.computed(function () {

    });

    self.CanvasSize = ko.computed(function () {
        return '' + self.State.CanvasWidth() + ' x ' + self.State.CanvasHeight() + ' ' + self.State.SelectedUnit().abbreviation;
    });

    self.FileSize = ko.computed(function () {

    });

    self.ZoomValue = ko.computed(function () {
        return '' + self.State.ZoomValue() + '%';
    });
}