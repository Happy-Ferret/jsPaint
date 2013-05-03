var fileExtension = null;

/* MENU COMMANDS */
function printCommand() {
	hideMainMenu();
}

function sendEmailCommand() {
	hideMainMenu();
}

function setAsDesktopBackgroundCommand() {
	hideMainMenu();
}	 

function showPropertiesCommand() {
	hideMainMenu();
}

function showAboutWindowCommand() {
	hideMainMenu();
}

/* SAVE FUNCTIONS */
function saveAsPng(){
	window.open(getElement('canv').toDataURL('image/png'), 'Save result');
	fileExtension = "png";
	hideMainMenu();
}

function saveAsJpeg() {
	window.open(getElement('canv').toDataURL('image/jpeg'), 'Save result');
	fileExtension = "jpg";
	hideMainMenu();
}