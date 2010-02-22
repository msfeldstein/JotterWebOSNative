function WhatsNewAssistant() {
}

WhatsNewAssistant.prototype.setup = function() {
    this.controller.setupWidget('startButton', {label: "Let's try it out!"}, {});
	this.startButton.observe(Mojo.Event.tap, this.goToApp);
}

WhatsNewAssistant.prototype.goToApp = function(event) {
    this.controller.stageController.popScene();
}