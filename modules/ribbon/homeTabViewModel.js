function HomeTabViewModel(state) {
    var self = this;

    self.ColorsColumnCnt = 10;

    self.State = state;

    self.PredefinedColors = [
        [
            new ColorModel(0, 0, 0), new ColorModel(127, 127, 127), new ColorModel(136, 0, 21), new ColorModel(237, 28, 36), new ColorModel(255, 127, 39),
            new ColorModel(255, 242, 0), new ColorModel(34, 177, 76), new ColorModel(0, 162, 232), new ColorModel(63, 72, 204), new ColorModel(163, 73, 164)
        ],
        [
            new ColorModel(255, 255, 255), new ColorModel(195, 195, 195), new ColorModel(185, 122, 87), new ColorModel(255, 174, 201), new ColorModel(255, 201, 14),
            new ColorModel(239, 228, 176), new ColorModel(181, 230, 29), new ColorModel(153, 217, 234), new ColorModel(112, 146, 190), new ColorModel(200, 191, 231)
        ]
    ];

    self.CustomColorIndex = ko.observable(0);
    self.CustomColors = ko.observableArray([]);

    this.SelectColor = function (newColor) {
        self.CustomColors()[self.CustomColorIndex()](newColor);
        self.CustomColorIndex((self.CustomColorIndex() + 1) % self.ColorsColumnCnt);
        self.State.ChangeColor(newColor);
    };

    this.ShowColorPicker = function () {
        Application.CreateWindow({
            title: 'Edit Colors',
            iconClass: 'systemAppIcon',

            size: {
                width: 450,
                height: 300
            }
        }, {
            windowTemplate: 'colorpickerTemplate'
        }, {
            windowViewModel: new ColorPickerViewModel()
        }, {
            onDataSelect: self.SelectColor
        });
    };

    this.Init = function () {
        self.PredefinedColors.push(ko.observableArray([]));
        self.PredefinedColors.push(ko.observableArray([]));
        for (var i = 0; i < self.ColorsColumnCnt; i++) {
            self.CustomColors.push(ko.observable(new ColorModel(255, 255, 255)));
        }
    };

    self.Init();
}