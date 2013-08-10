function HomeTabViewModel(state) {
    var self = this;

    self.State = state;

    this.ShowColorPicker = function () {
        appViewModel.CreateWindow({}, 'colorpickerTemplate', new ColorPickerViewModel(), {
            onDataChange: self.State.ChangeColor
        });
    };
}