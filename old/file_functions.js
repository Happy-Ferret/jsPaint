var fileExtension = null;

/* SAVE FUNCTIONS */
function saveAsPng() {
    window.open(getElement('canv').toDataURL('image/png'), 'Save result');
    fileExtension = "png";
    hideMainMenu();
}

function saveAsJpeg() {
    window.open(getElement('canv').toDataURL('image/jpeg'), 'Save result');
    fileExtension = "jpg";
    hideMainMenu();
}