heartbeatjs
===========

JS module that performs actions at a set interval through callbacks.

1. [Introduction](#introduction)
2. [License](#license)
3. [Module Layout](#modulelayout)
4. [Usage Examples](#usageexamples)
 
Introduction
------------
heartbeatjs is an AMD module containing classes where a timer triggers actions.

License
-------
[The MIT License](http://opensource.org/licenses/MIT)

Module Layout
-------------
| Class Name     | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| CallbackObject | Object passed to the callback function that specifies the changes |
| Callbacks      | Data structure for registering and executing callback functions   |
| Heartbeat      | Execute callback functions at a specified interval                |

Usage Examples
--------------
Text

### RequiresJS ###
Text

#### Require Config ###
```javascript
requirejs.config({
    baseUrl: 'components',
    paths: {
        'jquery': 'path to jquery', //if not using heartbeat.min.js
        'heartbeatjs': 'path to heartbeatjs'
    }
});
```

#### Module Definition ###
```javascript
define(['heartbeatjs'], function(HeartbeatJS) {
    //module definition
});
```

### Creating the Heartbeat ###
```javascript
var heartbeat = new HeartbeatJS.Heartbeat();
```

### Class Scope Change Handlers ###
To register a class function as a change handler, wrap it in an anonymous function to preserve the scope.
```javascript
function Example() {

    this.executeExample = function() {
        //implemention
    };

    this.heartbeat = new HeartbeatJS.Heartbeat();
    this.heartbeat.getCallbacks().register(
        function() {
            this.executeExample();
        }
    );
}
```

### Global Scope Change Handlers ###
To register a function in the global scope, you can omit the anonymous function wrapper.
```javascript
function executeExample() {
    //implemention
}

heartbeat.getCallbacks().register(executeExammple);
```

### Starting, Stopping, and Skipping the Heartbeat ###
```javascript
heartbeat.start(100); //start with a 100ms pulse
heartbeat.stop(); //stop
heartbeat.skip(50); //skip 50 beats (ie. 5000ms)
heartbeat.skip(10, true); //skip an additional 10 beats (instead of 10 total)
```

### Handling Changes ###
You can use the Callbacks class to handle changes to granularity of an object attribute.
```javascript
function Example() {

    this.handleChange = function(callbackObject) {
        //implemention
    };

    this.callbacks = new HeartbeatJS.Callbacks();
    this.callbacks.register(
        function(callbackObject) {
            this.handleChange(callbackObject);
        }
    );
    this.callbacks.execute(new Object(), ['changed attribute']);
}
```

### Callback Chains ###
A single change can propagate through multiple change handlers, updating multiple objects.
```javascript
function Example() {
    this.handleChange2 = function(callbackObject) {
        //execute on second call
        if(callbackObject.attributeChanged(1)) {
            //implementation
        }
    };

    this.handleChange1 = function(callbackObject) {
        //execute on first call
        if(callbackObject.attributeChanged(0)) {
            this.callbacks.execute(this, [1], callbackObject);
        }
    };

    this.callbacks = new HeartbeatJS.Callbacks();
    this.callbacks.register(
        function(callbackObject) {
            this.handleChange1(callbackObject);
        }
    );
    this.callbacks.register(
        function(callbackObject) {
            this.handleChange2(callbackObject);
        }
    );
    this.callbacks.execute(new Object(), [0]);
}
```

For detailed class documentation, see the [JSDoc page](http://ariker.github.io/heartbeatjs/docs)
