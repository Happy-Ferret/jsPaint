function ApplicationViewModel() {
    var self = this;

    self.Windows = ko.observableArray([]);

    this.CreateWindow = function (parameters, templateName, viewModel, events) {
        self.Windows.push(new WindowViewModel(parameters, templateName, viewModel, events));
    };

    this.Init = function () {
        self.CreateWindow({
            title: 'jsPaint',
            iconClass: 'systemAppIcon',

            system: {
                canMinimize: true,
                canMaximize: true,
                canClose: true
            },

            size: {
                width: 1024,
                height: 600
            }
        }, 'mainTemplate', new MainViewModel());
    };

    self.Init();
}
