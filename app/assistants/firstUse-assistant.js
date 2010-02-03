function FirstUseAssistant(params) {
    if(params) {
        this.mode = params.mode;
    }
}

FirstUseAssistant.prototype.setup = function() {
	this.startButton = this.controller.get('startButton');
	this.goToApp = this.goToApp.bind(this);
	
	this.controller.setupWidget('startButton', {label: "Let's Get Started!"}, {});
	
	this.startButton.observe(Mojo.Event.tap, this.goToApp);

	this.setMode();
}

FirstUseAssistant.prototype.setMode = function() {
    var that = this;
    this.controller.select("div[mode]").each(function(el) {
        if(el.getAttribute("mode") != that.mode) {
            el.hide();
        }
    })
}

FirstUseAssistant.prototype.goToApp = function(event) {
	this.controller.stageController.popScenesTo('jot');
}
