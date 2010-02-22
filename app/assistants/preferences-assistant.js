function PreferencesAssistant() {
    this.jotter = Jotter.instance;
}

PreferencesAssistant.prototype.setup = function() {
	this.controller.setupWidget("MultilineToggle",
        {},
        this.model = {
            value: this.jotter.preferences.multiline,
            disabled: false
        }
    );
    this.controller.listen("MultilineToggle", Mojo.Event.propertyChange, this.multilineChanged.bind(this));
    this.controller.setupWidget("FeedbackButton", {
        label:"Send us some feedback"
    });
    this.controller.listen("FeedbackButton", Mojo.Event.tap, this.sendFeedback.bind(this))
}

PreferencesAssistant.prototype.multilineChanged = function(e) {
    this.jotter.setMultiline(e.value);
}

PreferencesAssistant.prototype.sendFeedback = function(event) {
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method:'open',
        parameters:{ target: 'mailto:feedback@mijoro.com?subject=Jotter%20Feedback'}
    });
}