WindowsFramework = {
    // Get absolute coordinates of the element
    getAbsoluteElementPosition: function (element) {
        var obj = element;

        var coordinates = {
            x: 0,
            y: 0
        };

        if (!element)
            return coordinates;

        do {
            coordinates.x += obj.offsetLeft;
            coordinates.y += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return coordinates;
    },

    getElementPositionInWindow: function (element) {
        var obj = element;

        var coords = {
            x: 0,
            y: 0
        };

        do {
            coords.x += obj.offsetLeft;
            coords.y += obj.offsetTop;
        } while ((obj = obj.offsetParent) && (!WindowsFramework.elementIsClass(obj, 'outer_border')));

        return coords;
    },

    // Get coordinates of the mouse cursor relative to an element
    getRelativeMousePos: function (element, evt) {
        var mouseX = evt.pageX - element.offsetLeft;
        var mouseY = evt.pageY - element.offsetTop;

        return {
            x: mouseX,
            y: mouseY
        };
    },

    // Get absolute mouse coordinates
    getAbsoluteMousePos: function (evt) {
        return {
            x: evt.pageX,
            y: evt.pageY
        };
    },

    getElement: function (name) {
        return document.getElementById(name);
    },

    elementIsClass: function (element, className) {
        var elementClasses = element.className.split(' ');

        for (var i = 0; i < elementClasses.length; i++)
            if (elementClasses[i] == className)
                return true;

        return false;
    },

    includeModule: function (container, url) {
        var loadHtmlSync = function (url, callback) {
            var request;
            if (window.XMLHttpRequest) {
                request = new XMLHttpRequest();
            }

            request.open("GET", url, false);
            request.send();

            return (request.readyState == 4 || request.status == 200) ? request.responseText : '';
        };

        container.innerHTML = loadHtmlSync(url);
    },

    WindowsDispatcher: function () {
        var self = this;

        self.MaxOrder = ko.observable(10);
        self.Windows = ko.observableArray([]);

        this.AddWindow = function (windowViewModel) {
            windowViewModel.Dispatcher = self;
            windowViewModel.Order(self.MaxOrder());
            self.Windows.push(windowViewModel);
            self.MaxOrder(self.MaxOrder() + 1);
        };

        this.RemoveWindow = function (windowViewModel) {
            self.Windows.remove(windowViewModel);
        };

        this.BringToFront = function (viewModel) {
            viewModel.Order(self.MaxOrder());
            self.MaxOrder(self.MaxOrder() + 1);
        };

        this.EndDragAll = function () {
            for (var i = 0; i < self.Windows().length; i++) {
                self.Windows()[i].EndDrag();
                self.Windows()[i].EndResize();
            }
        };
    },

    WindowViewModel: function (parameters, templates, viewModels, events) {
        var self = this;

        self.Dispatcher = undefined;
        self.Order = ko.observable(0);
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

        self.Template = ko.observable('');
        self.Data = ko.observable(undefined);

        self.StatusbarTemplate = ko.observable('');
        self.StatusbarViewModel = ko.observable(undefined);

        self.Size = {
            Width: ko.observable(640),
            Height: ko.observable(480)
        };
        self.Size.FullWidth = ko.computed(function () {
            return self.Size.Width() + 6
        });

        self.Size.FullHeight = ko.computed(function () {
            return self.Size.Height() + 26 + (self.StatusbarTemplate() == '' ? 0 : 22);
        });

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

        this.BringToFront = function () {
            if (self.Dispatcher)
                self.Dispatcher.BringToFront(self);
        };

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

                if (templates) {
                    if (templates.windowTemplate) {
                        self.Template(templates.windowTemplate);
                    }

                    if (templates.statusbarTemplate) {
                        self.StatusbarTemplate(templates.statusbarTemplate);
                    }
                }

                if (viewModels) {
                    if (viewModels.windowViewModel) {
                        self.Data(viewModels.windowViewModel);
                    }

                    if (viewModels.statusbarViewModel) {
                        self.StatusbarViewModel(viewModels.statusbarViewModel);
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

            document.body.addEventListener('mousemove', self.MouseMove);
        };

        this.DataSelect = function (newValue) {
            if (events && events.onDataSelect) {
                events.onDataSelect(newValue);
            }

            self.Close();
        };

        this.Minimize = function () {
            if (events && events.onMinimize) {
                events.onMinimize();
            }
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

            if (events && events.onRestore) {
                events.onRestore();
            }
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
            self.Size.Height(window.innerHeight);
            self.Position.Left(0);
            self.Position.Top(0);

            self.IsMaximized(true);

            if (events && events.onMaximize) {
                events.onMaximize();
            }
        };

        this.ClickMaximize = function () {
            if (self.IsMaximized() == true) {
                this.RestoreLastSize();
            } else {
                this.Maximize();
            }
        };

        this.Close = function () {
            if (self.Dispatcher) {
                self.Dispatcher.RemoveWindow(self);
            }

            if (events && events.onClose) {
                events.onClose();
            }
        };

        this.BeginDrag = function () {
            self.IsDragging = true;

            if (events && events.onMoveBegin) {
                events.onMoveBegin();
            }
        };

        this.EndDrag = function () {
            self.IsDragging = false;
            self.DragOffset = undefined;

            if (events && events.onMoveEnd) {
                events.onMoveEnd();
            }
        };

        this.Drag = function (evt) {
            if (self.IsDragging == false || !evt) {
                return;
            }

            self.RestoreLastSize();

            if (!self.DragOffset) {
                var mouseCoordinates = WindowsFramework.getAbsoluteMousePos(evt);
                self.DragOffset = {
                    offsetX: mouseCoordinates.x - self.Position.Left(),
                    offsetY: mouseCoordinates.y - self.Position.Top()
                };
            }

            self.Position.Left(evt.x - self.DragOffset.offsetX);
            self.Position.Top(evt.y - self.DragOffset.offsetY);
        };

        self.IsResizingS = false;
        self.IsResizingE = false;
        self.IsResizingW = false;
        self.IsResizingN = false;

        self.Right = undefined;
        self.Bottom = undefined;

        this.BeginResizeE = function () {
            self.IsResizingE = true;
        };

        this.BeginResizeS = function () {
            self.IsResizingS = true;
        };

        this.BeginResizeW = function () {
            self.IsResizingW = true;
        };

        this.BeginResizeN = function () {
            self.IsResizingN = true;
        };

        this.BeginResizeNW = function () {
            self.IsResizingN = true;
            self.IsResizingW = true;
        };

        this.BeginResizeNE = function () {
            self.IsResizingN = true;
            self.IsResizingE = true;
        };

        this.BeginResizeSE = function () {
            self.IsResizingS = true;
            self.IsResizingE = true;
        };

        this.BeginResizeSW = function () {
            self.IsResizingS = true;
            self.IsResizingW = true;
        };

        this.ProcessResizeE = function (evt) {
            if (!self.IsResizingE || self.IsResizingE == false) {
                return;
            }

            self.Size.Width(evt.x - self.Position.Left());
        };

        this.ProcessResizeS = function (evt) {
            if (!self.IsResizingS || self.IsResizingS == false) {
                return;
            }

            self.Size.Height(evt.y - self.Position.Top() - 36 - (self.StatusbarTemplate() != '' ? 29 : 0));
        };

        this.ProcessResizeW = function (evt) {
            if (!self.IsResizingW || self.IsResizingW == false) {
                return;
            }

            if (!self.Right) {
                self.Right = self.Position.Left() + self.Size.Width();
            }

            self.Position.Left(evt.x);
            self.Size.Width(self.Right - evt.x);
        };

        this.ProcessResizeN = function (evt) {
            if (!self.IsResizingN || self.IsResizingN == false) {
                return;
            }

            if (!self.Bottom) {
                self.Bottom = self.Position.Top() + self.Size.Height();
            }

            self.Position.Top(evt.y);
            self.Size.Height(self.Bottom - evt.y);
        };

        this.EndResize = function () {
            self.IsResizingS = false;
            self.IsResizingE = false;
            self.IsResizingW = false;
            self.IsResizingN = false;

            self.Right = undefined;
            self.Bottom = undefined;
        };

        this.MouseMove = function (evt) {
            if (self.IsDragging == true && evt)
                self.Drag(evt);

            if (self.IsResizingE == true)
                self.ProcessResizeE(evt);

            if (self.IsResizingS == true)
                self.ProcessResizeS(evt);

            if (self.IsResizingW == true)
                self.ProcessResizeW(evt);

            if (self.IsResizingN == true)
                self.ProcessResizeN(evt);
        };

        this.RenderCompleted = function () {
            if (self.Data() && self.Data().RenderCompleted) {
                self.Data().RenderCompleted();
            }
        };

        self.Init();
    }
};