function RibbonTabViewModel(caption, templateName, viewModel, isActive) {
    var self = this;

    self.Caption = ko.observable(caption);
    self.IsActive = ko.observable(isActive);

    self.Template = ko.observable(templateName);
    self.Data = ko.observable(viewModel);
}

function MainMenuItemViewModel(title, iconClass, action) {
    var self = this;

    self.Title = ko.observable(title);
    self.IconClass = ko.observable(iconClass);
    self.Template = 'commonMenuButtonTemplate';

    this.Action = action;
}

function MainMenuOpenItemViewModel(title, iconClass, selectedCallback) {
    var self = this;

    self.Title = ko.observable(title);
    self.IconClass = ko.observable(iconClass);
    self.Template = 'openMenuButtonTemplate';

    this.SelectedCallback = selectedCallback;
}

function RibbonViewModel(tabs, mainMenuItems) {
    var self = this;

    self.Tabs = ko.observableArray(tabs);
    self.MainMenuItems = ko.observableArray(mainMenuItems);

    self.SelectedIndex = ko.observable(0);
    self.SelectedTab = ko.computed(function () {
        return self.Tabs()[self.SelectedIndex()];
    });

    self.IsMenuShown = ko.observable(false);

    this.ShowMenu = function () {
        self.IsMenuShown(true);
    };

    this.HideMenu = function () {
        self.IsMenuShown(false);
    };

    this.SelectTab = function (element) {
        for (var i = 0; i < self.Tabs().length; i++) {
            if (self.Tabs()[i] == element) {
                self.Tabs()[i].IsActive(true);
                self.SelectedIndex(i);
            } else {
                self.Tabs()[i].IsActive(false);
            }
        }
    };
}