function ApplicationViewModel() {
    var self = this;

    self.Windows = ko.observableArray([]);

    this.Init = function () {
        self.Windows.push(new WindowViewModel({
            title: 'jsPaint',

            system: {
                canMinimize: true,
                canMaximize: true,
                canClose: true
            },

            size: {
                width: 1024,
                height: 600
            }
        }, 'mainTemplate', new MainViewModel()));
    };

    self.Init();
}
