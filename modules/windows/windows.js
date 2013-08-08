/*

 parameters: {
 title (string, ''),
 icon (url, null),
 system: {
 canMinimize (bool, false),
 canMaximize (bool, false),
 canClose (bool, true),
 resizable (bool, false)
 },
 size: {
 width (integer, 640),
 height (integer, 480)
 },
 background: (string, #FFFFFF),
 },
 content (DOMElement, null)

 */

function WindowViewModel(parameters, content) {
    var self = this;

    // Properties
    self.Title = ko.observable('');
    self.Icon = ko.observable('');
    self.Background = ko.observable('#FFFFFF');

    self.CanMinimize = ko.observable(false);
    self.CanMaximize = ko.observable(false);
    self.CanClose = ko.observable(true);
    self.Resizable = ko.observable(false);

    // Window state
    self.IsVisible = ko.observable(true);
    self.DomContent = ko.observable(content);
    self.Content = ko.computed(function () {
        return self.DomContent() ? self.DomContent().outerHTML : '';
    });

    self.Width = ko.observable(640);
    self.Height = ko.observable(480);

    this.Init = function () {
        if (parameters) {
            if (parameters.title) {
                self.Title(parameters.title);
            }

            if (parameters.icon) {
                self.Icon(parameters.icon);
            }

            if (parameters.background) {
                self.Background(parameters.background);
            }

            if (parameters.system) {
                if (parameters.system.canMinimize) {
                    self.CanMinimize(parameters.system.canMinimize);
                }

                if (parameters.system.canMaximize) {
                    self.CanMaximize(parameters.system.canMaximize);
                }

                if (parameters.system.canCloze) {
                    self.CanClose(parameters.system.canClose);
                }

                if (parameters.system.resizable) {
                    self.Resizable(parameters.system.resizable);
                }
            }

            if (parameters.size) {
                if (parameters.size.width) {
                    self.Width(parameters.size.width);
                }

                if (parameters.size.height) {
                    self.Height(parameters.size.height);
                }
            }
        }
    };

    this.Minimize = function () {

    };

    this.Maximize = function () {

    };

    this.Close = function () {

    };

    self.Init();
}

var draggableWindow = null;
var offsetX;
var offsetY;

function drag(e) {
    if (draggableWindow == null)
        return;

    var coords = getAbsoluteMousePos(e);
    draggableWindow.style.left = coords.x - offsetX;
    draggableWindow.style.top = coords.y - offsetY;
}

function beginDrag(event, window) {
    var mouseCoords = getAbsoluteMousePos(event);
    var windowCoords = getAbsoluteElementPosition(window);

    draggableWindow = window.parentNode.parentNode;
    offsetX = mouseCoords.x - windowCoords.x;
    offsetY = mouseCoords.y - windowCoords.y;
}

function endDrag() {
    draggableWindow = null;
}