function ApplicationViewModel() {
    this.Open = function () {
        var reader = new FileReader();
        var image;
        reader.onload = function (e) {
            image = new Image();
            image.src = e.target.result;

            image.onload = function () {
                var canvas = getElement('canv');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.style.width = canvas.width;
                canvas.style.height = canvas.height;

                canvas.getContext("2d").drawImage(image, 0, 0);
            };
        };
        reader.readAsDataURL(getElement('image_file_picker').files[0]);
    };

    this.Save = function () {
        if (fileExtension == null)
            saveAsPng();
        else if (fileExtension == "png")
            saveAsPng();
        else if (fileExtension == "jpg")
            saveAsJpeg();
    };
}
