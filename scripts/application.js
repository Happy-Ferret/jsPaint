function ApplicationViewModel() {
    var self = this;

    self.Windows = ko.observableArray([]);

    self.TopIcons = ko.observable();

    self.StatusBarVisible = ko.observable(true);

    self.UndoAvailable = ko.computed(function () {

    });

    self.RedoAvailable = ko.computed(function () {

    });

    this.New = function () {
        init();

        hideMainMenu();
    };

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

        hideMainMenu();
    };

    this.Save = function () {
        if (fileExtension == null)
            saveAsPng();
        else if (fileExtension == "png")
            saveAsPng();
        else if (fileExtension == "jpg")
            saveAsJpeg();
    };

    this.SaveAs = function () {
    };

    this.Print = function () {
        var canvasClone = document.getElementById('printing_canvas');

        if (canvasClone)
            document.getElementById('app').removeChild(canvasClone);

        canvasClone = cloneCanvas(document.getElementById('canv'));
        canvasClone.id = 'printing_canvas';

        document.getElementById('app').appendChild(canvasClone);

        window.print();
    };

    this.ShowProperties = function () {
        getElement('properties_window').style.display = "block";
    };

    this.ShowAbout = function () {
        getElement('about_window').style.display = "block";
    };

    this.Exit = function () {
        window.close();
    };

    this.ZoomIn = function () {
        var zoomSlider = getElement('zoom_value');
        zoomSlider.value = parseInt(zoomSlider.value) + parseInt(zoomSlider.step);

        raiseZoomChanged();
    };

    this.ZoomOut = function () {
        var zoomSlider = getElement('zoom_value');
        zoomSlider.value = parseInt(zoomSlider.value) - parseInt(zoomSlider.step);

        raiseZoomChanged();
    };

    this.Init = function () {
        self.TopIcons(new TopIconsViewModel(self));
    };

    self.Init();
}
