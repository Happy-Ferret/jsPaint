function HomeTabViewModel(state) {
    var self = this;

    self.State = state;

    this.ShowColorPicker = function () {
        Application.CreateWindow({
            title: 'Edit Colors',
            iconClass: 'systemAppIcon'
        }, 'colorpickerTemplate', new ColorPickerViewModel(), {
            onDataSelect: self.State.ChangeColor
        });
    };
}