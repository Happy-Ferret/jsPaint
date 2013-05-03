var fileExtension = null;

/* MENU COMMANDS */
function newFileCommand() {
	init();
	
	hideMainMenu();
}

function openFileCommand() {
	var reader = new FileReader();
	var image;
    reader.onload = function(e) {
        image = new Image();
        image.src = e.target.result;
		
		image.onload = function() {
			var canvas = getElement('canv');
			canvas.width = image.width;
			canvas.height = image.height;
			canvas.style.width = canvas.width;
			canvas.style.height = canvas.height;
			
			canvas.getContext("2d").drawImage(image, 0, 0);
		};
    };
    reader.readAsDataURL(getElement('image_file_picker').files[0]);
	
	hideMainMenu();
}

function saveFileCommand() {
	if (fileExtension == null)
		saveAsPng();
	else if (fileExtension == "png")
		saveAsPng();
	else if (fileExtension == "jpg")
		saveAsJpeg();
}

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

function exitCommand() {
	window.close();
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