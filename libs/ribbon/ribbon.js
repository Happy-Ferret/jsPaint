function RibbonTabViewModel(caption, isActive) {
    var self = this;

    self.Caption = ko.observable(caption);
    self.IsActive = ko.observable(isActive);
}

function RibbonViewModel(tabs) {
    var self = this;

    self.Tabs = ko.observableArray(tabs);

    this.ShowMenu = function () {

    };

    this.SelectTab = function (element) {
        for (var i = 0; i < self.Tabs().length; i++) {
            self.Tabs()[i].IsActive(self.Tabs()[i] == element);
        }
    };
}