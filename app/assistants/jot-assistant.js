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

	this.controller.setupWidget(Mojo.Menu.appMenu,
	    {omitDefaultItems:true},
	    {
	        visible:true,
	        items: [
	            Mojo.Menu.editItem,
	            {label: "Help", command:Mojo.Menu.helpCmd},
	            {label: "More Mijoro Apps...", command: 'do-mijoro'}
	        ]
	    })
}

JotAssistant.prototype.activate = function() {
	if(this.jotter.getEmail()) {
		this.controller.get("JotField").mojo.focus();
	} else {
		this.controller.get("EmailField").mojo.focus();
		
		//	Check for first use
		var firstUseCookie = new Mojo.Model.Cookie('not_first_use');
		var firstUse = firstUseCookie.get() || {};
		if( !firstUse.hasBeenShown ) {
			//	If first use, interrupt with firstUse scene. This lets the
			//	Jot Scene load faster in cases where it's not first use :)
			firstUseCookie.put({hasBeenShown: true});
			this.controller.stageController.pushScene('firstUse', {mode:'first-use'});
		}
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
	/*
		if(){
			this.jotter.closeAutomaticly = true;
		}
	*/	
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

JotAssistant.prototype.handleCommand = function(event) {
    if (event.type == Mojo.Event.commandEnable) {
        switch(event.command) {
            case Mojo.Menu.helpCmd:
                event.preventDefault();
        }
    }
    if (event.type == Mojo.Event.command) {
        switch(event.command) {
            case Mojo.Menu.helpCmd:
                this.controller.stageController.pushScene('firstUse', {mode:'help'})
                break;
            case 'do-mijoro':
                this.controller.serviceRequest("palm://com.palm.applicationManager", {
                   method: "open",
                   parameters:  {
                       id: 'com.palm.app.browser',
                       params: {
                           target: "http://mijoro.com"
                       }
                   }
                 });
                 break;
        }
    }
}
