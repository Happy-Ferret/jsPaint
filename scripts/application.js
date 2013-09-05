function ApplicationViewModel() {
    var self = this;

    self.Dispatcher = new WindowsFramework.WindowsDispatcher();

    this.CreateWindow = function (parameters, templates, viewModels, events) {
        self.Dispatcher.AddWindow(new WindowsFramework.WindowViewModel(parameters, templates, viewModels, events));
    };

    this.Init = function () {
        var state = new ApplicationState();

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
            windowViewModel: new MainViewModel(state),
            statusbarViewModel: new MainStatusbarViewModel(state)
        });
    };

    self.Init();
}
