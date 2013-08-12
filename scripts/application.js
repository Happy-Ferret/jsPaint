function ApplicationViewModel() {
    var self = this;

    self.Windows = ko.observableArray([]);

    this.CreateWindow = function (parameters, templates, viewModels, events) {
        self.Windows.push(new WindowViewModel(parameters, templates, viewModels, events));
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
        }, {
            windowTemplate: 'mainTemplate',
            statusbarTemplate: 'mainStatusbarTemplate'
        }, {
            windowViewModel: new MainViewModel(),
            statusbarViewModel: new MainStatusbarViewModel()
        });
    };

    self.Init();
}
