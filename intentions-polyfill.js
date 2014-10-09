// Author: Ben Peters, Microsoft Corporation
// All rights reserved
//
// This file works in IE9+, Chrome, and Firefox

(function(){
	var IntentionEventsEnabled = false;
	var uaSupportedIntentionNames = [["selectall", 65], ["bold", 66], ["italic", 73], ["underline", 85]];
	/*
	if (-1 != navigator.userAgent.toLowerCase().indexOf('trident')) {
		uaSupportedIntentionNames = [["selectall", 65], ["bold", 66], ["italic", 73], ["underline", 85], ["copy", 67], ["cut", 88], ["paste", 86]];
	}
	*/
	
	(function () {
		function CustomEvent ( event, params ) {
	    	params = params || { bubbles: false, cancelable: false, detail: undefined };
		    var evt = document.createEvent( 'CustomEvent' );
		    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		    return evt;
	    };
		if (window.CustomEvent) {
			CustomEvent.prototype = window.CustomEvent.prototype;
		}
     	window.CustomEvent = CustomEvent;
	})();
	
	//intententionEvents
	if (document){
		IntentionEventsEnabled = true;
		/*
		function IntententionQueryResult(){
			this.isSupportedByUserAgent = false;
			this.isSupported = false;
			this.isEnabled = false;	
		}
		*/
		document.declareIntention = 
			function (name, arg){
				console.info('declareIntention');
				/*
				var result = new IntententionQueryResult();
				for (var i = 0; i < uaSupportedIntentionNames.length; i++)
				{
					if (uaSupportedIntentionNames[i][0] == name) {
						//TODO: better logic
						result.isSupportedByUserAgent = true;
						result.isSupported = true;
						result.isEnabled = true;
					}
				}
				var queryIntententionEvent = new CustomEvent("queryintentention", {"detail":{"intention":name, "intententionResult":result}});
				document.activeElement.dispatchEvent(queryintententionEvent);
				if (result.isEnabled) {
					var intentionEvent = new CustomEvent("intention", {"cancelable":true, "detail":{"intention":name, "intententionResult":result}});
				*/	
				var intentionEvent = new CustomEvent("intention", {"cancelable":true, "detail":{"intention":name}});
				var canceled = !document.activeElement.dispatchEvent(intentionEvent);
				if (!canceled) {
					return document.execCommand(name, false, arg);
				}
				//}
				return false;
			};
	}
	/*
	//TODO modify IntentionEvent instead of CustomEvent?
	if (Object.defineProperty && CustomEvent && CustomEvent.prototype) {
		Object.defineProperty(CustomEvent.prototype, "intention",	
			{ enumerable: true, configurable: true, 
				get: function() {
					var result = null; 
					if (this.intention) { 
						result = this.intention; 
					} 
					return result; 
				} 
			});
		
		Object.defineProperty(CustomEvent.prototype, "intententionResult",	
			{ enumerable: true, configurable: true, 
				get: function() {
					var result = null; 
					if (this.detail && this.detail.intententionResult) { 
						result = this.detail.intententionResult; 
					} 
					return result; 
				} 
			});
		
	}
	*/
	//Post Page-Load Functionality
	window.addEventListener(
		'load',function (evt) {
			//intententionEvents Post-Load
			if (IntentionEventsEnabled){
				document.body.addEventListener(
					"keydown",
					function (evt){
						if (evt.ctrlKey){
							for (var i = 0; i < uaSupportedIntentionNames.length; i++)
							{
								//.keyCode is deprecated, but Chrome doesn't support .key yet
								if (uaSupportedIntentionNames[i][1] == evt.keyCode) {
									document.declareIntention(uaSupportedIntentionNames[i][0]);
									evt.preventDefault();
									break;
								}
							}
						}	
					});
			}
		}
	);
})();