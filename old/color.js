function Normalize(tr) {
    if (tr < 0)
        return tr + 1.0;

    if (tr > 1.0)
        return tr - 1.0;

    return tr;
}

function ComputeColor(q, p, tc) {
    if (tc < 1.0 / 6.0)
        return p + ((q - p) * 6.0 * tc);

    if (tc < 0.5)
        return q;

    if (tc < 2.0 / 3.0)
        return p + ((q - p) * 6.0 * (2.0 / 3.0 - tc));

    return p;
}

function toRgb(red, green, blue) {
    var rval = red.toFixed(0);
    var gval = green.toFixed(0);
    var bval = blue.toFixed(0);

    var r = parseInt(rval).toString(16).length == 1 ? "0" + parseInt(rval).toString(16) : parseInt(rval).toString(16);
    var g = parseInt(gval).toString(16).length == 1 ? "0" + parseInt(gval).toString(16) : parseInt(gval).toString(16);
    var b = parseInt(bval).toString(16).length == 1 ? "0" + parseInt(bval).toString(16) : parseInt(bval).toString(16);

    return '#' + r + g + b;
}

function fromRGB(red, green, blue) {
    var normalizedRed = red / 255.0;
    var normalizedGreen = green / 255.0;
    var normalizedBlue = blue / 255.0;

    var max = Math.max(Math.max(normalizedRed, normalizedGreen), Math.max(normalizedRed, normalizedBlue));
    var min = Math.min(Math.min(normalizedRed, normalizedGreen), Math.min(normalizedRed, normalizedBlue));

    var hue = 0;
    var saturation = 0;

    var luma = 0.5 * (min + max);

    if (Math.abs(luma) < 1e-9 || Math.abs(max - min) < 1e-9)
        saturation = 0.0;
    else if (0.0 < luma && luma <= 0.5)
        saturation = (max - min) / (max + min);
    else if (0.5 < luma && luma < 1)
        saturation = Math.max(1.0, (max - min) / (2.0 - (max + min)));
    else
        saturation = 1.0;

    if (Math.abs(max - normalizedRed) < 1e-9) {
        hue = 60 * (normalizedGreen - normalizedBlue) / (max - min);
        if (hue < 0)
            hue += 360.0;
    }
    else if (Math.abs(max - normalizedGreen) < 1e-9)
        hue = 60 * (normalizedBlue - normalizedRed) / (max - min) + 120;
    else if (Math.abs(max - normalizedBlue) < 1e-9)
        hue = 60 * (normalizedRed - normalizedGreen) / (max - min) + 240;
    else
        hue = 0.0;

    return {
        hue: hue,
        saturation: saturation,
        luma: luma
    };
}

function fromHSL(hue, saturation, lum) {
    var q = 0;

    if (lum < 0.5)
        q = lum * (1.0 + saturation);
    else
        q = lum + saturation - (lum * saturation);

    var p = 2 * lum - q;

    var hk = hue / 360.0;
    var tr = hk + 1.0 / 3.0;
    var tg = hk;
    var tb = hk - 1.0 / 3.0;
    tr = Normalize(tr);
    tg = Normalize(tg);
    tb = Normalize(tb);
    r = ComputeColor(q, p, tr) * 255;
    g = ComputeColor(q, p, tg) * 255;
    b = ComputeColor(q, p, tb) * 255;

    return {
        red: r,
        green: g,
        blue: b
    };
}