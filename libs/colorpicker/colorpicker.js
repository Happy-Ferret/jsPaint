function ColorModel(r, g, b, colorChangedCallback) {
    var self = this;

    self.MAX_HSL = 240;
    self.MAX_RGB = 255;

    /**
     * @return {number}
     */
    this.ValidateValue = function (value, maxValue) {
        if (!value || isNaN(value))
            return 0;

        return Math.max(0, Math.min(value, maxValue));
    };

    self.CurrentColorRGB = ko.observable({
        red: self.ValidateValue(r, self.MAX_RGB),
        green: self.ValidateValue(g, self.MAX_RGB),
        blue: self.ValidateValue(b, self.MAX_RGB)
    });

    self.CurrentColorHSL = ko.observable({
        hue: 0,
        luma: 0,
        saturation: 0
    });

    this.ProcessRGBInput = function (r, g, b) {
        self.CurrentColorRGB({red: r, green: g, blue: b});

        var hsl = ColorHelpers.fromRGB(r, g, b);

        self.CurrentColorHSL({hue: isNaN(hsl.hue) ? 0 : hsl.hue, luma: hsl.luma, saturation: hsl.saturation});

        if (colorChangedCallback) {
            colorChangedCallback();
        }
    };

    this.ProcessHSLInput = function (h, s, l) {
        self.CurrentColorHSL({hue: h, luma: l, saturation: s});

        var rgb = ColorHelpers.fromHSL(h, s, l);

        self.CurrentColorRGB({red: rgb.red, green: rgb.green, blue: rgb.blue});

        if (colorChangedCallback) {
            colorChangedCallback();
        }
    };

    self.Red = ko.computed({
        read: function () {
            return parseInt(self.CurrentColorRGB().red);
        },
        write: function (value) {
            self.ProcessRGBInput(self.ValidateValue(value, self.MAX_RGB), self.CurrentColorRGB().green, self.CurrentColorRGB().blue);
        }
    });

    self.Green = ko.computed({
        read: function () {
            return parseInt(self.CurrentColorRGB().green);
        },
        write: function (value) {
            self.ProcessRGBInput(self.CurrentColorRGB().red, self.ValidateValue(value, self.MAX_RGB), self.CurrentColorRGB().blue);
        }
    });

    self.Blue = ko.computed({
        read: function () {
            return parseInt(self.CurrentColorRGB().blue);
        },
        write: function (value) {
            self.ProcessRGBInput(self.CurrentColorRGB().red, self.CurrentColorRGB().green, self.ValidateValue(value, self.MAX_RGB));
        }
    });

    self.Hue = ko.computed({
        read: function () {
            return parseInt(self.CurrentColorHSL().hue);
        },
        write: function (value) {
            self.ProcessHSLInput(self.ValidateValue(value, self.MAX_HSL), self.CurrentColorHSL().saturation, self.CurrentColorHSL().luma);
        }
    });

    self.Luma = ko.computed({
        read: function () {
            return parseInt(self.CurrentColorHSL().luma);
        },
        write: function (value) {
            self.ProcessHSLInput(self.CurrentColorHSL().hue, self.CurrentColorHSL().saturation, self.ValidateValue(value, self.MAX_HSL));
        }
    });

    self.Saturation = ko.computed({
        read: function () {
            return parseInt(self.CurrentColorHSL().saturation);
        },
        write: function (value) {
            self.ProcessHSLInput(self.CurrentColorHSL().hue, self.ValidateValue(value, self.MAX_HSL), self.CurrentColorHSL().luma);
        }
    });

    self.HtmlColor = ko.computed(function () {
        return ColorHelpers.toHtmlRGB(self.Red(), self.Green(), self.Blue());
    });

    this.Init = function () {
        self.ProcessRGBInput(self.CurrentColorRGB().red, self.CurrentColorRGB().green, self.CurrentColorRGB().blue);
    };

    self.Init();
}

function ColorPickerViewModel() {
    var self = this;

    self.ID = ko.observable(Math.random() * 10000000);

    self.MAX_HSL = 240;
    self.MAX_RGB = 255;

    self.PREDEFINED_PICKER_COLORS = [
        [ "#FF8080", "#FFFF80", "#80FF80", "#00FF80", "#80FFFF", "#0080FF", "#FF80C0", "#FF80FF" ],
        [ "#FF0000", "#FFFF00", "#80FF00", "#00FF40", "#00FF40", "#0080C0", "#8080C0", "#FF00FF" ],
        [ "#804040", "#FF8040", "#00FF00", "#008080", "#004080", "#8080FF", "#800040", "#FF0080" ],
        [ "#800000", "#FF8000", "#008000", "#008040", "#0000FF", "#0000A0", "#800080", "#8000FF" ],
        [ "#400000", "#804000", "#004000", "#004040", "#000080", "#000040", "#400040", "#400080" ],
        [ "#000000", "#808000", "#808040", "#808080", "#408080", "#C0C0C0", "#400040", "#FFFFFF" ]
    ];

    self.Rendered = ko.observable(false);

    self.CurrentCustomIndex = 0;
    self.CustomPickerColors = ko.observableArray([]);

    self.CustomColorsRowCnt = ko.observable(0);
    self.CustomColorsColumnCnt = ko.observable(0);

    this.GenerateLumPalette = function () {
        if (self.Rendered() == false || self.IsChangingLuma() == true) {
            return;
        }

        var hue = self.CurrentColor().Hue();
        var saturation = self.CurrentColor().Saturation();

        var canv = document.getElementById('lum_palette');
        var canvas = canv.getContext("2d");

        for (var lum = self.MAX_HSL; lum >= 0; lum--) {
            var tempColor = ColorHelpers.fromHSL(hue, saturation, lum);
            canvas.fillStyle = ColorHelpers.toHtmlRGB(tempColor.red, tempColor.green, tempColor.blue);
            canvas.fillRect(0, self.MAX_HSL - lum, canv.width, 1);
        }
    };

    self.CurrentColor = ko.observable(new ColorModel(0, 0, 0, self.GenerateLumPalette));
    self.CurrentColor.subscribe(self.GenerateLumPalette);

    self.PalettePickerPositionLeft = ko.computed(function () {
        return (self.CurrentColor().Hue() - 10) + 'px';
    });

    self.PalettePickerPositionTop = ko.computed(function () {
        return (self.MAX_HSL - self.CurrentColor().Saturation() - 10) + 'px';
    });

    self.LumaPickerPosition = ko.computed(function () {
        return (self.MAX_HSL - self.CurrentColor().Luma()) + 'px';
    });

    this.GeneratePalette = function () {
        var canvas = document.getElementById(self.ID()).getContext("2d");

        for (var saturation = self.MAX_HSL; saturation >= 0; saturation--) {
            for (var hue = 0; hue <= self.MAX_HSL; hue++) {
                var tmpColor = ColorHelpers.fromHSL(hue, saturation, self.MAX_HSL * 0.5);
                canvas.fillStyle = ColorHelpers.toHtmlRGB(tmpColor.red, tmpColor.green, tmpColor.blue);
                canvas.fillRect(hue, self.MAX_HSL - saturation, 1, 1);
            }
        }
    };

    this.AddToCustomColors = function () {
        var row = Math.floor(self.CurrentCustomIndex / self.CustomColorsColumnCnt());
        var column = self.CurrentCustomIndex % self.CustomColorsColumnCnt();
        var elemCnt = self.CustomColorsRowCnt() * self.CustomColorsColumnCnt();

        var newColor = new ColorModel(self.CurrentColor().Red(), self.CurrentColor().Green(), self.CurrentColor().Blue());
        self.CustomPickerColors()[row]()[column](newColor);

        self.CurrentCustomIndex = (self.CurrentCustomIndex + 1) % elemCnt;
    };

    self.IsChangingPalette = ko.observable(false);
    self.IsChangingLuma = ko.observable(false);

    this.BeginChangingPalette = function (sender, event) {
        self.IsChangingPalette(true);

        self.ProcessChangingPalette(sender, event);
    };

    this.ProcessChangingPalette = function (sender, event) {
        if (!self.IsChangingPalette || self.IsChangingPalette() == false) {
            return;
        }

        self.CurrentColor().Hue(event.layerX);
        self.CurrentColor().Saturation(self.MAX_HSL - event.layerY);
    };

    this.EndChangingPalette = function () {
        self.IsChangingPalette(false);
    };

    this.BeginChangingLuma = function (sender, event) {
        self.IsChangingLuma(true);

        self.ProcessChangingLuma(sender, event);
    };

    this.ProcessChangingLuma = function (sender, event) {
        if (!self.IsChangingLuma || self.IsChangingLuma() == false) {
            return;
        }

        self.CurrentColor().Luma(self.MAX_HSL - event.layerY);
    };

    this.EndChangingLuma = function () {
        self.IsChangingLuma(false);
    };

    this.RenderCompleted = function () {
        self.Rendered(true);
        self.GeneratePalette();
        self.GenerateLumPalette();
    };

    this.Init = function () {
        var rowCnt = 2;
        var columnCnt = 8;

        for (var i = 0; i < rowCnt; i++) {
            self.CustomPickerColors.push(ko.observableArray([]));
            for (var j = 0; j < columnCnt; j++) {
                self.CustomPickerColors()[i].push(ko.observable(new ColorModel(255, 255, 255)));
            }
        }

        self.CustomColorsRowCnt(rowCnt);
        self.CustomColorsColumnCnt(columnCnt);
    };

    self.Init();
}
