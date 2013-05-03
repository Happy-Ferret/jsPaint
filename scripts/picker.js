var MAX_LUMA = 240;
var MAX_SATURATION = 240;
var MAX_HUE = 240;

var predefinedPickerColors = [
							[ "#FF8080", "#FFFF80", "#80FF80", "#00FF80", "#80FFFF", "#0080FF", "#FF80C0", "#FF80FF" ],
							[ "#FF0000", "#FFFF00", "#80FF00", "#00FF40", "#00FF40", "#0080C0", "#8080C0", "#FF00FF" ], 
							[ "#804040", "#FF8040", "#00FF00", "#008080", "#004080", "#8080FF", "#800040", "#FF0080" ], 
							[ "#800000", "#FF8000", "#008000", "#008040", "#0000FF", "#0000A0", "#800080", "#8000FF" ],
							[ "#400000", "#804000", "#004000", "#004040", "#000080", "#000040", "#400040", "#400080" ],
							[ "#000000", "#808000", "#808040", "#808080", "#408080", "#C0C0C0", "#400040", "#FFFFFF" ]
						];
						
var customPickerColors = [
						[ "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF" ], 
						[ "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF" ] 
					];
					
var customColorRowIndex = 0;
var customColorColumnIndex = 0;

function generatePredefined() {
	var table = document.getElementById('predefined_colors_table');
	
	for (var i = 0; i < predefinedPickerColors.length; i++) {
		var row = table.insertRow(table.rows.length);
		
		for (var j = 0; j < predefinedPickerColors[i].length; j++) {
			var cell = row.insertCell(row.cells.length);
			
			var block = document.createElement('div');
			block.setAttribute("class", "color_cell");
			block.setAttribute("onclick", "pickPredefined('" + predefinedPickerColors[i][j] + "')");
			block.style.backgroundColor = predefinedPickerColors[i][j];
			
			cell.appendChild(block);
		}
	}
}

function generateCustom() {
	var table = document.getElementById('custom_colors_table');
	for (var i = 0; i < customPickerColors.length; i++) {
		var row = table.insertRow(table.rows.length);
		
		for (var j = 0; j < customPickerColors[i].length; j++) {
			var cell = row.insertCell(row.cells.length);
			
			var block = document.createElement('div');
			block.setAttribute("class", "color_cell");
			block.setAttribute("id", "custom_color_" + i + "_" + j);
			block.setAttribute("onclick", "pickPredefined('" + customPickerColors[i][j] + "')");
			
			cell.appendChild(block);
		}
	}
	
	raiseCustomColorsChanged();
}

function initHandlers() {
	document.getElementById('luma_picker').onmousemove = changeLuma;
	document.getElementById('palette_picker').onmousemove = changePalette;
	
	document.getElementById('red_text').onkeypress = processInputRGB;
	document.getElementById('green_text').onkeypress = processInputRGB;
	document.getElementById('blue_text').onkeypress = processInputRGB;
	
	document.getElementById('hue_text').onkeypress = processInputHSL;
	document.getElementById('saturation_text').onkeypress = processInputHSL;
	document.getElementById('luma_text').onkeypress = processInputHSL;
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
		canvas.fillStyle = toRgb(tempColor.red, tempColor.green, tempColor.blue);
		canvas.fillRect(0, MAX_LUMA - lum , canv.width, 1);		
	}
}

function generatePalette() {
	var canvas = document.getElementById('color_picker_palette').getContext("2d");
	
	for (var saturation = MAX_SATURATION; saturation >= 0; saturation--) {
		for (var hue = 0; hue <= MAX_HUE; hue++) {
			var tmpColor = fromHSL(hue * 360.0 / 240.0, saturation / 240.0, 0.5);
			canvas.fillStyle = toRgb(tmpColor.red, tmpColor.green, tmpColor.blue);
			canvas.fillRect(hue, MAX_SATURATION - saturation, 1, 1);
		}
	}
}

function colorChanged(color) {
	document.getElementById('red_text').value = color.red.toFixed(0);
	document.getElementById('green_text').value = color.green.toFixed(0);
	document.getElementById('blue_text').value = color.blue.toFixed(0);
	
	document.getElementById('hue_text').value = color.hue.toFixed(0);
	document.getElementById('saturation_text').value = color.saturation.toFixed(0);
	document.getElementById('luma_text').value = color.luma.toFixed(0);
	
	document.getElementById('color_example').style.backgroundColor = toRgb(color.red, color.green, color.blue);
	
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

function checkValue(value) {
	if (isNaN(value) || value < 0)
		return 0;
	
	if (value > 240)
		return 240;
		
	return value;
}

function processInputHSL(e) {
	if (!(e.charCode >= 48 && e.charCode <= 57)) {
		e.returnValue = false;
		return;
	}
	
	var h = parseInt(document.getElementById('hue_text').value);
	var s = parseInt(document.getElementById('saturation_text').value);
	var l = parseInt(document.getElementById('luma_text').value);
	
	h = checkValue(h);
	s = checkValue(s);
	l = checkValue(l);	
	
	var rgbSet = fromHSL(h * 360.0 / 240.0, s / 240.0, l / 240.0);
	
	colorChanged(
	{
		red: rgbSet.red,
		green: rgbSet.green,
		blue: rgbSet.blue,
		hue: h,
		saturation: s,
		luma: l
	});
}

function processInputRGB(e) {
	if (!(e.charCode >= 48 && e.charCode <= 57)) {
		e.returnValue = false;
		return;
	}
	
	var r = parseInt(document.getElementById('red_text').value);
	var g = parseInt(document.getElementById('green_text').value);
	var b = parseInt(document.getElementById('blue_text').value);
	
	r = checkValue(r);
	g = checkValue(g);
	b = checkValue(b);
	
	var hslSet = fromRGB(r, g, b);
	
	colorChanged(
	{
		red: r,
		green: g,
		blue: b,
		hue: hslSet.hue,
		saturation: hslSet.saturation,
		luma: hslSet.luma
	});
}

function raiseCustomColorsChanged() {
	for (var i = 0; i < customPickerColors.length; i++)
		for (var j = 0; j < customPickerColors[i].length; j++)
			document.getElementById('custom_color_' + i + '_' + j).style.backgroundColor = customPickerColors[i][j];
}

function getCurrentColor() {
	return document.getElementById('color_example').style.backgroundColor;
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
}