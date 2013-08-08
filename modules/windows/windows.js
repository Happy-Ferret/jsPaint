//  parameters: {
//      title (string, ''),
//      icon (url, null),
//      system: {
//          canMinimize (bool, false),
//          canMaximize (bool, false),
//          canClose (bool, true),
//          resizable (bool, false)
//      },
//      size: {
//          width (integer, 640),
//          height (integer, 480)
//      },
//      position: {
//          left (integer, 0),
//          top (integer, 0)
//      },
//      background: (string, #FFFFFF),
//  },
//  content (DOMElement, null)

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

    self.Size = {
        Top: ko.observable(0),
        Left: ko.observable(0)
    };

    self.Top = ko.computed(function () {
        return self.Size.Top() + 'px';
    });
    self.Left = ko.computed(function () {
        return self.Size.Left() + 'px';
    });

    self.IsDragging = false;
    self.DragOffset = {
        offsetX: 0,
        offsetY: 0
    };

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

                if (parameters.system.canClose) {
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

        document.body.addEventListener('mousemove', self.Drag);
    };

    this.Minimize = function () {

    };

    this.Maximize = function () {

    };

    this.Close = function () {

    };

    this.BeginDrag = function (data, event) {
        self.IsDragging = true;

        var mouseCoordinates = getAbsoluteMousePos(event);
        self.DragOffset = {
            offsetX: mouseCoordinates.x - self.Size.Left(),
            offsetY: mouseCoordinates.y - self.Size.Top()
        };
    };

    this.EndDrag = function () {
        self.IsDragging = false;
    };

    this.Drag = function (coordinates) {
        if (self.IsDragging == false || !coordinates) {
            return;
        }

        self.Size.Left(coordinates.x - self.DragOffset.offsetX);
        self.Size.Top(coordinates.y - self.DragOffset.offsetY);
    };

    self.Init();
}