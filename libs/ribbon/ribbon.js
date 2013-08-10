function RibbonTabViewModel(caption, templateName, viewModel, isActive) {
    var self = this;

    self.Caption = ko.observable(caption);
    self.IsActive = ko.observable(isActive);

    self.Template = ko.observable(templateName);
    self.Data = ko.observable(viewModel);
}

function RibbonViewModel(tabs) {
    var self = this;

    self.Tabs = ko.observableArray(tabs);

    self.SelectedIndex = ko.observable(0);
    self.SelectedTab = ko.computed(function () {
        return self.Tabs()[self.SelectedIndex()];
    });

    this.ShowMenu = function () {

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