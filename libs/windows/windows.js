//  parameters: {
//      title (string, ''),
//      iconClass (string, ''),
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
//  events: {
//      onDataSelect (function(newData), undefined)
//  }
//  template ID (string, '')
//  viewModel (knockout viewModel, undefined)

function WindowViewModel(parameters, template, viewModel, events) {
    var self = this;

    self.ID = ko.observable('container' + Math.floor((Math.random() * 100000000) + 1));

    // Initial Properties
    self.Title = ko.observable('');
    self.Icon = ko.observable('');
    self.Background = ko.observable('#FFFFFF');

    self.CanMinimize = ko.observable(false);
    self.CanMaximize = ko.observable(false);
    self.CanClose = ko.observable(true);
    self.Resizable = ko.observable(false);

    // Window State
    self.IsVisible = ko.observable(true);
    self.IsMaximized = ko.observable(false);

    self.Template = ko.observable(template);
    self.Data = ko.observable(viewModel);

    self.Size = {
        Width: ko.observable(640),
        Height: ko.observable(480)
    };

    self.Position = {
        Top: ko.observable(0),
        Left: ko.observable(0)
    };

    self.IsDragging = false;
    self.DragOffset = undefined;

    self.MaximizeStyle = ko.computed(function () {
        return self.IsMaximized() ? 'systemMaximizedButton' : 'systemMaximizeButton';
    });

    self.previousSize = {};
    self.previousPosition = {};

    this.Init = function () {
        if (parameters) {
            if (parameters.title) {
                self.Title(parameters.title);
            }

            if (parameters.iconClass) {
                self.Icon(parameters.iconClass);
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
                    self.Size.Width(parameters.size.width);
                }

                if (parameters.size.height) {
                    self.Size.Height(parameters.size.height);
                }
            }
        }

        self.previousPosition = {
            left: self.Position.Left(),
            top: self.Position.Top()
        };
        self.previousSize = {
            width: self.Size.Width(),
            height: self.Size.Height()
        };

        document.body.addEventListener('mousemove', self.Drag);

        //ko.applyBindings(viewModel, getElement(self.ID()));
    };

    this.DataSelect = function (newValue) {
        if (events && events.onDataSelect) {
            events.onDataSelect(newValue);
        }
    };

    this.Minimize = function () {

    };

    this.RestoreLastSize = function () {
        if (self.IsMaximized() == false) {
            return;
        }

        self.Size.Width(self.previousSize.width);
        self.Size.Height(self.previousSize.height);
        self.Position.Left(self.previousPosition.left);
        self.Position.Top(self.previousPosition.top);

        self.IsMaximized(false);
    };

    this.Maximize = function () {
        if (self.IsMaximized() == true) {
            return;
        }

        self.previousSize = {
            width: self.Size.Width(),
            height: self.Size.Height()
        };
        self.previousPosition = {
            left: self.Position.Left(),
            top: self.Position.Top()
        };

        self.Size.Width(window.innerWidth);
        self.Size.Height(window.InnerHeight);
        self.Position.Left(0);
        self.Position.Top(0);

        self.IsMaximized(true);
    };

    this.ClickMaximize = function () {
        if (self.IsMaximized() == true) {
            this.RestoreLastSize();
        } else {
            this.Maximize();
        }
    };

    this.Close = function () {

    };

    this.BeginDrag = function (data, event) {
        self.IsDragging = true;
    };

    this.EndDrag = function () {
        self.IsDragging = false;
        self.DragOffset = undefined;
    };

    this.Drag = function (coordinates) {
        if (self.IsDragging == false || !coordinates) {
            return;
        }

        self.RestoreLastSize();

        if (!self.DragOffset) {
            var mouseCoordinates = getAbsoluteMousePos(event);
            self.DragOffset = {
                offsetX: mouseCoordinates.x - self.Position.Left(),
                offsetY: mouseCoordinates.y - self.Position.Top()
            };
        }

        self.Position.Left(coordinates.x - self.DragOffset.offsetX);
        self.Position.Top(coordinates.y - self.DragOffset.offsetY);
    };

    self.Init();
}