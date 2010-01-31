function FirstUseAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstUseAssistant.prototype.setup = function() {
	this.startButton = this.controller.get('startButton');
	this.goToApp = this.goToApp.bind(this);
	
	this.controller.setupWidget('startButton', {label: "Let's Get Started!"}, {});
	
	this.startButton.observe(Mojo.Event.tap, this.goToApp);
}

FirstUseAssistant.prototype.goToApp = function(event) {
	this.controller.stageController.popScenesTo('jot');
}

FirstUseAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


FirstUseAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

FirstUseAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
