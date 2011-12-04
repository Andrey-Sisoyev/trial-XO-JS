function EventEmitter(allowedEvents){
    if(this === getGlobal())
        throw "EventEmmiter constructor is not allowed to be called with 'this' pointing to global scope.";
    
    this._allowedEvents = allowedEvents.slice(0);
    this._events = {};
    
    var _aeLen = this._allowedEvents.length;
    var i;
    
    for(i = 0; i < _aeLen; i++) {
        this._events[this._allowedEvents[i]]=[];
    }
}

EventEmitter.prototype.validate_SupportsEvent = function (event) {
    if(!contains(this._allowedEvents,event))
        throw "Unsupported event '" + event + "'";
}    

EventEmitter.prototype.on = function(event,cb) {
    this.validate_SupportsEvent(event);
    
    this._events[event].push(cb);
}

EventEmitter.prototype.emit = function(event){
    this.validate_SupportsEvent(event);
    
    var args = Array.prototype.slice.call(arguments,1);
    var cbs = this._events[event];
    var _len = cbs.length;
    var i;
    for(i = 0; i<_len; i++) {
        cbs[i].apply(this,args);
    }
}