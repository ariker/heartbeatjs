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
Text

### Global Scope Change Handlers ###
Text

### Registering Change Handlers ###
Text

### Starting, Stopping, and Skipping the Heartbeat ###
```javascript
heartbeat.start(100); //start with a 100ms pulse
heartbeat.stop(); //stop
heartbeat.skip(50); //skip 50 beats (ie. 5000ms)
heartbeat.skip(10, true); //skip an additional 10 beats (instead of 10 total)
```

### Callback Chains ###
Text
