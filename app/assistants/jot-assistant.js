function JotAssistant() {
}

JotAssistant.prototype.setup = function() {
	this.jotter = new Jotter();
	var email = this.jotter.getEmail();
	var message = this.jotter.getMessage();
	this.controller.setupWidget("EmailField", {modelProperty:"address", hintText:$L("Email Address...")}, 
		this.emailModel = {address:email});
	
	this.controller.setupWidget("JotField", {modelProperty:"message", enterSubmits:true, multiline:true, hintText:$L("Message...")}, 
		this.jotModel = {message:message});
		
	this.controller.listen("EmailField", "DOMFocusOut", this.emailBlur.bind(this));

	this.emailField = this.controller.get("EmailField");
	this.jotField = this.controller.get("JotField");
	
}

JotAssistant.prototype.activate = function() {
	if(this.jotter.getEmail()) {
		this.controller.get("JotField").mojo.focus();
	} else {
		this.controller.get("EmailField").mojo.focus();
	}
	
	var inputField = this.controller.select("#JotField textarea")[0];
	inputField.onkeydown = this.jotKeyDown.bind(this);
	
	this.windowResized();
	this.controller.listen(this.controller.window, "resize", this.windowResized.bind(this));
}

JotAssistant.prototype.deactivate = function(){
	if (this.jotModel.message) {
		this.jotter.setMessage(this.jotModel.message);
	}
}

JotAssistant.prototype.windowResized = function(){
	var topStuffHeight = this.controller.get("TopStuffHolder").getHeight();
	var totalHeight = this.controller.window.innerHeight;
	var diff = totalHeight - topStuffHeight;
	this.jotField.setStyle({height:diff + "px"});
}

JotAssistant.prototype.emailBlur = function(event) {
	this.jotter.setEmail(event.target.value)
}

JotAssistant.prototype.jotKeyDown = function(event) {
	if(event.keyCode == "13" && event.target.value) {
		this.jotter.jot(event.target.value, this.serverResponse.bind(this))
		this.setSendingState(true);
		return false;
	}
	return true;
}

JotAssistant.prototype.focusJotField = function() {
	this.controller.get("JotField").mojo.focus();
}

JotAssistant.prototype.setSendingState = function(state, message) {
	if(state == true) {
		this.dialog = this.controller.showAlertDialog({
		    onChoose: function(value) {},
		    title: $L("Sending..."),
		    message: $L("Please wait while the message sends"),
		    choices:[],
			preventCancel:true
		});
	}
}

JotAssistant.prototype.serverResponse = function(success) {
	this.dialog.mojo.close();
	var message;
	var title;
	var choices = [{label:$L("OK")}];
	if(success) {
		this.jotModel.message = "";
		this.jotter.setMessage(null);
		this.controller.modelChanged(this.jotModel);
		message = $L("Message Sent Successfully") ;
		title = $L("Success!");
		choices = [{label:$L("Jot Again")}, {label:$L("Close"), value:"close"}];
		
	} else {
		message = $L("There was an error sending the message.");
		title = $L("Problems!");
		//choices = [{label:$L("OK")}, {label:$L("Retry"), value:"retry"}];
	}
	this.dialog = this.controller.showAlertDialog({
	    onChoose: function(value) {
			this.dialog.mojo.close();
			if(value == "close") {
				this.controller.window.close();
			} else {
				this.focusJotField.bind(this).delay(.75);
			}
			// if(value == "retry") {
			// 	this.jotter.jot.bind(this,this.jotModel.value).defer();
			// }
		}.bind(this),
		title:title,
	    message: message,
	    choices:choices,
		preventCancel:false
	});
}

JotAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
