/**
 * @namespace heartbeatjs
 * @author Andrew Riker (ariker)
 * @memberof com.github.ariker
 * @license The MIT License (MIT)
 */
define(['jquery'], function($) {
	var namespace = {
		
		/**
		 * Collects callback functions and executes them at a specified interval
		 * @constructor
		 * @alias Heartbeat
		 * @memberof com.github.ariker.heartbeatjs
		 * @inner
		 */
		Heartbeat: function() {

			/**
			 * Starts the heartbeat
			 * @param {number=} pulse - Callback execution interval (milliseconds)
			 * @public
			 */
			this.start = function(pulse) {
				this.state = 'started';
				this.pulse = (typeof pulse === 'undefined') ? this.pulse : pulse;
				this.preventBeat = false;
				this._beat();
			};
			
			/**
			 * Executes each callback and sets the time for the next beat
			 * @private
			 */
			this._beat = function() {
				if(this.preventBeat) {return;}
				if(this.beatSkips > 0) {this.beatSkips--;}
				else {this.callbacks.execute();}
				
				var obj = this;
				this.timeout = window.setTimeout(
					function() {obj._beat();},
					obj.pulse
				);
			};
			
			/**
			 * Skip a number of beats
			 * @param {number=} [beats=1] - Number of beats to skip
			 * @param {boolean=} [add=true] - Whether to add the skips instead of replacing 
			 * @public
			 */
			this.skip = function(beats, add) {
				beats = (typeof beats === 'undefined') ? 1 : beats;
				add = (typeof add === 'undefined') ? true : add;
				
				if(add) {this.beatSkips += beats;}
				else {this.beatSkips = beats;}
				this.state = 'delayed';
			};
			
			/**
			 * Returns the number of beats to skip
			 * @returns {number}
			 * @public
			 */
			this.getBeatSkips = function() {
				return this.beatSkips;
			};
			
			/**
			 * Stops callback execution
			 * @public
			 */
			this.stop = function() {
				this.state = 'stopped';
				window.clearTimeout(this.timeout);
			};
			
			/**
			 * Returns the pulse interval
			 * @returns {Number}
			 * @public
			 */
		    this.getPulse = function() {
				return this.pulse;
			};
			
			/**
			 * Sets the pulse interval
			 * @param {number} pulse - Callback execution interval (milliseconds)
			 * @public
			 */
			this.setPulse = function(pulse) {
				this.pulse = pulse;
			};
			
			/**
			 * Returns the callback queue
			 * @returns {Callbacks}
			 * @public
			 */
			this.getCallbacks = function() {
				return this.callbacks;
			};
			
			/**
			 * Returns the display name of the class
			 * @returns {String} "stopped", "started", "delayed"
			 * @public
			 */
			this.getClassDisplayName = function() {
				return 'Heartbeat';
			};
			
			/**
			 * Returns the state of the heartbeat
			 * @returns {String}
			 * @public
			 */
			this.getState = function() {
				return this.state;
			};
			
			/**
			 * Window timeout function
			 * @type {function}
			 * @private
			 */
			this.timeout = null;
			
			/**
			 * Callback execution interval (milliseconds)
			 * @type {number}
			 * @private
			 */
			this.pulse = null;
			
			/**
			 * Number of beats to skip
			 * @type {number}
			 * @private
			 */
			this.beatSkips = 0;
			
			/**
			 * State of the heartbeat ("stopped", "started", "delayed")
			 * @type {String}
			 * @private
			 */
			this.state = 'stopped';
			
			/**
			 * Callback queue
			 * @type {Callbacks}
			 * @private
			 */
			this.callbacks = new this.namespace.CallbackJS.Callbacks();
		},
			
			
		/**
		 * Collects and executes callback functions
		 * @constructor
		 * @alias Callbacks
		 * @memberof com.github.ariker.heartbeatjs
		 * @inner
		 */
		Callbacks: function() {
			
			/**
			 * Register a callback function for execution
			 * @param {function} callback - Function to call during execution
			 * @public
			 */
			this.register = function(callback) {
				this.callbacks.push(callback);
			};
			
			/**
			 * Executes all registered callback functions
			 * @param {any=} changedObj - Object that was changed
			 * @param {Array.<string>=} changedAttributes - Attributes of the object that changed
			 * @param {CallbackObject=} prevCallbackObject - Previous callback object in the callback chain
			 * @public
			 */
			this.execute = function(changedObj, changedAttributes, prevCallbackObject) {
				//TODO document namespace at class level
				var CallbackObject = this.namespace.CallbackObject;
				$.each(this.callbacks, function(callbackIndex, callback) {
					try {
						callback(new CallbackObject(changedObj, changedAttributes, prevCallbackObject));
					}
					catch(exception) {return true;}
				});
			};
			
			/**
			 * Returns the display name of the class
			 * @returns {string}
			 * @public
			 */
			this.getClassDisplayName = function() {
				return 'Callbacks';
			};
			
			/**
			 * Callback queue
			 * @type {Array}
			 * @private
			 */
			this.callbacks = [];
		},
		
		/**
		 * Collects and executes callback functions
		 * @constructor
		 * @alias CallbackObject
		 * @param {any} changedObject - Changed object
		 * @param {string[]} changedAttributes - Attributes that changed
		 * @param {CallbackObject=} prevCallbackObject - Previous callback object in the callback chain
		 * @param {CallbackObject=} nextCallbackObject - Next callback object in the callback chain
		 * @memberof com.github.ariker.heartbeatjs
		 * @inner
		 */
		CallbackObject: function(changedObject, changedAttributes, prevCallbackObject, nextCallbackObject) {
			
			/**
			 * Returns the changed object
			 * @returns {any}
			 * @public
			 */
			this.getChangedObject = function() {
				return this.changedObject;
			};
			
			/**
			 * Sets the changed object
			 * @param {any} changedObject - Object that was changed
			 * @public
			 */
			this.setChangedObject = function(changedObject) {
				this.changedObject = changedObject;
			};
			
			/**
			 * Determines whether the specified attribute changed in the object
			 * @param {string} attribute - Attribute name
			 * @returns {Boolean}
			 * @public
			 */
			this.attributeChanged = function(attribute) {
				if($.inArray(attribute, this.changedAttributes) >= 0) {return true;}
				return false;
			};
			
			/**
			 * Returns the previous callback object in the callback chain
			 * @returns {CallbackObject}
			 * @public
			 */
			this.getPrevCallbackObject = function() {
				return this.prevCallbackObject;
			};
			
			/**
			 * Returns the attributes that changed
			 * @returns {string[]}
			 * @public
			 */
			this.getChangedAttributes = function() {
				return this.changedAttributes;
			};
			
			/**
			 * Sets the changed attributes
			 * @param {string[]} changedAttributes - Attributes that changed
			 * @public
			 */
			this.setChangedAttributes = function(changedAttributes) {
				this.changedAttributes = changedAttributes;
			};
			
			/**
			 * Adds a changed attribute
			 * @param {string} changedAttribute - Attribute that changed
			 * @public
			 */
			this.addChangedAttribute = function(changedAttribute) {
				this.changedAttributes.push(changedAttribute);
			};
			
			/**
			 * Sets the previous callback object in the callback chain
			 * @param {CallbackObject} prevCallbackObject - Previous callback object in the callback chain
			 * @param {boolean=} connect - Whether to connect to the next object in the callback chain
			 * @public
			 */
			this.setPrevCallbackObject = function(prevCallbackObject, connect) {
				this.prevCallbackObject = prevCallbackObject;
				connect = (typeof connect === 'undefined') ? true : connect;
				
				if(connect && prevCallbackObject.getNextCallbackObject() !== this) {
					this.prevCallbackObject = prevCallbackObject;
					prevCallbackObject.setNextCallbackObject(this, false);
				}
			};
			
			/**
			 * Gets the next callback object in the callback chain
			 * @returns {CallbackObject}
			 * @public
			 */
			this.getNextCallbackObject = function() {
				return this.nextCallbackObject;
			};
			
			/**
			 * Sets the next callback object in the callback chain
			 * @param {CallbackObject} nextCallbackObject - Next callback object in the callback chain
			 * @param connect
			 * @public
			 */
			this.setNextCallbackObject = function(nextCallbackObject, connect) {
				this.nextCallbackObject = nextCallbackObject;
				connect = (typeof connect === 'undefined') ? true : connect;
				
				if(connect && nextCallbackObject.getPrevCallbackObject() !== this) {
					this.nextCallbackObject = nextCallbackObject;
					nextCallbackObject.setPrevCallbackObject(this, false);
				}
			};
			
			/**
			 * Returns the display name of the class
			 * @returns {string}
			 * @public
			 */
			this.getClassDisplayName = function() {
				return 'Callback Object';
			};
			
			/**
			 * Changed object
			 * @type {any}
			 * @private
			 */
			this.changedObject = changedObject;
			
			/**
			 * Changed attributes
			 * @type {string[]}
			 * @private
			 */
			this.changedAttributes = typeof changedAttributes === 'undefined' ? [] : changedAttributes;
			
			/**
			 * Previous callback object in the callback chain
			 * @type {CallbackObject}
			 * @private
			 */
			this.prevCallbackObject = null;
			
			/**
			 * Next callback object in the callback chain
			 * @type {CallbackObject}
			 * @private
			 */
			this.nextCallbackObject = null;
			
			if(typeof prevCallbackObject !== 'undefined') {this.setPrevCallbackObject(prevCallbackObject);}
			if(typeof nextCallbackObject !== 'undefined') {this.setNextCallbackObject(nextCallbackObject);}
		}
	};
	
	namespace.Heartbeat.prototype.namespace = namespace;
	namespace.Callbacks.prototype.namespace = namespace;
	namespace.CallbackObject.prototype.namespace = namespace;
	
	return namespace;
});