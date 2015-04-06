/**
 * @namespace callbackjs
 * @author Andrew Riker (ariker)
 * @memberof com.github.ariker.callbackjs
 * @license The MIT License (MIT)
 */
define(['jquery'], function($) {
	var namespace = {
		
		/**
		 * Collects and executes callback functions
		 * @constructor
		 * @alias Callbacks
		 * @memberof com.github.ariker.callbackjs
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
		 * @memberof com.github.ariker.callbackjs
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
	
	namespace.Callbacks.prototype.namespace = namespace;
	namespace.CallbackObject.prototype.namespace = namespace;
	
	return namespace;
});