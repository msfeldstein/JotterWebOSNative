function LogsAssistant(log, model) {
    this.jotter = Jotter.instance;
    this.log = this.jotter.getLog();
}

LogsAssistant.prototype.setup = function() {
    this.controller.setupWidget("log-list", {itemTemplate:"logs/log-entry", swipeToDelete:true}, {
        items:this.log
    })
    this.controller.listen("log-list", Mojo.Event.listDelete, this.listDelete.bind(this));
}

LogsAssistant.prototype.listDelete = function(e) {
    this.jotter.deleteElement(e.item.date);
}