(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/competition-registration-teams"],{

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _TeamRegistrationState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamRegistrationState */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationState.ts");
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_pages */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/index.ts");




var extendedVue = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_0__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (extendedVue.extend({
    components: {
        TeamRegistrationCoaches: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationCoaches"],
        TeamRegistrationCompetitionRoster: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationCompetitionRoster"],
        TeamRegistrationEventSelection: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationEventSelection"],
        TeamRegistrationPropCrew: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationPropCrew"],
        TeamRegistrationRegistrationOverview: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationRegistrationOverview"],
        TeamRegistrationTeamVerification: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationTeamVerification"],
        TeamRegistrationTeamServicePersonnel: _pages__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationTeamServicePersonnel"]
    },
    props: {
        /**
         * The URL for the back link on the first step in the process
         */
        back_link: {
            type: String,
            required: false
        },
        /**
         * The label for the back link on the first step in the process
         */
        back_link_label: {
            type: String,
            required: false
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Data dependencies for component to load
             */
            dependencies: {
                shell: false
            },
            /**
             * Minimum height on the content section to ensure full height background colors
             */
            min_content_height: 0,
            /**
             * The name of the active page transition
             */
            transition_name: ''
        };
    },
    computed: {
        /**
         * The active screen component
         */
        active_component: function () {
            return this.$store.getters['team_registration/active_step_component'];
        },
        /**
         * The index of the active step in the process
         */
        active_step_index: function () {
            return this.$store.state.team_registration.active_step_index;
        },
        /**
         * Back link configuration for the active step in the workflow
         */
        back_link_config: function () {
            if (this.active_step_index === 0) {
                return {
                    back_link: this.back_link,
                    back_link_label: this.back_link_label
                };
            }
            return {
                back_link_handler: this.retreat
            };
        },
        /**
         * Whether to hide the retreat button in the active step
         */
        hide_retreat: function () {
            return this.active_step_index === 0 && !this.back_link;
        }
    },
    /**
     * Before component is created, initialize state
     */
    beforeCreate: function () {
        if (!this.$store.state.team_registration) {
            this.$store.registerModule('team_registration', _TeamRegistrationState__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationState"]);
        }
    },
    methods: {
        /**
         * Advance to the next screen
         */
        advance: function () {
            this.transition_name = 'team-registration-advance';
            this.$store.dispatch('team_registration/advance');
        },
        /**
         * Initialize process for calculating and recalculating calculated content area height
         */
        initializeCalculatedContentHeight: function () {
            var _this = this;
            var window_debounce;
            this.updateContentHeight();
            window.addEventListener('resize', function () {
                if (window_debounce) {
                    clearTimeout(window_debounce);
                }
                window_debounce = window.setTimeout(function () {
                    _this.updateContentHeight();
                }, 200);
            });
        },
        /**
         * Load data for the component
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('team_registration/loadShell')
                    .then(function () {
                    _this.dependencies.shell = true;
                    _this.$nextTick(function () {
                        _this.initializeCalculatedContentHeight();
                        _this.transition_name = 'team-registration-advance';
                    });
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        },
        /**
         * Retreat to the previous screen
         */
        retreat: function () {
            if (this.active_step_index === 0) {
                if (this.back_link) {
                    location.assign(this.back_link);
                }
                return;
            }
            this.transition_name = 'team-registration-retreat';
            this.$store.dispatch('team_registration/retreat');
        },
        /**
         * Update the min height on the content area
         */
        updateContentHeight: function () {
            var app_root = document.getElementById('app');
            var site_header_offset = 0;
            if (app_root) {
                var app_top_pad = getComputedStyle(app_root).paddingTop;
                if (app_top_pad) {
                    site_header_offset = parseInt(app_top_pad);
                }
            }
            this.min_content_height = window.innerHeight - site_header_offset;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_EventSelectionMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../mixins/EventSelectionMixin */ "./src/js/mixins/EventSelectionMixin.ts");
/* harmony import */ var _TeamRegistrationEventSelectionEventCard_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationEventSelectionEventCard.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");



/* harmony default export */ __webpack_exports__["default"] = (Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_2__["default"])(_mixins_EventSelectionMixin__WEBPACK_IMPORTED_MODULE_0__["default"])
    .extend({
    components: {
        'event-selection-card': _TeamRegistrationEventSelectionEventCard_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    },
    methods: {
        /**
         * Action to perform add event
         */
        addEventAction: function (event) {
            return this.$store.dispatch('team_registration/event_selection/addEvent', event);
        },
        /**
         * Action to perform remove event
         */
        removeEventAction: function (event) {
            return this.$store.dispatch('team_registration/event_selection/removeEvent', event);
        }
    },
    computed: {
        /**
         * Whether to show the pagination
         */
        show_pagination: function () {
            return this.paginated_events.length > 1;
        }
    },
    watch: {
        disable_event_selection: function (value) {
            if (value) {
                this.$emit('disable');
                return;
            }
            this.$emit('enable');
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The source event item
         */
        event: {
            type: Object,
            required: true
        },
        /**
         * Whether action buttons should be disabled
         */
        disable_actions: {
            type: Boolean,
            default: false
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=script&lang=ts&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=script&lang=ts& ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    computed: {
        /**
         * Source data for the heading
         */
        source: function () {
            return this.$store.getters['team_registration/registration_heading_source'];
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        advance: {
            type: Function,
            required: true
        },
        advance_disabled: {
            type: Boolean,
            default: false
        },
        hide_retreat: {
            type: Boolean,
            default: false
        },
        retreat: {
            type: Function,
            required: true
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    filters: {
        /**
         * Display formatting for a price
         */
        priceDisplay: function (value) {
            if (value === null) {
                return '';
            }
            return '$' + value;
        }
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        rows: {
            type: Array,
            required: true
        }
    },
    computed: {
        /**
         * Whether the table has an odd number of rows
         */
        has_odd_row_count: function () {
            return this.rows.length % 2 !== 0;
        },
        /**
         * Heading for label column
         */
        label_column_heading: function () {
            return this.config.column_names[0];
        },
        /**
         * Headings for value columns
         */
        value_column_headings: function () {
            return this.config.column_names.slice(1);
        }
    },
    methods: {
        /**
         * String fix for IJS display
         */
        ijsFix: function (value) {
            return value.replace('IJS', '<span class="ijs-fix">IJS</span>');
        },
        /**
         * Whether to show a notice about lack of prices for a particular category
         */
        showPriceNotice: function (row) {
            var price_set = row.values;
            for (var i = 0; i < price_set.length; i++) {
                if (price_set[i]) {
                    return false;
                }
            }
            return true;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _components_ProgressBar_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../components/ProgressBar.vue */ "./src/js/components/ProgressBar.vue");


/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    components: {
        ProgressBar: _components_ProgressBar_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    },
    computed: {
        /**
         * The number of the current step
         */
        active_step: function () {
            return this.$store.state.team_registration.active_step_index + 1;
        },
        /**
         * The total number of steps
         */
        available_steps: function () {
            return this.$store.getters['team_registration/step_components'].length;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/ValidatesTeamRegistrationRosters */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _TeamRegistrationRosterSummary_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamRegistrationRosterSummary.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue");



var extendedVue = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_0__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (extendedVue.extend({
    components: {
        TeamRegistrationRosterSummary: _TeamRegistrationRosterSummary_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
    },
    props: {
        /**
         * The full roster of available members for the team
         */
        available_roster: {
            type: Array,
            required: true
        },
        /**
         * Label for submit button
         */
        confirm_label: {
            type: String,
            default: 'Confirm Roster'
        },
        /**
         * Method to confirm roster
         */
        confirm_method: {
            type: Function,
            required: true
        },
        /**
         * The maximum selections allowed
         */
        maximum_size: {
            type: Number,
            required: false
        },
        /**
         * Descriptor for the member type
         */
        member_type_descriptor: {
            type: Object,
            required: true
        },
        /**
         * The minimum size of the roster
         */
        minimum_size: {
            type: Number,
            required: false
        },
        /**
         * The fee per member for the roster
         */
        per_member_fee: {
            type: Number,
            required: false
        },
        /**
         * The rules for creating a team roster
         */
        roster_rules: {
            type: Array,
            required: false
        },
        /**
         * The list of member IDs in the selected roster
         */
        selected_roster_ids: {
            type: Array,
            required: true
        },
        /**
         * Subtitle to display in header
         */
        subtitle: {
            type: String,
            required: false
        },
        /**
         * Label for summary size count
         */
        summary_label: {
            type: String,
            default: 'Competition Roster'
        },
        /**
         * Title to display in header
         */
        title: {
            type: String,
            default: 'Edit Roster'
        },
        /**
         * The loading status of the data for the component
         */
        loading_state: {
            type: Object,
            required: false,
            /**
             * By default, treat the component as loaded
             */
            default: function () {
                return {
                    load_error: false,
                    loaded: true,
                    loading_timeout: true
                };
            }
        }
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * The amount to pad the content list to prevent overlay issues with sticky footer
             */
            content_pad: 0,
            /**
             * Local tracking of member IDs included in the current competition roster.
             * Local copy to enable cancellation of edits without impacting "official" roster
             */
            selected_roster_member_ids: this.selected_roster_ids.slice(),
            /**
             * Server error resulting from most recent submission
             */
            submission_error: '',
            /**
             * Whether the component is submitting a change
             */
            submitting: false
        };
    },
    computed: {
        /**
         * Whether the confirm button should be disabled
         */
        confirm_disabled: function () {
            return this.invalid || this.incomplete || this.submitting;
        },
        /**
         * The binding for the summary elements
         */
        summary_binding: function () {
            return {
                available_roster: this.available_roster,
                maximum_size: this.maximum_size,
                member_type_descriptor: this.member_type_descriptor,
                minimum_size: this.minimum_size,
                per_member_fee: this.per_member_fee,
                selected_roster_ids: this.selected_roster_member_ids,
                summary_label: this.summary_label
            };
        },
        /**
         * Whether to show the component loading/load error state
         */
        show_loader: function () {
            return !this.loading_state.loaded || this.loading_state.load_error;
        },
        /**
         * The full available roster list
         */
        _available_roster: function () {
            return this.available_roster;
        },
        /**
         * The list of selected ids to validate
         */
        _active_roster_ids: function () {
            return this.selected_roster_member_ids;
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function () {
            return this.minimum_size;
        },
        /**
         * The active maximum roster size
         */
        _maximum_roster_size: function () {
            return this.maximum_size;
        }
    },
    watch: {
        /**
         * Watch submission error for change and update content offset
         */
        submission_error: function () {
            var _this = this;
            this.$nextTick(function () {
                _this.updateContentOffset();
            });
        },
        /**
         * Watch available members for change and clear submission error message
         */
        selected_roster_member_ids: function () {
            this.submission_error = '';
        },
        /**
         * When loader goes away, adjust content offset
         */
        show_loader: function (val) {
            var _this = this;
            if (!val) {
                this.$nextTick(function () {
                    _this.updateContentOffset();
                });
            }
        }
    },
    /**
     * Run processes upon component mount
     */
    mounted: function () {
        var _this = this;
        this.$nextTick(function () {
            _this.updateContentOffset();
        });
    },
    methods: {
        /**
         * Confirm submission of the updated roster
         */
        confirmRoster: function () {
            var _this = this;
            if (this.confirm_disabled) {
                return;
            }
            this.submitting = true;
            this.confirm_method(this.selected_roster_member_ids)
                .then(function () {
                _this.submitting = false;
                _this.$emit('roster-confirmed');
            })
                .catch(function (error_message) {
                _this.submitting = false;
                _this.submission_error = error_message;
            });
        },
        /**
         * Class to apply to a list item
         */
        listItemClass: function (member) {
            // If the member is selected but can't be added, invalid
            if (this.memberInSelectedRoster(member) && !member.can_be_added_to_roster) {
                return 'invalid';
            }
            // If member is not selected, and they either can't be added or the maximum selections have been reached, disabled
            if (!this.memberInSelectedRoster(member) && (!member.can_be_added_to_roster || this.maximum_reached)) {
                return 'disabled';
            }
            return null;
        },
        /**
         * Determine whether a member is in the currently selected roster or not
         */
        memberInSelectedRoster: function (member) {
            return this.selected_roster_member_ids.indexOf(member.id) !== -1;
        },
        /**
         * Whether to show the control element for a member item
         */
        showMemberControl: function (member) {
            if (this.memberInSelectedRoster(member)) {
                return true;
            }
            return !this.maximum_reached && member.can_be_added_to_roster;
        },
        /**
         * Add/remove a member from the competition roster
         */
        toggleMember: function (member) {
            var member_index = this.selected_roster_member_ids.indexOf(member.id);
            // If member not in list, add them at the end
            if (member_index === -1) {
                this.selected_roster_member_ids.push(member.id);
                return;
            }
            // Remove a member already in the list
            this.selected_roster_member_ids.splice(member_index, 1);
        },
        /**
         * Add padding to content to offset sticky footer
         */
        updateContentOffset: function () {
            if (this.show_loader) {
                return;
            }
            var footer = this.$refs.footer;
            var footer_height = footer.offsetHeight;
            this.content_pad = footer_height + 30;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        entity_list: {
            type: Array,
            required: true
        },
        include_numbering: {
            type: Boolean,
            default: false
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/ValidatesTeamRegistrationRosters */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");


var extendedVue = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (extendedVue.extend({
    props: {
        /**
         * The full roster of available members for the team
         */
        available_roster: {
            type: Array,
            required: true
        },
        /**
         * The maximum selections allowed
         */
        maximum_size: {
            type: Number,
            required: false
        },
        /**
         * Descriptor for the member type
         */
        member_type_descriptor: {
            type: Object,
            required: true
        },
        /**
         * The minimum size of the roster
         */
        minimum_size: {
            type: Number,
            required: false
        },
        /**
         * The fee per member for the roster
         */
        per_member_fee: {
            type: Number,
            required: false
        },
        /**
         * The list of member IDs in the selected roster
         */
        selected_roster_ids: {
            type: Array,
            required: true
        },
        /**
         * Whether to show messaging that isn't related to validation errors
         */
        show_secondary_messaging: {
            type: Boolean,
            default: true
        },
        /**
         * Label for summary size count
         */
        summary_label: {
            type: String,
            default: 'Competition Roster'
        }
    },
    computed: {
        /**
         * Message to display in roster summary
         */
        roster_summary_message: function () {
            if (this.invalid) {
                return "Remove " + this.invalid_reason + " " + this.member_type_descriptor.singular.toLowerCase();
            }
            if (this.incomplete) {
                return "Roster minimum is " + this.minimum_size;
            }
            if (this.show_secondary_messaging) {
                if (this.maximum_size && this.current_roster_size < this.maximum_size) {
                    return "You can select up to " + this.maximum_size;
                }
                if (this.maximum_reached) {
                    return 'You have reached the max allowed';
                }
            }
            return null;
        },
        /**
         * The full available roster list
         */
        _available_roster: function () {
            return this.available_roster;
        },
        /**
         * The list of selected ids to validate
         */
        _active_roster_ids: function () {
            return this.selected_roster_ids;
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function () {
            return this.minimum_size;
        },
        /**
         * The active maximum roster size
         */
        _maximum_roster_size: function () {
            return this.maximum_size;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    filters: {
        /**
         * Format a price
         */
        price: function (value) {
            return value.toFixed(2)
                .replace('.00', '');
        }
    },
    props: {
        label: {
            type: String,
            required: true
        },
        per_member_fee: {
            type: Number,
            required: true
        },
        current_roster_size: {
            type: Number,
            required: true
        }
    },
    computed: {
        /**
         * The total fees associated with the roster
         */
        total_member_cost: function () {
            if (!this.per_member_fee) {
                return 0;
            }
            var int_cast = Math.round(this.per_member_fee * 100);
            var total = int_cast * this.current_roster_size;
            return total / 100;
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_components/TeamRegistrationRosterEdit.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue");
/* harmony import */ var _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_mixins/TeamRegistrationPersonnelPageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationPersonnelPageMixin.ts");
/* harmony import */ var _store_TeamRegistrationCompetitionCoachesState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_store/TeamRegistrationCompetitionCoachesState */ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionCoachesState.ts");
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_mixins/ValidatesTeamRegistrationRosters */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts");







var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_4__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_5__["default"], _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_6__["default"], _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_2__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        TeamRegistrationRosterEdit: _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Content to display in title block of page
             */
            page_title: 'Competition Coaches',
            state_key: 'competition_coaches',
            state_module: _store_TeamRegistrationCompetitionCoachesState__WEBPACK_IMPORTED_MODULE_3__["TeamRegistrationCompetitionCoachesState"]
        };
    },
    computed: {
        /**
         * The active coaches currently set
         */
        active_coaches: function () {
            return this.active_entity_list;
        },
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function () {
            return this.invalid;
        },
        /**
         * Unique overrides for edit binding
         */
        edit_binding_override: function () {
            return {
                confirm_label: 'Confirm Coaches',
                title: this.current_action + " Coaches"
            };
        },
        /**
         * Unique overrides for summary binding
         */
        summary_binding_override: function () {
            return {
                member_type_descriptor: {
                    singular: 'Coach',
                    plural: 'Coaches'
                },
                summary_label: 'Coaches'
            };
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_components/TeamRegistrationRosterEdit.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_mixins/ValidatesTeamRegistrationRosters */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts");
/* harmony import */ var _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_mixins/TeamRegistrationPersonnelPageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationPersonnelPageMixin.ts");
/* harmony import */ var _store_TeamRegistrationCompetitionRosterState__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_store/TeamRegistrationCompetitionRosterState */ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionRosterState.ts");







var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_3__["default"], _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_4__["default"], _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_5__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        TeamRegistrationRosterEdit: _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            confirmed: false,
            page_title: 'Competition Roster',
            state_key: 'competition_roster',
            state_module: _store_TeamRegistrationCompetitionRosterState__WEBPACK_IMPORTED_MODULE_6__["TeamRegistrationCompetitionRosterState"]
        };
    },
    computed: {
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function () {
            return this.invalid || this.incomplete || !this.confirmed;
        },
        /**
         * The currently selected roster
         */
        competition_roster: function () {
            return this.active_entity_list;
        },
        /**
         * Unique overrides for edit binding
         */
        edit_binding_override: function () {
            return {
                confirm_label: 'Confirm Roster',
                title: 'Edit Roster',
                roster_rules: this.$store.state.team_registration.competition_roster.roster_rules
            };
        },
        /**
         * The per skater fee for the competition
         */
        per_skater_fee: function () {
            return this.$store.state.team_registration.competition_roster.per_skater_fee;
        },
        /**
         * Unique overrides for summary binding
         */
        summary_binding_override: function () {
            return {
                member_type_descriptor: {
                    singular: 'Skater',
                    plural: 'Skaters'
                },
                minimum_size: this._minimum_roster_size,
                per_member_fee: this.per_skater_fee,
                summary_label: 'Competition Roster'
            };
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function () {
            return this.$store.state.team_registration.competition_roster.roster_minimum;
        }
    },
    methods: {
        /**
         * Perform the action to confirm/save the current selections
         */
        confirmRoster: function (ids) {
            this.confirmed = false;
            return this.$store.dispatch("team_registration/" + this.state_key + "/update", ids);
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_components */ "./src/js/Teams/CompetitionRegistration/Registration/_components/index.ts");




var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_2__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        EventSelection: _components__WEBPACK_IMPORTED_MODULE_3__["EventSelection"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Data dependencies for the component
             */
            dependencies: {
                page_data: false
            },
            /**
             * Title to display for page
             */
            page_title: 'Event Selection',
            child_processing: false
        };
    },
    computed: {
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function () {
            if (this.child_processing) {
                return true;
            }
            for (var i = 0; i < this.events.length; i++) {
                if (this.events[i].is_selected) {
                    return false;
                }
            }
            return true;
        },
        /**
         * All events
         */
        events: function () {
            return this.$store.state.team_registration.event_selection.events;
        }
    },
    methods: {
        /**
         * Load data for page
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('team_registration/fetchEventSelection')
                    .then(function () {
                    _this.dependencies.page_data = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _store_TeamRegistrationCompetitionPropCrewState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_store/TeamRegistrationCompetitionPropCrewState */ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionPropCrewState.ts");
/* harmony import */ var _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_mixins/TeamRegistrationPersonnelPageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationPersonnelPageMixin.ts");
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_mixins/ValidatesTeamRegistrationRosters */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts");






var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_0__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_3__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_4__["default"], _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_5__["default"], _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_2__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Content to display in title block of page
             */
            page_title: 'Prop Crew',
            state_key: 'competition_prop_crew',
            state_module: _store_TeamRegistrationCompetitionPropCrewState__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationCompetitionPropCrewState"]
        };
    },
    computed: {
        /**
         * The active prop_crew currently set
         */
        active_prop_crew: function () {
            return this.active_entity_list;
        },
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function () {
            return this.invalid;
        },
        /**
         * Unique overrides for edit binding
         */
        edit_binding_override: function () {
            return {
                confirm_label: 'Confirm Prop Crew',
                title: this.current_action + " Prop Crew"
            };
        },
        /**
         * Unique overrides for summary binding
         */
        summary_binding_override: function () {
            return {
                member_type_descriptor: {
                    singular: 'Prop Crew',
                    plural: 'Prop Crew'
                },
                summary_label: 'Prop Crew'
            };
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _components_TeamRegistrationPricingTable_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_components/TeamRegistrationPricingTable.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");




var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_3__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        TeamRegistrationPricingTable: _components_TeamRegistrationPricingTable_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Whether the confirmation checkbox has been checked
             */
            confirmed: false,
            /**
             * Data dependencies for the component
             */
            dependencies: {
                page_data: false
            },
            /**
             * Title to display for page
             */
            page_title: 'Registration Overview'
        };
    },
    computed: {
        /**
         * Whether continue button should be disabled
         */
        advance_disabled: function () {
            return !this.confirmed;
        },
        /**
         * Content for registration information accordion
         */
        registration_information: function () {
            return this.registration_overview.registration_information;
        },
        /**
         * The registration overview information
         */
        registration_overview: function () {
            return this.$store.state.team_registration.registration_overview;
        },
        /**
         * The year range for the current rulebook
         */
        rulebook_year: function () {
            return this.registration_overview.rulebook_year;
        },
        /**
         * Pricing table data
         */
        tables: function () {
            return this.registration_overview.pricing_tables;
        }
    },
    methods: {
        /**
         * Load data for page
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('team_registration/fetchRegistrationOverview')
                    .then(function () {
                    _this.dependencies.page_data = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_components/TeamRegistrationRosterEdit.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_mixins/ValidatesTeamRegistrationRosters */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts");
/* harmony import */ var _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_mixins/TeamRegistrationPersonnelPageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationPersonnelPageMixin.ts");
/* harmony import */ var _store_TeamRegistrationCompetitionTeamServicePersonnelState__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_store/TeamRegistrationCompetitionTeamServicePersonnelState */ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionTeamServicePersonnelState.ts");







var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_3__["default"], _mixins_ValidatesTeamRegistrationRosters__WEBPACK_IMPORTED_MODULE_4__["default"], _mixins_TeamRegistrationPersonnelPageMixin__WEBPACK_IMPORTED_MODULE_5__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    components: {
        TeamRegistrationRosterEdit: _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Content to display in title block of page
             */
            page_title: 'Team Service Personnel',
            state_key: 'competition_team_service_personnel',
            state_module: _store_TeamRegistrationCompetitionTeamServicePersonnelState__WEBPACK_IMPORTED_MODULE_6__["TeamRegistrationCompetitionTeamServicePersonnelState"]
        };
    },
    computed: {
        /**
         * The active team service personnel currently set
         */
        active_team_service_personnel: function () {
            return this.active_entity_list;
        },
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function () {
            return this.invalid;
        },
        /**
         * Unique overrides for edit binding
         */
        edit_binding_override: function () {
            return {
                confirm_label: 'Confirm Team Service Personnel',
                title: this.current_action + " Team Service Personnel"
            };
        },
        /**
         * Unique overrides for summary binding
         */
        summary_binding_override: function () {
            return {
                member_type_descriptor: {
                    singular: 'Team Service Personnel',
                    plural: 'Team Service Personnel'
                },
                summary_label: 'Team Service Personnel'
            };
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_mixins/TeamRegistrationSubpageMixin */ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts");
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");



var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_2__["default"])(_mixins_TeamRegistrationSubpageMixin__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_1__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Confirmation message following team name save
             */
            confirmation_message: '',
            /**
             * Whether the confirmation checkbox is checked
             */
            confirmed: false,
            /**
             * Data dependencies for the component to function
             */
            dependencies: {
                team: false
            },
            /**
             * Whether the edit name form is active
             */
            edit_active: false,
            /**
             * Reactive name for the edit team name form
             */
            edit_name: '',
            /**
             * Whether the component is saving a team name edit
             */
            is_saving: false,
            /**
             * Page title for mixin integration
             */
            page_title: 'Team Verification',
            /**
             * Error resulting from a team name save attempt
             */
            save_error: ''
        };
    },
    computed: {
        /**
         * Whether continue button should be disabled
         */
        advance_disabled: function () {
            return !this.confirmed;
        },
        /**
         * Information about the active team
         */
        team_information: function () {
            return this.$store.state.team_registration.active_team_profile;
        }
    },
    methods: {
        /**
         * Cancel edit to the team name
         */
        cancelEdit: function () {
            this.edit_active = false;
        },
        /**
         * Close the confirmation overlay
         */
        closeConfirmation: function () {
            this.edit_active = !!this.save_error;
            this.is_saving = false;
            this.confirmation_message = '';
            this.save_error = '';
        },
        /**
         * Load data for page
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('team_registration/fetchTeamVerification')
                    .then(function () {
                    _this.dependencies.team = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        },
        /**
         * Open the team name edit form
         */
        openEdit: function () {
            this.edit_active = true;
            this.edit_name = this.team_information.name;
        },
        /**
         * Save edit to team name
         */
        saveEdit: function () {
            var _this = this;
            this.is_saving = true;
            var payload = {
                team_name: this.edit_name,
                team_id: this.team_information.id
            };
            this.$store.dispatch('team_registration/updateTeamName', payload)
                .then(function () {
                _this.is_saving = false;
                _this.confirmation_message = "Team \"" + _this.team_information.name + "\" Successfully Updated.";
            })
                .catch(function (error_message) {
                _this.is_saving = false;
                _this.save_error = error_message;
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _TeamsCompetitionRegistrationState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../TeamsCompetitionRegistrationState */ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationState.ts");
/* harmony import */ var _components_SelectTeamList_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../_components/SelectTeamList.vue */ "./src/js/Teams/_components/SelectTeamList.vue");




var extendedVue = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_0__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (extendedVue.extend({
    components: {
        SelectTeamList: _components_SelectTeamList_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
    },
    props: {
        /**
         * The back link url to display in the page header
         */
        back_link: {
            type: String,
            required: false
        },
        /**
         * The label for the back link in the page header
         */
        back_link_label: {
            type: String,
            required: false
        }
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * Data dependencies for page component
             */
            dependencies: {
                teams: false
            },
            /**
             * Error resulting from a selection attempt
             */
            selection_error: null
        };
    },
    computed: {
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var conf = {
                title: 'Select a team to register',
                back_link: this.back_link,
                back_link_label: this.back_link_label
            };
            return conf;
        },
        /**
         * Teams available for selection
         */
        teams: function () {
            return this.$store.getters['teams/competition_registration/selection_teams'];
        }
    },
    /**
     * Before component is created, initialize state
     */
    beforeCreate: function () {
        if (!this.$store.state.teams.competition_registration) {
            this.$store.registerModule(['teams', 'competition_registration'], _TeamsCompetitionRegistrationState__WEBPACK_IMPORTED_MODULE_2__["TeamsCompetitionRegistrationState"]);
        }
    },
    methods: {
        /**
         * Load data dependencies
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('teams/competition_registration/fetchTeamSelect')
                    .then(function () {
                    _this.dependencies.teams = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        },
        /**
         * Select a team
         */
        selectTeam: function (team) {
            var _this = this;
            this.$store.dispatch('teams/competition_registration/selectTeam', team)
                .catch(function (error_message) {
                _this.selection_error = error_message;
            });
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../mixins/HasDataDependencies */ "./src/js/mixins/HasDataDependencies.ts");
/* harmony import */ var vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-typed-mixins */ "./node_modules/vue-typed-mixins/lib/index.js");
/* harmony import */ var _mixins_HasPaginatedItems__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../mixins/HasPaginatedItems */ "./src/js/mixins/HasPaginatedItems.ts");
/* harmony import */ var _TeamsCompetitionRegistrationState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../TeamsCompetitionRegistrationState */ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationState.ts");




var vueClass = Object(vue_typed_mixins__WEBPACK_IMPORTED_MODULE_1__["default"])(_mixins_HasDataDependencies__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_HasPaginatedItems__WEBPACK_IMPORTED_MODULE_2__["default"]);
// @vue/component
/* harmony default export */ __webpack_exports__["default"] = (vueClass.extend({
    props: {
        /**
         * The back link url to display in the page header
         */
        back_link: {
            type: String,
            required: false
        },
        /**
         * The label for the back link in the page header
         */
        back_link_label: {
            type: String,
            required: false
        }
    },
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * The active type of events being shown (qual/nonqual)
             */
            active_type: 'non_qualifying',
            /**
             * Data dependencies for page
             */
            dependencies: {
                competitions: false
            },
            /**
             * The competitions filtered by the user
             */
            filtered_competitions: []
        };
    },
    computed: {
        /**
         * The competitions to display on the page.
         */
        available_competitions: function () {
            return this.$store.state.teams.competition_registration.available_competitions;
        },
        /**
         * Whether no competitions are available for the currently active type
         */
        no_active_configured_competitions: function () {
            return this.type_filtered_competitions.length === 0;
        },
        /**
         * The configuration for the page header
         */
        page_header: function () {
            var conf = {
                title: 'Competition Registration - Teams',
                back_link: this.back_link,
                back_link_label: this.back_link_label
            };
            return conf;
        },
        /**
         * The items to paginate
         */
        pagination_items: function () {
            return this.filtered_competitions;
        },
        /**
         * Whether to show the search form
         */
        show_search: function () {
            return !this.no_active_configured_competitions;
        },
        /**
         * The name of the current team to use in the summary header
         */
        team_summary_name: function () {
            var active_team = this.$store.state.teams.competition_registration.active_team;
            if (active_team) {
                return [active_team.name, active_team.level].join(' - ');
            }
            return null;
        },
        /**
         * Competitions that belong to the active type
         */
        type_filtered_competitions: function () {
            var _this = this;
            return this.available_competitions.filter(function (competition) {
                var check = _this.active_type === 'qualifying';
                return competition.is_qualifying === check;
            });
        },
        /**
         * The set of competitions currently visible on the active pagination page
         */
        visible_competitions: function () {
            return this.visible_items;
        }
    },
    /**
     * Before component is created, initialize state
     */
    beforeCreate: function () {
        if (!this.$store.state.teams.competition_registration) {
            this.$store.registerModule(['teams', 'competition_registration'], _TeamsCompetitionRegistrationState__WEBPACK_IMPORTED_MODULE_3__["TeamsCompetitionRegistrationState"]);
        }
    },
    methods: {
        /**
         * Whether a competition is registered for by the user
         */
        isRegistered: function (competition) {
            return competition.user_registration_status === 'registered';
        },
        /**
         * Load data dependencies
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch('teams/competition_registration/fetchCompetitionList')
                    .then(function () {
                    _this.dependencies.competitions = true;
                    _this.resetFilteredCompetitions();
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        },
        /**
         * Reset the filtered competitions
         */
        resetFilteredCompetitions: function () {
            var _this = this;
            this.$nextTick(function () {
                _this.filtered_competitions = _this.type_filtered_competitions;
            });
        },
        /**
         * Reset the filter component to initial state
         */
        resetFilterComponent: function () {
            var ref = this.$refs.filter;
            if (ref && 'reset' in ref) {
                ref.reset();
            }
        },
        /**
         * Select whether qualifying or nonqualifying are active
         */
        selectActiveType: function (qualifying_key) {
            this.active_type = qualifying_key;
            this.resetFilteredCompetitions();
            this.resetFilterComponent();
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts& ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The teams to display in the list
         */
        teams: {
            type: Array,
            required: true
        }
    },
    methods: {
        /**
         * Handle the select event on a team
         */
        selectTeam: function (team) {
            this.$emit('select', team);
        }
    }
}));


/***/ }),

/***/ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/ProgressBar.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/ProgressBar.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * The number of total steps
         */
        available_step_count: {
            type: Number,
            required: true,
        },
        /**
         * The current step number
         */
        active_step_number: {
            type: Number,
            required: true,
        },
    },
    computed: {
        /**
         * Calculated total progress percent
         */
        completed_progress_percent: function () {
            return (this.active_step_number) / (this.available_step_count) * 100;
        },
    }
}));


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=template&id=21d28be2&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=template&id=21d28be2& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "team-registration" },
    [
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading registration."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-transition-container" },
            [
              _c(
                "transition",
                {
                  attrs: { name: _vm.transition_name },
                  on: {
                    afterEnter: function($event) {
                      _vm.$root.resetScroll()
                    }
                  }
                },
                [
                  _c(
                    "keep-alive",
                    [
                      _c(_vm.active_component, {
                        tag: "component",
                        style: { "min-height": _vm.min_content_height + "px" },
                        attrs: {
                          back_link_config: _vm.back_link_config,
                          hide_retreat: _vm.hide_retreat
                        },
                        on: { advance: _vm.advance, retreat: _vm.retreat }
                      })
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=template&id=921e4a76&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=template&id=921e4a76& ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "event-selection-component",
      class: {
        "event-selection-component--no-pagination": !_vm.show_pagination
      }
    },
    [
      _c("div", { staticClass: "event-selection__selected" }, [
        _c(
          "div",
          { staticClass: "grid-container" },
          [
            _c("transition", { attrs: { name: "fade" } }, [
              _vm.element_added || _vm.element_removed
                ? _c(
                    "div",
                    {
                      staticClass: "event-selection__my-events-status",
                      class: {
                        recent: _vm.element_added,
                        "recent--out": _vm.element_removed
                      }
                    },
                    [_vm._v("\n                     \n                ")]
                  )
                : _vm._e()
            ]),
            _vm._v(" "),
            _c(
              "accordion",
              { staticClass: "accordion--blank accordion--up-down" },
              [
                _c(
                  "span",
                  { attrs: { slot: "trigger_text" }, slot: "trigger_text" },
                  [
                    _vm._v(
                      "\n                    My Events: (" +
                        _vm._s(_vm.my_events_count) +
                        ")\n                "
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { attrs: { slot: "expand_content" }, slot: "expand_content" },
                  [
                    _c(
                      "div",
                      { staticClass: "event-selection__event-list" },
                      _vm._l(_vm.my_events, function(event) {
                        return _c(
                          "event-selection-card",
                          {
                            key: event.id,
                            attrs: {
                              disable_actions: _vm.disable_event_selection,
                              event: event
                            },
                            on: {
                              remove: function($event) {
                                _vm.removeEvent(event, event.id * -1)
                              }
                            }
                          },
                          [
                            _vm.eventMessage(-1 * event.id)
                              ? _c(
                                  "div",
                                  {
                                    staticClass:
                                      "session-feedback session-feedback--small",
                                    class:
                                      "session-feedback--" +
                                      _vm.active_event_status,
                                    attrs: { slot: "error" },
                                    slot: "error"
                                  },
                                  [
                                    _vm.active_event_status === "error"
                                      ? _c(
                                          "button",
                                          {
                                            staticClass:
                                              "session-feedback__close",
                                            attrs: {
                                              type: "button",
                                              title: "Close"
                                            },
                                            on: {
                                              click: function($event) {
                                                $event.preventDefault()
                                                $event.stopPropagation()
                                                return _vm.closeEventError(
                                                  $event
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _vm._v(
                                              "\n                                    ×\n                                "
                                            )
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      {
                                        staticClass: "session-feedback__content"
                                      },
                                      [
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "session-feedback__text"
                                          },
                                          [
                                            _vm._v(
                                              "\n                                        " +
                                                _vm._s(
                                                  _vm.eventMessage(
                                                    -1 * event.id
                                                  )
                                                ) +
                                                "\n                                    "
                                            )
                                          ]
                                        )
                                      ]
                                    )
                                  ]
                                )
                              : _vm._e()
                          ]
                        )
                      })
                    )
                  ]
                )
              ]
            )
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "event-selection__available" }, [
        _c("div", { staticClass: "grid-container" }, [
          _vm.event_type_options.length > 1
            ? _c(
                "div",
                { staticClass: "event-selection__filters form-group" },
                [
                  _c(
                    "label",
                    {
                      staticClass:
                        "field-label event-selection__filters__label",
                      attrs: { for: "type_filter" }
                    },
                    [
                      _vm._v(
                        "\n                    Available Events:\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "event-selection__filters__control" },
                    [
                      _c(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.active_type,
                              expression: "active_type"
                            }
                          ],
                          staticClass: "form-field form-field--reduced-right",
                          attrs: { id: "type_filter", name: "type_filter" },
                          on: {
                            change: function($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function(o) {
                                  return o.selected
                                })
                                .map(function(o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.active_type = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            }
                          }
                        },
                        [
                          _c("option", { domProps: { value: null } }, [
                            _vm._v(
                              "\n                            All Events\n                        "
                            )
                          ]),
                          _vm._v(" "),
                          _vm._l(_vm.event_type_options, function(
                            option,
                            index
                          ) {
                            return _c(
                              "option",
                              { key: index, domProps: { value: option } },
                              [
                                _vm._v(
                                  "\n                            " +
                                    _vm._s(option) +
                                    "\n                        "
                                )
                              ]
                            )
                          })
                        ],
                        2
                      )
                    ]
                  )
                ]
              )
            : _c("p", { staticClass: "event-selection__available__heading" }, [
                _vm._v("\n                Available Events:\n            ")
              ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "event-selection__event-list" },
            _vm._l(_vm.visible_events, function(event) {
              return _c(
                "event-selection-card",
                {
                  key: event.id,
                  attrs: {
                    disable_actions: _vm.disable_event_selection,
                    event: event
                  },
                  on: {
                    remove: function($event) {
                      _vm.removeEvent(event, event.id)
                    },
                    add: function($event) {
                      _vm.addEvent(event, event.id)
                    }
                  }
                },
                [
                  _c(
                    "transition",
                    { attrs: { slot: "error", name: "fade" }, slot: "error" },
                    [
                      _vm.eventMessage(event.id)
                        ? _c(
                            "div",
                            {
                              staticClass:
                                "session-feedback session-feedback--small",
                              class:
                                "session-feedback--" + _vm.active_event_status
                            },
                            [
                              _vm.active_event_status === "error"
                                ? _c(
                                    "button",
                                    {
                                      staticClass: "session-feedback__close",
                                      attrs: { type: "button", title: "Close" },
                                      on: {
                                        click: function($event) {
                                          $event.preventDefault()
                                          $event.stopPropagation()
                                          return _vm.closeEventError($event)
                                        }
                                      }
                                    },
                                    [
                                      _vm._v(
                                        "\n                                ×\n                            "
                                      )
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "session-feedback__content" },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "session-feedback__text" },
                                    [
                                      _vm._v(
                                        "\n                                    " +
                                          _vm._s(_vm.eventMessage(event.id)) +
                                          "\n                                "
                                      )
                                    ]
                                  )
                                ]
                              )
                            ]
                          )
                        : _vm._e()
                    ]
                  )
                ],
                1
              )
            })
          ),
          _vm._v(" "),
          _vm.show_pagination
            ? _c(
                "div",
                { staticClass: "event-selection__pagination" },
                [
                  _c("pagination", {
                    ref: "pagination",
                    attrs: { paginated_items: _vm.paginated_events },
                    on: { "page-changed": _vm.updateActivePage }
                  })
                ],
                1
              )
            : _vm._e()
        ])
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f&":
/*!********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "event-card",
      class: {
        "event-card--registered": _vm.event.is_registered_for,
        "event-card--selected": _vm.event.is_selected
      }
    },
    [
      _c("div", { staticClass: "event-card__content" }, [
        _c(
          "div",
          { staticClass: "event-card__details" },
          [
            _c("p", { staticClass: "event-card__event-name" }, [
              _vm._v(
                "\n                " + _vm._s(_vm.event.name) + "\n            "
              )
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "event-card__event-details" }, [
              _vm._v("\n                Judging System:\n                "),
              _c(
                "span",
                {
                  class: {
                    "ijs-fix": _vm.event.judging_system.toLowerCase() === "ijs"
                  }
                },
                [_vm._v(_vm._s(_vm.event.judging_system))]
              )
            ]),
            _vm._v(" "),
            _vm._l(_vm.event.additional_data, function(datum, index) {
              return _c(
                "p",
                { key: index, staticClass: "event-card__event-details" },
                [
                  _vm._v(
                    "\n                " + _vm._s(datum) + "\n            "
                  )
                ]
              )
            })
          ],
          2
        ),
        _vm._v(" "),
        _c("div", { staticClass: "event-card__actions" }, [
          _vm.event.is_registered_for
            ? _c("span", { staticClass: "event-card__paid" }, [
                _vm._v("\n                Paid\n            ")
              ])
            : _vm.event.is_selected
            ? _c(
                "button",
                {
                  staticClass:
                    "icon-button--md-text icon-button icon-button--delete icon-button--labeled-inline icon-button--pseudo",
                  attrs: { disabled: _vm.disable_actions },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.$emit("remove")
                    }
                  }
                },
                [_vm._v("\n                Remove\n            ")]
              )
            : _c(
                "button",
                {
                  staticClass:
                    "button--medium-text button button--block button--info button--medium button--medium--text",
                  attrs: { disabled: _vm.disable_actions },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.$emit("add")
                    }
                  }
                },
                [_vm._v("\n                Add\n            ")]
              )
        ])
      ]),
      _vm._v(" "),
      _vm._t("error")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16&":
/*!***************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16& ***!
  \***************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.source
    ? _c(
        "div",
        { staticClass: "team-registration-header" },
        [
          _vm.source.competition
            ? _c("competition-heading", {
                attrs: {
                  always_show: true,
                  competition_override: _vm.source.competition
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.source.team
            ? _c("page-entity-header", {
                attrs: { entity_name: _vm.source.team }
              })
            : _vm._e()
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c&":
/*!***********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "team-registration__navigation" }, [
    _vm.$slots.pre
      ? _c(
          "div",
          { staticClass: "team-registration__navigation__pre" },
          [_vm._t("pre")],
          2
        )
      : _vm._e(),
    _vm._v(" "),
    _c("div", { staticClass: "team-registration__navigation__buttons" }, [
      !_vm.hide_retreat
        ? _c("div", { staticClass: "team-registration__navigation__button" }, [
            _c(
              "button",
              {
                staticClass: "button button--info button--block",
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    return _vm.retreat($event)
                  }
                }
              },
              [_vm._v("\n                Back\n            ")]
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "team-registration__navigation__button" }, [
        _c(
          "button",
          {
            staticClass: "button button--block",
            attrs: { disabled: _vm.advance_disabled },
            on: {
              click: function($event) {
                $event.preventDefault()
                return _vm.advance($event)
              }
            }
          },
          [_vm._v("\n                Continue\n            ")]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1&":
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "team-registration-pricing-table",
      class: {
        "team-registration-pricing-table--odd-row-count": _vm.has_odd_row_count
      }
    },
    [
      _c("h2", {
        staticClass: "team-registration-pricing-table__title",
        domProps: { innerHTML: _vm._s(_vm.ijsFix(_vm.config.title)) }
      }),
      _vm._v(" "),
      _c(
        "table",
        { staticClass: "competition-prices-table" },
        [
          _c(
            "tr",
            { staticClass: "competition-prices-table__header" },
            [
              _c("th", { staticClass: "cell cell--label" }, [
                _c("span", { staticClass: "label-value" }, [
                  _vm._v(_vm._s(_vm.label_column_heading))
                ])
              ]),
              _vm._v(" "),
              _vm._l(_vm.value_column_headings, function(name, nindex) {
                return _c(
                  "th",
                  {
                    key: nindex,
                    staticClass: "cell",
                    class:
                      nindex === _vm.value_column_headings.length - 1
                        ? "cell--price-combined"
                        : "cell--price"
                  },
                  [
                    _vm._v(
                      "\n                " + _vm._s(name) + "\n            "
                    )
                  ]
                )
              })
            ],
            2
          ),
          _vm._v(" "),
          _vm._l(_vm.rows, function(row, rindex) {
            return _c(
              "tr",
              { key: rindex, staticClass: "competition-prices-table__row" },
              [
                _c("td", { staticClass: "cell cell--label" }, [
                  _c("span", { staticClass: "label-value" }, [
                    _vm._v(_vm._s(row.label))
                  ])
                ]),
                _vm._v(" "),
                _vm.showPriceNotice(row)
                  ? _c(
                      "td",
                      {
                        staticClass: "cell cell--notice",
                        attrs: { colspan: row.values.length }
                      },
                      [
                        _c("span", {
                          staticClass: "notice-value",
                          domProps: {
                            innerHTML: _vm._s(
                              _vm.ijsFix(_vm.config.null_row_message)
                            )
                          }
                        })
                      ]
                    )
                  : _vm._l(row.values, function(value, vindex) {
                      return _c(
                        "td",
                        {
                          key: vindex,
                          staticClass: "cell",
                          class:
                            vindex === row.values.length - 1
                              ? "cell--price-combined"
                              : "cell--price"
                        },
                        [
                          _vm._v(
                            "\n                " +
                              _vm._s(_vm._f("priceDisplay")(value)) +
                              "\n            "
                          )
                        ]
                      )
                    })
              ],
              2
            )
          })
        ],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d&":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d& ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "team-registration__progress-bar" },
    [
      _c("progress-bar", {
        attrs: {
          available_step_count: _vm.available_steps,
          active_step_number: _vm.active_step
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "team-registration-roster-edit" },
    [
      _c("div", { staticClass: "team-registration-roster-edit__header" }, [
        _c(
          "h2",
          { staticClass: "team-registration-roster-edit__header__title" },
          [_vm._v("\n            " + _vm._s(_vm.title) + "\n        ")]
        ),
        _vm._v(" "),
        _vm.subtitle
          ? _c(
              "h3",
              {
                staticClass: "team-registration-roster-edit__header__subtitle"
              },
              [_vm._v("\n            " + _vm._s(_vm.subtitle) + "\n        ")]
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm.show_loader
        ? _c("component-loader", {
            attrs: { container: true, source: _vm.loading_state }
          })
        : _c(
            "div",
            {
              staticClass: "team-registration-roster-edit__content",
              style: { "padding-bottom": _vm.content_pad + "px" }
            },
            [
              _vm.roster_rules
                ? _c(
                    "ul",
                    {
                      staticClass: "team-registration-roster-edit__rules-list"
                    },
                    _vm._l(_vm.roster_rules, function(rule, index) {
                      return _c("li", { key: index }, [
                        _vm._v(
                          "\n                " + _vm._s(rule) + "\n            "
                        )
                      ])
                    })
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.$slots.information
                ? _c(
                    "div",
                    {
                      staticClass: "team-registration-roster-edit__information"
                    },
                    [_vm._t("information")],
                    2
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "team-registration-roster-edit__roster-size" },
                [
                  _c(
                    "team-registration-roster-summary",
                    _vm._b(
                      {},
                      "team-registration-roster-summary",
                      _vm.summary_binding,
                      false
                    )
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "team-registration-roster-edit__roster" },
                [
                  !_vm.available_roster.length
                    ? _c("p", { staticClass: "text--alert" }, [
                        _vm._v(
                          "\n                There are no " +
                            _vm._s(
                              _vm.member_type_descriptor.plural.toLowerCase()
                            ) +
                            " in the team roster.\n            "
                        )
                      ])
                    : _c(
                        "ul",
                        { staticClass: "team-registration-roster-list" },
                        _vm._l(_vm.available_roster, function(member) {
                          return _c(
                            "li",
                            {
                              key: member.id,
                              staticClass:
                                "team-registration-roster-list__item",
                              class: _vm.listItemClass(member)
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "team-registration-roster-list__entity"
                                },
                                [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "team-registration-roster-list__entity__content"
                                    },
                                    [
                                      _c(
                                        "p",
                                        {
                                          staticClass:
                                            "team-registration-roster-list__entity__description"
                                        },
                                        [
                                          _c("span", [
                                            _vm._v(
                                              _vm._s(member.last_name) +
                                                ", " +
                                                _vm._s(member.first_name) +
                                                " "
                                            ),
                                            _c(
                                              "span",
                                              { staticClass: "text--muted" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    member.supporting_information
                                                  )
                                                )
                                              ]
                                            )
                                          ])
                                        ]
                                      ),
                                      _vm._v(" "),
                                      !member.can_be_added_to_roster &&
                                      member.cannot_be_added_to_roster_reason
                                        ? _c(
                                            "p",
                                            {
                                              staticClass:
                                                "team-registration-roster-list__entity__invalid-message text--alert"
                                            },
                                            [
                                              _c("span", [
                                                _vm._v(
                                                  _vm._s(
                                                    member.cannot_be_added_to_roster_reason
                                                  )
                                                ),
                                                _vm.memberInSelectedRoster(
                                                  member
                                                )
                                                  ? _c("span", [
                                                      _vm._v(
                                                        ", please uncheck to remove"
                                                      )
                                                    ])
                                                  : _vm._e()
                                              ])
                                            ]
                                          )
                                        : _vm._e()
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _vm.showMemberControl(member)
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "team-registration-roster-list__entity__action"
                                        },
                                        [
                                          _c(
                                            "div",
                                            { staticClass: "form-group" },
                                            [
                                              _c(
                                                "label",
                                                {
                                                  staticClass:
                                                    "usfsa-checkbox usfsa-checkbox--unlabeled",
                                                  class: {
                                                    "usfsa-checkbox--invalid": !member.can_be_added_to_roster
                                                  },
                                                  attrs: {
                                                    for:
                                                      "select_to_roster_" +
                                                      member.id
                                                  }
                                                },
                                                [
                                                  _c("input", {
                                                    attrs: {
                                                      id:
                                                        "select_to_roster_" +
                                                        member.id,
                                                      type: "checkbox"
                                                    },
                                                    domProps: {
                                                      checked: _vm.memberInSelectedRoster(
                                                        member
                                                      )
                                                    },
                                                    on: {
                                                      click: function($event) {
                                                        $event.preventDefault()
                                                        _vm.toggleMember(member)
                                                      }
                                                    }
                                                  }),
                                                  _vm._v(" "),
                                                  _c(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "usfsa-checkbox__text"
                                                    },
                                                    [_vm._v(" ")]
                                                  )
                                                ]
                                              )
                                            ]
                                          )
                                        ]
                                      )
                                    : _vm._e()
                                ]
                              )
                            ]
                          )
                        })
                      )
                ]
              )
            ]
          ),
      _vm._v(" "),
      !_vm.show_loader
        ? _c(
            "div",
            {
              ref: "footer",
              staticClass: "team-registration-roster-edit__footer"
            },
            [
              _c(
                "div",
                {
                  staticClass: "team-registration-roster-edit__footer__content"
                },
                [
                  _vm.per_member_fee
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-roster-edit__footer__member-cost total-member-cost"
                        },
                        [
                          _c("total-member-cost", {
                            attrs: {
                              per_member_fee: _vm.per_member_fee,
                              current_roster_size: _vm.current_roster_size,
                              label: _vm.member_type_descriptor.singular
                            }
                          })
                        ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.submission_error
                    ? _c(
                        "p",
                        { staticClass: "team-registration-roster-edit__error" },
                        [
                          _vm._v(
                            "\n                " +
                              _vm._s(_vm.submission_error) +
                              "\n            "
                          )
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass:
                        "button button--large button--primary button--block",
                      attrs: { disabled: _vm.confirm_disabled },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          return _vm.confirmRoster($event)
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n                " +
                          _vm._s(
                            _vm.submitting ? "Saving" : _vm.confirm_label
                          ) +
                          "\n            "
                      )
                    ]
                  )
                ]
              )
            ]
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c&":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ul",
    { staticClass: "team-registration__roster-list" },
    _vm._l(_vm.entity_list, function(entity, index) {
      return _c(
        "li",
        { key: entity.id, staticClass: "team-registration__roster-list__item" },
        [
          _c("div", { staticClass: "team-registration-roster-card" }, [
            _c(
              "div",
              { staticClass: "team-registration-roster-card__content" },
              [
                _c(
                  "div",
                  {
                    staticClass:
                      "team-registration-roster-card__content__description"
                  },
                  [
                    _c(
                      "p",
                      {
                        staticClass:
                          "team-registration-roster-card__text team-registration-roster-card__text--primary"
                      },
                      [
                        _c("span", [
                          _vm._v(
                            _vm._s(
                              _vm.include_numbering ? index + 1 + ". " : ""
                            ) +
                              _vm._s(entity.last_name) +
                              ", " +
                              _vm._s(entity.first_name) +
                              " "
                          ),
                          _c("span", { staticClass: "text--muted" }, [
                            _vm._v("(" + _vm._s(entity.member_number) + ")")
                          ])
                        ])
                      ]
                    ),
                    _vm._v(" "),
                    _vm.$scopedSlots.card_secondary
                      ? _c(
                          "p",
                          {
                            staticClass:
                              "team-registration-roster-card__text team-registration-roster-card__text--secondary"
                          },
                          [_vm._t("card_secondary", null, { entity: entity })],
                          2
                        )
                      : _vm._e()
                  ]
                ),
                _vm._v(" "),
                !entity.can_be_added_to_roster
                  ? _c(
                      "div",
                      {
                        staticClass:
                          "team-registration-roster-card__content__error"
                      },
                      [
                        _c(
                          "span",
                          {
                            staticClass:
                              "member-result-notice member-result-notice--alert"
                          },
                          [
                            _c(
                              "span",
                              { staticClass: "member-result-notice__icon" },
                              [_vm._v(" ")]
                            ),
                            _vm._v(" "),
                            _c(
                              "span",
                              { staticClass: "member-result-notice__text" },
                              [
                                _vm._v(
                                  "\n                            " +
                                    _vm._s(
                                      entity.cannot_be_added_to_roster_reason
                                    ) +
                                    "\n                        "
                                )
                              ]
                            )
                          ]
                        )
                      ]
                    )
                  : _vm._e()
              ]
            )
          ])
        ]
      )
    })
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422&":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "team-registration-roster-summary" }, [
    _c("div", { staticClass: "team-registration-roster-summary__row" }, [
      _c("h4", { staticClass: "team-registration-roster-summary__label" }, [
        _vm._v("\n            " + _vm._s(_vm.summary_label) + ":\n        ")
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "team-registration-roster-summary__count" }, [
        _c(
          "span",
          {
            staticClass: "count-badge",
            class: {
              "count-badge--invalid": _vm.invalid,
              "count-badge--incomplete": _vm.incomplete && !_vm.invalid
            }
          },
          [
            _c("span", { staticClass: "count-badge__content" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(_vm.current_roster_size) +
                  "\n                "
              )
            ])
          ]
        )
      ]),
      _vm._v(" "),
      _vm.roster_summary_message
        ? _c(
            "p",
            {
              staticClass: "team-registration-roster-summary__message",
              class: {
                "text--alert": _vm.invalid || _vm.incomplete
              }
            },
            [
              _vm._v(
                "\n            " +
                  _vm._s(_vm.roster_summary_message) +
                  "\n        "
              )
            ]
          )
        : _vm._e()
    ]),
    _vm._v(" "),
    _vm.per_member_fee
      ? _c(
          "p",
          { staticClass: "team-registration-roster-summary__secondary" },
          [
            _vm._v(
              "\n        Per " +
                _vm._s(_vm.member_type_descriptor.singular) +
                " Fee:\n        "
            ),
            _c(
              "span",
              { staticClass: "team-registration-roster-summary__fee" },
              [_vm._v("$" + _vm._s(_vm.per_member_fee))]
            )
          ]
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=template&id=acecd170&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=template&id=acecd170& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "total-member-cost" }, [
    _c("span", { staticClass: "cost-display" }, [
      _c("span", { staticClass: "cost-display__label" }, [
        _vm._v("Total " + _vm._s(_vm.label) + " Cost:")
      ]),
      _vm._v(" "),
      _c("span", { staticClass: "cost-display__value" }, [
        _vm._v("$" + _vm._s(_vm._f("price")(_vm.total_member_cost)))
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=template&id=528b6041&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=template&id=528b6041& ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass: "team-registration-personnel-page team-registration-coaches",
      class: { "page--accent": _vm.component_loaded && _vm.roster_exists },
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _vm.component_loaded
            ? _c("div", [
                _c("p", { staticClass: "team-registration__page-lead" }, [
                  _vm._v(
                    '\n                Click "' +
                      _vm._s(_vm.current_action) +
                      ' Coaches" to select the coaches who will be\n                attending this competition with the team. Only coaches listed in EMS will receive a credential at\n                the competition.\n            '
                  )
                ])
              ])
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading coaches."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-personnel-page__content" },
            [
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  !_vm.roster_exists
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__new team-registration-personnel-page__new--alt"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--add",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Add Coaches\n                    "
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "p",
                                {
                                  staticClass:
                                    "warning-notice team-registration-personnel-page__no-personnel-notice"
                                },
                                [
                                  _c(
                                    "i",
                                    {
                                      staticClass:
                                        "inline-icon icon-warning-alt"
                                    },
                                    [_vm._v(" ")]
                                  ),
                                  _vm._v(
                                    "\n                        There are no coaches identified as\n                        "
                                  ),
                                  _c("br"),
                                  _vm._v(
                                    "\n                        attending the competition.\n                    "
                                  )
                                ]
                              )
                            ]
                          )
                        ]
                      )
                    : _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__review team-registration-personnel-page__review--alt"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--edit",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Edit Coaches\n                    "
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "team-registration-roster-summary",
                            _vm._b(
                              {},
                              "team-registration-roster-summary",
                              _vm.summary_binding,
                              false
                            )
                          ),
                          _vm._v(" "),
                          _c("team-registration-roster-review-list", {
                            attrs: { entity_list: _vm.active_coaches }
                          })
                        ],
                        1
                      ),
                  _vm._v(" "),
                  _c("team-registration-page-navigation", {
                    attrs: {
                      retreat: _vm.retreat,
                      advance: _vm.advance,
                      advance_disabled: _vm.advance_disabled,
                      hide_retreat: _vm.hide_retreat
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.edit_active
                ? _c(
                    "site-takeover",
                    {
                      on: {
                        close: function($event) {
                          _vm.edit_active = false
                        }
                      }
                    },
                    [
                      _c(
                        "team-registration-roster-edit",
                        _vm._b(
                          {
                            on: {
                              "roster-confirmed": function($event) {
                                _vm.edit_active = false
                              }
                            }
                          },
                          "team-registration-roster-edit",
                          _vm.edit_binding,
                          false
                        ),
                        [
                          _c(
                            "p",
                            {
                              attrs: { slot: "information" },
                              slot: "information"
                            },
                            [
                              _vm._v(
                                "\n                    Select the coach(es) attending the competition with the team. The coaches listed below are those\n                    currently listed in the Team Profile. If a coach is not listed, they will need to be added\n                    through the Team Profile in Members Only.\n                "
                              )
                            ]
                          )
                        ]
                      )
                    ],
                    1
                  )
                : _vm._e()
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863&":
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass:
        "team-registration-personnel-page team-registration-competition-roster",
      class: { "page--accent": _vm.component_loaded && _vm.roster_exists },
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _vm.component_loaded
            ? _c("div", [
                !_vm.roster_exists
                  ? _c("p", { staticClass: "team-registration__page-lead" }, [
                      _vm._v(
                        "\n                Click “Add Skaters” to select skaters from the Main Roster who will be attending this competition.\n                Only skaters listed on the competition roster will receive a credential at the competition.\n            "
                      )
                    ])
                  : _c(
                      "div",
                      { staticClass: "team-registration__page-information" },
                      [
                        _c(
                          "page-alert",
                          {
                            staticClass:
                              "page-alert page-alert--notice page-alert--medium",
                            attrs: { slot: "information" },
                            slot: "information"
                          },
                          [
                            _c(
                              "div",
                              {
                                attrs: { slot: "trigger_text" },
                                slot: "trigger_text"
                              },
                              [
                                _vm._v(
                                  "\n                        Information\n                    "
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                attrs: { slot: "expand_content" },
                                slot: "expand_content"
                              },
                              [
                                _vm._v(
                                  "\n                        Click “Edit Roster” to select skaters from the Main Roster who will be attending this\n                        competition. Only skaters listed on the competition roster will receive a credential at the\n                        competition.\n                    "
                                )
                              ]
                            )
                          ]
                        )
                      ],
                      1
                    )
              ])
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading competition roster."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-personnel-page__content" },
            [
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  !_vm.roster_exists
                    ? _c(
                        "div",
                        {
                          staticClass: "team-registration-personnel-page__new"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--add",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Add Skaters\n                    "
                                  )
                                ]
                              )
                            ]
                          )
                        ]
                      )
                    : _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__review"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--edit",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Edit Roster\n                    "
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "team-registration-roster-summary",
                            _vm._b(
                              {},
                              "team-registration-roster-summary",
                              _vm.summary_binding,
                              false
                            )
                          ),
                          _vm._v(" "),
                          _c("team-registration-roster-review-list", {
                            attrs: {
                              entity_list: _vm.competition_roster,
                              include_numbering: true
                            },
                            scopedSlots: _vm._u([
                              {
                                key: "card_secondary",
                                fn: function(ref) {
                                  var entity = ref.entity
                                  return [
                                    _vm._v(
                                      "\n                        Age: " +
                                        _vm._s(entity.age) +
                                        "\n                    "
                                    )
                                  ]
                                }
                              }
                            ])
                          })
                        ],
                        1
                      ),
                  _vm._v(" "),
                  _c("div", { staticClass: "team-registration__terms" }, [
                    _c(
                      "div",
                      { staticClass: "team-registration__terms__confirm" },
                      [
                        _c(
                          "label",
                          {
                            staticClass: "usfsa-checkbox",
                            attrs: { for: "terms_confirm" }
                          },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.confirmed,
                                  expression: "confirmed"
                                }
                              ],
                              attrs: { id: "terms_confirm", type: "checkbox" },
                              domProps: {
                                checked: Array.isArray(_vm.confirmed)
                                  ? _vm._i(_vm.confirmed, null) > -1
                                  : _vm.confirmed
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.confirmed,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.confirmed = $$a.concat([$$v]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.confirmed = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.confirmed = $$c
                                  }
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "span",
                              { staticClass: "usfsa-checkbox__text" },
                              [
                                _vm._v(
                                  "I have verified the competition roster is accurate."
                                )
                              ]
                            )
                          ]
                        )
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c(
                    "team-registration-page-navigation",
                    {
                      attrs: {
                        retreat: _vm.retreat,
                        advance: _vm.advance,
                        advance_disabled: _vm.advance_disabled,
                        hide_retreat: _vm.hide_retreat
                      }
                    },
                    [
                      _vm.per_skater_fee && _vm.roster_exists
                        ? _c("total-member-cost", {
                            attrs: {
                              slot: "pre",
                              label: "Skater",
                              per_member_fee: _vm.per_skater_fee,
                              current_roster_size: _vm.current_roster_ids.length
                            },
                            slot: "pre"
                          })
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.edit_active
                ? _c(
                    "site-takeover",
                    {
                      on: {
                        close: function($event) {
                          _vm.edit_active = false
                        }
                      }
                    },
                    [
                      _c(
                        "team-registration-roster-edit",
                        _vm._b(
                          {
                            on: {
                              "roster-confirmed": function($event) {
                                _vm.edit_active = false
                              }
                            }
                          },
                          "team-registration-roster-edit",
                          _vm.edit_binding,
                          false
                        ),
                        [
                          _c(
                            "page-alert",
                            {
                              staticClass:
                                "page-alert page-alert--notice page-alert--medium",
                              attrs: { slot: "information" },
                              slot: "information"
                            },
                            [
                              _c(
                                "div",
                                {
                                  attrs: { slot: "trigger_text" },
                                  slot: "trigger_text"
                                },
                                [
                                  _vm._v(
                                    "\n                        Information\n                    "
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                {
                                  attrs: { slot: "expand_content" },
                                  slot: "expand_content"
                                },
                                [
                                  _vm._v(
                                    "\n                        Select skaters to be listed on the Competition Roster. The skaters listed below are\n                        those currently on the team’s Main Roster. If a skater is not on the Main Roster, they\n                        will need to be added through the Team Profile in Members Only.\n                    "
                                  )
                                ]
                              )
                            ]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                : _vm._e()
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9&":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9& ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass: "team-registration-event-selection",
      class: { "page--accent": _vm.component_loaded },
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _vm.component_loaded
            ? _c(
                "div",
                { staticClass: "team-registration__page-information" },
                [
                  _c(
                    "page-alert",
                    {
                      staticClass:
                        "page-alert page-alert--notice page-alert--medium"
                    },
                    [
                      _c(
                        "div",
                        {
                          attrs: { slot: "trigger_text" },
                          slot: "trigger_text"
                        },
                        [
                          _vm._v(
                            "\n                    Additional Information\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          attrs: { slot: "expand_content" },
                          slot: "expand_content"
                        },
                        [
                          _c("p", [
                            _vm._v(
                              "\n                        Your team is eligible for the events listed below based on level. A blue star indicates that\n                        an event has been selected.\n                    "
                            )
                          ]),
                          _vm._v(" "),
                          _c("p", [
                            _vm._v(
                              "\n                        If events appear incorrect, contact\n                        "
                            ),
                            _c(
                              "a",
                              {
                                staticClass: "standard-link",
                                attrs: {
                                  href:
                                    "mailto:productsupport@usfigureskating.org"
                                }
                              },
                              [
                                _vm._v(
                                  "productsupport@usfigureskating.org\n                        "
                                )
                              ]
                            )
                          ])
                        ]
                      )
                    ]
                  )
                ],
                1
              )
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading event selection."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-event-selection__content" },
            [
              _c("event-selection", {
                ref: "event_selection",
                attrs: { state_available_events: _vm.events },
                on: {
                  disable: function($event) {
                    _vm.child_processing = true
                  },
                  enable: function($event) {
                    _vm.child_processing = false
                  }
                }
              }),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  _c("team-registration-page-navigation", {
                    attrs: {
                      retreat: _vm.retreat,
                      advance: _vm.advance,
                      advance_disabled: _vm.advance_disabled,
                      hide_retreat: _vm.hide_retreat
                    }
                  })
                ],
                1
              )
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a&":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a& ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass:
        "team-registration-personnel-page team-registration-prop-crew",
      class: { "page--accent": _vm.component_loaded && _vm.roster_exists },
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _vm.component_loaded
            ? _c("div", [
                _c("p", { staticClass: "team-registration__page-lead" }, [
                  _vm._v(
                    '\n                Click "' +
                      _vm._s(_vm.current_action) +
                      ' Prop Crew" to select the Prop Crew who will be\n                attending this competition with the team. Only Prop Crew listed in EMS will receive a\n                credential at the competition.\n            '
                  )
                ])
              ])
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading prop crew."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-personnel-page__content" },
            [
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  !_vm.roster_exists
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__new team-registration-personnel-page__new--alt"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--add",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Add Prop Crew\n                    "
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "p",
                                {
                                  staticClass:
                                    "warning-notice team-registration-personnel-page__no-personnel-notice"
                                },
                                [
                                  _c(
                                    "i",
                                    {
                                      staticClass:
                                        "inline-icon icon-warning-alt"
                                    },
                                    [_vm._v(" ")]
                                  ),
                                  _vm._v(
                                    "\n                        There are no prop crew identified as\n                        "
                                  ),
                                  _c("br"),
                                  _vm._v(
                                    "\n                        attending the competition.\n                    "
                                  )
                                ]
                              )
                            ]
                          )
                        ]
                      )
                    : _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__review team-registration-personnel-page__review--alt"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--edit",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Edit Prop Crew\n                    "
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "team-registration-roster-summary",
                            _vm._b(
                              {},
                              "team-registration-roster-summary",
                              _vm.summary_binding,
                              false
                            )
                          ),
                          _vm._v(" "),
                          _c("team-registration-roster-review-list", {
                            attrs: { entity_list: _vm.active_prop_crew }
                          })
                        ],
                        1
                      ),
                  _vm._v(" "),
                  _c("team-registration-page-navigation", {
                    attrs: {
                      retreat: _vm.retreat,
                      advance: _vm.advance,
                      advance_disabled: _vm.advance_disabled,
                      hide_retreat: _vm.hide_retreat
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.edit_active
                ? _c(
                    "site-takeover",
                    {
                      on: {
                        close: function($event) {
                          _vm.edit_active = false
                        }
                      }
                    },
                    [
                      _c(
                        "team-registration-roster-edit",
                        _vm._b(
                          {
                            on: {
                              "roster-confirmed": function($event) {
                                _vm.edit_active = false
                              }
                            }
                          },
                          "team-registration-roster-edit",
                          _vm.edit_binding,
                          false
                        ),
                        [
                          _c(
                            "p",
                            {
                              attrs: { slot: "information" },
                              slot: "information"
                            },
                            [
                              _vm._v(
                                "\n                    Select the Prop Crew attending the competition with the team. The Prop Crew listed below are\n                    those currently listed in the Team Profile. If a Prop Crew member is not listed, they will need\n                    to be added through the Team Profile in Members Only.\n                "
                              )
                            ]
                          )
                        ]
                      )
                    ],
                    1
                  )
                : _vm._e()
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae&":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae& ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass: "team-registration-registration-overview",
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _vm.component_loaded
            ? _c(
                "div",
                { staticClass: "team-registration__page-information" },
                [
                  _c(
                    "page-alert",
                    {
                      staticClass:
                        "page-alert page-alert--notice page-alert--medium"
                    },
                    [
                      _c(
                        "div",
                        {
                          attrs: { slot: "trigger_text" },
                          slot: "trigger_text"
                        },
                        [
                          _vm._v(
                            "\n                    Registration Information\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          attrs: { slot: "expand_content" },
                          slot: "expand_content"
                        },
                        [
                          _c(
                            "ul",
                            {
                              staticClass:
                                "team-registration-registration-overview__information-list"
                            },
                            _vm._l(_vm.registration_information, function(
                              information_item,
                              index
                            ) {
                              return _c("li", {
                                key: index,
                                domProps: {
                                  innerHTML: _vm._s(information_item)
                                }
                              })
                            })
                          )
                        ]
                      )
                    ]
                  )
                ],
                1
              )
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading registration overview."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-registration-overview__content" },
            [
              _c(
                "div",
                {
                  staticClass: "team-registration-registration-overview__prices"
                },
                [
                  _c(
                    "div",
                    {
                      staticClass:
                        "team-registration-registration-overview__prices__container"
                    },
                    _vm._l(_vm.tables, function(table, tindex) {
                      return _c("team-registration-pricing-table", {
                        key: tindex,
                        attrs: { config: table.config, rows: table.rows }
                      })
                    })
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  _c("div", { staticClass: "team-registration__terms" }, [
                    _c("p", { staticClass: "team-registration__terms__lead" }, [
                      _vm._v(
                        "\n                    By clicking the box below and continuing with registration I acknowledge, accept and agree to\n                    abide by all bylaws, rules, policies, procedures and guidelines as outlined in the\n                    " +
                          _vm._s(_vm.rulebook_year) +
                          "\n                    U.S. Figure Skating Rulebook and as listed within the official announcement for the sanctioned\n                    competition I am registering for. Compliance with all such provisions as updated or amended is\n                    the responsibility of the participants.\n                "
                      )
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "team-registration__terms__confirm" },
                      [
                        _c(
                          "label",
                          {
                            staticClass: "usfsa-checkbox",
                            attrs: { for: "terms_confirm" }
                          },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.confirmed,
                                  expression: "confirmed"
                                }
                              ],
                              attrs: { id: "terms_confirm", type: "checkbox" },
                              domProps: {
                                checked: Array.isArray(_vm.confirmed)
                                  ? _vm._i(_vm.confirmed, null) > -1
                                  : _vm.confirmed
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.confirmed,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.confirmed = $$a.concat([$$v]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.confirmed = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.confirmed = $$c
                                  }
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "span",
                              { staticClass: "usfsa-checkbox__text" },
                              [
                                _vm._v(
                                  "I have read and understand the above overview of the U.S. Figure Skating online registration process."
                                )
                              ]
                            )
                          ]
                        )
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c("team-registration-page-navigation", {
                    attrs: {
                      retreat: _vm.retreat,
                      advance: _vm.advance,
                      advance_disabled: _vm.advance_disabled,
                      hide_retreat: _vm.hide_retreat
                    }
                  })
                ],
                1
              )
            ]
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf&":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf& ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass:
        "team-registration-personnel-page team-registration-team-service-personnel",
      class: { "page--accent": _vm.component_loaded && _vm.roster_exists },
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _vm.component_loaded
            ? _c("div", [
                _c("p", { staticClass: "team-registration__page-lead" }, [
                  _vm._v(
                    '\n                Click "' +
                      _vm._s(_vm.current_action) +
                      ' Team Service Personnel" to select the Team Service Personnel who will be\n                attending this competition with the team. Only Team Service Personnel listed in EMS will receive a\n                credential at the competition.\n            '
                  )
                ])
              ])
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading team service personnel."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-personnel-page__content" },
            [
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  !_vm.roster_exists
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__new team-registration-personnel-page__new--alt"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--add",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Add Team Service Personnel\n                    "
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "p",
                                {
                                  staticClass:
                                    "warning-notice team-registration-personnel-page__no-personnel-notice"
                                },
                                [
                                  _c(
                                    "i",
                                    {
                                      staticClass:
                                        "inline-icon icon-warning-alt"
                                    },
                                    [_vm._v(" ")]
                                  ),
                                  _vm._v(
                                    "\n                        There are no team service personnel\n                        "
                                  ),
                                  _c("br"),
                                  _vm._v(
                                    "\n                        identified as attending the competition.\n                    "
                                  )
                                ]
                              )
                            ]
                          )
                        ]
                      )
                    : _c(
                        "div",
                        {
                          staticClass:
                            "team-registration-personnel-page__review team-registration-personnel-page__review--alt"
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "team-registration-personnel-page__editor-cta"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass:
                                    "labeled-action-button labeled-action-button--edit",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.edit_active = true
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                        Edit Team Service Personnel\n                    "
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "team-registration-roster-summary",
                            _vm._b(
                              {},
                              "team-registration-roster-summary",
                              _vm.summary_binding,
                              false
                            )
                          ),
                          _vm._v(" "),
                          _c("team-registration-roster-review-list", {
                            attrs: {
                              entity_list: _vm.active_team_service_personnel
                            }
                          })
                        ],
                        1
                      ),
                  _vm._v(" "),
                  _c("team-registration-page-navigation", {
                    attrs: {
                      retreat: _vm.retreat,
                      advance: _vm.advance,
                      advance_disabled: _vm.advance_disabled,
                      hide_retreat: _vm.hide_retreat
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.edit_active
                ? _c(
                    "site-takeover",
                    {
                      on: {
                        close: function($event) {
                          _vm.edit_active = false
                        }
                      }
                    },
                    [
                      _c(
                        "team-registration-roster-edit",
                        _vm._b(
                          {
                            on: {
                              "roster-confirmed": function($event) {
                                _vm.edit_active = false
                              }
                            }
                          },
                          "team-registration-roster-edit",
                          _vm.edit_binding,
                          false
                        ),
                        [
                          _c(
                            "p",
                            {
                              attrs: { slot: "information" },
                              slot: "information"
                            },
                            [
                              _vm._v(
                                "\n                    Select the Team Service Personnel attending the competition with the team. The persons listed\n                    below are those currently listed in the Team Profile as a Team Manager or Team Service\n                    Personnel. If a person is not listed, they will need to be added through the Team Profile in\n                    Members Only.\n                "
                              )
                            ]
                          )
                        ]
                      )
                    ],
                    1
                  )
                : _vm._e()
            ],
            1
          )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422&":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422& ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "page",
    {
      staticClass: "team-registration-team-verification",
      attrs: { header: _vm.page_header }
    },
    [
      _c("team-registration-header", {
        attrs: { slot: "pre-header" },
        slot: "pre-header"
      }),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { slot: "header-content" }, slot: "header-content" },
        [
          _c("team-registration-progress-bar"),
          _vm._v(" "),
          _c("p", { staticClass: "team-registration__page-lead" }, [
            _vm._v(
              "\n            Please review the team information below as it will be used for various aspects of the competition. If\n            the level is not correct, you must update this through your profile in members only.\n        "
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      !_vm.component_loaded
        ? _c("component-loader", {
            attrs: {
              container: true,
              source: this,
              error_message: "Error loading team verification."
            }
          })
        : _c(
            "div",
            { staticClass: "team-registration-team-verification__content" },
            [
              _c(
                "div",
                {
                  staticClass:
                    "page__section page__section--accent page__accent-content"
                },
                [
                  _c("div", { staticClass: "grid-container" }, [
                    _c("div", { staticClass: "card" }, [
                      _c("div", { staticClass: "card__content" }, [
                        _vm.edit_active
                          ? _c("div", { staticClass: "edit-team-name-form" }, [
                              _c("div", { staticClass: "form-group" }, [
                                _c(
                                  "label",
                                  {
                                    staticClass: "sr-only",
                                    attrs: { for: "team_name" }
                                  },
                                  [
                                    _vm._v(
                                      "Team Name\n                                "
                                    )
                                  ]
                                ),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.edit_name,
                                      expression: "edit_name"
                                    }
                                  ],
                                  staticClass: "form-field",
                                  attrs: {
                                    id: "team_name",
                                    type: "text",
                                    name: "team_name"
                                  },
                                  domProps: { value: _vm.edit_name },
                                  on: {
                                    keydown: function($event) {
                                      if (
                                        !("button" in $event) &&
                                        _vm._k(
                                          $event.keyCode,
                                          "enter",
                                          13,
                                          $event.key,
                                          "Enter"
                                        )
                                      ) {
                                        return null
                                      }
                                      return _vm.saveEdit($event)
                                    },
                                    input: function($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.edit_name = $event.target.value
                                    }
                                  }
                                })
                              ]),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "edit-team-name-form__actions" },
                                [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "edit-team-name-form__actions__column"
                                    },
                                    [
                                      _c(
                                        "button",
                                        {
                                          staticClass:
                                            "button button--block button--info",
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              return _vm.cancelEdit($event)
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        Cancel\n                                    "
                                          )
                                        ]
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "edit-team-name-form__actions__column"
                                    },
                                    [
                                      _c(
                                        "button",
                                        {
                                          staticClass: "button button--block",
                                          attrs: {
                                            disabled:
                                              _vm.edit_name ===
                                              _vm.team_information.name
                                          },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              return _vm.saveEdit($event)
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        Save\n                                    "
                                          )
                                        ]
                                      )
                                    ]
                                  )
                                ]
                              )
                            ])
                          : _c(
                              "h3",
                              {
                                staticClass:
                                  "team-registration-team-verification__team-name card__heading"
                              },
                              [
                                _c("span", [
                                  _vm._v(_vm._s(_vm.team_information.name))
                                ]),
                                _vm._v(" "),
                                _c(
                                  "button",
                                  {
                                    staticClass:
                                      "team-registration-team-verification__team-name__edit-trigger icon-button icon-button--edit icon-button--md",
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        return _vm.openEdit($event)
                                      }
                                    }
                                  },
                                  [
                                    _c("span", { staticClass: "sr-only" }, [
                                      _vm._v("Edit team name")
                                    ])
                                  ]
                                )
                              ]
                            ),
                        _vm._v(" "),
                        _c("ul", { staticClass: "card__list label-list" }, [
                          _c("li", [
                            _c("span", { staticClass: "label-list__label" }, [
                              _vm._v("Level:")
                            ]),
                            _vm._v(
                              "\n                                " +
                                _vm._s(_vm.team_information.level) +
                                "\n                            "
                            )
                          ]),
                          _vm._v(" "),
                          _c("li", [
                            _c("span", { staticClass: "label-list__label" }, [
                              _vm._v("Member:")
                            ]),
                            _vm._v(
                              "\n                                #" +
                                _vm._s(_vm.team_information.member_number) +
                                "\n                            "
                            )
                          ]),
                          _vm._v(" "),
                          _c("li", [
                            _c("span", { staticClass: "label-list__label" }, [
                              _vm._v("Membership End Date:")
                            ]),
                            _vm._v(
                              "\n                                " +
                                _vm._s(
                                  _vm.team_information.membership_end_date
                                ) +
                                "\n                                "
                            ),
                            _vm.team_information.membership_expired
                              ? _c("span", { staticClass: "text--alert" }, [
                                  _vm._v(" (Expired)")
                                ])
                              : _vm._e()
                          ]),
                          _vm._v(" "),
                          _c("li", [
                            _c("span", { staticClass: "label-list__label" }, [
                              _vm._v("Club:")
                            ]),
                            _vm._v(
                              "\n                                " +
                                _vm._s(_vm.team_information.club) +
                                "\n                            "
                            )
                          ]),
                          _vm._v(" "),
                          _vm.team_information.section
                            ? _c("li", [
                                _c(
                                  "span",
                                  { staticClass: "label-list__label" },
                                  [_vm._v("Section:")]
                                ),
                                _vm._v(
                                  "\n                                " +
                                    _vm._s(_vm.team_information.section) +
                                    "\n                            "
                                )
                              ])
                            : _vm._e()
                        ])
                      ])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "team-registration__terms" }, [
                      _c(
                        "label",
                        {
                          staticClass: "usfsa-checkbox",
                          attrs: { for: "terms_confirm" }
                        },
                        [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.confirmed,
                                expression: "confirmed"
                              }
                            ],
                            attrs: { id: "terms_confirm", type: "checkbox" },
                            domProps: {
                              checked: Array.isArray(_vm.confirmed)
                                ? _vm._i(_vm.confirmed, null) > -1
                                : _vm.confirmed
                            },
                            on: {
                              change: function($event) {
                                var $$a = _vm.confirmed,
                                  $$el = $event.target,
                                  $$c = $$el.checked ? true : false
                                if (Array.isArray($$a)) {
                                  var $$v = null,
                                    $$i = _vm._i($$a, $$v)
                                  if ($$el.checked) {
                                    $$i < 0 &&
                                      (_vm.confirmed = $$a.concat([$$v]))
                                  } else {
                                    $$i > -1 &&
                                      (_vm.confirmed = $$a
                                        .slice(0, $$i)
                                        .concat($$a.slice($$i + 1)))
                                  }
                                } else {
                                  _vm.confirmed = $$c
                                }
                              }
                            }
                          }),
                          _vm._v(" "),
                          _c("span", { staticClass: "usfsa-checkbox__text" }, [
                            _vm._v(
                              "I have verified the team information is accurate."
                            )
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "grid-container" },
                [
                  _c("team-registration-page-navigation", {
                    attrs: {
                      retreat: _vm.retreat,
                      advance: _vm.advance,
                      advance_disabled: _vm.advance_disabled,
                      hide_retreat: _vm.hide_retreat
                    }
                  })
                ],
                1
              )
            ]
          ),
      _vm._v(" "),
      _c("saving-confirmation-overlay", {
        attrs: {
          is_saving: _vm.is_saving,
          save_error: _vm.save_error,
          confirmation_message: _vm.confirmation_message
        },
        on: { close: _vm.closeConfirmation }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=template&id=d6c06fd6&":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=template&id=d6c06fd6& ***!
  \*************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "select-team-page" },
    [
      _c(
        "page",
        {
          class: { "page--accent": _vm.component_loaded },
          attrs: { header: _vm.page_header }
        },
        [
          _c(
            "p",
            {
              staticClass: "select-team-page__lead",
              attrs: { slot: "header-content" },
              slot: "header-content"
            },
            [
              _vm._v(
                "\n            If you do not see the team listed, verify the team’s membership has been renewed and you are indicated\n            as either Coach or Team Manager.\n        "
              )
            ]
          ),
          _vm._v(" "),
          !_vm.component_loaded
            ? _c("component-loader", {
                attrs: {
                  slot: "loader",
                  container: true,
                  source: this,
                  error_message: "Error loading teams."
                },
                slot: "loader"
              })
            : _c(
                "div",
                { staticClass: "page__accent-content grid-container" },
                [
                  _c("select-team-list", {
                    attrs: { teams: _vm.teams },
                    on: { select: _vm.selectTeam }
                  })
                ],
                1
              )
        ],
        1
      ),
      _vm._v(" "),
      _vm.selection_error
        ? _c(
            "popup",
            {
              staticClass: "popup popup--error popup--md",
              attrs: { math_center: true },
              on: {
                "close-popup": function($event) {
                  _vm.selection_error = null
                }
              }
            },
            [
              _c(
                "span",
                { attrs: { slot: "heading-text" }, slot: "heading-text" },
                [_vm._v("\n            Error\n        ")]
              ),
              _vm._v(" "),
              _c("div", { attrs: { slot: "content" }, slot: "content" }, [
                _c("p", [
                  _vm._v(
                    "\n                " +
                      _vm._s(_vm.selection_error) +
                      "\n            "
                  )
                ])
              ])
            ]
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c&":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c& ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "teams-competition-registration-index-page" },
    [
      _c(
        "page",
        {
          class: { "page--accent": _vm.component_loaded },
          attrs: { header: _vm.page_header }
        },
        [
          _vm.component_loaded && _vm.team_summary_name
            ? _c("page-entity-header", {
                attrs: {
                  slot: "pre-header",
                  entity_name: _vm.team_summary_name
                },
                slot: "pre-header"
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.component_loaded
            ? _c("component-loader", {
                attrs: {
                  slot: "loader",
                  container: true,
                  source: this,
                  error_message: "Error loading competitions."
                },
                slot: "loader"
              })
            : _c(
                "div",
                {
                  staticClass: "page__content page__content--bleed",
                  attrs: { slot: "content" },
                  slot: "content"
                },
                [
                  _c(
                    "div",
                    {
                      staticClass:
                        "tabs tabs--justified tabs--reduced page--accent__standard-content"
                    },
                    [
                      _c("div", { staticClass: "tabs__triggers" }, [
                        _c("ul", { staticClass: "tabs__list" }, [
                          _c("li", { staticClass: "tabs__item" }, [
                            _c(
                              "a",
                              {
                                staticClass: "tabs__trigger",
                                class: {
                                  active: _vm.active_type === "qualifying"
                                },
                                attrs: { href: "#" },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    _vm.selectActiveType("qualifying")
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n                                Qualifying\n                            "
                                )
                              ]
                            )
                          ]),
                          _vm._v(" "),
                          _c("li", { staticClass: "tabs__item" }, [
                            _c(
                              "a",
                              {
                                staticClass: "tabs__trigger",
                                class: {
                                  active: _vm.active_type === "non_qualifying"
                                },
                                attrs: { href: "#" },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    _vm.selectActiveType("non_qualifying")
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n                                Nonqualifying\n                            "
                                )
                              ]
                            )
                          ])
                        ])
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "page__accent-content grid-container" },
                    [
                      _vm.show_search
                        ? _c("competition-filter", {
                            ref: "filter",
                            attrs: {
                              competitions: _vm.type_filtered_competitions
                            },
                            on: {
                              input: function($event) {
                                _vm.filtered_competitions = $event
                              }
                            }
                          })
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.no_active_configured_competitions
                        ? _c(
                            "div",
                            {
                              staticClass:
                                "teams-competition-registration-index-page__no_configured_notice"
                            },
                            [
                              _c("p", [
                                _vm._v(
                                  "\n                        For questions regarding " +
                                    _vm._s(_vm.active_type.replace("_", "")) +
                                    " events, contact\n                        events@usfigureskating.org.\n                    "
                                )
                              ]),
                              _vm._v(" "),
                              _c("p", { staticClass: "alert" }, [
                                _vm._v(
                                  "\n                        There are no " +
                                    _vm._s(_vm.active_type.replace("_", "")) +
                                    " competitions setup and currently\n                        accepting entries. Check back again.\n                    "
                                )
                              ])
                            ]
                          )
                        : _c(
                            "div",
                            { staticClass: "competition-tile-list" },
                            [
                              _vm.visible_competitions.length === 0
                                ? _c(
                                    "p",
                                    {
                                      staticClass:
                                        "competition-tile-list__no-results alert"
                                    },
                                    [
                                      _vm._v(
                                        "\n                        No competitions match your filters.\n                    "
                                      )
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm._l(_vm.visible_competitions, function(
                                competition
                              ) {
                                return _c(
                                  "competition-tile",
                                  {
                                    key: competition.id,
                                    class: {
                                      "competition-tile--with-banners": _vm.isRegistered(
                                        competition
                                      )
                                    },
                                    attrs: { competition: competition }
                                  },
                                  [
                                    _vm.isRegistered(competition)
                                      ? _c(
                                          "div",
                                          {
                                            staticClass:
                                              "competition-tile__banners",
                                            attrs: { slot: "banners" },
                                            slot: "banners"
                                          },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "competition-tile-banner competition-tile-banner--registered"
                                              },
                                              [
                                                _vm._v(
                                                  "\n                                Registered\n                            "
                                                )
                                              ]
                                            )
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("competition-registration-cta", {
                                      staticClass: "competition-tile__drawer",
                                      attrs: {
                                        slot: "drawer",
                                        competition: competition
                                      },
                                      slot: "drawer"
                                    })
                                  ],
                                  1
                                )
                              })
                            ],
                            2
                          )
                    ],
                    1
                  )
                ]
              ),
          _vm._v(" "),
          _vm.show_pagination
            ? _c("div", { staticClass: "pagination-footer" }, [
                _c(
                  "div",
                  { staticClass: "grid-container" },
                  [
                    _c("pagination", {
                      ref: "pagination",
                      attrs: { paginated_items: _vm.paginated_items },
                      on: { "page-changed": _vm.handleActivePageChange }
                    })
                  ],
                  1
                )
              ])
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647& ***!
  \******************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "select-team-list" },
    _vm._l(_vm.teams, function(team) {
      return _c(
        "div",
        {
          key: team.id,
          staticClass: "card select-team-card",
          class: {
            "select-team-card--no-level": !team.level
          }
        },
        [
          _c("div", { staticClass: "select-team-card__content" }, [
            _c("div", { staticClass: "select-team-card__data" }, [
              _c("h3", { staticClass: "select-team-card__title" }, [
                _vm._v(
                  "\n                    " +
                    _vm._s(team.name) +
                    "\n                "
                )
              ]),
              _vm._v(" "),
              team.level
                ? _c("h4", { staticClass: "select-team-card__level" }, [
                    _vm._v(
                      "\n                    " +
                        _vm._s(team.level) +
                        "\n                "
                    )
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c(
                "ul",
                { staticClass: "select-team-card__data-list label-list" },
                [
                  _c("li", [
                    _c("span", { staticClass: "label-list__label" }, [
                      _vm._v(
                        "\n                            Member:\n                        "
                      )
                    ]),
                    _vm._v(" "),
                    _c("span", [
                      _vm._v(
                        "\n                            #" +
                          _vm._s(team.member_number) +
                          "\n                        "
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("li", [
                    _c("span", { staticClass: "label-list__label" }, [
                      _vm._v(
                        "\n                            Membership End Date:\n                        "
                      )
                    ]),
                    _vm._v(" "),
                    _c("span", [
                      _vm._v(
                        "\n                            " +
                          _vm._s(
                            team.membership_status.validity_date_formatted
                          ) +
                          "\n                            "
                      ),
                      !team.membership_status.active
                        ? _c("span", { staticClass: "text--error" }, [
                            _vm._v("Expired")
                          ])
                        : _vm._e()
                    ])
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "select-team-card__cta" },
              [
                team.is_selectable
                  ? _vm._t(
                      "button",
                      [
                        _c(
                          "button",
                          {
                            staticClass:
                              "button button--block button--info button--block",
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                $event.stopPropagation()
                                _vm.selectTeam(team)
                              }
                            }
                          },
                          [
                            _vm._t(
                              "button-text",
                              [
                                _vm._v(
                                  "\n                            Select\n                        "
                                )
                              ],
                              { team: team }
                            )
                          ],
                          2
                        )
                      ],
                      { team: team }
                    )
                  : _c(
                      "span",
                      {
                        staticClass:
                          "member-result-notice member-result-notice--alert"
                      },
                      [
                        _c(
                          "span",
                          { staticClass: "member-result-notice__icon" },
                          [_vm._v(" ")]
                        ),
                        _vm._v(" "),
                        team.not_selectable_reason && team.not_selectable_link
                          ? _c(
                              "a",
                              {
                                staticClass: "member-result-notice__text",
                                attrs: {
                                  href: team.not_selectable_link,
                                  target: "_blank",
                                  rel: "noreferrer noopener"
                                }
                              },
                              [_vm._v(_vm._s(team.not_selectable_reason))]
                            )
                          : team.not_selectable_reason
                          ? _c(
                              "span",
                              { staticClass: "member-result-notice__text" },
                              [_vm._v(_vm._s(team.not_selectable_reason))]
                            )
                          : _vm._e()
                      ]
                    )
              ],
              2
            )
          ])
        ]
      )
    })
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/ProgressBar.vue?vue&type=template&id=70fb958a&":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/js/components/ProgressBar.vue?vue&type=template&id=70fb958a& ***!
  \********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "progress-bar" }, [
    _c("div", { staticClass: "progress-bar__bar" }, [
      _c("span", { staticClass: "progress-bar__track" }, [_vm._v(" ")]),
      _vm._v(" "),
      _c(
        "span",
        {
          staticClass: "progress-bar__progress",
          style: { width: _vm.completed_progress_percent + "%" }
        },
        [_vm._v(" ")]
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "progress-bar__steps" }, [
      _vm._v(
        "\n\t\t" +
          _vm._s(_vm.active_step_number) +
          "/" +
          _vm._s(_vm.available_step_count) +
          "\n\t"
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue":
/*!********************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistration_vue_vue_type_template_id_21d28be2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistration.vue?vue&type=template&id=21d28be2& */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=template&id=21d28be2&");
/* harmony import */ var _TeamRegistration_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistration.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistration_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistration_vue_vue_type_template_id_21d28be2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistration_vue_vue_type_template_id_21d28be2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistration_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistration.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistration_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=template&id=21d28be2&":
/*!***************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=template&id=21d28be2& ***!
  \***************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistration_vue_vue_type_template_id_21d28be2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistration.vue?vue&type=template&id=21d28be2& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue?vue&type=template&id=21d28be2&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistration_vue_vue_type_template_id_21d28be2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistration_vue_vue_type_template_id_21d28be2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts":
/*!*****************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts ***!
  \*****************************************************************************************/
/*! exports provided: TeamRegistrationApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationApiService", function() { return TeamRegistrationApiService; });
/* harmony import */ var _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/AbstractAPIService */ "./src/js/services/AbstractAPIService.ts");
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../config/AppConfig */ "./src/js/config/AppConfig.ts");
/* harmony import */ var _TeamRegistrationApiTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamRegistrationApiTransformer */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiTransformer.ts");
/* harmony import */ var _TeamsCompetitionRegistrationApiService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../TeamsCompetitionRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var TeamRegistrationApiService = /** @class */ (function (_super) {
    __extends(TeamRegistrationApiService, _super);
    function TeamRegistrationApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamRegistrationApiService.fetchTeamRegistrationShell = function () {
        var team_id = TeamRegistrationApiService.getActiveTeamId();
        var competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        var url = "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/shell";
        return this.fetchAndTransformResponse({
            url: url,
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _TeamRegistrationApiTransformer__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationApiTransformer"].transformFetchShellApiResponse(response);
            },
            /**
             * Validate the response
             */
            validateResponse: function (response) {
                if (!response.team) {
                    console.error('team information not provided in response');
                    return false;
                }
                if (!response.competition) {
                    console.error('competition information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    /**
     * Fetch data for the team verification page
     */
    TeamRegistrationApiService.fetchTeamVerification = function () {
        var team_id = TeamRegistrationApiService.getActiveTeamId();
        var competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        var url = "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id;
        return this.fetchAndTransformResponse({
            url: url,
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _TeamRegistrationApiTransformer__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationApiTransformer"].transformFetchTeamVerification(response);
            },
            /**
             * Validate the response
             */
            validateResponse: function (response) {
                if (!response.team_profile) {
                    console.error('team profile information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    /**
     * Update the current team's name
     */
    TeamRegistrationApiService.updateTeamName = function (payload) {
        var api_payload = {
            name: payload.team_name
        };
        var error_message = 'Error updating team name.';
        var method = 'put';
        var team_id = payload.team_id;
        var competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        var url = "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id;
        return this.submitForAPISubmissionResponse({
            error_message: error_message,
            method: method,
            payload: api_payload,
            url: url
        });
    };
    /**
     * Fetch data for the registration overview page
     */
    TeamRegistrationApiService.fetchRegistrationOverview = function () {
        var team_id = TeamRegistrationApiService.getActiveTeamId();
        var competition_id = TeamRegistrationApiService.getActiveCompetitionId();
        var url = "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/registration-overview";
        return this.fetchAndTransformResponse({
            url: url,
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _TeamRegistrationApiTransformer__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationApiTransformer"].transformFetchRegistrationOverview(response);
            },
            /**
             * Validate the response
             */
            validateResponse: function (response) {
                if (!response.registration_information) {
                    console.error('registration information not provided in response');
                    return false;
                }
                if (!response.rulebook_year) {
                    console.error('rulebook year not provided in response');
                    return false;
                }
                if (!response.price_information) {
                    console.error('price information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    /**
     * Get the active Team ID from a cookie value
     */
    TeamRegistrationApiService.getActiveTeamId = function () {
        return _TeamsCompetitionRegistrationApiService__WEBPACK_IMPORTED_MODULE_3__["TeamsCompetitionRegistrationApiService"].getActiveTeamId();
    };
    /**
     * Get the active Competition ID from a cookie value
     */
    TeamRegistrationApiService.getActiveCompetitionId = function () {
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].getValueFromCookie(_config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME"], 'team registration competition ID');
    };
    return TeamRegistrationApiService;
}(_services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiTransformer.ts":
/*!*********************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiTransformer.ts ***!
  \*********************************************************************************************/
/*! exports provided: TeamRegistrationApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationApiTransformer", function() { return TeamRegistrationApiTransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_models */ "./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts");

var TeamRegistrationApiTransformer = /** @class */ (function () {
    function TeamRegistrationApiTransformer() {
    }
    TeamRegistrationApiTransformer.transformFetchShellApiResponse = function (data) {
        return {
            team: new _models__WEBPACK_IMPORTED_MODULE_0__["TeamSummary"](data.team),
            competition: new _models__WEBPACK_IMPORTED_MODULE_0__["CompetitionSummary"](data.competition)
        };
    };
    /**
     * Transform the fetch team verification response
     */
    TeamRegistrationApiTransformer.transformFetchTeamVerification = function (data) {
        return {
            team_profile: TeamRegistrationApiTransformer.transformTeamProfile(data.team_profile)
        };
    };
    /**
     * Transform registration overview information
     */
    TeamRegistrationApiTransformer.transformFetchRegistrationOverview = function (response) {
        var overview_data = response;
        var params = {
            /**
             * Map items to ensure anchors open in a new tab
             */
            registration_information: overview_data.registration_information.map(function (item) {
                var div = document.createElement('div');
                div.innerHTML = item;
                var anchors = div.querySelectorAll('a');
                for (var i = 0; i < anchors.length; i++) {
                    var anchor = anchors[i];
                    anchor.setAttribute('target', '_blank');
                    anchor.setAttribute('rel', 'noopener noreferrer');
                }
                return div.innerHTML;
            }),
            rulebook_year: overview_data.rulebook_year,
            pricing_tables: response.price_information.slice()
        };
        return { overview: new _models__WEBPACK_IMPORTED_MODULE_0__["RegistrationOverview"](params) };
    };
    /**
     * Transform team profile information
     */
    TeamRegistrationApiTransformer.transformTeamProfile = function (team_profile) {
        return new _models__WEBPACK_IMPORTED_MODULE_0__["TeamProfile"]({
            id: team_profile.id,
            club: team_profile.club,
            level: team_profile.level,
            member_number: team_profile.member_number,
            membership_end_date: team_profile.membership_status.validity_date_formatted,
            membership_expired: !team_profile.membership_status.active,
            name: team_profile.name,
            section: team_profile.section || null
        });
    };
    return TeamRegistrationApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationConfig.ts":
/*!*************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationConfig.ts ***!
  \*************************************************************************************/
/*! exports provided: TEAM_REGISTRATION_STEPS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEAM_REGISTRATION_STEPS", function() { return TEAM_REGISTRATION_STEPS; });
var TEAM_REGISTRATION_STEPS = {
    team_verification: 'team-registration-team-verification',
    overview: 'team-registration-registration-overview',
    event_selection: 'team-registration-event-selection',
    roster: 'team-registration-competition-roster',
    coaches: 'team-registration-coaches',
    team_service_personnel: 'team-registration-team-service-personnel',
    prop_crew: 'team-registration-prop-crew'
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationState.ts":
/*!************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationState.ts ***!
  \************************************************************************************/
/*! exports provided: State, TeamRegistrationState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationState", function() { return TeamRegistrationState; });
/* harmony import */ var _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts");
/* harmony import */ var _TeamRegistrationConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationConfig */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationConfig.ts");
/* harmony import */ var _store_TeamRegistrationEventSelectionState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_store/TeamRegistrationEventSelectionState */ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationEventSelectionState.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};



var State = /** @class */ (function () {
    function State() {
        /**
         * Summary workflow-wide information about the active competition
         */
        this.active_competition_summary = null;
        /**
         * Profile information for active team
         */
        this.active_team_profile = null;
        /**
         * Summary workflow-wide information about the active team
         */
        this.active_team_summary = null;
        /**
         * The index for the active step in the process
         */
        this.active_step_index = 0;
        /**
         * The configuration for steps for the workflow
         */
        this.active_step_config = __assign({}, _TeamRegistrationConfig__WEBPACK_IMPORTED_MODULE_1__["TEAM_REGISTRATION_STEPS"]);
        /**
         * The current registration overview information
         */
        this.registration_overview = null;
    }
    return State;
}());

var actions = {
    /**
     * Advance a step in the process
     */
    advance: function (context) {
        var current_step_index = context.state.active_step_index;
        var total_steps = context.getters.step_keys.length;
        if (current_step_index == total_steps - 1) {
            var active_competition_summary = context.state.active_competition_summary;
            if (!active_competition_summary) {
                throw 'unable to parse cart link';
            }
            location.assign(active_competition_summary.links.cart);
            return;
        }
        context.commit('setActiveStepIndex', current_step_index + 1);
    },
    /**
     * Initialize the workflow following shell fetch
     */
    initialize: function (_a) {
        var state = _a.state, commit = _a.commit, getters = _a.getters;
        var default_step_config = __assign({}, _TeamRegistrationConfig__WEBPACK_IMPORTED_MODULE_1__["TEAM_REGISTRATION_STEPS"]);
        var active_team_summary = state.active_team_summary;
        if (!active_team_summary) {
            throw 'team summary not configured';
        }
        if (!active_team_summary.has_prop_crew) {
            delete default_step_config.prop_crew;
        }
        commit('setStepConfig', default_step_config);
        var step_keys = getters.step_keys;
        var initial_index = step_keys.indexOf(active_team_summary.initial_page);
        commit('setActiveStepIndex', initial_index);
    },
    /**
     * Fetch information for the event selection page
     */
    fetchEventSelection: function (context) {
        if (!this.state.team_registration.event_selection) {
            this.registerModule(['team_registration', 'event_selection'], _store_TeamRegistrationEventSelectionState__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationEventSelectionState"]);
        }
        return new Promise(function (resolve, reject) {
            context.dispatch('team_registration/event_selection/fetch', null, { root: true })
                .then(function () {
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch information for the team verification page
     */
    fetchTeamVerification: function (_a) {
        var commit = _a.commit;
        return new Promise(function (resolve, reject) {
            _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationApiService"].fetchTeamVerification()
                .then(function (response) {
                commit('setActiveTeamProfile', response.team_profile);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch information for the registration overview page
     */
    fetchRegistrationOverview: function (_a) {
        var commit = _a.commit;
        return new Promise(function (resolve, reject) {
            _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationApiService"].fetchRegistrationOverview()
                .then(function (response) {
                commit('setRegistrationOverview', response.overview);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Load registration app shell
     */
    loadShell: function (context) {
        return new Promise(function (resolve, reject) {
            _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationApiService"].fetchTeamRegistrationShell()
                .then(function (response) {
                context.commit('setActiveTeamSummary', response.team);
                context.dispatch('initialize');
                context.commit('setActiveCompetitionSummary', response.competition);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Retreat a step in the process
     */
    retreat: function (context) {
        context.commit('setActiveStepIndex', context.state.active_step_index - 1);
    },
    /**
     * Update the team's name
     */
    updateTeamName: function (context, payload) {
        return new Promise(function (resolve, reject) {
            _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationApiService"].updateTeamName(payload)
                .then(function () {
                context.commit('setTeamName', payload.team_name);
                resolve();
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    }
};
var getters = {
    /**
     * The key for the active step's component
     */
    active_step_component: function (state, getters) {
        return getters.step_components[state.active_step_index];
    },
    /**
     * Source data for the registration heading
     */
    registration_heading_source: function (state) {
        var competition = null;
        if (state.active_competition_summary) {
            competition = {
                id: state.active_competition_summary.id,
                name: state.active_competition_summary.name,
                icon: state.active_competition_summary.icon,
                start_date_pretty: state.active_competition_summary.start_date_pretty,
                end_date_pretty: state.active_competition_summary.end_date_pretty,
                directions: [],
                announcement_url: null,
                website_url: null
            };
        }
        var team = null;
        if (state.active_team_summary) {
            team = state.active_team_summary.summary_name;
        }
        if (competition || team) {
            return {
                competition: competition,
                team: team
            };
        }
        return null;
    },
    /**
     * The step components for active workflow
     */
    step_components: function (state) {
        var result = [];
        var source = state.active_step_config;
        for (var i in source) {
            if (Object.prototype.hasOwnProperty.call(source, i)) {
                result.push(source[i]);
            }
        }
        return result;
    },
    /**
     * The step keys for active workflow
     */
    step_keys: function (state) {
        var result = [];
        var source = state.active_step_config;
        for (var i in source) {
            if (Object.prototype.hasOwnProperty.call(source, i)) {
                result.push(i);
            }
        }
        return result;
    }
};
var mutations = {
    /**
     * Set the active competition summary in state
     */
    setActiveCompetitionSummary: function (state, payload) {
        state.active_competition_summary = payload;
    },
    /**
     * Set the index of the active step in state
     */
    setActiveStepIndex: function (state, payload) {
        state.active_step_index = payload;
    },
    /**
     * Set the active team profile in state
     */
    setActiveTeamProfile: function (state, payload) {
        state.active_team_profile = payload;
    },
    /**
     * Set the active team summary in state
     */
    setActiveTeamSummary: function (state, payload) {
        state.active_team_summary = payload;
    },
    /**
     * Set the registration overview in state
     */
    setRegistrationOverview: function (state, payload) {
        state.registration_overview = payload;
    },
    /**
     * Set the active step config in state
     */
    setStepConfig: function (state, payload) {
        state.active_step_config = payload;
    },
    /**
     * Set the active team's name in state
     */
    setTeamName: function (state, payload) {
        if (state.active_team_profile) {
            state.active_team_profile.name = payload;
        }
        if (state.active_team_summary) {
            state.active_team_summary.name = payload;
        }
    }
};
var TeamRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue":
/*!******************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EventSelection_vue_vue_type_template_id_921e4a76___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventSelection.vue?vue&type=template&id=921e4a76& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=template&id=921e4a76&");
/* harmony import */ var _EventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventSelection.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _EventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _EventSelection_vue_vue_type_template_id_921e4a76___WEBPACK_IMPORTED_MODULE_0__["render"],
  _EventSelection_vue_vue_type_template_id_921e4a76___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_EventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./EventSelection.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_EventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=template&id=921e4a76&":
/*!*************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=template&id=921e4a76& ***!
  \*************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EventSelection_vue_vue_type_template_id_921e4a76___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./EventSelection.vue?vue&type=template&id=921e4a76& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue?vue&type=template&id=921e4a76&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EventSelection_vue_vue_type_template_id_921e4a76___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EventSelection_vue_vue_type_template_id_921e4a76___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue":
/*!*******************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue ***!
  \*******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationEventSelectionEventCard_vue_vue_type_template_id_5118ed1f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f&");
/* harmony import */ var _TeamRegistrationEventSelectionEventCard_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationEventSelectionEventCard_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationEventSelectionEventCard_vue_vue_type_template_id_5118ed1f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationEventSelectionEventCard_vue_vue_type_template_id_5118ed1f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelectionEventCard_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelectionEventCard_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f&":
/*!**************************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f& ***!
  \**************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelectionEventCard_vue_vue_type_template_id_5118ed1f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue?vue&type=template&id=5118ed1f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelectionEventCard_vue_vue_type_template_id_5118ed1f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelectionEventCard_vue_vue_type_template_id_5118ed1f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue":
/*!**************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationHeader_vue_vue_type_template_id_0abf5d16___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16&");
/* harmony import */ var _TeamRegistrationHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationHeader.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationHeader_vue_vue_type_template_id_0abf5d16___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationHeader_vue_vue_type_template_id_0abf5d16___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=script&lang=ts&":
/*!***************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=script&lang=ts& ***!
  \***************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationHeader.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationHeader_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16& ***!
  \*********************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationHeader_vue_vue_type_template_id_0abf5d16___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue?vue&type=template&id=0abf5d16&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationHeader_vue_vue_type_template_id_0abf5d16___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationHeader_vue_vue_type_template_id_0abf5d16___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue":
/*!**********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationPageNavigation_vue_vue_type_template_id_4eca708c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c&");
/* harmony import */ var _TeamRegistrationPageNavigation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationPageNavigation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationPageNavigation_vue_vue_type_template_id_4eca708c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationPageNavigation_vue_vue_type_template_id_4eca708c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPageNavigation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPageNavigation_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c&":
/*!*****************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c& ***!
  \*****************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPageNavigation_vue_vue_type_template_id_4eca708c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue?vue&type=template&id=4eca708c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPageNavigation_vue_vue_type_template_id_4eca708c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPageNavigation_vue_vue_type_template_id_4eca708c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue":
/*!********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationPricingTable_vue_vue_type_template_id_2c0bb3f1___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1&");
/* harmony import */ var _TeamRegistrationPricingTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationPricingTable.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationPricingTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationPricingTable_vue_vue_type_template_id_2c0bb3f1___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationPricingTable_vue_vue_type_template_id_2c0bb3f1___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPricingTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationPricingTable.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPricingTable_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1&":
/*!***************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1& ***!
  \***************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPricingTable_vue_vue_type_template_id_2c0bb3f1___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPricingTable.vue?vue&type=template&id=2c0bb3f1&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPricingTable_vue_vue_type_template_id_2c0bb3f1___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPricingTable_vue_vue_type_template_id_2c0bb3f1___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue":
/*!*******************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationProgressBar_vue_vue_type_template_id_7297ee6d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d&");
/* harmony import */ var _TeamRegistrationProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationProgressBar.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationProgressBar_vue_vue_type_template_id_7297ee6d___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationProgressBar_vue_vue_type_template_id_7297ee6d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationProgressBar.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d&":
/*!**************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d& ***!
  \**************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationProgressBar_vue_vue_type_template_id_7297ee6d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue?vue&type=template&id=7297ee6d&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationProgressBar_vue_vue_type_template_id_7297ee6d___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationProgressBar_vue_vue_type_template_id_7297ee6d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue":
/*!******************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationRosterEdit_vue_vue_type_template_id_390a993e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e&");
/* harmony import */ var _TeamRegistrationRosterEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationRosterEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationRosterEdit_vue_vue_type_template_id_390a993e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationRosterEdit_vue_vue_type_template_id_390a993e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts&":
/*!*******************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts& ***!
  \*******************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterEdit_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e&":
/*!*************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e& ***!
  \*************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterEdit_vue_vue_type_template_id_390a993e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue?vue&type=template&id=390a993e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterEdit_vue_vue_type_template_id_390a993e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterEdit_vue_vue_type_template_id_390a993e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue":
/*!************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue ***!
  \************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationRosterReviewList_vue_vue_type_template_id_ba0d5f6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c&");
/* harmony import */ var _TeamRegistrationRosterReviewList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationRosterReviewList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationRosterReviewList_vue_vue_type_template_id_ba0d5f6c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationRosterReviewList_vue_vue_type_template_id_ba0d5f6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterReviewList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterReviewList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c&":
/*!*******************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c& ***!
  \*******************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterReviewList_vue_vue_type_template_id_ba0d5f6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue?vue&type=template&id=ba0d5f6c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterReviewList_vue_vue_type_template_id_ba0d5f6c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterReviewList_vue_vue_type_template_id_ba0d5f6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue":
/*!*********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationRosterSummary_vue_vue_type_template_id_52d65422___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422&");
/* harmony import */ var _TeamRegistrationRosterSummary_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationRosterSummary_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationRosterSummary_vue_vue_type_template_id_52d65422___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationRosterSummary_vue_vue_type_template_id_52d65422___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts&":
/*!**********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts& ***!
  \**********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterSummary_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterSummary_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422&":
/*!****************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422& ***!
  \****************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterSummary_vue_vue_type_template_id_52d65422___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue?vue&type=template&id=52d65422&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterSummary_vue_vue_type_template_id_52d65422___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRosterSummary_vue_vue_type_template_id_52d65422___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue":
/*!*******************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TotalMemberCost_vue_vue_type_template_id_acecd170___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TotalMemberCost.vue?vue&type=template&id=acecd170& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=template&id=acecd170&");
/* harmony import */ var _TotalMemberCost_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TotalMemberCost.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TotalMemberCost_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TotalMemberCost_vue_vue_type_template_id_acecd170___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TotalMemberCost_vue_vue_type_template_id_acecd170___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TotalMemberCost_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TotalMemberCost.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TotalMemberCost_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=template&id=acecd170&":
/*!**************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=template&id=acecd170& ***!
  \**************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TotalMemberCost_vue_vue_type_template_id_acecd170___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TotalMemberCost.vue?vue&type=template&id=acecd170& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue?vue&type=template&id=acecd170&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TotalMemberCost_vue_vue_type_template_id_acecd170___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TotalMemberCost_vue_vue_type_template_id_acecd170___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_components/index.ts":
/*!********************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_components/index.ts ***!
  \********************************************************************************/
/*! exports provided: TeamRegistrationHeader, TeamRegistrationProgressBar, TeamRegistrationPageNavigation, TeamRegistrationEventSelectionEventCard, EventSelection, TeamRegistrationRosterSummary, TotalMemberCost, TeamRegistrationRosterReviewList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationHeader_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationHeader.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationHeader.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationHeader", function() { return _TeamRegistrationHeader_vue__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _TeamRegistrationProgressBar_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationProgressBar.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationProgressBar.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationProgressBar", function() { return _TeamRegistrationProgressBar_vue__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _TeamRegistrationPageNavigation_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamRegistrationPageNavigation.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationPageNavigation.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationPageNavigation", function() { return _TeamRegistrationPageNavigation_vue__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _TeamRegistrationEventSelectionEventCard_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TeamRegistrationEventSelectionEventCard.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationEventSelectionEventCard.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationEventSelectionEventCard", function() { return _TeamRegistrationEventSelectionEventCard_vue__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _EventSelection_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EventSelection.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/EventSelection.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EventSelection", function() { return _EventSelection_vue__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _TeamRegistrationRosterSummary_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TeamRegistrationRosterSummary.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterSummary.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationRosterSummary", function() { return _TeamRegistrationRosterSummary_vue__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _TotalMemberCost_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TotalMemberCost.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TotalMemberCost.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TotalMemberCost", function() { return _TotalMemberCost_vue__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _TeamRegistrationRosterReviewList_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TeamRegistrationRosterReviewList.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterReviewList.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationRosterReviewList", function() { return _TeamRegistrationRosterReviewList_vue__WEBPACK_IMPORTED_MODULE_7__["default"]; });











/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationPersonnelPageMixin.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationPersonnelPageMixin.ts ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_components/TeamRegistrationRosterEdit.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_components/TeamRegistrationRosterEdit.vue");
/* harmony import */ var _services_TeamRegistrationRosterService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/TeamRegistrationRosterService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationRosterService.ts");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};



/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_2__["default"].extend({
    components: {
        TeamRegistrationRosterEdit: _components_TeamRegistrationRosterEdit_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * Data dependencies for the component
             */
            dependencies: {
                entities: false
            },
            /**
             * Whether the edit component is active
             */
            edit_active: false,
            /**
             * Key to access state module
             */
            state_key: '',
            /**
             * State module to register for page component
             */
            state_module: {}
        };
    },
    computed: {
        /**
         * The currently selected list of entities
         */
        active_entity_list: function () {
            return _services_TeamRegistrationRosterService__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationRosterService"].rosterFromIds(this.available_entity_list, this.current_roster_ids);
        },
        /**
         * The full list of entities associated with the team
         */
        available_entity_list: function () {
            return this.$store.state.team_registration[this.state_key].team_roster;
        },
        /**
         * The name of the current action on the list
         */
        current_action: function () {
            return this.roster_exists ? 'Edit' : 'Add';
        },
        /**
         * The IDs of the skaters in the current competition roster
         */
        current_roster_ids: function () {
            return this.$store.state.team_registration[this.state_key].selected_roster_ids;
        },
        /**
         * Attribute binding for roster edit component
         */
        edit_binding: function () {
            return __assign({}, this.summary_binding, { confirm_label: 'Confirm Team Personnel', confirm_method: this.confirmRoster, subtitle: this.team_summary_name, title: this.current_action + " Team Personnel" }, this.edit_binding_override);
        },
        /**
         * Unique overrides for edit binding
         */
        edit_binding_override: function () {
            return {};
        },
        /**
         * The maximum roster size for the competition
         */
        maximum_roster_size: function () {
            return this.$store.state.team_registration[this.state_key].roster_maximum;
        },
        /**
         * Whether a roster has been selected
         */
        roster_exists: function () {
            return !!this.current_roster_ids.length;
        },
        /**
         * Attribute binding for roster summary component
         */
        summary_binding: function () {
            return __assign({ available_roster: this.available_entity_list, maximum_size: this.maximum_roster_size, member_type_descriptor: {
                    singular: 'Team Personnel',
                    plural: 'Team Personnel'
                }, minimum_size: null, per_member_fee: null, selected_roster_ids: this.current_roster_ids, show_secondary_messaging: false, summary_label: 'Team Personnel' }, this.summary_binding_override);
        },
        /**
         * Unique overrides for summary binding
         */
        summary_binding_override: function () {
            return {};
        },
        /**
         * The summary name for the current team
         */
        team_summary_name: function () {
            var team_summary = this.$store.state.team_registration.active_team_summary;
            return team_summary ? team_summary.summary_name : null;
        },
        /**
         * The list of selected ids to validate
         */
        _active_roster_ids: function () {
            return this.current_roster_ids;
        },
        /**
         * The full available roster list
         */
        _available_roster: function () {
            return this.available_entity_list;
        },
        /**
         * The active maximum roster size
         */
        _maximum_roster_size: function () {
            return this.maximum_roster_size;
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function () {
            return null;
        }
    },
    created: function () {
        if (!this.$store.state.team_registration[this.state_key]) {
            this.$store.registerModule(['team_registration', this.state_key], this.state_module);
        }
    },
    methods: {
        /**
         * Perform the action to confirm/save the current selections
         */
        confirmRoster: function (ids) {
            return this.$store.dispatch("team_registration/" + this.state_key + "/update", ids);
        },
        /**
         * Load data for page
         */
        loadData: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.$store.dispatch("team_registration/" + _this.state_key + "/fetch")
                    .then(function () {
                    _this.dependencies.entities = true;
                    resolve();
                })
                    .catch(function () {
                    reject();
                });
            });
        }
    }
}));


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts":
/*!***************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_mixins/TeamRegistrationSubpageMixin.ts ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        /**
         * Configuration for the back link
         */
        back_link_config: {
            type: Object,
            required: true
        },
        hide_retreat: {
            type: Boolean,
            default: false
        }
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            page_title: ''
        };
    },
    computed: {
        /**
         * Whether the advance button should be disabled
         */
        advance_disabled: function () {
            return false;
        },
        /**
         * Configuration for the page header
         */
        page_header: function () {
            return __assign({ title: this.page_title }, this.back_link_config);
        }
    },
    methods: {
        /**
         * Advance in the process
         */
        advance: function () {
            if (this.advance_disabled) {
                return;
            }
            this.$emit('advance');
        },
        /**
         * Retreat in the process
         */
        retreat: function () {
            this.$emit('retreat');
        }
    }
}));


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts":
/*!*******************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_mixins/ValidatesTeamRegistrationRosters.ts ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _services_TeamRegistrationRosterService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/TeamRegistrationRosterService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationRosterService.ts");


/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    computed: {
        /**
         * The size of the selected roster
         */
        current_roster_size: function () {
            return this._active_roster_ids.length;
        },
        /**
         * Whether the selected roster is incomplete
         */
        incomplete: function () {
            return !!this._minimum_roster_size && this.current_roster_size < this._minimum_roster_size;
        },
        /**
         * Whether the selected roster is invalid
         */
        invalid: function () {
            return !!this.invalid_reason;
        },
        /**
         * Reason selected roster is invalid
         */
        invalid_reason: function () {
            for (var i = 0; i < this.selected_roster.length; i++) {
                var selectedRosterElement = this.selected_roster[i];
                if (!selectedRosterElement.can_be_added_to_roster) {
                    var reason = selectedRosterElement.cannot_be_added_to_roster_reason;
                    if (reason && reason.toLowerCase()
                        .indexOf('ineligible') !== -1) {
                        return 'ineligible';
                    }
                    return 'invalid';
                }
            }
            return null;
        },
        /**
         * Whether the maximum roster size has been reached
         */
        maximum_reached: function () {
            return !!this._maximum_roster_size && this.current_roster_size >= this._maximum_roster_size;
        },
        /**
         * The roster corresponding with the current selections
         */
        selected_roster: function () {
            return _services_TeamRegistrationRosterService__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationRosterService"].rosterFromIds(this._available_roster, this._active_roster_ids);
        },
        /**
         * The full available roster list
         */
        _available_roster: function () {
            return [];
        },
        /**
         * The list of selected ids to validate
         */
        _active_roster_ids: function () {
            return [];
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function () {
            return null;
        },
        /**
         * The active maximum roster size
         */
        _maximum_roster_size: function () {
            return null;
        }
    }
}));


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts":
/*!*****************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts ***!
  \*****************************************************************************************/
/*! exports provided: AbstractTeamEntity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractTeamEntity", function() { return AbstractTeamEntity; });
var AbstractTeamEntity = /** @class */ (function () {
    function AbstractTeamEntity(params) {
        this.can_be_added_to_roster = params.can_be_added_to_roster;
        this.cannot_be_added_to_roster_reason = params.cannot_be_added_to_roster_reason;
        this.first_name = params.first_name;
        this.id = params.id;
        this.last_name = params.last_name;
        this.member_number = params.member_number;
    }
    return AbstractTeamEntity;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/CompetitionSummary.ts":
/*!*****************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/CompetitionSummary.ts ***!
  \*****************************************************************************************/
/*! exports provided: CompetitionSummary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompetitionSummary", function() { return CompetitionSummary; });
var CompetitionSummary = /** @class */ (function () {
    function CompetitionSummary(params) {
        this.id = params.id;
        this.name = params.name;
        this.icon = params.icon;
        this.start_date_pretty = params.start_date_pretty;
        this.end_date_pretty = params.end_date_pretty;
        this.links = params.links;
    }
    return CompetitionSummary;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/EventSelectionEvent.ts":
/*!******************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/EventSelectionEvent.ts ***!
  \******************************************************************************************/
/*! exports provided: EventSelectionEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventSelectionEvent", function() { return EventSelectionEvent; });
var EventSelectionEvent = /** @class */ (function () {
    function EventSelectionEvent(params) {
        // Extend interface for component; property unused in context
        this.category = 'Synchro';
        this.id = params.id;
        this.is_registered_for = params.is_registered_for;
        this.is_selected = params.is_selected;
        this.name = params.name;
        this.judging_system = params.judging_system;
        this.music_required = params.music_required;
        this.ppc_required = params.ppc_required;
    }
    Object.defineProperty(EventSelectionEvent.prototype, "additional_data", {
        get: function () {
            return [
                "Music: " + (this.music_required ? 'Required' : 'Not Required'),
                "PPC: " + (this.ppc_required ? 'Required' : 'Not Required')
            ];
        },
        enumerable: true,
        configurable: true
    });
    return EventSelectionEvent;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/PropCrewMember.ts":
/*!*************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/PropCrewMember.ts ***!
  \*************************************************************************************/
/*! exports provided: PropCrewMember */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PropCrewMember", function() { return PropCrewMember; });
/* harmony import */ var _AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractTeamEntity */ "./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var PropCrewMember = /** @class */ (function (_super) {
    __extends(PropCrewMember, _super);
    function PropCrewMember() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PropCrewMember.prototype, "supporting_information", {
        get: function () {
            return "(" + this.member_number + ")";
        },
        enumerable: true,
        configurable: true
    });
    return PropCrewMember;
}(_AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__["AbstractTeamEntity"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/RegistrationOverview.ts":
/*!*******************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/RegistrationOverview.ts ***!
  \*******************************************************************************************/
/*! exports provided: RegistrationOverview */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistrationOverview", function() { return RegistrationOverview; });
var RegistrationOverview = /** @class */ (function () {
    function RegistrationOverview(params) {
        this.registration_information = params.registration_information;
        this.rulebook_year = params.rulebook_year;
        this.pricing_tables = params.pricing_tables;
    }
    return RegistrationOverview;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamCoach.ts":
/*!********************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/TeamCoach.ts ***!
  \********************************************************************************/
/*! exports provided: TeamCoach */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamCoach", function() { return TeamCoach; });
/* harmony import */ var _AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractTeamEntity */ "./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var TeamCoach = /** @class */ (function (_super) {
    __extends(TeamCoach, _super);
    function TeamCoach() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TeamCoach.prototype, "supporting_information", {
        get: function () {
            return "(" + this.member_number + ")";
        },
        enumerable: true,
        configurable: true
    });
    return TeamCoach;
}(_AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__["AbstractTeamEntity"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamProfile.ts":
/*!**********************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/TeamProfile.ts ***!
  \**********************************************************************************/
/*! exports provided: TeamProfile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamProfile", function() { return TeamProfile; });
var TeamProfile = /** @class */ (function () {
    function TeamProfile(params) {
        this.id = params.id;
        this.club = params.club;
        this.level = params.level;
        this.member_number = params.member_number;
        this.membership_end_date = params.membership_end_date;
        this.membership_expired = params.membership_expired;
        this.name = params.name;
        this.section = params.section;
    }
    return TeamProfile;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamRosterMember.ts":
/*!***************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/TeamRosterMember.ts ***!
  \***************************************************************************************/
/*! exports provided: TeamRosterMember */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRosterMember", function() { return TeamRosterMember; });
/* harmony import */ var _AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractTeamEntity */ "./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var TeamRosterMember = /** @class */ (function (_super) {
    __extends(TeamRosterMember, _super);
    function TeamRosterMember(params) {
        var _this = _super.call(this, params) || this;
        _this.age = params.age;
        return _this;
    }
    Object.defineProperty(TeamRosterMember.prototype, "supporting_information", {
        get: function () {
            return "(" + this.member_number + ") Age:" + this.age;
        },
        enumerable: true,
        configurable: true
    });
    return TeamRosterMember;
}(_AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__["AbstractTeamEntity"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamServicePerson.ts":
/*!****************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/TeamServicePerson.ts ***!
  \****************************************************************************************/
/*! exports provided: TeamServicePerson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamServicePerson", function() { return TeamServicePerson; });
/* harmony import */ var _AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractTeamEntity */ "./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var TeamServicePerson = /** @class */ (function (_super) {
    __extends(TeamServicePerson, _super);
    function TeamServicePerson() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TeamServicePerson.prototype, "supporting_information", {
        get: function () {
            return "(" + this.member_number + ")";
        },
        enumerable: true,
        configurable: true
    });
    return TeamServicePerson;
}(_AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__["AbstractTeamEntity"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamSummary.ts":
/*!**********************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/TeamSummary.ts ***!
  \**********************************************************************************/
/*! exports provided: TeamSummary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamSummary", function() { return TeamSummary; });
var TeamSummary = /** @class */ (function () {
    function TeamSummary(params) {
        this.initial_page = 'team_verification';
        var name = params.name, level = params.level, has_prop_crew = params.has_prop_crew, initial_page = params.initial_page;
        this.name = name;
        this.level = level;
        this.has_prop_crew = has_prop_crew;
        if (initial_page) {
            this.initial_page = initial_page;
        }
    }
    Object.defineProperty(TeamSummary.prototype, "summary_name", {
        get: function () {
            return this.name + " - " + this.level;
        },
        enumerable: true,
        configurable: true
    });
    return TeamSummary;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts":
/*!****************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts ***!
  \****************************************************************************/
/*! exports provided: AbstractTeamEntity, CompetitionSummary, TeamSummary, RegistrationOverview, TeamProfile, EventSelectionEvent, TeamCoach, TeamServicePerson, PropCrewMember */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractTeamEntity */ "./src/js/Teams/CompetitionRegistration/Registration/_models/AbstractTeamEntity.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AbstractTeamEntity", function() { return _AbstractTeamEntity__WEBPACK_IMPORTED_MODULE_0__["AbstractTeamEntity"]; });

/* harmony import */ var _CompetitionSummary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CompetitionSummary */ "./src/js/Teams/CompetitionRegistration/Registration/_models/CompetitionSummary.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CompetitionSummary", function() { return _CompetitionSummary__WEBPACK_IMPORTED_MODULE_1__["CompetitionSummary"]; });

/* harmony import */ var _TeamSummary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamSummary */ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamSummary.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamSummary", function() { return _TeamSummary__WEBPACK_IMPORTED_MODULE_2__["TeamSummary"]; });

/* harmony import */ var _RegistrationOverview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RegistrationOverview */ "./src/js/Teams/CompetitionRegistration/Registration/_models/RegistrationOverview.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RegistrationOverview", function() { return _RegistrationOverview__WEBPACK_IMPORTED_MODULE_3__["RegistrationOverview"]; });

/* harmony import */ var _TeamProfile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TeamProfile */ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamProfile.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamProfile", function() { return _TeamProfile__WEBPACK_IMPORTED_MODULE_4__["TeamProfile"]; });

/* harmony import */ var _EventSelectionEvent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EventSelectionEvent */ "./src/js/Teams/CompetitionRegistration/Registration/_models/EventSelectionEvent.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EventSelectionEvent", function() { return _EventSelectionEvent__WEBPACK_IMPORTED_MODULE_5__["EventSelectionEvent"]; });

/* harmony import */ var _TeamCoach__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TeamCoach */ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamCoach.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamCoach", function() { return _TeamCoach__WEBPACK_IMPORTED_MODULE_6__["TeamCoach"]; });

/* harmony import */ var _TeamServicePerson__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TeamServicePerson */ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamServicePerson.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamServicePerson", function() { return _TeamServicePerson__WEBPACK_IMPORTED_MODULE_7__["TeamServicePerson"]; });

/* harmony import */ var _PropCrewMember__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./PropCrewMember */ "./src/js/Teams/CompetitionRegistration/Registration/_models/PropCrewMember.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PropCrewMember", function() { return _PropCrewMember__WEBPACK_IMPORTED_MODULE_8__["PropCrewMember"]; });












/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue":
/*!**********************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationCoaches_vue_vue_type_template_id_528b6041___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationCoaches.vue?vue&type=template&id=528b6041& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=template&id=528b6041&");
/* harmony import */ var _TeamRegistrationCoaches_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationCoaches.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationCoaches_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationCoaches_vue_vue_type_template_id_528b6041___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationCoaches_vue_vue_type_template_id_528b6041___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=script&lang=ts&":
/*!***********************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=script&lang=ts& ***!
  \***********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCoaches_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationCoaches.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCoaches_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=template&id=528b6041&":
/*!*****************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=template&id=528b6041& ***!
  \*****************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCoaches_vue_vue_type_template_id_528b6041___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationCoaches.vue?vue&type=template&id=528b6041& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue?vue&type=template&id=528b6041&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCoaches_vue_vue_type_template_id_528b6041___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCoaches_vue_vue_type_template_id_528b6041___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue":
/*!********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationCompetitionRoster_vue_vue_type_template_id_66874863___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863&");
/* harmony import */ var _TeamRegistrationCompetitionRoster_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationCompetitionRoster_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationCompetitionRoster_vue_vue_type_template_id_66874863___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationCompetitionRoster_vue_vue_type_template_id_66874863___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts& ***!
  \*********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCompetitionRoster_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCompetitionRoster_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863&":
/*!***************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863& ***!
  \***************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCompetitionRoster_vue_vue_type_template_id_66874863___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue?vue&type=template&id=66874863&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCompetitionRoster_vue_vue_type_template_id_66874863___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationCompetitionRoster_vue_vue_type_template_id_66874863___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue":
/*!*****************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationEventSelection_vue_vue_type_template_id_17ec77a9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9&");
/* harmony import */ var _TeamRegistrationEventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationEventSelection.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationEventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationEventSelection_vue_vue_type_template_id_17ec77a9___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationEventSelection_vue_vue_type_template_id_17ec77a9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=script&lang=ts&":
/*!******************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationEventSelection.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelection_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9&":
/*!************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9& ***!
  \************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelection_vue_vue_type_template_id_17ec77a9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue?vue&type=template&id=17ec77a9&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelection_vue_vue_type_template_id_17ec77a9___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationEventSelection_vue_vue_type_template_id_17ec77a9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue":
/*!***********************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationPropCrew_vue_vue_type_template_id_c590b58a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a&");
/* harmony import */ var _TeamRegistrationPropCrew_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationPropCrew.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationPropCrew_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationPropCrew_vue_vue_type_template_id_c590b58a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationPropCrew_vue_vue_type_template_id_c590b58a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPropCrew_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationPropCrew.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPropCrew_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a&":
/*!******************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a& ***!
  \******************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPropCrew_vue_vue_type_template_id_c590b58a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue?vue&type=template&id=c590b58a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPropCrew_vue_vue_type_template_id_c590b58a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationPropCrew_vue_vue_type_template_id_c590b58a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue":
/*!***********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationRegistrationOverview_vue_vue_type_template_id_de75bcae___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae&");
/* harmony import */ var _TeamRegistrationRegistrationOverview_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationRegistrationOverview_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationRegistrationOverview_vue_vue_type_template_id_de75bcae___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationRegistrationOverview_vue_vue_type_template_id_de75bcae___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRegistrationOverview_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRegistrationOverview_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae&":
/*!******************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae& ***!
  \******************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRegistrationOverview_vue_vue_type_template_id_de75bcae___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue?vue&type=template&id=de75bcae&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRegistrationOverview_vue_vue_type_template_id_de75bcae___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationRegistrationOverview_vue_vue_type_template_id_de75bcae___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue":
/*!***********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationTeamServicePersonnel_vue_vue_type_template_id_5c17c8bf___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf&");
/* harmony import */ var _TeamRegistrationTeamServicePersonnel_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationTeamServicePersonnel_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationTeamServicePersonnel_vue_vue_type_template_id_5c17c8bf___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationTeamServicePersonnel_vue_vue_type_template_id_5c17c8bf___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamServicePersonnel_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamServicePersonnel_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf&":
/*!******************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf& ***!
  \******************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamServicePersonnel_vue_vue_type_template_id_5c17c8bf___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue?vue&type=template&id=5c17c8bf&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamServicePersonnel_vue_vue_type_template_id_5c17c8bf___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamServicePersonnel_vue_vue_type_template_id_5c17c8bf___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue":
/*!*******************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationTeamVerification_vue_vue_type_template_id_077d4422___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422&");
/* harmony import */ var _TeamRegistrationTeamVerification_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamRegistrationTeamVerification_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamRegistrationTeamVerification_vue_vue_type_template_id_077d4422___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamRegistrationTeamVerification_vue_vue_type_template_id_077d4422___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts&":
/*!********************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts& ***!
  \********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamVerification_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/ts-loader??ref--5!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamVerification_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422&":
/*!**************************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422& ***!
  \**************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamVerification_vue_vue_type_template_id_077d4422___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue?vue&type=template&id=077d4422&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamVerification_vue_vue_type_template_id_077d4422___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamRegistrationTeamVerification_vue_vue_type_template_id_077d4422___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_pages/index.ts":
/*!***************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_pages/index.ts ***!
  \***************************************************************************/
/*! exports provided: TeamRegistrationCoaches, TeamRegistrationCompetitionRoster, TeamRegistrationEventSelection, TeamRegistrationPropCrew, TeamRegistrationRegistrationOverview, TeamRegistrationTeamVerification, TeamRegistrationTeamServicePersonnel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamRegistrationCoaches_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamRegistrationCoaches.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCoaches.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCoaches", function() { return _TeamRegistrationCoaches_vue__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _TeamRegistrationCompetitionRoster_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistrationCompetitionRoster.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationCompetitionRoster.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionRoster", function() { return _TeamRegistrationCompetitionRoster_vue__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _TeamRegistrationEventSelection_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamRegistrationEventSelection.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationEventSelection.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationEventSelection", function() { return _TeamRegistrationEventSelection_vue__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _TeamRegistrationPropCrew_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TeamRegistrationPropCrew.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationPropCrew.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationPropCrew", function() { return _TeamRegistrationPropCrew_vue__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _TeamRegistrationRegistrationOverview_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TeamRegistrationRegistrationOverview.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationRegistrationOverview.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationRegistrationOverview", function() { return _TeamRegistrationRegistrationOverview_vue__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _TeamRegistrationTeamVerification_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TeamRegistrationTeamVerification.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamVerification.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationTeamVerification", function() { return _TeamRegistrationTeamVerification_vue__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _TeamRegistrationTeamServicePersonnel_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TeamRegistrationTeamServicePersonnel.vue */ "./src/js/Teams/CompetitionRegistration/Registration/_pages/TeamRegistrationTeamServicePersonnel.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationTeamServicePersonnel", function() { return _TeamRegistrationTeamServicePersonnel_vue__WEBPACK_IMPORTED_MODULE_6__["default"]; });










/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationCoachesApiService.ts":
/*!**********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationCoachesApiService.ts ***!
  \**********************************************************************************************************/
/*! exports provided: TeamRegistrationCoachesApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCoachesApiService", function() { return TeamRegistrationCoachesApiService; });
/* harmony import */ var _transformers_TeamRegistrationCoachesApiTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_transformers/TeamRegistrationCoachesApiTransformer */ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCoachesApiTransformer.ts");
/* harmony import */ var _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TeamRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TeamRegistrationCoachesApiService = /** @class */ (function (_super) {
    __extends(TeamRegistrationCoachesApiService, _super);
    function TeamRegistrationCoachesApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamRegistrationCoachesApiService.fetchCoaches = function () {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationCoachesApiTransformer__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationCoachesApiTransformer"].transformFetchCoaches(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/coaches",
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response.team_coaches) {
                    console.error('Coach list not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    TeamRegistrationCoachesApiService.updateCoaches = function (selected_roster_ids) {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        var payload = selected_roster_ids.slice();
        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating coaches.',
            method: 'put',
            payload: payload,
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/coaches"
        });
    };
    return TeamRegistrationCoachesApiService;
}(_TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationApiService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationCompetitionRosterApiService.ts":
/*!********************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationCompetitionRosterApiService.ts ***!
  \********************************************************************************************************************/
/*! exports provided: TeamRegistrationCompetitionRosterApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionRosterApiService", function() { return TeamRegistrationCompetitionRosterApiService; });
/* harmony import */ var _transformers_TeamRegistrationCompetitionRosterApiTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_transformers/TeamRegistrationCompetitionRosterApiTransformer */ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCompetitionRosterApiTransformer.ts");
/* harmony import */ var _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TeamRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TeamRegistrationCompetitionRosterApiService = /** @class */ (function (_super) {
    __extends(TeamRegistrationCompetitionRosterApiService, _super);
    function TeamRegistrationCompetitionRosterApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamRegistrationCompetitionRosterApiService.fetchCompetitionRoster = function () {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationCompetitionRosterApiTransformer__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationCompetitionRosterApiTransformer"].transformFetchCompetitionRoster(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/competition-roster",
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response.team_roster) {
                    console.error('Roster information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    TeamRegistrationCompetitionRosterApiService.updateActiveEntityCompetitionRoster = function (selected_roster_ids) {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        var payload = selected_roster_ids.slice();
        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating roster.',
            method: 'put',
            payload: payload,
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/competition-roster"
        });
    };
    return TeamRegistrationCompetitionRosterApiService;
}(_TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationApiService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationEventSelectionApiService.ts":
/*!*****************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationEventSelectionApiService.ts ***!
  \*****************************************************************************************************************/
/*! exports provided: TeamRegistrationEventSelectionApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationEventSelectionApiService", function() { return TeamRegistrationEventSelectionApiService; });
/* harmony import */ var _transformers_TeamRegistrationEventSelectionApiTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_transformers/TeamRegistrationEventSelectionApiTransformer */ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationEventSelectionApiTransformer.ts");
/* harmony import */ var _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TeamRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TeamRegistrationEventSelectionApiService = /** @class */ (function (_super) {
    __extends(TeamRegistrationEventSelectionApiService, _super);
    function TeamRegistrationEventSelectionApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamRegistrationEventSelectionApiService.fetchEventSelection = function () {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationEventSelectionApiTransformer__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationEventSelectionApiTransformer"].transformFetchEventSelection(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/events",
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response.events) {
                    console.error('Events information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    /**
     * Remove an event
     */
    TeamRegistrationEventSelectionApiService.removeEvent = function (event_id) {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.submitWithTransformedResponse({
            payload: null,
            error_message: 'Error removing event.',
            method: 'delete',
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationEventSelectionApiTransformer__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationEventSelectionApiTransformer"].transformFetchEventSelection(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/events/" + event_id,
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response || !response.success) {
                    return false;
                }
                if (!response.events) {
                    console.error('Events information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    /**
     * Add an event
     */
    TeamRegistrationEventSelectionApiService.addEvent = function (event_id) {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.submitWithTransformedResponse({
            payload: null,
            error_message: 'Error adding event.',
            method: 'put',
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationEventSelectionApiTransformer__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationEventSelectionApiTransformer"].transformFetchEventSelection(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/events/" + event_id,
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response || !response.success) {
                    return false;
                }
                if (!response.events) {
                    console.error('Events information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    return TeamRegistrationEventSelectionApiService;
}(_TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationApiService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationPropCrewApiService.ts":
/*!***********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationPropCrewApiService.ts ***!
  \***********************************************************************************************************/
/*! exports provided: TeamRegistrationPropCrewApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationPropCrewApiService", function() { return TeamRegistrationPropCrewApiService; });
/* harmony import */ var _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TeamRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts");
/* harmony import */ var _transformers_TeamRegistrationPropCrewApiTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_transformers/TeamRegistrationPropCrewApiTransformer */ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationPropCrewApiTransformer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TeamRegistrationPropCrewApiService = /** @class */ (function (_super) {
    __extends(TeamRegistrationPropCrewApiService, _super);
    function TeamRegistrationPropCrewApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamRegistrationPropCrewApiService.fetchPropCrew = function () {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationPropCrewApiTransformer__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationPropCrewApiTransformer"].transformFetchPropCrew(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/prop-crew",
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response.prop_crew) {
                    console.error('Prop Crew list not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    TeamRegistrationPropCrewApiService.updatePropCrew = function (selected_roster_ids) {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        var payload = selected_roster_ids.slice();
        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating prop crew.',
            method: 'put',
            payload: payload,
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/prop-crew"
        });
    };
    return TeamRegistrationPropCrewApiService;
}(_TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationApiService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationRosterService.ts":
/*!******************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationRosterService.ts ***!
  \******************************************************************************************************/
/*! exports provided: TeamRegistrationRosterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationRosterService", function() { return TeamRegistrationRosterService; });
var TeamRegistrationRosterService = /** @class */ (function () {
    function TeamRegistrationRosterService() {
    }
    TeamRegistrationRosterService.rosterFromIds = function (roster, selected_ids) {
        return roster.filter(function (item) {
            return selected_ids.indexOf(item.id) !== -1;
        });
    };
    return TeamRegistrationRosterService;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationTeamServicePersonnelApiService.ts":
/*!***********************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationTeamServicePersonnelApiService.ts ***!
  \***********************************************************************************************************************/
/*! exports provided: TeamRegistrationTeamServicePersonnelApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationTeamServicePersonnelApiService", function() { return TeamRegistrationTeamServicePersonnelApiService; });
/* harmony import */ var _transformers_TeamRegistrationTeamServicePersonnelApiTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_transformers/TeamRegistrationTeamServicePersonnelApiTransformer */ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationTeamServicePersonnelApiTransformer.ts");
/* harmony import */ var _TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TeamRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistrationApiService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TeamRegistrationTeamServicePersonnelApiService = /** @class */ (function (_super) {
    __extends(TeamRegistrationTeamServicePersonnelApiService, _super);
    function TeamRegistrationTeamServicePersonnelApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamRegistrationTeamServicePersonnelApiService.fetchTeamServicePersonnel = function () {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        return this.fetchAndTransformResponse({
            /**
             * Transform API data to app data
             */
            transformResponse: function (response) {
                return _transformers_TeamRegistrationTeamServicePersonnelApiTransformer__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationTeamServicePersonnelApiTransformer"].transformFetchTeamServicePersonnel(response);
            },
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/team-service-personnel",
            /**
             * Validate response properties
             */
            validateResponse: function (response) {
                if (!response.team_service_personnel) {
                    console.error('Team Service Personnel list not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    TeamRegistrationTeamServicePersonnelApiService.updateTeamServicePersonnel = function (selected_roster_ids) {
        var competition_id = this.getActiveCompetitionId();
        var team_id = this.getActiveTeamId();
        var payload = selected_roster_ids.slice();
        return this.submitForAPISubmissionResponse({
            error_message: 'Error updating team service personnel.',
            method: 'put',
            payload: payload,
            url: "/api/competition-registration/competitions/" + competition_id + "/teams/" + team_id + "/team-service-personnel"
        });
    };
    return TeamRegistrationTeamServicePersonnelApiService;
}(_TeamRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__["TeamRegistrationApiService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionCoachesState.ts":
/*!*************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionCoachesState.ts ***!
  \*************************************************************************************************************/
/*! exports provided: State, TeamRegistrationCompetitionCoachesState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionCoachesState", function() { return TeamRegistrationCompetitionCoachesState; });
/* harmony import */ var _services_TeamRegistrationCoachesApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/TeamRegistrationCoachesApiService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationCoachesApiService.ts");

var State = /** @class */ (function () {
    function State() {
        this.team_roster = [];
        this.selected_roster_ids = [];
        this.roster_maximum = null;
    }
    return State;
}());

var actions = {
    fetch: function (context) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationCoachesApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationCoachesApiService"].fetchCoaches()
                .then(function (response) {
                context.commit('setTeamRoster', response.team_roster);
                context.commit('setSelectedRosterIds', response.selected_roster_ids);
                context.commit('setRosterMaximum', response.roster_maximum);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Update the competition roster for an entity
     */
    update: function (context, selected_roster_ids) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationCoachesApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationCoachesApiService"].updateCoaches(selected_roster_ids)
                .then(function () {
                context.commit('setSelectedRosterIds', selected_roster_ids);
                resolve();
            })
                .catch(function (message) {
                reject(message);
            });
        });
    }
};
var getters = {};
var mutations = {
    setTeamRoster: function (state, payload) {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload) {
        state.selected_roster_ids = payload;
    },
    setRosterMaximum: function (state, payload) {
        state.roster_maximum = payload;
    }
};
var TeamRegistrationCompetitionCoachesState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionPropCrewState.ts":
/*!**************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionPropCrewState.ts ***!
  \**************************************************************************************************************/
/*! exports provided: State, TeamRegistrationCompetitionPropCrewState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionPropCrewState", function() { return TeamRegistrationCompetitionPropCrewState; });
/* harmony import */ var _services_TeamRegistrationPropCrewApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/TeamRegistrationPropCrewApiService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationPropCrewApiService.ts");

var State = /** @class */ (function () {
    function State() {
        this.team_roster = [];
        this.selected_roster_ids = [];
        this.roster_maximum = null;
    }
    return State;
}());

var actions = {
    fetch: function (context) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationPropCrewApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationPropCrewApiService"].fetchPropCrew()
                .then(function (response) {
                context.commit('setTeamRoster', response.team_roster);
                context.commit('setSelectedRosterIds', response.selected_roster_ids);
                context.commit('setRosterMaximum', response.roster_maximum);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Update the competition roster for an entity
     */
    update: function (context, selected_roster_ids) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationPropCrewApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationPropCrewApiService"].updatePropCrew(selected_roster_ids)
                .then(function () {
                context.commit('setSelectedRosterIds', selected_roster_ids);
                resolve();
            })
                .catch(function (message) {
                reject(message);
            });
        });
    }
};
var getters = {};
var mutations = {
    setTeamRoster: function (state, payload) {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload) {
        state.selected_roster_ids = payload;
    },
    setRosterMaximum: function (state, payload) {
        state.roster_maximum = payload;
    }
};
var TeamRegistrationCompetitionPropCrewState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionRosterState.ts":
/*!************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionRosterState.ts ***!
  \************************************************************************************************************/
/*! exports provided: State, TeamRegistrationCompetitionRosterState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionRosterState", function() { return TeamRegistrationCompetitionRosterState; });
/* harmony import */ var _services_TeamRegistrationCompetitionRosterApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/TeamRegistrationCompetitionRosterApiService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationCompetitionRosterApiService.ts");

var State = /** @class */ (function () {
    function State() {
        this.team_roster = [];
        this.selected_roster_ids = [];
        this.roster_rules = [];
        this.per_skater_fee = null;
        this.roster_minimum = null;
        this.roster_maximum = null;
    }
    return State;
}());

var actions = {
    fetch: function (context) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationCompetitionRosterApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationCompetitionRosterApiService"].fetchCompetitionRoster()
                .then(function (response) {
                context.commit('setTeamRoster', response.team_roster);
                context.commit('setSelectedRosterIds', response.selected_roster_ids);
                context.commit('setRosterRules', response.roster_rules);
                context.commit('setPerSkaterFee', response.per_skater_fee);
                context.commit('setRosterMinimum', response.roster_minimum);
                context.commit('setRosterMaximum', response.roster_maximum);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Update the competition roster for an entity
     */
    update: function (context, selected_roster_ids) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationCompetitionRosterApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationCompetitionRosterApiService"].updateActiveEntityCompetitionRoster(selected_roster_ids)
                .then(function () {
                context.commit('setSelectedRosterIds', selected_roster_ids);
                resolve();
            })
                .catch(function (message) {
                reject(message);
            });
        });
    }
};
var getters = {};
var mutations = {
    setTeamRoster: function (state, payload) {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload) {
        state.selected_roster_ids = payload;
    },
    setRosterRules: function (state, payload) {
        state.roster_rules = payload;
    },
    setPerSkaterFee: function (state, payload) {
        state.per_skater_fee = payload;
    },
    setRosterMinimum: function (state, payload) {
        state.roster_minimum = payload;
    },
    setRosterMaximum: function (state, payload) {
        state.roster_maximum = payload;
    }
};
var TeamRegistrationCompetitionRosterState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionTeamServicePersonnelState.ts":
/*!**************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationCompetitionTeamServicePersonnelState.ts ***!
  \**************************************************************************************************************************/
/*! exports provided: State, TeamRegistrationCompetitionTeamServicePersonnelState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionTeamServicePersonnelState", function() { return TeamRegistrationCompetitionTeamServicePersonnelState; });
/* harmony import */ var _services_TeamRegistrationTeamServicePersonnelApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/TeamRegistrationTeamServicePersonnelApiService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationTeamServicePersonnelApiService.ts");

var State = /** @class */ (function () {
    function State() {
        this.team_roster = [];
        this.selected_roster_ids = [];
        this.roster_maximum = null;
    }
    return State;
}());

var actions = {
    fetch: function (context) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationTeamServicePersonnelApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationTeamServicePersonnelApiService"].fetchTeamServicePersonnel()
                .then(function (response) {
                context.commit('setTeamRoster', response.team_roster);
                context.commit('setSelectedRosterIds', response.selected_roster_ids);
                context.commit('setRosterMaximum', response.roster_maximum);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Update the competition roster for an entity
     */
    update: function (context, selected_roster_ids) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationTeamServicePersonnelApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationTeamServicePersonnelApiService"].updateTeamServicePersonnel(selected_roster_ids)
                .then(function () {
                context.commit('setSelectedRosterIds', selected_roster_ids);
                resolve();
            })
                .catch(function (message) {
                reject(message);
            });
        });
    }
};
var getters = {};
var mutations = {
    setTeamRoster: function (state, payload) {
        state.team_roster = payload;
    },
    setSelectedRosterIds: function (state, payload) {
        state.selected_roster_ids = payload;
    },
    setRosterMaximum: function (state, payload) {
        state.roster_maximum = payload;
    }
};
var TeamRegistrationCompetitionTeamServicePersonnelState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationEventSelectionState.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_store/TeamRegistrationEventSelectionState.ts ***!
  \*********************************************************************************************************/
/*! exports provided: State, TeamRegistrationEventSelectionState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationEventSelectionState", function() { return TeamRegistrationEventSelectionState; });
/* harmony import */ var _services_TeamRegistrationEventSelectionApiService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/TeamRegistrationEventSelectionApiService */ "./src/js/Teams/CompetitionRegistration/Registration/_services/TeamRegistrationEventSelectionApiService.ts");

var State = /** @class */ (function () {
    function State() {
        this.events = [];
    }
    return State;
}());

var actions = {
    /**
     * Select an event for registration
     */
    addEvent: function (context, event) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationEventSelectionApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationEventSelectionApiService"].addEvent(event.id)
                .then(function (response) {
                context.commit('setEvents', response.events);
                resolve();
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    },
    /**
     * Fetch Event Selection
     */
    fetch: function (context) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationEventSelectionApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationEventSelectionApiService"].fetchEventSelection()
                .then(function (response) {
                context.commit('setEvents', response.events);
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Remove a selected event from registration
     */
    removeEvent: function (context, event) {
        return new Promise(function (resolve, reject) {
            _services_TeamRegistrationEventSelectionApiService__WEBPACK_IMPORTED_MODULE_0__["TeamRegistrationEventSelectionApiService"].removeEvent(event.id)
                .then(function (response) {
                context.commit('setEvents', response.events);
                resolve();
            })
                .catch(function (error_message) {
                reject(error_message);
            });
        });
    }
};
var getters = {};
var mutations = {
    /**
     * Set events in state
     */
    setEvents: function (state, payload) {
        state.events = payload;
    }
};
var TeamRegistrationEventSelectionState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCoachesApiTransformer.ts":
/*!******************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCoachesApiTransformer.ts ***!
  \******************************************************************************************************************/
/*! exports provided: TeamRegistrationCoachesApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCoachesApiTransformer", function() { return TeamRegistrationCoachesApiTransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models */ "./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TeamRegistrationCoachesApiTransformer = /** @class */ (function () {
    function TeamRegistrationCoachesApiTransformer() {
    }
    TeamRegistrationCoachesApiTransformer.transformFetchCoaches = function (response) {
        var _this = this;
        return {
            team_roster: response.team_coaches.map(function (member_data) {
                return _this.transformEntity(member_data);
            }),
            selected_roster_ids: response.selected_coach_ids.slice(),
            roster_maximum: parseInt(String(response.coach_maximum))
        };
    };
    TeamRegistrationCoachesApiTransformer.transformEntity = function (data) {
        return new _models__WEBPACK_IMPORTED_MODULE_0__["TeamCoach"](__assign({}, data));
    };
    return TeamRegistrationCoachesApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCompetitionRosterApiTransformer.ts":
/*!****************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationCompetitionRosterApiTransformer.ts ***!
  \****************************************************************************************************************************/
/*! exports provided: TeamRegistrationCompetitionRosterApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationCompetitionRosterApiTransformer", function() { return TeamRegistrationCompetitionRosterApiTransformer; });
/* harmony import */ var _models_TeamRosterMember__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models/TeamRosterMember */ "./src/js/Teams/CompetitionRegistration/Registration/_models/TeamRosterMember.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TeamRegistrationCompetitionRosterApiTransformer = /** @class */ (function () {
    function TeamRegistrationCompetitionRosterApiTransformer() {
    }
    TeamRegistrationCompetitionRosterApiTransformer.transformFetchCompetitionRoster = function (response) {
        var _this = this;
        return {
            team_roster: response.team_roster.map(function (member_data) {
                return _this.transformRosterMember(member_data);
            }),
            selected_roster_ids: response.selected_roster_ids.slice(),
            roster_rules: response.roster_rules.slice(),
            per_skater_fee: parseFloat(String(response.per_skater_fee)) || null,
            roster_minimum: parseInt(String(response.roster_minimum)),
            roster_maximum: parseInt(String(response.roster_maximum))
        };
    };
    TeamRegistrationCompetitionRosterApiTransformer.transformRosterMember = function (data) {
        return new _models_TeamRosterMember__WEBPACK_IMPORTED_MODULE_0__["TeamRosterMember"](__assign({}, data));
    };
    return TeamRegistrationCompetitionRosterApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationEventSelectionApiTransformer.ts":
/*!*************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationEventSelectionApiTransformer.ts ***!
  \*************************************************************************************************************************/
/*! exports provided: TeamRegistrationEventSelectionApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationEventSelectionApiTransformer", function() { return TeamRegistrationEventSelectionApiTransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models */ "./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TeamRegistrationEventSelectionApiTransformer = /** @class */ (function () {
    function TeamRegistrationEventSelectionApiTransformer() {
    }
    TeamRegistrationEventSelectionApiTransformer.transformFetchEventSelection = function (response) {
        return {
            events: response.events.map(function (event_data) {
                return new _models__WEBPACK_IMPORTED_MODULE_0__["EventSelectionEvent"](__assign({}, event_data));
            })
        };
    };
    return TeamRegistrationEventSelectionApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationPropCrewApiTransformer.ts":
/*!*******************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationPropCrewApiTransformer.ts ***!
  \*******************************************************************************************************************/
/*! exports provided: TeamRegistrationPropCrewApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationPropCrewApiTransformer", function() { return TeamRegistrationPropCrewApiTransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models */ "./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TeamRegistrationPropCrewApiTransformer = /** @class */ (function () {
    function TeamRegistrationPropCrewApiTransformer() {
    }
    TeamRegistrationPropCrewApiTransformer.transformFetchPropCrew = function (response) {
        var _this = this;
        return {
            team_roster: response.prop_crew.map(function (member_data) {
                return _this.transformEntity(member_data);
            }),
            selected_roster_ids: response.selected_prop_crew_ids.slice(),
            roster_maximum: parseInt(String(response.prop_crew_maximum))
        };
    };
    TeamRegistrationPropCrewApiTransformer.transformEntity = function (data) {
        return new _models__WEBPACK_IMPORTED_MODULE_0__["TeamServicePerson"](__assign({}, data));
    };
    return TeamRegistrationPropCrewApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationTeamServicePersonnelApiTransformer.ts":
/*!*******************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/_transformers/TeamRegistrationTeamServicePersonnelApiTransformer.ts ***!
  \*******************************************************************************************************************************/
/*! exports provided: TeamRegistrationTeamServicePersonnelApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamRegistrationTeamServicePersonnelApiTransformer", function() { return TeamRegistrationTeamServicePersonnelApiTransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models */ "./src/js/Teams/CompetitionRegistration/Registration/_models/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TeamRegistrationTeamServicePersonnelApiTransformer = /** @class */ (function () {
    function TeamRegistrationTeamServicePersonnelApiTransformer() {
    }
    TeamRegistrationTeamServicePersonnelApiTransformer.transformFetchTeamServicePersonnel = function (response) {
        var _this = this;
        return {
            team_roster: response.team_service_personnel.map(function (member_data) {
                return _this.transformEntity(member_data);
            }),
            selected_roster_ids: response.selected_team_service_personnel_ids.slice(),
            roster_maximum: parseInt(String(response.team_service_personnel_maximum))
        };
    };
    TeamRegistrationTeamServicePersonnelApiTransformer.transformEntity = function (data) {
        return new _models__WEBPACK_IMPORTED_MODULE_0__["TeamServicePerson"](__assign({}, data));
    };
    return TeamRegistrationTeamServicePersonnelApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/Registration/bootstrap.ts":
/*!************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/Registration/bootstrap.ts ***!
  \************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _TeamRegistration_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamRegistration.vue */ "./src/js/Teams/CompetitionRegistration/Registration/TeamRegistration.vue");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_components */ "./src/js/Teams/CompetitionRegistration/Registration/_components/index.ts");



vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('team-registration', _TeamRegistration_vue__WEBPACK_IMPORTED_MODULE_1__["default"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('team-registration-header', _components__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationHeader"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('team-registration-progress-bar', _components__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationProgressBar"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('team-registration-page-navigation', _components__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationPageNavigation"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('team-registration-roster-summary', _components__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationRosterSummary"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('total-member-cost', _components__WEBPACK_IMPORTED_MODULE_2__["TotalMemberCost"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('team-registration-roster-review-list', _components__WEBPACK_IMPORTED_MODULE_2__["TeamRegistrationRosterReviewList"]);


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiService.ts":
/*!****************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiService.ts ***!
  \****************************************************************************************/
/*! exports provided: TeamsCompetitionRegistrationApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamsCompetitionRegistrationApiService", function() { return TeamsCompetitionRegistrationApiService; });
/* harmony import */ var _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/AbstractAPIService */ "./src/js/services/AbstractAPIService.ts");
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/AppConfig */ "./src/js/config/AppConfig.ts");
/* harmony import */ var _TeamsCompetitionRegistrationApiTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TeamsCompetitionRegistrationApiTransformer */ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiTransformer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var TeamsCompetitionRegistrationApiService = /** @class */ (function (_super) {
    __extends(TeamsCompetitionRegistrationApiService, _super);
    function TeamsCompetitionRegistrationApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetch the competition list for registration
     */
    TeamsCompetitionRegistrationApiService.fetchCompetitionList = function () {
        var team_id = TeamsCompetitionRegistrationApiService.getActiveTeamId();
        var url = "/api/competition-registration/teams/" + team_id;
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].fetchAndTransformResponse({
            /**
             * Transform API data into App data
             */
            transformResponse: function (response) {
                return _TeamsCompetitionRegistrationApiTransformer__WEBPACK_IMPORTED_MODULE_2__["TeamsCompetitionRegistrationApiTransformer"].transformFetchCompetitionListApiResponse(response);
            },
            url: url,
            /**
             * Validate response data
             */
            validateResponse: function (response) {
                if (!response.competitions) {
                    console.error('competitions not provided in response');
                    return false;
                }
                if (!response.team) {
                    console.error('team information not provided in response');
                    return false;
                }
                return true;
            }
        });
    };
    /**
     * Get the active Series ID from a cookie value
     */
    TeamsCompetitionRegistrationApiService.getActiveTeamId = function () {
        return _services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"].getValueFromCookie(_config_AppConfig__WEBPACK_IMPORTED_MODULE_1__["TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME"], 'team registration team id');
    };
    return TeamsCompetitionRegistrationApiService;
}(_services_AbstractAPIService__WEBPACK_IMPORTED_MODULE_0__["AbstractAPIService"]));



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiTransformer.ts":
/*!********************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiTransformer.ts ***!
  \********************************************************************************************/
/*! exports provided: TeamsCompetitionRegistrationApiTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamsCompetitionRegistrationApiTransformer", function() { return TeamsCompetitionRegistrationApiTransformer; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_models */ "./src/js/Teams/CompetitionRegistration/_models/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TeamsCompetitionRegistrationApiTransformer = /** @class */ (function () {
    function TeamsCompetitionRegistrationApiTransformer() {
    }
    TeamsCompetitionRegistrationApiTransformer.transformFetchCompetitionListApiResponse = function (data) {
        var _this = this;
        return {
            competitions: data.competitions.map(function (competition_data) {
                return _this.transformCompetitionListCompetition(competition_data);
            }),
            team: this.transformTeamSummary(data.team)
        };
    };
    TeamsCompetitionRegistrationApiTransformer.transformCompetitionListCompetition = function (competition_data) {
        return new _models__WEBPACK_IMPORTED_MODULE_0__["CompetitionListCompetition"](__assign({}, competition_data, { series: competition_data.series ? competition_data.series : null, end_date_ts: competition_data.end_date_ts * 1000, start_date_ts: competition_data.start_date_ts * 1000 }));
    };
    TeamsCompetitionRegistrationApiTransformer.transformTeamSummary = function (team) {
        return __assign({}, team);
    };
    return TeamsCompetitionRegistrationApiTransformer;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationState.ts":
/*!***********************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationState.ts ***!
  \***********************************************************************************/
/*! exports provided: State, TeamsCompetitionRegistrationState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TeamsCompetitionRegistrationState", function() { return TeamsCompetitionRegistrationState; });
/* harmony import */ var _config_AppConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/AppConfig */ "./src/js/config/AppConfig.ts");
/* harmony import */ var _TeamsCompetitionRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamsCompetitionRegistrationApiService */ "./src/js/Teams/CompetitionRegistration/TeamsCompetitionRegistrationApiService.ts");


var State = /** @class */ (function () {
    function State() {
        this.available_competitions = [];
        this.active_team = null;
    }
    return State;
}());

var actions = {
    /**
     * Initialize the team registration competition list
     */
    fetchCompetitionList: function (_a) {
        var commit = _a.commit;
        return new Promise(function (resolve, reject) {
            _TeamsCompetitionRegistrationApiService__WEBPACK_IMPORTED_MODULE_1__["TeamsCompetitionRegistrationApiService"].fetchCompetitionList()
                .then(function (response) {
                commit('setAvailableCompetitions', response.competitions);
                commit('setActiveTeam', response.team);
                resolve(response);
            })
                .catch(function () {
                reject();
            });
        });
    },
    /**
     * Fetch team select page information
     */
    fetchTeamSelect: function (context) {
        return context.dispatch('teams/fetchManagedTeams', null, { root: true });
    },
    /**
     * Select a team for registration
     */
    selectTeam: function (context, team) {
        return new Promise(function (resolve, reject) {
            try {
                document.cookie = _config_AppConfig__WEBPACK_IMPORTED_MODULE_0__["TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME"] + "=" + team.id;
                var redirect_url = context.rootState.teams.selection_links.competition_registration;
                if (!redirect_url) {
                    throw 'Unable to redirect';
                }
                location.assign(redirect_url);
                resolve();
            }
            catch (_a) {
                reject("There was an error transferring you to registration for " + team.name + ". Please try again.");
            }
        });
    }
};
var getters = {
    /**
     * Teams for team selection page
     */
    selection_teams: function (state, getters, rootState) {
        return rootState.teams.managed_teams;
    }
};
var mutations = {
    /**
     * Set the active team summary in state
     */
    setActiveTeam: function (state, payload) {
        state.active_team = payload;
    },
    /**
     * Set the available competitions for registration in state
     */
    setAvailableCompetitions: function (state, payload) {
        state.available_competitions = payload;
    }
};
var TeamsCompetitionRegistrationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};


/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_models/CompetitionListCompetition.ts":
/*!************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_models/CompetitionListCompetition.ts ***!
  \************************************************************************************/
/*! exports provided: CompetitionListCompetition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompetitionListCompetition", function() { return CompetitionListCompetition; });
/* harmony import */ var _helpers_time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/time */ "./src/js/helpers/time.ts");

/**
 * Model for competition in Team Registration Competition List
 */
var CompetitionListCompetition = /** @class */ (function () {
    /**
     * CompetitionListCompetition constructor
     */
    function CompetitionListCompetition(parameters) {
        this.id = parameters.id;
        if (parameters.action_blocked_message) {
            this.action_blocked_message = parameters.action_blocked_message;
        }
        this.city = parameters.city;
        this.club = parameters.club;
        this.end_date_ts = parameters.end_date_ts;
        this.icon = parameters.icon;
        this.name = parameters.name;
        this.series = parameters.series;
        this.start_date_ts = parameters.start_date_ts;
        this.state = parameters.state;
        this.is_qualifying = parameters.is_qualifying;
        this.start_date = Object(_helpers_time__WEBPACK_IMPORTED_MODULE_0__["UTCDateFormatNoYear"])(new Date(parameters.start_date_ts));
        this.end_date = Object(_helpers_time__WEBPACK_IMPORTED_MODULE_0__["UTCDateFormatNoYear"])(new Date(parameters.end_date_ts));
        this.competition_registration_status = parameters.competition_registration_status;
        this.has_registration_deadline_warning = parameters.has_registration_deadline_warning;
        this.registration_deadline = parameters.registration_deadline;
        this.user_registration_link = parameters.user_registration_link;
        this.user_registration_status = parameters.user_registration_status;
    }
    return CompetitionListCompetition;
}());



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_models/index.ts":
/*!***************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_models/index.ts ***!
  \***************************************************************/
/*! exports provided: CompetitionListCompetition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CompetitionListCompetition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CompetitionListCompetition */ "./src/js/Teams/CompetitionRegistration/_models/CompetitionListCompetition.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CompetitionListCompetition", function() { return _CompetitionListCompetition__WEBPACK_IMPORTED_MODULE_0__["CompetitionListCompetition"]; });




/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue":
/*!************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectTeamPage_vue_vue_type_template_id_d6c06fd6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectTeamPage.vue?vue&type=template&id=d6c06fd6& */ "./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=template&id=d6c06fd6&");
/* harmony import */ var _SelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectTeamPage.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectTeamPage_vue_vue_type_template_id_d6c06fd6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectTeamPage_vue_vue_type_template_id_d6c06fd6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=script&lang=ts&":
/*!*************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=script&lang=ts& ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectTeamPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=template&id=d6c06fd6&":
/*!*******************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=template&id=d6c06fd6& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamPage_vue_vue_type_template_id_d6c06fd6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectTeamPage.vue?vue&type=template&id=d6c06fd6& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue?vue&type=template&id=d6c06fd6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamPage_vue_vue_type_template_id_d6c06fd6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamPage_vue_vue_type_template_id_d6c06fd6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue":
/*!***********************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TeamsCompetitionRegistrationIndexPage_vue_vue_type_template_id_10789e7c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c& */ "./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c&");
/* harmony import */ var _TeamsCompetitionRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts& */ "./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TeamsCompetitionRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TeamsCompetitionRegistrationIndexPage_vue_vue_type_template_id_10789e7c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TeamsCompetitionRegistrationIndexPage_vue_vue_type_template_id_10789e7c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts&":
/*!************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts& ***!
  \************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamsCompetitionRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/ts-loader??ref--5!../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamsCompetitionRegistrationIndexPage_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c&":
/*!******************************************************************************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c& ***!
  \******************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamsCompetitionRegistrationIndexPage_vue_vue_type_template_id_10789e7c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue?vue&type=template&id=10789e7c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamsCompetitionRegistrationIndexPage_vue_vue_type_template_id_10789e7c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TeamsCompetitionRegistrationIndexPage_vue_vue_type_template_id_10789e7c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/_pages/index.ts":
/*!**************************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/_pages/index.ts ***!
  \**************************************************************/
/*! exports provided: SelectTeamPage, TeamsCompetitionRegistrationIndexPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectTeamPage_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectTeamPage.vue */ "./src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectTeamPage", function() { return _SelectTeamPage_vue__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _TeamsCompetitionRegistrationIndexPage_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TeamsCompetitionRegistrationIndexPage.vue */ "./src/js/Teams/CompetitionRegistration/_pages/TeamsCompetitionRegistrationIndexPage.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TeamsCompetitionRegistrationIndexPage", function() { return _TeamsCompetitionRegistrationIndexPage_vue__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "./src/js/Teams/CompetitionRegistration/bootstrap.ts":
/*!***********************************************************!*\
  !*** ./src/js/Teams/CompetitionRegistration/bootstrap.ts ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_pages */ "./src/js/Teams/CompetitionRegistration/_pages/index.ts");
/* harmony import */ var _Registration_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Registration/bootstrap */ "./src/js/Teams/CompetitionRegistration/Registration/bootstrap.ts");



vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('select-team-page', _pages__WEBPACK_IMPORTED_MODULE_1__["SelectTeamPage"]);
vue__WEBPACK_IMPORTED_MODULE_0__["default"].component('teams-competition-registration-index-page', _pages__WEBPACK_IMPORTED_MODULE_1__["TeamsCompetitionRegistrationIndexPage"]);


/***/ }),

/***/ "./src/js/Teams/_components/SelectTeamList.vue":
/*!*****************************************************!*\
  !*** ./src/js/Teams/_components/SelectTeamList.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectTeamList.vue?vue&type=template&id=03f2d647& */ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&");
/* harmony import */ var _SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectTeamList.vue?vue&type=script&lang=ts& */ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/Teams/_components/SelectTeamList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&":
/*!******************************************************************************!*\
  !*** ./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/ts-loader??ref--5!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectTeamList.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&":
/*!************************************************************************************!*\
  !*** ./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectTeamList.vue?vue&type=template&id=03f2d647& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/Teams/_components/SelectTeamList.vue?vue&type=template&id=03f2d647&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectTeamList_vue_vue_type_template_id_03f2d647___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/adaptors/MemberSearchAdaptor.ts":
/*!************************************************!*\
  !*** ./src/js/adaptors/MemberSearchAdaptor.ts ***!
  \************************************************/
/*! exports provided: MemberSearchAdaptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberSearchAdaptor", function() { return MemberSearchAdaptor; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var MemberSearchAdaptor = /** @class */ (function () {
    function MemberSearchAdaptor() {
    }
    MemberSearchAdaptor.adaptResult = function (raw_data) {
        return __assign({}, raw_data);
    };
    MemberSearchAdaptor.adaptResultArray = function (raw_data) {
        return raw_data.map(function (item) {
            return MemberSearchAdaptor.adaptResult(item);
        });
    };
    MemberSearchAdaptor.adaptGenderedResultArray = function (raw_data) {
        return raw_data.map(function (item) {
            return __assign({}, item, MemberSearchAdaptor.adaptResult(item));
        });
    };
    MemberSearchAdaptor.adaptMemberSearchParametersToMemberSearchAPIParameters = function (search_params) {
        return __assign({}, search_params);
    };
    return MemberSearchAdaptor;
}());



/***/ }),

/***/ "./src/js/competition-registration-teams.ts":
/*!**************************************************!*\
  !*** ./src/js/competition-registration-teams.ts ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Teams_CompetitionRegistration_bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Teams/CompetitionRegistration/bootstrap */ "./src/js/Teams/CompetitionRegistration/bootstrap.ts");



/***/ }),

/***/ "./src/js/components/ProgressBar.vue":
/*!*******************************************!*\
  !*** ./src/js/components/ProgressBar.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProgressBar_vue_vue_type_template_id_70fb958a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProgressBar.vue?vue&type=template&id=70fb958a& */ "./src/js/components/ProgressBar.vue?vue&type=template&id=70fb958a&");
/* harmony import */ var _ProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProgressBar.vue?vue&type=script&lang=ts& */ "./src/js/components/ProgressBar.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProgressBar_vue_vue_type_template_id_70fb958a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ProgressBar_vue_vue_type_template_id_70fb958a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/js/components/ProgressBar.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/js/components/ProgressBar.vue?vue&type=script&lang=ts&":
/*!********************************************************************!*\
  !*** ./src/js/components/ProgressBar.vue?vue&type=script&lang=ts& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_ProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/ts-loader??ref--5!../../../node_modules/vue-loader/lib??vue-loader-options!./ProgressBar.vue?vue&type=script&lang=ts& */ "./node_modules/ts-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/ProgressBar.vue?vue&type=script&lang=ts&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_ts_loader_index_js_ref_5_node_modules_vue_loader_lib_index_js_vue_loader_options_ProgressBar_vue_vue_type_script_lang_ts___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/js/components/ProgressBar.vue?vue&type=template&id=70fb958a&":
/*!**************************************************************************!*\
  !*** ./src/js/components/ProgressBar.vue?vue&type=template&id=70fb958a& ***!
  \**************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProgressBar_vue_vue_type_template_id_70fb958a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ProgressBar.vue?vue&type=template&id=70fb958a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/js/components/ProgressBar.vue?vue&type=template&id=70fb958a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProgressBar_vue_vue_type_template_id_70fb958a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProgressBar_vue_vue_type_template_id_70fb958a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/js/config/AppConfig.ts":
/*!************************************!*\
  !*** ./src/js/config/AppConfig.ts ***!
  \************************************/
/*! exports provided: URL_CONFIG, PracticeIceConfig, CREDIT_CARD_GAP_SEPARATOR, DATE_INPUT_GAP_SEPARATOR, SKIP_VALIDATION, ENTITY_CHECK_IN_DEBUG, AUTOLOAD_ENTITY_CHECK_IN_INDEX, COMPETITION_MANAGEMENT_COOKIE_NAME, SERIES_REGISTRATION_COOKIE_NAME, TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME, TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME, COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME, COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME, SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "URL_CONFIG", function() { return URL_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PracticeIceConfig", function() { return PracticeIceConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CREDIT_CARD_GAP_SEPARATOR", function() { return CREDIT_CARD_GAP_SEPARATOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATE_INPUT_GAP_SEPARATOR", function() { return DATE_INPUT_GAP_SEPARATOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SKIP_VALIDATION", function() { return SKIP_VALIDATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ENTITY_CHECK_IN_DEBUG", function() { return ENTITY_CHECK_IN_DEBUG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTOLOAD_ENTITY_CHECK_IN_INDEX", function() { return AUTOLOAD_ENTITY_CHECK_IN_INDEX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPETITION_MANAGEMENT_COOKIE_NAME", function() { return COMPETITION_MANAGEMENT_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SERIES_REGISTRATION_COOKIE_NAME", function() { return SERIES_REGISTRATION_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME", function() { return TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME", function() { return TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME", function() { return COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME", function() { return COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME", function() { return SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME; });
var URL_CONFIG = {
    login: '/Account/CheckLogin',
    getSkaterComps: '/EMS/UpcomingCompsSkater',
    getCompetitionList: '/api/competitions'
};
var PracticeIceConfig = {
    allow_all_dates_filter: false
};
var CREDIT_CARD_GAP_SEPARATOR = ' ';
var DATE_INPUT_GAP_SEPARATOR = '/';
/**
 * Whether to bypass validation for forms.  Used for development
 *
 * @note: not all forms are tied to this value as of this writing and may still validate even when this is true
 */
var SKIP_VALIDATION = false;
/**
 * Enable debug mode for entity check-in:
 *
 * 1. Shows all subpage items on entity check-in index
 */
var ENTITY_CHECK_IN_DEBUG = false;
/**
 * Start check-in with an entity active.
 *
 * Set to a number to load the appropriate entity.
 * Set to false or undefined to prevent autoload.
 */
var AUTOLOAD_ENTITY_CHECK_IN_INDEX = false;
/**
 * Name of cookie from which active Competition Management Competition ID can be read.
 *
 * False if cookie is not being used.
 */
var COMPETITION_MANAGEMENT_COOKIE_NAME = false; // 'competition_management_active_competition_id';
/**
 * Name of cookie from which active Series Registration Series ID can be read
 */
var SERIES_REGISTRATION_COOKIE_NAME = 'series_registration_series_id';
/**
 * Name of cookie from which active Team Registration Team ID can be read
 */
var TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME = 'team_competition_registration_team_id';
/**
 * Name of cookie from which active Team Registration Competition ID can be read
 */
var TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME = 'team_competition_registration_competition_id';
/**
 * Name of cookie that tracks the active competition ID within the Competition Portal
 */
var COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME = 'competition_portal_competition_id';
/**
 * Name of cookie that tracks the active team ID within the Competition Portal
 */
var COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME = 'competition_portal_team_id';
/**
 * Name of cookie that tracks the active team ID within Series Registration
 */
var SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME = 'series_registration_team_id';


/***/ }),

/***/ "./src/js/helpers/SearchResultHelpers.ts":
/*!***********************************************!*\
  !*** ./src/js/helpers/SearchResultHelpers.ts ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var SearchResultHelpers = /** @class */ (function () {
    function SearchResultHelpers() {
    }
    SearchResultHelpers.getSpread = function (result_count, active_page_index, per_page) {
        if (result_count === 0) {
            return {
                start: 0,
                end: 0
            };
        }
        var start = 1;
        var end = result_count;
        if (typeof per_page === "number") {
            start = per_page * active_page_index + 1;
            end = per_page * (active_page_index + 1);
        }
        return {
            start: start,
            end: end < result_count ? end : result_count
        };
    };
    /**
     * Create pagination that always contains 7 items (unless source pages are shorter)
     * Pagination always includes first and last page
     * Pagination contains 5 remaining items surrounding the active page
     * For non-sequential pagination elements, display ellipsis.
     */
    SearchResultHelpers.getPaginationOptions = function (paginated_data, active_page_index) {
        var first_page = {
            page_number: 1,
            page_index: 0
        };
        var last_page = {
            page_number: paginated_data.length,
            page_index: paginated_data.length - 1
        };
        var result = [
            first_page,
            last_page
        ];
        /**
         * If only 1 page of data, return the first item in our result set
         */
        if (paginated_data.length === 1) {
            return result.splice(0, 1);
        }
        var spread = SearchResultHelpers.getPaginationSpread(paginated_data, active_page_index);
        result.splice.apply(result, [1, 0].concat(spread));
        /**
         *
         */
        return result.map(function (item, index) {
            /**
             * Preserve first and last items
             */
            if (index === 0 || index === result.length - 1) {
                return item;
            }
            var previous_item = result[index - 1];
            var next_item = result[index + 1];
            /**
             * If a next item isn't sequentially 1 step above the current, replace current with ellipsis
             */
            if (next_item && next_item.page_number > item.page_number + 1) {
                return {
                    page_number: "...",
                    page_index: false
                };
            }
            /**
             * If a previous item isn't sequentially 1 step below the current, replace current with ellipsis
             */
            if (previous_item && previous_item.page_number < item.page_number - 1) {
                return {
                    page_number: "...",
                    page_index: false
                };
            }
            return item;
        });
    };
    /**
     * Get the spread of pages surrounding the active page
     */
    SearchResultHelpers.getPaginationSpread = function (paginated_data, active_page_index) {
        var full_spread_length = 5;
        var spread = [];
        var max_spread = paginated_data.length - 2;
        var spread_length = max_spread < full_spread_length ? max_spread : full_spread_length;
        /**
         * Add the active page first if it's not the first or last page
         */
        var active_page_not_first = active_page_index > 0;
        var active_page_not_last = active_page_index < paginated_data.length - 1;
        if (active_page_not_first && active_page_not_last) {
            spread.push({
                page_number: active_page_index + 1,
                page_index: active_page_index
            });
        }
        /**
         * Build the spread according to it's length.
         *
         * Add previous pages while applicable before the current spread
         * Add next pages while applicable to the end of the spread
         */
        for (var j = 1; j <= spread_length; j++) {
            var previous_index = active_page_index - j;
            var next_index = active_page_index + j;
            if (previous_index > 0) {
                spread.unshift({
                    page_number: previous_index + 1,
                    page_index: previous_index
                });
            }
            if (next_index < paginated_data.length - 1) {
                spread.push({
                    page_number: next_index + 1,
                    page_index: next_index
                });
            }
            if (spread.length >= spread_length) {
                break;
            }
        }
        return spread;
    };
    return SearchResultHelpers;
}());
/* harmony default export */ __webpack_exports__["default"] = (SearchResultHelpers);


/***/ }),

/***/ "./src/js/helpers/time.ts":
/*!********************************!*\
  !*** ./src/js/helpers/time.ts ***!
  \********************************/
/*! exports provided: meridian, twelveHourHour, prettyTime, fullMinutes, hoursMinutes, DateFormat, UTCDateFormatNoYear, TwoDigitYear, DateFormatAbridgedYear, FormInputDate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "meridian", function() { return meridian; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "twelveHourHour", function() { return twelveHourHour; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prettyTime", function() { return prettyTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fullMinutes", function() { return fullMinutes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hoursMinutes", function() { return hoursMinutes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateFormat", function() { return DateFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UTCDateFormatNoYear", function() { return UTCDateFormatNoYear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TwoDigitYear", function() { return TwoDigitYear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateFormatAbridgedYear", function() { return DateFormatAbridgedYear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormInputDate", function() { return FormInputDate; });
function meridian(date) {
    var hours = date.getHours();
    if (hours >= 12) {
        return "PM";
    }
    return "AM";
}
function twelveHourHour(date) {
    var hours = date.getHours();
    if (hours > 12) {
        hours = hours - 12;
    }
    else if (hours == 0) {
        hours = 12;
    }
    return hours;
}
function prettyTime(date) {
    return twelveHourHour(date) + ":" + fullMinutes(date);
}
function fullMinutes(date) {
    var minutes = date.getMinutes();
    var pretty_minutes = String(minutes);
    if (minutes < 10) {
        pretty_minutes = "0" + pretty_minutes;
    }
    return pretty_minutes;
}
function hoursMinutes(date) {
    return twelveHourHour(date) + ":" + fullMinutes(date);
}
function DateFormat(date) {
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}
/**
 * Format a UTC date as M/D
 */
function UTCDateFormatNoYear(date) {
    return date.getUTCMonth() + 1 + "/" + date.getUTCDate();
}
function TwoDigitYear(date) {
    return String(date.getFullYear()).substring(2);
}
function DateFormatAbridgedYear(date) {
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + TwoDigitYear(date);
}
/**
 * Format a date in MM/DD/YYYY format
 */
function FormInputDate(date) {
    var value = [];
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();
    value.push(String(month));
    if (month < 10) {
        value[0] = "0" + value[0];
    }
    value.push(String(day));
    if (day < 10) {
        value[1] = "0" + value[1];
    }
    value.push(year);
    return value.join('/');
}


/***/ }),

/***/ "./src/js/mixins/EventSelectionMixin.ts":
/*!**********************************************!*\
  !*** ./src/js/mixins/EventSelectionMixin.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var _services_PaginationService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/PaginationService */ "./src/js/services/PaginationService.ts");


var CONFIG = {
    feedback_in_duration: 250,
    feedback_show_duration: 600,
    error_show_duration: 850,
    my_event_change_duration: 600,
    results_per_page: 4
};
/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    props: {
        state_available_events: {
            type: Array
        }
    },
    /**
     * Reactive data
     */
    // eslint-disable-next-line max-lines-per-function
    data: function () {
        return {
            /**
             * The active type of events to show
             */
            active_type: null,
            /**
             * The active page index of paginated event results
             */
            active_page_index: 0,
            /**
             * Whether an event was recently added.  For my events state transition
             */
            element_added: false,
            /**
             * Whether an event was recently removed.  For my events state transition
             */
            element_removed: false,
            /**
             * The ID of the current event being added or removed.  Used for error message location on event failure
             * events in "my events" are identified with a negative id
             */
            active_event_tracking_id: null,
            /**
             * The message for the latest event submission interaction
             */
            active_event_message: null,
            /**
             * The type of message for the latest submission interaction.
             * Determines the class styling of the feedback element
             */
            active_event_status: 'success',
            /**
             * Whether actions on event cards should be disabled. True when an event action is being submitted
             * Disables action buttons on event cards, but not referenced within component methods
             */
            disable_event_selection: false,
            /**
             * Whether data needed for component to function has been loaded
             */
            dependencies: {
                screen: false,
                competition: false
            },
            /**
             * The list of available events, local to the component
             */
            available_events: [],
            /**
             * Buffer for active events.  Allows component to update display without direct binding to state
             */
            available_events_buffer: [],
            /**
             * Display of amount of "my events"
             */
            my_events_count: 0,
            /**
             * Buffer for my events count.  Allows component to update display without direct binding to state
             */
            my_events_count_buffer: 0
        };
    },
    computed: {
        /**
         * The types that the event list can be filtered by.
         * Populate the list with each event type/category unique value
         */
        event_type_options: function () {
            return this.available_events.reduce(function (carry, event) {
                if (carry.indexOf(event.category) === -1) {
                    carry.push(event.category);
                }
                return carry;
            }, []);
        },
        /**
         * The events that have been selected by the user
         */
        selected_events: function () {
            return this.available_events.filter(function (event) {
                return event.is_selected;
            });
        },
        /**
         * Events to show in "My Events" tray
         * Selected and registered events
         */
        my_events: function () {
            return this.available_events.filter(function (event) {
                return event.is_registered_for || event.is_selected;
            });
        },
        /**
         * List of events for display in the available event area
         */
        display_events: function () {
            var type_filter = this.active_type;
            if (!type_filter) {
                return this.available_events;
            }
            return this.available_events.filter(function (event) {
                return event.category === type_filter;
            });
        },
        /**
         * The paginated list of display events
         */
        paginated_events: function () {
            return _services_PaginationService__WEBPACK_IMPORTED_MODULE_1__["PaginationService"].paginate(this.display_events, CONFIG.results_per_page);
        },
        /**
         * The events from the active page of the pagination
         */
        visible_events: function () {
            return this.paginated_events[this.active_page_index];
        },
        /**
         * Whether to show the pagination
         */
        show_pagination: function () {
            return this.visible_events.length > 0;
        }
    },
    watch: {
        /**
         * When active type filter changes, go to first page of paginated results
         */
        active_type: function () {
            this.active_page_index = 0;
            var pagination_component = this.$refs.pagination ? this.$refs.pagination : null;
            if (pagination_component) {
                pagination_component.setActivePage(0);
            }
        },
        /**
         * Watch available events from state and update the buffer on change
         */
        state_available_events: function (value) {
            this.available_events_buffer = value;
        },
        /**
         * Watch change to my events length and update my events count buffer
         */
        'my_events.length': function (value) {
            this.my_events_count_buffer = value;
        }
    },
    /**
     * On creation, set the initial state of available events and my events count
     */
    created: function () {
        var _this = this;
        this.available_events = this.state_available_events.slice();
        this.$nextTick(function () {
            _this.my_events_count = _this.my_events.length;
        });
    },
    methods: {
        /**
         * Update local state values following an update to state
         * 1. Find the new page within the pagination of the active event
         * 2. Assign the active page and the events list to local state
         * 3. Update pagination component to display proper page
         */
        updateAvailableEvents: function () {
            var _this = this;
            var new_events = this.available_events_buffer.slice();
            var new_page_index = 0;
            // If the event was added/removed from the available area, find what its new page would be and preload it
            var index = 0;
            if (this.active_event_tracking_id && this.active_event_tracking_id > 0) {
                for (var i = 0; i < new_events.length; i++) {
                    var newEvent = new_events[i];
                    // if there's an active type filter and the event doesn't match, it won't factor into pagination
                    if (this.active_type && newEvent.category !== this.active_type) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }
                    if (newEvent.id === this.active_event_tracking_id) {
                        new_page_index = Math.floor(index / CONFIG.results_per_page);
                        break;
                    }
                    index++;
                }
            }
            this.available_events = new_events;
            this.active_page_index = new_page_index;
            this.$nextTick(function () {
                var pagination_component = _this.$refs.pagination ? _this.$refs.pagination : null;
                if (pagination_component) {
                    pagination_component.setActivePage(new_page_index);
                }
            });
        },
        /**
         * Animate changes to "My Events" section
         */
        animateMyEventsChange: function (prop) {
            var _this = this;
            this[prop] = true;
            setTimeout(function () {
                _this[prop] = false;
            }, CONFIG.my_event_change_duration);
            setTimeout(function () {
                _this.my_events_count = _this.my_events_count_buffer;
            }, CONFIG.my_event_change_duration / 2);
        },
        /**
         * Handle component flows following a change to state values
         * 1. Trigger local events state update.
         * 2. Trigger My Events animation change
         * 3. Clear the active item messaging
         */
        postEventsChange: function (change_type) {
            var _this = this;
            this.disable_event_selection = false;
            this.updateAvailableEvents();
            this.animateMyEventsChange(change_type);
            setTimeout(function () {
                _this.clearActiveMessage();
            }, CONFIG.feedback_show_duration / 2);
        },
        /**
         * Handle component flows following a submission error
         * 1. Display error message, then clear it
         */
        postEventError: function (error_message) {
            var _this = this;
            this.displayMessage(error_message, 'error');
            setTimeout(function () {
                _this.clearActiveMessage();
                _this.disable_event_selection = false;
            }, CONFIG.error_show_duration);
        },
        /**
         * Handle the add event fired on an event tile.
         * Start add data submission process and respond with success or error messaging
         */
        addEvent: function (event, event_tracking_id) {
            var _this = this;
            this.active_event_tracking_id = event_tracking_id;
            this.active_event_message = null;
            this.disable_event_selection = true;
            this.addEventAction(event)
                .then(function () {
                _this.displayMessage('Event added', 'success');
                setTimeout(function () {
                    _this.postEventsChange('element_added');
                }, CONFIG.feedback_in_duration + (CONFIG.feedback_show_duration / 2));
            })
                .catch(function (error_message) {
                _this.postEventError(error_message);
            });
        },
        /**
         * Action to perform add event
         */
        addEventAction: function (event) {
            return new Promise(function (resolve, reject) {
                reject("Add event action not configured for " + event.name);
            });
        },
        /**
         * Handle the remove event fired on an event tile.
         * Start remove data submission process and respond with success or error messaging
         */
        removeEvent: function (event, tracking_id) {
            var _this = this;
            this.active_event_tracking_id = tracking_id;
            this.active_event_message = null;
            this.disable_event_selection = true;
            var my_events_section_removal_flag = tracking_id < 0;
            this.removeEventAction(event)
                .then(function () {
                /**
                 * If removing from my events, don't display a message and just fire the post message display event
                 */
                if (my_events_section_removal_flag) {
                    _this.postEventsChange('element_removed');
                    return;
                }
                /**
                 * Otherwise, follow standard change flow
                 */
                _this.displayMessage('Event removed', 'error');
                setTimeout(function () {
                    _this.postEventsChange('element_removed');
                }, CONFIG.feedback_in_duration + (CONFIG.feedback_show_duration / 2));
            })
                .catch(function (error_message) {
                _this.postEventError(error_message);
            });
        },
        /**
         * Action to perform remove event
         */
        removeEventAction: function (event) {
            return new Promise(function (resolve, reject) {
                reject("Remove event action not configured for " + event.name);
            });
        },
        /**
         * Set the current display message for the active event tile
         */
        displayMessage: function (message, status) {
            this.active_event_message = message;
            this.active_event_status = status;
        },
        /**
         * Clear the current active messaging component properties
         * Clear the message and reset the active event index
         */
        clearActiveMessage: function () {
            this.active_event_message = null;
            this.active_event_status = null;
            this.active_event_tracking_id = null;
        },
        /**
         * Handle the event where a user clicks the close button on an event error message
         * Clear the current timeout that would hide the message, and reset component error-related properties
         */
        closeEventError: function () {
            this.clearActiveMessage();
            this.disable_event_selection = false;
        },
        /**
         * Get the active error message for a event tile index.
         * Returns false if no error message active on the tile
         */
        eventMessage: function (index) {
            if (!this.active_event_message) {
                return false;
            }
            if (index === this.active_event_tracking_id) {
                return this.active_event_message;
            }
            return false;
        },
        /**
         * Handle the active page change on the pagination
         */
        updateActivePage: function (page_index) {
            this.active_page_index = page_index;
        }
    }
}));


/***/ }),

/***/ "./src/js/mixins/HasDataDependencies.ts":
/*!**********************************************!*\
  !*** ./src/js/mixins/HasDataDependencies.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_0__["default"].extend({
    /**
     * Handle data loading and loading state-related variables upon component creation
     */
    created: function () {
        var _this = this;
        this.initLoadingTimeout();
        this.preDataLoad()
            .then(function () {
            _this.loadData().catch(function () {
                _this.load_error = true;
            });
        });
    },
    data: function () {
        return {
            /**
             * Dependencies for component loading
             */
            dependencies: {},
            /**
             * Whether there was an error loading component dependencies
             */
            load_error: false,
            /**
             * Timeout after which to display a loading message if data is not yet loaded
             */
            loading_timeout: false,
        };
    },
    methods: {
        /**
         * Start the loading timeout.  Log value after expiration
         */
        initLoadingTimeout: function () {
            var _this = this;
            setTimeout(function () {
                _this.loading_timeout = true;
            }, 200);
        },
        /**
         * Load dependencies
         */
        loadData: function () {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        },
        /**
         * Action to take prior to data load attempt
         */
        preDataLoad: function () {
            return new Promise(function (resolve) {
                resolve();
            });
        }
    },
    computed: {
        /**
         * Whether the component data is fully loaded.
         */
        loaded: function () {
            for (var i in this.dependencies) {
                if (this.dependencies.hasOwnProperty(i)) {
                    var obj = this.dependencies[i];
                    if (obj !== true) {
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * Whether the component successfully loaded
         */
        component_loaded: function () {
            return this.loaded && !this.load_error;
        }
    }
}));


/***/ }),

/***/ "./src/js/mixins/HasPaginatedItems.ts":
/*!********************************************!*\
  !*** ./src/js/mixins/HasPaginatedItems.ts ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_PaginationService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/PaginationService */ "./src/js/services/PaginationService.ts");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");


/* harmony default export */ __webpack_exports__["default"] = (vue__WEBPACK_IMPORTED_MODULE_1__["default"].extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * The active page of paginated results
             */
            active_page_index: 0,
            /**
             * The amount of items per page of pagination
             */
            pagination_per_page: 50
        };
    },
    computed: {
        /**
         * The items to paginate
         */
        pagination_items: function () {
            return [];
        },
        /**
         * Paginated items that have passed all active filters
         */
        paginated_items: function () {
            return _services_PaginationService__WEBPACK_IMPORTED_MODULE_0__["PaginationService"].paginate(this.pagination_items, this.pagination_per_page);
        },
        /**
         * The pagination component element
         */
        pagination_component: function () {
            return this.$refs.pagination ? this.$refs.pagination : null;
        },
        /**
         * Whether to show the pagination
         *
         * If there is more than one page of paginated items
         */
        show_pagination: function () {
            return this.paginated_items.length > 1;
        },
        /**
         * The set of items currently visible on the active pagination page
         */
        visible_items: function () {
            return this.paginated_items[this.active_page_index];
        }
    },
    watch: {
        /**
         * When pagination items change, reset the active page to the first
         */
        pagination_items: function () {
            this.changeActivePage(0);
        }
    },
    methods: {
        /**
         * Set the active page within the component and its dependents
         */
        changeActivePage: function (page_index) {
            this.active_page_index = page_index;
            var pagination_component = this.$refs.pagination;
            if (pagination_component) {
                pagination_component.setActivePage(page_index);
            }
        },
        /**
         * Handle active page change reported by pagination component
         */
        handleActivePageChange: function (page_index) {
            this.active_page_index = page_index;
        }
    }
}));


/***/ }),

/***/ "./src/js/services/AbstractAPIService.ts":
/*!***********************************************!*\
  !*** ./src/js/services/AbstractAPIService.ts ***!
  \***********************************************/
/*! exports provided: AbstractAPIService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractAPIService", function() { return AbstractAPIService; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adaptors/MemberSearchAdaptor */ "./src/js/adaptors/MemberSearchAdaptor.ts");


var AbstractAPIService = /** @class */ (function () {
    function AbstractAPIService() {
    }
    /**
     * Fetch information from the API and transform the response
     */
    AbstractAPIService.fetchAndTransformResponse = function (parameters) {
        var url = parameters.url, validateResponse = parameters.validateResponse, transformResponse = parameters.transformResponse;
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(url)
                .then(function (response) {
                if (typeof validateResponse === 'undefined' || validateResponse(response.data)) {
                    resolve(transformResponse(response.data));
                    return;
                }
                reject();
            })
                .catch(function () {
                reject();
            });
        });
    };
    /**
     * Submit an API request and handle the expected APISubmissionResponse response
     */
    AbstractAPIService.submitForAPISubmissionResponse = function (parameters) {
        var url = parameters.url, payload = parameters.payload;
        var error_message = parameters.error_message;
        var method = parameters.method || 'post';
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.request({
                data: payload,
                url: url,
                method: method
            })
                .then(function (response) {
                if (response.data && response.data.success) {
                    resolve();
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            })
                .catch(function () {
                reject(error_message);
            });
        });
    };
    /**
     * Submit a member search
     */
    AbstractAPIService.submitMemberSearch = function (parameters) {
        var error_message = parameters.error_message || 'Search error. Please try again';
        var payload = parameters.payload, url = parameters.url;
        var transform = parameters.transformPayload || (function (data) {
            return _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_1__["MemberSearchAdaptor"].adaptMemberSearchParametersToMemberSearchAPIParameters(data);
        });
        var api_payload = transform(payload);
        var validateResponse = parameters.validateResponse || (function (response_data) {
            return !!response_data && !!response_data.results;
        });
        var transformResponse = parameters.transformResponse || (function (response_data) {
            return _adaptors_MemberSearchAdaptor__WEBPACK_IMPORTED_MODULE_1__["MemberSearchAdaptor"].adaptResultArray(response_data.results);
        });
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(url, api_payload)
                .then(function (response) {
                if (validateResponse(response.data)) {
                    resolve(transformResponse(response.data));
                    return;
                }
                reject(error_message);
            })
                .catch(function () {
                reject(error_message);
            });
        });
    };
    /**
     * Submit an API request with an expected response payload. Validate then transform the response payload
     *
     * R represents the API response
     * O represents the transformed outcome
     */
    AbstractAPIService.submitWithTransformedResponse = function (parameters) {
        var url = parameters.url, payload = parameters.payload, transformResponse = parameters.transformResponse;
        var method = parameters.method || 'post';
        var validateResponse = parameters.validateResponse || (function (response_data) {
            return !!response_data && !!response_data.success;
        });
        var error_message = parameters.error_message;
        return new Promise(function (resolve, reject) {
            axios__WEBPACK_IMPORTED_MODULE_0___default.a.request({
                data: payload,
                url: url,
                method: method
            })
                .then(function (response) {
                if (validateResponse(response.data)) {
                    resolve(transformResponse(response.data));
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            })
                .catch(function () {
                reject(error_message);
            });
        });
    };
    /**
     * Get a value from a cookie using the cookie name
     */
    AbstractAPIService.getValueFromCookie = function (cookie_name, cookie_descriptor, suppress_warnings) {
        if (cookie_descriptor === void 0) { cookie_descriptor = ''; }
        var cookie_value = '';
        if (cookie_name) {
            var pattern = "(?:(?:^|.*;\\s*)" + cookie_name + "\\s*\\=\\s*([^;]*).*$)|^.*$";
            var cookieValue = document.cookie.replace(new RegExp(pattern), '$1');
            cookie_value = cookieValue.trim();
            if (cookie_value !== '') {
                return cookie_value;
            }
        }
        if (!suppress_warnings) {
            console.warn("Unable to retrieve " + cookie_descriptor + " cookie value");
        }
        throw "Unable to retrieve " + cookie_descriptor + " cookie value";
    };
    return AbstractAPIService;
}());



/***/ }),

/***/ "./src/js/services/PaginationService.ts":
/*!**********************************************!*\
  !*** ./src/js/services/PaginationService.ts ***!
  \**********************************************/
/*! exports provided: PaginationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaginationService", function() { return PaginationService; });
/* harmony import */ var _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/SearchResultHelpers */ "./src/js/helpers/SearchResultHelpers.ts");

/**
 * New service class to wrap previously-existing functions
 */
var PaginationService = /** @class */ (function () {
    function PaginationService() {
    }
    /**
     * Paginate an array of items
     */
    PaginationService.paginate = function (items, per_page) {
        if (items.length === 0) {
            return [[]];
        }
        var result = [];
        return items.reduce(function (accumulator, item, index) {
            var result_index = 0;
            if (typeof per_page === "number") {
                result_index = Math.floor(index / per_page);
            }
            if (!accumulator[result_index]) {
                accumulator[result_index] = [];
            }
            accumulator[result_index].push(item);
            return accumulator;
        }, result);
    };
    /**
     * Get the options to display in pagination
     */
    PaginationService.paginationOptions = function (paginated_data, active_page_index) {
        return _helpers_SearchResultHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].getPaginationOptions(paginated_data, active_page_index);
    };
    return PaginationService;
}());



/***/ }),

/***/ 4:
/*!********************************************************!*\
  !*** multi ./src/js/competition-registration-teams.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Test\Figure\hawkeye-ems\src\js\competition-registration-teams.ts */"./src/js/competition-registration-teams.ts");


/***/ })

},[[4,"/js/manifest","/js/vendor"]]]);