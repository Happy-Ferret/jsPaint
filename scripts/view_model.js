function TopIconViewModel(parent, name, description, enabled, offset, action) {
    var self = this;

    self.Visible = ko.observable(true);
    self.Enabled = enabled;
    self.Name = ko.observable(name);
    self.Description = ko.observable(description);
    self.Offset = ko.observable(offset);

    self.BackgroundStyle = ko.computed(function () {
        return ' ' + self.Offset() + 'px 0';
    });

    this.ChangeState = function () {
        self.Visible(!self.Visible());
        parent.HideProperties();
    };

    this.Action = function () {
        if (action)
            action();
    };
}

function TopIconsViewModel(parent) {
    var self = this;

    self.PropertiesVisible = ko.observable(false);
    self.PropertiesWindowPosition = ko.computed(function () {
        self.PropertiesVisible();   // dummy reference to update this computed on "PropertiesVisible()" changed
        var position = getAbsoluteElementPosition(document.getElementById('top_icons_show_properties_btn'));

        return {
            left: position.x,
            top: position.y
        }
    });

    self.Icons = ko.observableArray([]);

    self.VisibleIcons = ko.computed(function () {
        var result = [];

        var i;
        for (i = 0; i < self.Icons().length; i++)
            if (self.Icons()[i].Visible() === true)
                result.push(self.Icons()[i]);

        return result;
    });

    this.ShowProperties = function () {
        self.PropertiesVisible(true);
    };

    this.HideProperties = function () {
        self.PropertiesVisible(false);
    };

    this.Init = function () {
        self.Icons([
            new TopIconViewModel(self, 'New', 'Create a new picture.', true, -17, parent.New),
            new TopIconViewModel(self, 'Open', 'Open an existing picture.', true, -33, parent.Open),
            new TopIconViewModel(self, 'Save', 'Save the current picture.', true, -50, parent.Save),
            new TopIconViewModel(self, 'Print', 'Print the current picture.', true, -66, parent.Print),
            new TopIconViewModel(self, 'Print preview', 'Print preview', false, -82, null),
            new TopIconViewModel(self, 'Send in e-mail', 'Send a copy of the picture in an e-mail message as an attachment.', false, -101, null),
            new TopIconViewModel(self, 'Undo', 'Undo last action.', true, -118, parent.Undo),
            new TopIconViewModel(self, 'Redo', 'Redo last action.', true, -136, parent.Redo)
        ]);
    };

    self.Init();
}