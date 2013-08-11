function ColorPickerViewModel() {
    var self = this;

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

    self.CustomPickerColors = ko.observableArray([
        [ "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF" ],
        [ "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF" ]
    ]);

    this.ValidateValue = function (value, maxValue) {
        if (isNaN(value) || value < 0)
            return 0;

        if (value > maxValue)
            return maxValue;

        return value;
    };

    self.CurrentColorRGB = ko.observable({
        red: 0,
        green: 0,
        blue: 0
    });
    self.CurrentColorHSL = ko.observable({
        hue: 0,
        luma: 0,
        saturation: 0
    });

    this.ProcessRGBInput = function (r, g, b) {
        self.CurrentColorRGB({red: r, green: g, blue: b});

        var hsl = ColorHelpers.fromRGB(r, g, b);

        self.CurrentColorHSL({hue: hsl.hue, luma: hsl.luma, saturation: hsl.saturation});
    };

    this.ProcessHSLInput = function (h, s, l) {
        self.CurrentColorHSL({hue: h, luma: l, saturation: s});

        var rgbSet = ColorHelpers.fromHSL(h * 360.0 / 240.0, s / 240.0, l / 240.0);

        self.CurrentColorRGB({red: rgbSet.red, green: rgbSet.green, blue: rgbSet.blue});
    };

    self.Red = ko.computed({
        read: function () {
            return self.CurrentColorRGB().red;
        },
        write: function (value) {
            self.ProcessRGBInput(self.ValidateValue(value, self.MAX_RGB), self.CurrentColorRGB().green, self.CurrentColorRGB().blue);
        }
    });
    self.Green = ko.computed({
        read: function () {
            return self.CurrentColorRGB().green;
        },
        write: function (value) {
            self.ProcessRGBInput(self.CurrentColorRGB().red, self.ValidateValue(value, self.MAX_RGB), self.CurrentColorRGB().blue);
        }
    });
    self.Blue = ko.computed({
        read: function () {
            return self.CurrentColorRGB().blue;
        },
        write: function (value) {
            self.ProcessRGBInput(self.CurrentColorRGB().red, self.CurrentColorRGB().green, self.ValidateValue(value, self.MAX_RGB));
        }
    });

    self.Hue = ko.computed({
        read: function () {
            return self.CurrentColorHSL().hue;
        },
        write: function (value) {
            self.ProcessHSLInput(self.ValidateValue(value, self.MAX_HSL), self.CurrentColorHSL().saturation, self.CurrentColorHSL().luma);
        }
    });
    self.Luma = ko.computed({
        read: function () {
            return self.CurrentColorHSL().luma;
        },
        write: function (value) {
            self.ProcessHSLInput(self.CurrentColorHSL().hue, self.CurrentColorHSL().saturation, self.ValidateValue(value, self.MAX_HSL));
        }
    });
    self.Saturation = ko.computed({
        read: function () {
            return self.CurrentColorHSL().saturation;
        },
        write: function (value) {
            self.ProcessHSLInput(self.CurrentColorHSL().hue, self.ValidateValue(value, self.MAX_HSL), self.CurrentColorHSL().luma);
        }
    });

    /*var customColorRowIndex = 0;
     var customColorColumnIndex = 0;

     function initHandlers() {
     document.getElementById('luma_picker').onmousemove = changeLuma;
     document.getElementById('palette_picker').onmousemove = changePalette;

     }

     function initPicker() {
     generatePredefined();
     generateCustom();

     generatePalette();
     generateLumPalette(160 * 360.0 / MAX_LUMA, 0);

     initHandlers();

     document.getElementById('palette_crosshair').draggable = false;

     document.getElementById('define_custom_colors').disabled = true;
     }

     function generateLumPalette(hue, saturation) {
     var canv = document.getElementById('lum_palette');
     var canvas = canv.getContext("2d");


     for (var lum = MAX_LUMA; lum >= 0; lum--) {
     var tempColor = fromHSL(hue * 360.0 / 240.0, saturation / 240.0, lum / 240.0);
     canvas.fillStyle = toHtmlRGB(tempColor.red, tempColor.green, tempColor.blue);
     canvas.fillRect(0, MAX_LUMA - lum, canv.width, 1);
     }
     }

     function generatePalette() {
     var canvas = document.getElementById('color_picker_palette').getContext("2d");

     for (var saturation = MAX_SATURATION; saturation >= 0; saturation--) {
     for (var hue = 0; hue <= MAX_HUE; hue++) {
     var tmpColor = fromHSL(hue * 360.0 / 240.0, saturation / 240.0, 0.5);
     canvas.fillStyle = toHtmlRGB(tmpColor.red, tmpColor.green, tmpColor.blue);
     canvas.fillRect(hue, MAX_SATURATION - saturation, 1, 1);
     }
     }
     }

     function colorChanged(color) {
     document.getElementById('color_example').style.backgroundColor = toHtmlRGB(color.red, color.green, color.blue);

     generateLumPalette(color.hue, color.saturation);

     var paletteCrosshair = document.getElementById('palette_crosshair');
     var lumaSlider = document.getElementById('luma_slider');
     paletteCrosshair.style.marginLeft = color.hue + "px";
     paletteCrosshair.style.marginTop = (MAX_SATURATION - color.saturation) + "px";
     lumaSlider.style.marginTop = (MAX_LUMA - color.luma) + "px";
     }

     var isLumaChanging = false;

     function beginChangingLuma() {
     isLumaChanging = true;
     }

     function endChangingLuma() {
     isLumaChanging = false;
     }

     function changeLuma(event) {
     if (!isLumaChanging)
     return;

     var picker = document.getElementById('luma_picker');
     var slider = document.getElementById('luma_slider');

     slider.style.marginTop = (getAbsoluteMousePos(event).y - getAbsoluteElementPosition(picker).y) + "px";

     colorChanged(defineColor());
     }

     var isPaletteChanging = false;

     function beginChangingPalette() {
     isPaletteChanging = true;
     document.getElementById('palette_picker').style.cursor = "none";
     }

     function endChangingPalette() {
     isPaletteChanging = false;
     document.getElementById('palette_picker').style.cursor = "default";
     }

     function changePalette(event) {
     if (!isPaletteChanging)
     return;

     var picker = document.getElementById('palette_picker');
     var crosshair = document.getElementById('palette_crosshair');

     var hue = getAbsoluteMousePos(event).x - getAbsoluteElementPosition(picker).x - (crosshair.width * 0.5);
     var saturation = getAbsoluteMousePos(event).y - getAbsoluteElementPosition(picker).y - (crosshair.height * 0.5);
     crosshair.style.marginLeft = hue + "px";
     crosshair.style.marginTop = saturation + "px";

     generateLumPalette(hue, MAX_SATURATION - saturation);
     colorChanged(defineColor());
     }

     function defineColor() {
     var crosshair = document.getElementById('palette_crosshair');
     var lumaSlider = document.getElementById('luma_slider');

     var h = parseInt(crosshair.style.marginLeft);
     var s = MAX_SATURATION - parseInt(crosshair.style.marginTop);
     var l = MAX_LUMA - parseInt(lumaSlider.style.marginTop);
     var rgbClr = fromHSL(h * 360.0 / 240.0, s / 240.0, l / 240.0);

     return {
     red: rgbClr.red,
     green: rgbClr.green,
     blue: rgbClr.blue,
     hue: h,
     saturation: s,
     luma: l
     };
     }

     function pickPredefined(color) {
     var r = parseInt(color.substring(1, 3), 16);
     var g = parseInt(color.substring(3, 5), 16);
     var b = parseInt(color.substring(5, 7), 16);

     var hsl = fromRGB(r, g, b);

     colorChanged({
     hue: Math.round(hsl.hue * 240.0 / 360.0),
     saturation: Math.round(hsl.saturation * 240.0),
     luma: Math.round(hsl.luma * 240.0),
     red: Math.round(r),
     green: Math.round(g),
     blue: Math.round(b)
     });
     }

     function raiseCustomColorsChanged() {
     for (var i = 0; i < customPickerColors.length; i++)
     for (var j = 0; j < customPickerColors[i].length; j++)
     document.getElementById('custom_color_' + i + '_' + j).style.backgroundColor = customPickerColors[i][j];
     }

     function addToCustomColors() {
     customPickerColors[customColorRowIndex][customColorColumnIndex++] = getCurrentColor();
     if (customColorColumnIndex == customPickerColors[customColorRowIndex].length) {
     customColorColumnIndex = 0;
     customColorRowIndex++;

     if (customColorRowIndex == customPickerColors.length)
     customColorRowIndex = 0;
     }

     raiseCustomColorsChanged();
     }*/
}