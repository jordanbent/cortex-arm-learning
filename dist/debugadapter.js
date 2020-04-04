module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/gdb.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/async/lib/async.js":
/*!*****************************************!*\
  !*** ./node_modules/async/lib/async.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if ( true && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return async;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    // included directly via <script> tag
    else {}

}());


/***/ }),

/***/ "./node_modules/command-exists/index.js":
/*!**********************************************!*\
  !*** ./node_modules/command-exists/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/command-exists */ "./node_modules/command-exists/lib/command-exists.js");


/***/ }),

/***/ "./node_modules/command-exists/lib/command-exists.js":
/*!***********************************************************!*\
  !*** ./node_modules/command-exists/lib/command-exists.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var exec = __webpack_require__(/*! child_process */ "child_process").exec;
var execSync = __webpack_require__(/*! child_process */ "child_process").execSync;
var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");
var access = fs.access;
var accessSync = fs.accessSync;
var constants = fs.constants || fs;

var isUsingWindows = process.platform == 'win32'

var fileNotExists = function(commandName, callback){
    access(commandName, constants.F_OK,
    function(err){
        callback(!err);
    });
};

var fileNotExistsSync = function(commandName){
    try{
        accessSync(commandName, constants.F_OK);
        return false;
    }catch(e){
        return true;
    }
};

var localExecutable = function(commandName, callback){
    access(commandName, constants.F_OK | constants.X_OK,
        function(err){
        callback(null, !err);
    });
};

var localExecutableSync = function(commandName){
    try{
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    }catch(e){
        return false;
    }
}

var commandExistsUnix = function(commandName, cleanedCommandName, callback) {

    fileNotExists(commandName, function(isFile){

        if(!isFile){
            var child = exec('command -v ' + cleanedCommandName +
                  ' 2>/dev/null' +
                  ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }',
                  function (error, stdout, stderr) {
                      callback(null, !!stdout);
                  });
            return;
        }

        localExecutable(commandName, callback);
    });

}

var commandExistsWindows = function(commandName, cleanedCommandName, callback) {
  if (/[\x00-\x1f<>:"\|\?\*]/.test(commandName)) {
    callback(null, false);
    return;
  }
  var child = exec('where ' + cleanedCommandName,
    function (error) {
      if (error !== null){
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  )
}

var commandExistsUnixSync = function(commandName, cleanedCommandName) {
  if(fileNotExistsSync(commandName)){
      try {
        var stdout = execSync('command -v ' + cleanedCommandName +
              ' 2>/dev/null' +
              ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }'
              );
        return !!stdout;
      } catch (error) {
        return false;
      }
  }
  return localExecutableSync(commandName);
}

var commandExistsWindowsSync = function(commandName, cleanedCommandName, callback) {
  if (/[\x00-\x1f<>:"\|\?\*]/.test(commandName)) {
    return false;
  }
  try {
      var stdout = execSync('where ' + cleanedCommandName, {stdio: []});
      return !!stdout;
  } catch (error) {
      return false;
  }
}

var cleanInput = function(s) {
  if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
    s = "'"+s.replace(/'/g,"'\\''")+"'";
    s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
      .replace(/\\'''/g, "\\'" ); // remove non-escaped single-quote if there are enclosed between 2 escaped
  }
  return s;
}

if (isUsingWindows) {
  cleanInput = function(s) {
    var isPathName = /[\\]/.test(s);
    if (isPathName) {
      var dirname = '"' + path.dirname(s) + '"';
      var basename = '"' + path.basename(s) + '"';
      return dirname + ':' + basename;
    }
    return '"' + s + '"';
  }
}

module.exports = function commandExists(commandName, callback) {
  var cleanedCommandName = cleanInput(commandName);
  if (!callback && typeof Promise !== 'undefined') {
    return new Promise(function(resolve, reject){
      commandExists(commandName, function(error, output) {
        if (output) {
          resolve(commandName);
        } else {
          reject(error);
        }
      });
    });
  }
  if (isUsingWindows) {
    commandExistsWindows(commandName, cleanedCommandName, callback);
  } else {
    commandExistsUnix(commandName, cleanedCommandName, callback);
  }
};

module.exports.sync = function(commandName) {
  var cleanedCommandName = cleanInput(commandName);
  if (isUsingWindows) {
    return commandExistsWindowsSync(commandName, cleanedCommandName);
  } else {
    return commandExistsUnixSync(commandName, cleanedCommandName);
  }
};


/***/ }),

/***/ "./node_modules/deep-is/index.js":
/*!***************************************!*\
  !*** ./node_modules/deep-is/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var pSlice = Array.prototype.slice;
var Object_keys = typeof Object.keys === 'function'
    ? Object.keys
    : function (obj) {
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }
;

var deepEqual = module.exports = function (actual, expected) {
  // enforce Object.is +0 !== -0
  if (actual === 0 && expected === 0) {
    return areZerosEqual(actual, expected);

  // 7.1. All identical values are equivalent, as determined by ===.
  } else if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  } else if (isNumberNaN(actual)) {
    return isNumberNaN(expected);

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function isNumberNaN(value) {
  // NaN === NaN -> false
  return typeof value == 'number' && value !== value;
}

function areZerosEqual(zeroA, zeroB) {
  // (1 / +0|0) -> Infinity, but (1 / -0) -> -Infinity and (Infinity !== -Infinity)
  return (1 / zeroA) === (1 / zeroB);
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;

  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b);
  }
  try {
    var ka = Object_keys(a),
        kb = Object_keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}


/***/ }),

/***/ "./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ "./node_modules/hasbin/lib/hasbin.js":
/*!*******************************************!*\
  !*** ./node_modules/hasbin/lib/hasbin.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var async = __webpack_require__(/*! async */ "./node_modules/async/lib/async.js");
var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");

module.exports = hasbin;
hasbin.async = hasbin;
hasbin.sync = hasbinSync;
hasbin.all = hasbinAll;
hasbin.all.sync = hasbinAllSync;
hasbin.some = hasbinSome;
hasbin.some.sync = hasbinSomeSync;
hasbin.first = hasbinFirst;
hasbin.first.sync = hasbinFirstSync;

hasbin.every = hasbin.all;
hasbin.any = hasbin.some;

function hasbin (bin, done) {
	async.some(getPaths(bin), fileExists, done);
}

function hasbinSync (bin) {
	return getPaths(bin).some(fileExistsSync);
}

function hasbinAll (bins, done) {
	async.every(bins, hasbin.async, done);
}

function hasbinAllSync (bins) {
	return bins.every(hasbin.sync);
}

function hasbinSome (bins, done) {
	async.some(bins, hasbin.async, done);
}

function hasbinSomeSync (bins) {
	return bins.some(hasbin.sync);
}

function hasbinFirst (bins, done) {
	async.detect(bins, hasbin.async, function (result) {
		done(result || false);
	});
}

function hasbinFirstSync (bins) {
	var matched = bins.filter(hasbin.sync);
	return matched.length ? matched[0] : false;
}

function getPaths (bin) {
	var envPath = (process.env.PATH || '');
	var envExt = (process.env.PATHEXT || '');
	return envPath.replace(/["]+/g, '').split(path.delimiter).map(function (chunk) {
		return envExt.split(path.delimiter).map(function (ext) {
			return path.join(chunk, bin + ext);
		});
	}).reduce(function (a, b) {
		return a.concat(b);
	});
}

function fileExists (filePath, done) {
	fs.stat(filePath, function (error, stat) {
		if (error) {
			return done(false);
		}
		done(stat.isFile());
	});
}

function fileExistsSync (filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch (error) {
		return false;
	}
}


/***/ }),

/***/ "./node_modules/ip-regex/index.js":
/*!****************************************!*\
  !*** ./node_modules/ip-regex/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';

const v6seg = '[0-9a-fA-F]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

const ip = module.exports = opts => opts && opts.exact ?
	new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
	new RegExp(`(?:${v4})|(?:${v6})`, 'g');

ip.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, 'g');
ip.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, 'g');


/***/ }),

/***/ "./node_modules/is-url/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-url/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * Expose `isUrl`.
 */

module.exports = isUrl;

/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */

var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isUrl(string){
  if (typeof string !== 'string') {
    return false;
  }

  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
      nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}


/***/ }),

/***/ "./node_modules/is2/index.js":
/*!***********************************!*\
  !*** ./node_modules/is2/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview
 * is2 derived from is by Enrico Marino, adapted for Node.js.
 * Slightly modified by Edmond Meinfelder
 *
 * is
 * the definitive JavaScript type testing library
 * Copyright(c) 2013,2014 Edmond Meinfelder <edmond@stdarg.com>
 * Copyright(c) 2011 Enrico Marino <enrico.marino@email.com>
 * MIT license
 */

const owns = {}.hasOwnProperty;
const toString = {}.toString;
const is = exports;
const deepIs = __webpack_require__(/*! deep-is */ "./node_modules/deep-is/index.js");
const ipRegEx =  __webpack_require__(/*! ip-regex */ "./node_modules/ip-regex/index.js");
is.version = __webpack_require__(/*! ./package.json */ "./node_modules/is2/package.json").version;

////////////////////////////////////////////////////////////////////////////////
// Environment

/**
 * Tests if is is running under a browser.
 * @return {Boolean} true if the environment has process, process.version and process.versions.
 */
is.browser = function() {
    return (!is.node() && typeof window !== 'undefined' && toString.call(window) === '[object global]');
};

/**
 * Test if 'value' is defined.
 * Alias: def
 * @param {Any} value The value to test.
 * @return {Boolean} true if 'value' is defined, false otherwise.
 */
is.defined = function(value) {
    return typeof value !== 'undefined';
};
is.def = is.defined;

/**
 * Tests if is is running under node.js
 * @return {Boolean} true if the environment has process, process.version and process.versions.
 */
is.nodejs = function() {
    return (process && process.hasOwnProperty('version') &&
            process.hasOwnProperty('versions'));
};
is.node = is.nodejs;

/**
 * Test if 'value' is undefined.
 * Aliases: undef, udef
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is undefined, false otherwise.
 */
is.undefined = function(value) {
    return value === undefined;
};
is.udef = is.undef = is.undefined;


////////////////////////////////////////////////////////////////////////////////
// Types

/**
 * Test if 'value' is an array.
 * Alias: ary, arry
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is an array, false otherwise.
 */
is.array = function(value) {
    return '[object Array]' === toString.call(value);
};
is.arr = is.ary = is.arry = is.array;

/**
 * Test if 'value' is an arraylike object (i.e. it has a length property with a valid value)
 * Aliases: arraylike, arryLike, aryLike
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is an arguments object, false otherwise.
 */
is.arrayLike = function(value) {
    if (is.nullOrUndef(value))
        return false;
    return value !== undefined &&
        owns.call(value, 'length') &&
        isFinite(value.length);
};
is.arrLike = is.arryLike = is.aryLike = is.arraylike = is.arrayLike;

/**
 * Test if 'value' is an arguments object.
 * Alias: args
 * @param {Any} value value to test
 * @return {Boolean} true if 'value' is an arguments object, false otherwise
 */
is.arguments = function(value) {
    return '[object Arguments]' === toString.call(value);
};
is.args = is.arguments;

/**
 * Test if 'value' is a boolean.
 * Alias: bool
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is a boolean, false otherwise.
 */
is.boolean = function(value) {
    return '[object Boolean]' === toString.call(value);
};
is.bool = is.boolean;

/**
 * Test if 'value' is an instance of Buffer.
 * Aliases: instOf, instanceof
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is an instance of 'constructor'.
 */
is.buffer = function(value) {
    return is.nodejs() && Buffer && Buffer.hasOwnProperty('isBuffer') && Buffer.isBuffer(value);
};
is.buff = is.buf = is.buffer;

/**
 * Test if 'value' is a date.
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is a date, false otherwise.
 */
is.date = function(value) {
    return '[object Date]' === toString.call(value);
};

/**
 * Test if 'value' is an error object.
 * Alias: err
 * @param value value to test.
 * @return {Boolean} true if 'value' is an error object, false otherwise.
 */
is.error = function(value) {
    return '[object Error]' === toString.call(value);
};
is.err = is.error;

/**
 * Test if 'value' is false.
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is false, false otherwise
 */
is.false = function(value) {
    return value === false;
};

/**
 * Test if 'value' is a function or async function.
 * Alias: func
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is a function, false otherwise.
 */
is.function = function(value) {
    return is.syncFunction(value) || is.asyncFunction(value)
};
is.fun = is.func = is.function;

/**
 * Test if 'value' is an async function using `async () => {}` or `async function () {}`.
 * Alias: func
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is a function, false otherwise.
 */
is.asyncFunction = function(value) {
  return '[object AsyncFunction]' === toString.call(value);
}
is.asyncFun = is.asyncFunc = is.asyncFunction;

/**
 * Test if 'value' is a synchronous function.
 * Alias: syncFunc
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is a function, false otherwise.
 */
is.syncFunction = function (value) {
  return '[object Function]' === toString.call(value);
}
is.syncFun = is.syncFunc = is.syncFunction
/**
 * Test if 'value' is null.
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is null, false otherwise.
 */
is.null = function(value) {
    return value === null;
};

/**
 * Test is 'value' is either null or undefined.
 * Alias: nullOrUndef
 * @param {Any} value value to test.
 * @return {Boolean} True if value is null or undefined, false otherwise.
 */
is.nullOrUndefined = function(value) {
    return value === null || typeof value === 'undefined';
};
is.nullOrUndef = is.nullOrUndefined;

/**
 * Test if 'value' is a number.
 * Alias: num
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a number, false otherwise.
 */
is.number = function(value) {
    return '[object Number]' === toString.call(value);
};
is.num = is.number;

/**
 * Test if 'value' is an object. Note: Arrays, RegExps, Date, Error, etc all return false.
 * Alias: obj
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is an object, false otherwise.
 */
is.object = function(value) {
    return '[object Object]' === toString.call(value);
};
is.obj = is.object;

/**
 * Test if 'value' is a regular expression.
 * Alias: regexp
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a regexp, false otherwise.
 */
is.regExp = function(value) {
    return '[object RegExp]' === toString.call(value);
};
is.re = is.regexp = is.regExp;

/**
 * Test if 'value' is a string.
 * Alias: str
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a string, false otherwise.
 */
is.string = function(value) {
    return '[object String]' === toString.call(value);
};
is.str = is.string;

/**
 * Test if 'value' is true.
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is true, false otherwise.
 */
is.true = function(value) {
    return value === true;
};

/**
 * Test if 'value' is a uuid (v1-v5)
 * @param {Any} value to test.
 * @return {Boolean} true if 'value is a valid RFC4122 UUID. Case non-specific.
 */
var uuidRegExp = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab]'+
                            '[0-9a-f]{3}-[0-9a-f]{12}', 'i');
is.uuid = function(value) {
    return uuidRegExp.test(value);
};

////////////////////////////////////////////////////////////////////////////////
// Object Relationships

/**
 * Test if 'value' is equal to 'other'. Works for objects and arrays and will do deep comparisions,
 * using recursion.
 * Alias: eq
 * @param {Any} value value.
 * @param {Any} other value to compare with.
 * @return {Boolean} true if 'value' is equal to 'other', false otherwise
 */
is.equal = function(value, other) {
    var type = toString.call(value);

    if (typeof value !== typeof other) {
        return false;
    }

    if (type !== toString.call(other)) {
        return false;
    }

    if ('[object Object]' === type || '[object Array]' === type) {
        return deepIs(value, other);
    } else if ('[object Function]' === type) {
        return value.prototype === other.prototype;
    } else if ('[object Date]' === type) {
        return value.getTime() === other.getTime();
    }

    return value === other;
};
is.objEquals = is.eq = is.equal;

/**
 * JS Type definitions which cannot host values.
 * @api private
 */
var NON_HOST_TYPES = {
    'boolean': 1,
    'number': 1,
    'string': 1,
    'undefined': 1
};

/**
 * Test if 'key' in host is an object. To be hosted means host[value] is an object.
 * @param {Any} value The value to test.
 * @param {Any} host Host that may contain value.
 * @return {Boolean} true if 'value' is hosted by 'host', false otherwise.
 */
is.hosted = function(value, host) {
    if (is.nullOrUndef(value))
        return false;
    var type = typeof host[value];
    return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * Test if 'value' is an instance of 'constructor'.
 * Aliases: instOf, instanceof
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is an instance of 'constructor'.
 */
is.instanceOf = function(value, constructor) {
    if (is.nullOrUndef(value) || is.nullOrUndef(constructor))
        return false;
    return (value instanceof constructor);
};
is.instOf = is.instanceof = is.instanceOf;

/**
 * Test if 'value' is an instance type objType.
 * Aliases: objInstOf, objectinstanceof, instOf, instanceOf
 * @param {object} objInst an object to testfor type.
 * @param {object} objType an object type to compare.
 * @return {Boolean} true if 'value' is an object, false otherwise.
 */
is.objectInstanceOf = function(objInst, objType) {
    try {
        return '[object Object]' === toString.call(objInst) && (objInst instanceof objType);
    } catch(err) {
        return false;
    }
};
is.instOf = is.instanceOf = is.objInstOf = is.objectInstanceOf;

/**
 * Test if 'value' is a type of 'type'.
 * Alias: a
 * @param value value to test.
 * @param {String} type The name of the type.
 * @return {Boolean} true if 'value' is an arguments object, false otherwise.
 */
is.type = function(value, type) {
    return typeof value === type;
};
is.a = is.type;

////////////////////////////////////////////////////////////////////////////////
// Object State

/**
 * Test if 'value' is empty. To be empty means to be an array, object or string with nothing contained.
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is empty, false otherwise.
 */
is.empty = function(value) {
    var type = toString.call(value);

    if ('[object Array]' === type || '[object Arguments]' === type) {
        return value.length === 0;
    }

    if ('[object Object]' === type) {
        for (var key in value) if (owns.call(value, key)) return false;
        return true;
    }

    if ('[object String]' === type) {
        return value === '';
    }

    return false;
};

/**
 * Test if 'value' is an arguments object that is empty.
 * Alias: args
 * @param {Any} value value to test
 * @return {Boolean} true if 'value' is an arguments object with no args, false otherwise
 */
is.emptyArguments = function(value) {
    return '[object Arguments]' === toString.call(value) && value.length === 0;
};
is.noArgs = is.emptyArgs = is.emptyArguments;

/**
 * Test if 'value' is an array containing no entries.
 * Aliases: emptyArry, emptyAry
 * @param {Any} value The value to test.
 * @return {Boolean} true if 'value' is an array with no elemnets.
 */
is.emptyArray = function(value) {
    return '[object Array]' === toString.call(value) && value.length === 0;
};
is.emptyArry = is.emptyAry = is.emptyArray;

/**
 * Test if 'value' is an empty array(like) object.
 * Aliases: arguents.empty, args.empty, ary.empty, arry.empty
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is an empty array(like), false otherwise.
 */
is.emptyArrayLike = function(value) {
    return value.length === 0;
};
is.emptyArrLike = is.emptyArrayLike;

/**
 * Test if 'value' is an empty string.
 * Alias: emptyStr
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is am empty string, false otherwise.
 */
is.emptyString = function(value) {
    return is.string(value) && value.length === 0;
};
is.emptyStr = is.emptyString;

/**
 * Test if 'value' is an array containing at least 1 entry.
 * Aliases: nonEmptyArry, nonEmptyAry
 * @param {Any} value The value to test.
 * @return {Boolean} true if 'value' is an array with at least 1 value, false otherwise.
 */
is.nonEmptyArray = function(value) {
    return '[object Array]' === toString.call(value) && value.length > 0;
};
is.nonEmptyArr = is.nonEmptyArry = is.nonEmptyAry = is.nonEmptyArray;

/**
 * Test if 'value' is an object with properties. Note: Arrays are objects.
 * Alias: nonEmptyObj
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is an object, false otherwise.
 */
is.nonEmptyObject = function(value) {
    return '[object Object]' === toString.call(value) && Object.keys(value).length > 0;
};
is.nonEmptyObj = is.nonEmptyObject;

/**
 * Test if 'value' is an object with no properties. Note: Arrays are objects.
 * Alias: nonEmptyObj
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is an object, false otherwise.
 */
is.emptyObject = function(value) {
    return '[object Object]' === toString.call(value) && Object.keys(value).length === 0;
};
is.emptyObj = is.emptyObject;

/**
 * Test if 'value' is a non-empty string.
 * Alias: nonEmptyStr
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a non-empty string, false otherwise.
 */
is.nonEmptyString = function(value) {
    return is.string(value) && value.length > 0;
};
is.nonEmptyStr = is.nonEmptyString;

////////////////////////////////////////////////////////////////////////////////
// Numeric Types within Number

/**
 * Test if 'value' is an even number.
 * @param {Number} value to test.
 * @return {Boolean} true if 'value' is an even number, false otherwise.
 */
is.even = function(value) {
    return '[object Number]' === toString.call(value) && value % 2 === 0;
};

/**
 * Test if 'value' is a decimal number.
 * Aliases: decimalNumber, decNum
 * @param {Any} value value to test.
 * @return {Boolean} true if 'value' is a decimal number, false otherwise.
 */
is.decimal = function(value) {
    return '[object Number]' === toString.call(value) && value % 1 !== 0;
};
is.dec = is.decNum = is.decimal;

/**
 * Test if 'value' is an integer.
 * Alias: integer
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is an integer, false otherwise.
 */
is.integer = function(value) {
    return '[object Number]' === toString.call(value) && value % 1 === 0;
};
is.int = is.integer;

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */
is.notANumber = function(value) {
    return !is.num(value) || value !== value;
};
is.nan = is.notANum = is.notANumber;

/**
 * Test if 'value' is an odd number.
 * @param {Number} value to test.
 * @return {Boolean} true if 'value' is an odd number, false otherwise.
 */
is.odd = function(value) {
    return !is.decimal(value) && '[object Number]' === toString.call(value) && value % 2 !== 0;
};
is.oddNumber = is.oddNum = is.odd;

////////////////////////////////////////////////////////////////////////////////
// Numeric Type & State

/**
 * Test if 'value' is a positive number.
 * Alias: positiveNum, posNum
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a number, false otherwise.
 */
is.positiveNumber = function(value) {
    return '[object Number]' === toString.call(value) && value > 0;
};
is.pos = is.positive = is.posNum = is.positiveNum = is.positiveNumber;

/**
 * Test if 'value' is a negative number.
 * Aliases: negNum, negativeNum
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a number, false otherwise.
 */
is.negativeNumber = function(value) {
    return '[object Number]' === toString.call(value) && value < 0;
};
is.neg = is.negNum = is.negativeNum = is.negativeNumber;

/**
 * Test if 'value' is a negative integer.
 * Aliases: negInt, negativeInteger
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a negative integer, false otherwise.
 */
is.negativeInteger = function(value) {
    return '[object Number]' === toString.call(value) && value % 1 === 0 && value < 0;
};
is.negativeInt = is.negInt = is.negativeInteger;

/**
 * Test if 'value' is a positive integer.
 * Alias: posInt
 * @param {Any} value to test.
 * @return {Boolean} true if 'value' is a positive integer, false otherwise.
 */
is.positiveInteger = function(value) {
    return '[object Number]' === toString.call(value) && value % 1 === 0 && value > 0;
};
is.posInt = is.positiveInt = is.positiveInteger;

////////////////////////////////////////////////////////////////////////////////
// Numeric Relationships

/**
 * Test if 'value' is divisible by 'n'.
 * Alias: divisBy
 * @param {Number} value value to test.
 * @param {Number} n dividend.
 * @return {Boolean} true if 'value' is divisible by 'n', false otherwise.
 */
is.divisibleBy = function(value, n) {
    if (value === 0)
        return false;
    return '[object Number]' === toString.call(value) &&
        n !== 0 &&
        value % n === 0;
};
is.divBy = is.divisBy = is.divisibleBy;

/**
 * Test if 'value' is greater than or equal to 'other'.
 * Aliases: greaterOrEq, greaterOrEqual
 * @param {Number} value value to test.
 * @param {Number} other value to compare with.
 * @return {Boolean} true, if value is greater than or equal to other, false otherwise.
 */
is.greaterOrEqualTo = function(value, other) {
    return value >= other;
};
is.greaterOrEqual = is.ge = is.greaterOrEqualTo;

/**
 * Test if 'value' is greater than 'other'.
 * Aliases: greaterThan
 * @param {Number} value value to test.
 * @param {Number} other value to compare with.
 * @return {Boolean} true, if value is greater than other, false otherwise.
 */
is.greaterThan = function(value, other) {
    return value > other;
};
is.gt = is.greaterThan;

/**
 * Test if 'value' is less than or equal to 'other'.
 * Alias: lessThanOrEq, lessThanOrEqual
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} true, if 'value' is less than or equal to 'other', false otherwise.
 */
is.lessThanOrEqualTo = function(value, other) {
    return value <= other;
};
is.lessThanOrEq = is.lessThanOrEqual = is.le = is.lessThanOrEqualTo;

/**
 * Test if 'value' is less than 'other'.
 * Alias: lessThan
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} true, if 'value' is less than 'other', false otherwise.
 */
is.lessThan = function(value, other) {
    return value < other;
};
is.lt = is.lessThan;

/**
 * Test if 'value' is greater than 'others' values.
 * Alias: max
 * @param {Number} value value to test.
 * @param {Array} others values to compare with.
 * @return {Boolean} true if 'value' is greater than 'others' values.
 */
is.maximum = function(value, others) {
    if (!is.arrayLike(others) || !is.number(value))
        return false;

    var len = others.length;
    while (--len > -1) {
        if (value < others[len]) {
            return false;
        }
    }

    return true;
};
is.max = is.maximum;

/**
 * Test if 'value' is less than 'others' values.
 * Alias: min
 * @param {Number} value value to test.
 * @param {Array} others values to compare with.
 * @return {Boolean} true if 'value' is less than 'others' values.
 */
is.minimum = function(value, others) {
    if (!is.arrayLike(others) || !is.number(value))
        return false;

    var len = others.length;
    while (--len > -1) {
        if (value > others[len]) {
            return false;
        }
    }

    return true;
};
is.min = is.minimum;

/**
 * Test if 'value' is within 'start' and 'finish'.
 * Alias: withIn
 * @param {Number} value value to test.
 * @param {Number} start lower bound.
 * @param {Number} finish upper bound.
 * @return {Boolean} true if 'value' is is within 'start' and 'finish', false otherwise.
 */
is.within = function(value, start, finish) {
    return value >= start && value <= finish;
};
is.withIn = is.within;

/**
 * Test if 'value' is within 'precision' decimal places from 'comparitor'.
 * Alias: closish, near.
 * @param {Number} value value to test
 * @param {Number} comparitor value to test 'value' against
 * @param {Number} precision number of decimals to compare floating points, defaults to 2
 * @return {Boolean} true if 'value' is within 'precision' decimal places from 'comparitor', false otherwise.
 */
is.prettyClose = function(value, comparitor, precision) {
  if (!is.number(value) || !is.number(comparitor)) return false;
  if (is.defined(precision) && !is.posInt(precision)) return false;
  if (is.undefined(precision)) precision = 2;

  return value.toFixed(precision) === comparitor.toFixed(precision);
};
is.closish = is.near = is.prettyClose;
////////////////////////////////////////////////////////////////////////////////
// Networking

/**
 * Test if a value is a valid DNS address. eg www.stdarg.com is true while
 * 127.0.0.1 is false.
 * @param {Any} value to test if a DNS address.
 * @return {Boolean} true if a DNS address, false otherwise.
 * DNS Address is made up of labels separated by '.'
 * Each label must be between 1 and 63 characters long
 * The entire hostname (including the delimiting dots) has a maximum of 255 characters.
 * Hostname may not contain other characters, such as the underscore character (_)
 * other DNS names may contain the underscore.
 */
is.dnsAddress = function(value) {
    if (!is.nonEmptyStr(value))  return false;
    if (value.length > 255)  return false;
    if (numbersLabel.test(value))  return false;
    if (!dnsLabel.test(value))  return false;
    return true;
    //var names = value.split('.');
    //if (!is.array(names) || !names.length)  return false;
    //if (names[0].indexOf('_') > -1)  return false;
    //for (var i=0; i<names.length; i++) {
        //if (!dnsLabel.test(names[i]))  return false;
    //}
    //return true;
};
is.dnsAddr = is.dns = is.dnsAddress;
var dnsLabel = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;
var numbersLabel = /^([0-9]|[0-9][0-9\-]{0,61}[0-9])(\.([0-9]|[0-9][0-9\-]{0,61}[0-9]))*$/;

/**
 * Test if value is a valid email address.
 * @param {Any} value to test if an email address.
 * @return {Boolean} true if an email address, false otherwise.
 */
is.emailAddress = function(value) {
    if (!is.nonEmptyStr(value))
        return false;
    return emailRegexp.test(value);
};
is.email = is.emailAddr = is.emailAddress;
var emailRegexp = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

/**
 * Test if a value is either an IPv4 numeric IP address.
 * The rules are:
 * must be a string
 * length must be 15 characters or less
 * There must be four octets separated by a '.'
 * No octet can be less than 0 or greater than 255.
 * @param {Any} value to test if an ip address.
 * @return {Boolean} true if an ip address, false otherwise.
 */
is.ipv4Address = function(value) {
    if (!is.nonEmptyStr(value))  return false;
    if (value.length > 15)  return false;
    var octets = value.split('.');
    if (!is.array(octets) || octets.length !== 4)  return false;
    for (var i=0; i<octets.length; i++) {
        var val = parseInt(octets[i], 10);
        if (isNaN(val))  return false;
        if (val < 0 || val > 255)  return false;
    }
    return true;
};
is.ipv4 = is.ipv4Addr = is.ipv4Address;

/**
 * Test if a value is either an IPv6 numeric IP address.
 * @param {Any} value to test if an ip address.
 * @return {Boolean} true if an ip address, false otherwise.
 */
is.ipv6Address = function(value) {
    if (!is.nonEmptyStr(value))  return false;
    return ipRegEx.v6({extract: true}).test(value);
};
is.ipv6 = is.ipv6Addr = is.ipv6Address;

/**
 * Test if a value is either an IPv4 or IPv6 numeric IP address.
 * @param {Any} value to test if an ip address.
 * @return {Boolean} true if an ip address, false otherwise.
 */
is.ipAddress = function(value) {
    if (!is.nonEmptyStr(value)) return false;
    return is.ipv4Address(value) || is.ipv6Address(value)
};
is.ip = is.ipAddr = is.ipAddress;

/**
 * Test is a value is a valid ipv4, ipv6 or DNS name.
 * Aliases: host, hostAddr, hostAddress.
 * @param {Any} value to test if a host address.
 * @return {Boolean} true if a host address, false otherwise.
 */
is.hostAddress = function(value) {
    if (!is.nonEmptyStr(value)) return false;
    return is.dns(value) || is.ipv4(value) || is.ipv6(value);
};
is.host = is.hostIp = is.hostAddr = is.hostAddress;

/**
 * Test if a number is a valid TCP port
 * @param {Any} value to test if its a valid TCP port
 */
is.port = function(value) {
    if (!is.num(value) || is.negativeInt(value) || value > 65535)
        return false;
    return true;
};

/**
 * Test if a number is a valid TCP port in the range 0-1023.
 * Alias: is.sysPort.
 * @param {Any} value to test if its a valid TCP port
 */
is.systemPort = function(value) {
    if (is.port(value) && value < 1024)
        return true;
    return false;
};
is.sysPort = is.systemPort;

/**
 * Test if a number is a valid TCP port in the range 1024-65535.
 * @param {Any} value to test if its a valid TCP port
 */
is.userPort = function(value) {
    if (is.port(value) && value > 1023)
        return true;
    return false;
};

/*
function sumDigits(num) {
    var str = num.toString();
    var sum = 0;
    for (var i = 0; i < str.length; i++)
        sum += (str[i]-0);
    return sum;
}
*/

/**
 * Test if a string is a credit card.
 * From http://en.wikipedia.org/wiki/Luhn_algorithm
 * @param {String} value to test if a credit card.
 * @return true if the string is the correct format, false otherwise
 */
is.creditCardNumber = function(str) {
    if (!is.str(str))
        return false;

    var ary = str.split('');
    var i, cnt;
    // From the rightmost digit, which is the check digit, moving left, double
    // the value of every second digit;
    for (i=ary.length-1, cnt=1; i>-1; i--, cnt++) {
        if (cnt%2 === 0)
            ary[i] *= 2;
    }

    str = ary.join('');
    var sum = 0;
    // if the product of the previous doubling operation is greater than 9
    // (e.g., 7 * 2 = 14), then sum the digits of the products (e.g., 10: 1 + 0
    // = 1, 14: 1 + 4 = 5).  We do the this by joining the array of numbers and
    // add adding the int value of all the characters in the string.
    for (i=0; i<str.length; i++)
        sum += Math.floor(str[i]);

    // If the total (sum) modulo 10 is equal to 0 (if the total ends in zero)
    // then the number is valid according to the Luhn formula; else it is not
    // valid.
    return sum % 10 === 0;
};
is.creditCard = is.creditCardNum = is.creditCardNumber;


////////////////////////////////////////////////////////////////////////////////
// The following credit card info is from:
// http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29

/**
 * Test if card number is an American Express card.
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.americanExpressCardNumber = function(str) {
    if (!is.str(str) || str.length !== 15)
        return false;

    var prefix = Math.floor(str.slice(0,2));
    if (prefix !== 34 && prefix !== 37)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.amexCard = is.amexCardNum = is.americanExpressCardNumber;

/**
 * Test if card number is a China UnionPay card.
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.chinaUnionPayCardNumber = function(str) {
    if (!is.str(str) || (str.length < 16 && str.length > 19))
        return false;

    var prefix = Math.floor(str.slice(0,2));
    if (prefix !== 62 && prefix !== 88)
        return false;

    // no validation for this card
    return true;
};
is.chinaUnion = is.chinaUnionPayCard = is.chinaUnionPayCardNumber;

/**
 * Test if card number is a Diner's Club Carte Blance card.
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.dinersClubCarteBlancheCardNumber = function(str) {
    if (!is.str(str) || str.length !== 14)
        return false;

    var prefix = Math.floor(str.slice(0,3));
    if (prefix < 300 || prefix > 305)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.dinersClubCB = is.dinersClubCarteBlancheCard =
    is.dinersClubCarteBlancheCardNumber;

/**
 * Test if card number is a Diner's Club International card.
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.dinersClubInternationalCardNumber = function(str) {
    if (!is.str(str) || str.length !== 14)
        return false;
    var prefix = Math.floor(str.slice(0,3));
    var prefix2 = Math.floor(str.slice(0,2));

    // 300-305, 309, 36, 38-39
    if ((prefix < 300 || prefix > 305) && prefix !== 309 && prefix2 !== 36 &&
        (prefix2 < 38 || prefix2 > 39)) {
        return false;
    }

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.dinersClubInt = is.dinersClubInternationalCard =
    is.dinersClubInternationalCardNumber;

/**
 * Test if card number is a Diner's Club USA & CA card.
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.dinersClubUSACanadaCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;
    var prefix = Math.floor(str.slice(0,2));

    if (prefix !== 54 && prefix !== 55)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.dinersClub = is.dinersClubUSACanCard = is.dinersClubUSACanadaCardNumber;

/**
 * Test if card number is a Diner's Club USA/CA card.
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.discoverCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;

    var prefix = Math.floor(str.slice(0,6));
    var prefix2 = Math.floor(str.slice(0,3));

    if (str.slice(0,4) !== '6011' && (prefix < 622126 || prefix > 622925) &&
        (prefix2 < 644 || prefix2 > 649) && str.slice(0,2) !== '65') {
        return false;
    }

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.discover = is.discoverCard = is.discoverCardNumber;

/**
 * Test if card number is an InstaPayment card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.instaPaymentCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;

    var prefix = Math.floor(str.slice(0,3));
    if (prefix < 637 || prefix > 639)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.instaPayment = is.instaPaymentCardNumber;

/**
 * Test if card number is a JCB card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.jcbCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;

    var prefix = Math.floor(str.slice(0,4));
    if (prefix < 3528 || prefix > 3589)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.jcb = is.jcbCard = is.jcbCardNumber;

/**
 * Test if card number is a Laser card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.laserCardNumber = function(str) {
    if (!is.str(str) || (str.length < 16 && str.length > 19))
        return false;

    var prefix = Math.floor(str.slice(0,4));
    var valid = [ 6304, 6706, 6771, 6709 ];
    if (valid.indexOf(prefix) === -1)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.laser = is.laserCard = is.laserCardNumber;

/**
 * Test if card number is a Maestro card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.maestroCardNumber = function(str) {
    if (!is.str(str) || str.length < 12 || str.length > 19)
        return false;

    var prefix = str.slice(0,4);
    var valid = [ '5018', '5020', '5038', '5612', '5893', '6304', '6759',
        '6761', '6762', '6763', '0604', '6390' ];

    if (valid.indexOf(prefix) === -1)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.maestro = is.maestroCard = is.maestroCardNumber;

/**
 * Test if card number is a Dankort card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.dankortCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;

    if (str.slice(0,4) !== '5019')
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.dankort = is.dankortCard = is.dankortCardNumber;

/**
 * Test if card number is a MasterCard card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.masterCardCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;

    var prefix = Math.floor(str.slice(0,2));
    if (prefix < 50 || prefix > 55)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};
is.masterCard = is.masterCardCard = is.masterCardCardNumber;

/**
 * Test if card number is a Visa card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.visaCardNumber = function(str) {
    if (!is.str(str) || (str.length !== 13 && str.length !== 16))
        return false;

    if ('4' !== str.slice(0,1))
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return true;
};

is.visa = is.visaCard = is.visaCardNumber;

/**
 * Test if card number is a Visa card number
 * @param {String} the credit card number string to test.
 * @return true if the string is the correct format, false otherwise
 */
is.visaElectronCardNumber = function(str) {
    if (!is.str(str) || str.length !== 16)
        return false;

    var prefix = Math.floor(str.slice(0,4));
    var valid = [ 4026, 4405, 4508, 4844, 4913, 4917 ];
    if ('417500' !== str.slice(0,6) && valid.indexOf(prefix) === -1)
        return false;

    if (!is.creditCardNumber(str))
        return false;

    return false;
};

is.visaElectron = is.visaElectronCard = is.visaElectronCardNumber;

/**
 * Test if the input is a valid MongoDB id.
 * @param {String|Object} Either a mongodb object id or a string representation.
 * @return true if the string is the correct format, false otherwise
 * Thanks to Jason Denizac (https://github.com/jden) for pointing this out.
 * https://github.com/jden/objectid/blob/master/index.js#L7-L10
 */
var objIdPattern = /^[0-9a-fA-F]{24}$/;
is.mongoId = is.objectId = is.objId = function(id) {
  return (Boolean(id) && !Array.isArray(id) && objIdPattern.test(String(id)));
};

/**
 * Test is the first argument is structly equal to any of the subsequent args.
 * @param Value to test against subsequent arguments.
 * @return true if the first value matches any of subsequent values.
 */
is.matching = is.match = is.inArgs = function(val) {
    if (arguments.length < 2)
        return false;
    var result = false;
    for (var i=1; i<arguments.length; i++) {
        var eq = is.equal(val, arguments[i]);
        result = result || eq;
    }
    return result;
};



// US Address components
/**********************************
***Definitely a work in progress***
**********************************/
/**
 * Test if a string contains a US street address
 * @param {String} the string to search
 * @return true if an address is present, false otherwise
 */
is.streetAddress = function(str) {
  if (!is.str(str))
      return false;

  var regex = /\b\d+[\s](?:[A-Za-z0-9.-]+[\s]+)+\b(ALLEY|ALY|AVENUE|AVE|BEND|BND|BLUFFS?|BLFS?|BOULEVARD|BLVD|BRANCH|BR|CENTERS?|CTRS?|CIRCLES?|CIRS?|CLIFFS?|CLFS?|COURTS?|CTS?|COVES?|CVS?|CREEK|CRK|CRESCENT|CRES|CREST|CRST|CROSSING|XING|DRIVES?|DRS?|EXPRESSWAY|EXPY|FREEWAY|FWY|HEIGHTS|HTS|HIGHWAY|HWY|HILLS?|HLS?|LANE|LN|LOOP|MANORS?|MNRS?|MOTORWAY|MTWY|MOUNT|MT|PARKS?|PARKWAYS?|PKWY|PASS|PLACE|PL|PLAZA|PLZ|POINTS?|PTS?|RIDGES?|RDGS?|ROADS?|RDS?|ROUTE|RTE?|SHOALS?|SHLS?|SHORES?|SHRS?|SPRINGS?|SPGS?|SPURS?|STREETS?|STS?|SUMMIT|SMT|TERRACE|TER|THROUGHWAY|TRWY|TRAFFICWAY|TRFY|TRAIL|TRL|TURNPIKE|TPKE|VALLEYS?|VLYS?|WAYS?)+(?:[\.\-\s\,]?)*((APARTMENT|APT|APPT|#|NUMBER|NUM|FLOOR|FL|\s)?(\d)*)\b/ig;

  return regex.test(str);
};
is.street = is.address = is.streetAddress;

/**
 * Test if a string resembles a US Zip code,
 * no regular expression will be perfect for this,
 * as there are many numbers that aren't valid zip codes
 * @param {String || Number} the string or number literal to test
 * @return true if zipcode like, false otherwise
 */
is.zipCode = function(str) {
  if (is.undefined(str) || !(is.string(str) || is.number(str)))
    return false;

  var zip = /^\d{5}(?:-\d{4})?$/;
  return zip.test(str);
};
is.zip = is.zipCode;

/**
 * Test if a string contains a US phone number
 * @param {String} the string to search
 * @return true if str contains a phone number, false otherwise.
 */
 is.phoneNumber = function(str){
   if (!is.string(str))
    return false;
   var nums = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\(?)(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\)?)\s*(?:[.-]\s*)?)?([2-9]1[02-‌​9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/g;
   return nums.test(str);
 };
 is.phone = is.phoneNumber;

/**
 * Test is a string is a valid URL
 * @param {string} val - the possible url to check
 * @return true if str contains a phone number, false otherwise.
 */
var isUrl = __webpack_require__(/*! is-url */ "./node_modules/is-url/index.js");
is.url = function(val) {
    return isUrl(val);
};
is.uri = is.url;

is.enumerator = function(val, ary){
  var value = false;

  if (!is.defined(val) || !is.defined(ary) || !is.arrayLike(ary))
    return value;

  for (var i = 0, len = ary.length; i < len; i++) {
    if (is.equal(val, ary[i])) {
      value = true;
      break;
    }
  }
  return value;
};
is.enum = is.inArray = is.enumerator;


/***/ }),

/***/ "./node_modules/is2/package.json":
/*!***************************************!*\
  !*** ./node_modules/is2/package.json ***!
  \***************************************/
/*! exports provided: _args, _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _spec, _where, author, bugs, dependencies, description, devDependencies, engines, homepage, keywords, license, main, maintainers, name, repository, scripts, tags, version, default */
/***/ (function(module) {

module.exports = {"_args":[["is2@2.0.1","c:\\users\\jordan.jordanspc\\desktop\\fyp\\cortex-debug-master\\cortex-debug-master"]],"_from":"is2@2.0.1","_id":"is2@2.0.1","_inBundle":false,"_integrity":"sha512-+WaJvnaA7aJySz2q/8sLjMb2Mw14KTplHmSwcSpZ/fWJPkUmqw3YTzSWbPJ7OAwRvdYTWF2Wg+yYJ1AdP5Z8CA==","_location":"/is2","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"is2@2.0.1","name":"is2","escapedName":"is2","rawSpec":"2.0.1","saveSpec":null,"fetchSpec":"2.0.1"},"_requiredBy":["/tcp-port-used"],"_resolved":"https://registry.npmjs.org/is2/-/is2-2.0.1.tgz","_spec":"2.0.1","_where":"c:\\users\\jordan.jordanspc\\desktop\\fyp\\cortex-debug-master\\cortex-debug-master","author":{"name":"Enrico Marino","email":"enrico.marino@email.com"},"bugs":{"url":"http://github.com/stdarg/is/issues"},"dependencies":{"deep-is":"^0.1.3","ip-regex":"^2.1.0","is-url":"^1.2.2"},"description":"A type checking library where each exported function returns either true or false and does not throw. Also added tests.","devDependencies":{"jsdom":"0.5.0","mocha":"5.0.1","mongodb":"3.0.2"},"engines":{"node":">=v0.10.0"},"homepage":"http://github.com/stdarg/is2","keywords":["type","check","checker","checking","utilities","network","networking","credit","card","validation"],"license":"MIT","main":"./index.js","maintainers":"Edmond Meinfelder <edmond@stdarg.com>, Chris Oyler <christopher.oyler@gmail.com>","name":"is2","repository":{"type":"git","url":"git+ssh://git@github.com/stdarg/is2.git"},"scripts":{"test":"mocha -C --reporter list tests.js"},"tags":["type","check","checker","checking","utilities","network","networking","credit","card","validation"],"version":"2.0.1"};

/***/ }),

/***/ "./node_modules/mkdirp/index.js":
/*!**************************************!*\
  !*** ./node_modules/mkdirp/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path");
var fs = __webpack_require__(/*! fs */ "fs");
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                if (path.dirname(p) === p) return cb(er);
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "./node_modules/os-tmpdir/index.js":
/*!*****************************************!*\
  !*** ./node_modules/os-tmpdir/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isWindows = process.platform === 'win32';
var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;

// https://github.com/nodejs/node/blob/3e7a14381497a3b73dda68d05b5130563cdab420/lib/os.js#L25-L43
module.exports = function () {
	var path;

	if (isWindows) {
		path = process.env.TEMP ||
			process.env.TMP ||
			(process.env.SystemRoot || process.env.windir) + '\\temp';
	} else {
		path = process.env.TMPDIR ||
			process.env.TMP ||
			process.env.TEMP ||
			'/tmp';
	}

	if (trailingSlashRe.test(path)) {
		path = path.slice(0, -1);
	}

	return path;
};


/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const hasFlag = __webpack_require__(/*! has-flag */ "./node_modules/has-flag/index.js");

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ "./node_modules/tcp-port-used/index.js":
/*!*********************************************!*\
  !*** ./node_modules/tcp-port-used/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview
 * A simple promises-based check to see if a TCP port is already in use.
 */


// define the exports first to avoid cyclic dependencies.
exports.check = check;
exports.waitUntilFreeOnHost = waitUntilFreeOnHost;
exports.waitUntilFree = waitUntilFree;
exports.waitUntilUsedOnHost = waitUntilUsedOnHost;
exports.waitUntilUsed = waitUntilUsed;
exports.waitForStatus = waitForStatus;

var is = __webpack_require__(/*! is2 */ "./node_modules/is2/index.js");
var net = __webpack_require__(/*! net */ "net");
var util = __webpack_require__(/*! util */ "util");
var debug = __webpack_require__(/*! debug */ "./node_modules/tcp-port-used/node_modules/debug/src/index.js")('tcp-port-used');

// Global Values
var TIMEOUT = 2000;
var RETRYTIME = 250;

function getDeferred() {
    var resolve, reject, promise = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
    });

    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}

/**
 * Creates an options object from all the possible arguments
 * @private
 * @param {Number} port a valid TCP port number
 * @param {String} host The DNS name or IP address.
 * @param {Boolean} status The desired in use status to wait for: false === not in use, true === in use
 * @param {Number} retryTimeMs the retry interval in milliseconds - defaultis is 200ms
 * @param {Number} timeOutMs the amount of time to wait until port is free default is 1000ms
 * @return {Object} An options object with all the above parameters as properties.
 */
function makeOptionsObj(port, host, inUse, retryTimeMs, timeOutMs) {
    var opts = {};
    opts.port = port;
    opts.host = host;
    opts.inUse = inUse;
    opts.retryTimeMs = retryTimeMs;
    opts.timeOutMs = timeOutMs;
    return opts;
}

/**
 * Checks if a TCP port is in use by creating the socket and binding it to the
 * target port. Once bound, successfully, it's assume the port is availble.
 * After the socket is closed or in error, the promise is resolved.
 * Note: you have to be super user to correctly test system ports (0-1023).
 * @param {Number|Object} port The port you are curious to see if available. If an object, must have the parameters as properties.
 * @param {String} [host] May be a DNS name or IP address. Default '127.0.0.1'
 * @return {Object} A deferred Q promise.
 *
 * Example usage:
 *
 * var tcpPortUsed = require('tcp-port-used');
 * tcpPortUsed.check(22, '127.0.0.1')
 * .then(function(inUse) {
 *    debug('Port 22 usage: '+inUse);
 * }, function(err) {
 *    console.error('Error on check: '+util.inspect(err));
 * });
 */
function check(port, host) {

    var deferred = getDeferred();
    var inUse = true;
    var client;

    var opts;
    if (!is.obj(port)) {
        opts = makeOptionsObj(port, host);
    } else {
        opts = port;
    }

    if (!is.port(opts.port)) {
        debug('Error invalid port: '+util.inspect(opts.port));
        deferred.reject(new Error('invalid port: '+util.inspect(opts.port)));
        return deferred.promise;
    }

    if (is.nullOrUndefined(opts.host)) {
        debug('set host address to default 127.0.0.1');
        opts.host = '127.0.0.1';
    }

    function cleanUp() {
        if (client) {
            client.removeAllListeners('connect');
            client.removeAllListeners('error');
            client.end();
            client.destroy();
            client.unref();
        }
        //debug('listeners removed from client socket');
    }

    function onConnectCb() {
        //debug('check - promise resolved - in use');
        deferred.resolve(inUse);
        cleanUp();
    }

    function onErrorCb(err) {
        if (err.code !== 'ECONNREFUSED') {
            //debug('check - promise rejected, error: '+err.message);
            deferred.reject(err);
        } else {
            //debug('ECONNREFUSED');
            inUse = false;
            //debug('check - promise resolved - not in use');
            deferred.resolve(inUse);
        }
        cleanUp();
    }

    client = new net.Socket();
    client.once('connect', onConnectCb);
    client.once('error', onErrorCb);
    client.connect({port: opts.port, host: opts.host}, function() {});

    return deferred.promise;
}

/**
 * Creates a deferred promise and fulfills it only when the socket's usage
 * equals status in terms of 'in use' (false === not in use, true === in use).
 * Will retry on an interval specified in retryTimeMs.  Note: you have to be
 * super user to correctly test system ports (0-1023).
 * @param {Number|Object} port a valid TCP port number, if an object, has all the parameters described as properties.
 * @param {String} host The DNS name or IP address.
 * @param {Boolean} status The desired in use status to wait for false === not in use, true === in use
 * @param {Number} [retryTimeMs] the retry interval in milliseconds - defaultis is 200ms
 * @param {Number} [timeOutMs] the amount of time to wait until port is free default is 1000ms
 * @return {Object} A deferred promise from the Q library.
 *
 * Example usage:
 *
 * var tcpPortUsed = require('tcp-port-used');
 * tcpPortUsed.waitForStatus(44204, 'some.host.com', true, 500, 4000)
 * .then(function() {
 *     console.log('Port 44204 is now in use.');
 * }, function(err) {
 *     console.log('Error: ', error.message);
 * });
 */
function waitForStatus(port, host, inUse, retryTimeMs, timeOutMs) {

    var deferred = getDeferred();
    var timeoutId;
    var timedout = false;
    var retryId;

    // the first arument may be an object, if it is not, make an object
    var opts;
    if (is.obj(port)) {
        opts = port;
    } else {
        opts = makeOptionsObj(port, host, inUse, retryTimeMs, timeOutMs);
    }

    //debug('opts:'+util.inspect(opts);

    if (!is.bool(opts.inUse)) {
        deferred.reject(new Error('inUse must be a boolean'));
        return deferred.promise;
    }

    if (!is.positiveInt(opts.retryTimeMs)) {
        opts.retryTimeMs = RETRYTIME;
        debug('set retryTime to default '+RETRYTIME+'ms');
    }

    if (!is.positiveInt(opts.timeOutMs)) {
        opts.timeOutMs = TIMEOUT;
        debug('set timeOutMs to default '+TIMEOUT+'ms');
    }

    function cleanUp() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (retryId) {
            clearTimeout(retryId);
        }
    }

    function timeoutFunc() {
        timedout = true;
        cleanUp();
        deferred.reject(new Error('timeout'));
    }
    timeoutId = setTimeout(timeoutFunc, opts.timeOutMs);

    function doCheck() {
        check(opts.port, opts.host)
        .then(function(inUse) {
            if (timedout) {
                return;
            }
            //debug('doCheck inUse: '+inUse);
            //debug('doCheck opts.inUse: '+opts.inUse);
            if (inUse === opts.inUse) {
                deferred.resolve();
                cleanUp();
                return;
            } else {
                retryId = setTimeout(function() { doCheck(); }, opts.retryTimeMs);
                return;
            }
        }, function(err) {
            if (timedout) {
                return;
            }
            deferred.reject(err);
            cleanUp();
        });
    }

    doCheck();
    return deferred.promise;
}

/**
 * Creates a deferred promise and fulfills it only when the socket is free.
 * Will retry on an interval specified in retryTimeMs.
 * Note: you have to be super user to correctly test system ports (0-1023).
 * @param {Number} port a valid TCP port number
 * @param {String} [host] The hostname or IP address of where the socket is.
 * @param {Number} [retryTimeMs] the retry interval in milliseconds - defaultis is 100ms.
 * @param {Number} [timeOutMs] the amount of time to wait until port is free. Default 300ms.
 * @return {Object} A deferred promise from the q library.
 *
 * Example usage:
 *
 * var tcpPortUsed = require('tcp-port-used');
 * tcpPortUsed.waitUntilFreeOnHost(44203, 'some.host.com', 500, 4000)
 * .then(function() {
 *     console.log('Port 44203 is now free.');
 *  }, function(err) {
 *     console.loh('Error: ', error.message);
 *  });
 */
function waitUntilFreeOnHost(port, host, retryTimeMs, timeOutMs) {

    // the first arument may be an object, if it is not, make an object
    var opts;
    if (is.obj(port)) {
        opts = port;
        opts.inUse = false;
    } else {
        opts = makeOptionsObj(port, host, false, retryTimeMs, timeOutMs);
    }

    return waitForStatus(opts);
}

/**
 * For compatibility with previous version of the module, that did not provide
 * arguements for hostnames. The host is set to the localhost '127.0.0.1'.
 * @param {Number|Object} port a valid TCP port number. If an object, must contain all the parameters as properties.
 * @param {Number} [retryTimeMs] the retry interval in milliseconds - defaultis is 100ms.
 * @param {Number} [timeOutMs] the amount of time to wait until port is free. Default 300ms.
 * @return {Object} A deferred promise from the q library.
 *
 * Example usage:
 *
 * var tcpPortUsed = require('tcp-port-used');
 * tcpPortUsed.waitUntilFree(44203, 500, 4000)
 * .then(function() {
 *     console.log('Port 44203 is now free.');
 *  }, function(err) {
 *     console.loh('Error: ', error.message);
 *  });
 */
function waitUntilFree(port, retryTimeMs, timeOutMs) {

    // the first arument may be an object, if it is not, make an object
    var opts;
    if (is.obj(port)) {
        opts = port;
        opts.host = '127.0.0.1';
        opts.inUse = false;
    } else {
        opts = makeOptionsObj(port, '127.0.0.1', false, retryTimeMs, timeOutMs);
    }

    return waitForStatus(opts);
}

/**
 * Creates a deferred promise and fulfills it only when the socket is used.
 * Will retry on an interval specified in retryTimeMs.
 * Note: you have to be super user to correctly test system ports (0-1023).
 * @param {Number|Object} port a valid TCP port number. If an object, must contain all the parameters as properties.
 * @param {Number} [retryTimeMs] the retry interval in milliseconds - defaultis is 500ms
 * @param {Number} [timeOutMs] the amount of time to wait until port is free
 * @return {Object} A deferred promise from the q library.
 *
 * Example usage:
 *
 * var tcpPortUsed = require('tcp-port-used');
 * tcpPortUsed.waitUntilUsedOnHost(44204, 'some.host.com', 500, 4000)
 * .then(function() {
 *     console.log('Port 44204 is now in use.');
 * }, function(err) {
 *     console.log('Error: ', error.message);
 * });
 */
function waitUntilUsedOnHost(port, host, retryTimeMs, timeOutMs) {

    // the first arument may be an object, if it is not, make an object
    var opts;
    if (is.obj(port)) {
        opts = port;
        opts.inUse = true;
    } else {
        opts = makeOptionsObj(port, host, true, retryTimeMs, timeOutMs);
    }

    return waitForStatus(opts);
}

/**
 * For compatibility to previous version of module which did not have support
 * for host addresses. This function works only for localhost.
 * @param {Number} port a valid TCP port number. If an Object, must contain all the parameters as properties.
 * @param {Number} [retryTimeMs] the retry interval in milliseconds - defaultis is 500ms
 * @param {Number} [timeOutMs] the amount of time to wait until port is free
 * @return {Object} A deferred promise from the q library.
 *
 * Example usage:
 *
 * var tcpPortUsed = require('tcp-port-used');
 * tcpPortUsed.waitUntilUsed(44204, 500, 4000)
 * .then(function() {
 *     console.log('Port 44204 is now in use.');
 * }, function(err) {
 *     console.log('Error: ', error.message);
 * });
 */
function waitUntilUsed(port, retryTimeMs, timeOutMs) {

    // the first arument may be an object, if it is not, make an object
    var opts;
    if (is.obj(port)) {
        opts = port;
        opts.host = '127.0.0.1';
        opts.inUse = true;
    } else {
        opts = makeOptionsObj(port, '127.0.0.1', true, retryTimeMs, timeOutMs);
    }

    return waitUntilUsedOnHost(opts);
}



/***/ }),

/***/ "./node_modules/tcp-port-used/node_modules/debug/src/browser.js":
/*!**********************************************************************!*\
  !*** ./node_modules/tcp-port-used/node_modules/debug/src/browser.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/tcp-port-used/node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ "./node_modules/tcp-port-used/node_modules/debug/src/common.js":
/*!*********************************************************************!*\
  !*** ./node_modules/tcp-port-used/node_modules/debug/src/common.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "./node_modules/tcp-port-used/node_modules/debug/src/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/tcp-port-used/node_modules/debug/src/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/tcp-port-used/node_modules/debug/src/browser.js");
} else {
	module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/tcp-port-used/node_modules/debug/src/node.js");
}


/***/ }),

/***/ "./node_modules/tcp-port-used/node_modules/debug/src/node.js":
/*!*******************************************************************!*\
  !*** ./node_modules/tcp-port-used/node_modules/debug/src/node.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(/*! tty */ "tty");
const util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/tcp-port-used/node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ "./node_modules/tmp/lib/tmp.js":
/*!*************************************!*\
  !*** ./node_modules/tmp/lib/tmp.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

/*
 * Module dependencies.
 */
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const osTmpDir = __webpack_require__(/*! os-tmpdir */ "./node_modules/os-tmpdir/index.js");
const _c = process.binding('constants');

/*
 * The working inner variables.
 */
const
  /**
   * The temporary directory.
   * @type {string}
   */
  tmpDir = osTmpDir(),

  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  DEFAULT_TRIES = 3,

  CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR),

  EBADF = _c.EBADF || _c.os.errno.EBADF,
  ENOENT = _c.ENOENT || _c.os.errno.ENOENT,

  DIR_MODE = 448 /* 0o700 */,
  FILE_MODE = 384 /* 0o600 */,

  // this will hold the objects need to be removed on exit
  _removeObjects = [];

var
  _gracefulCleanup = false,
  _uncaughtException = false;

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {number} howMany
 * @returns {string} the generated random name
 * @private
 */
function _randomChars(howMany) {
  var
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @returns {boolean} true if the object is undefined
 * @private
 */
function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

/**
 * Parses the function arguments.
 *
 * This function helps to have optional arguments.
 *
 * @param {(Options|Function)} options
 * @param {Function} callback
 * @returns {Array} parsed arguments
 * @private
 */
function _parseArguments(options, callback) {
  if (typeof options == 'function') {
    return [callback || {}, options];
  }

  if (_isUndefined(options)) {
    return [{}, callback];
  }

  return [options, callback];
}

/**
 * Generates a new temporary name.
 *
 * @param {Object} opts
 * @returns {string} the new random name according to opts
 * @private
 */
function _generateTmpName(opts) {
  if (opts.name) {
    return path.join(opts.dir || tmpDir, opts.name);
  }

  // mkstemps like template
  if (opts.template) {
    return opts.template.replace(TEMPLATE_PATTERN, _randomChars(6));
  }

  // prefix and postfix
  const name = [
    opts.prefix || 'tmp-',
    process.pid,
    _randomChars(12),
    opts.postfix || ''
  ].join('');

  return path.join(opts.dir || tmpDir, name);
}

/**
 * Gets a temporary file name.
 *
 * @param {(Options|tmpNameCallback)} options options or callback
 * @param {?tmpNameCallback} callback the callback function
 */
function tmpName(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1],
    tries = opts.name ? 1 : opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    return cb(new Error('Invalid template provided'));

  (function _getUniqueName() {
    const name = _generateTmpName(opts);

    // check whether the path exists then retry if needed
    fs.stat(name, function (err) {
      if (!err) {
        if (tries-- > 0) return _getUniqueName();

        return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
      }

      cb(null, name);
    });
  }());
}

/**
 * Synchronous version of tmpName.
 *
 * @param {Object} options
 * @returns {string} the generated random name
 * @throws {Error} if the options are invalid or could not generate a filename
 */
function tmpNameSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0],
    tries = opts.name ? 1 : opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    throw new Error('Invalid tries');

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    throw new Error('Invalid template provided');

  do {
    const name = _generateTmpName(opts);
    try {
      fs.statSync(name);
    } catch (e) {
      return name;
    }
  } while (tries-- > 0);

  throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
 * Creates and opens a temporary file.
 *
 * @param {(Options|fileCallback)} options the config options or the callback function
 * @param {?fileCallback} callback
 */
function file(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  opts.postfix = (_isUndefined(opts.postfix)) ? '.tmp' : opts.postfix;

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create and open the file
    fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
      if (err) return cb(err);

      if (opts.discardDescriptor) {
        return fs.close(fd, function _discardCallback(err) {
          if (err) {
            // Low probability, and the file exists, so this could be
            // ignored.  If it isn't we certainly need to unlink the
            // file, and if that fails too its error is more
            // important.
            try {
              fs.unlinkSync(name);
            } catch (e) {
              if (!isENOENT(e)) {
                err = e;
              }
            }
            return cb(err);
          }
          cb(null, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts));
        });
      }
      if (opts.detachDescriptor) {
        return cb(null, name, fd, _prepareTmpFileRemoveCallback(name, -1, opts));
      }
      cb(null, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
    });
  });
}

/**
 * Synchronous version of file.
 *
 * @param {Options} options
 * @returns {FileSyncObject} object consists of name, fd and removeCallback
 * @throws {Error} if cannot create a file
 */
function fileSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

  opts.postfix = opts.postfix || '.tmp';

  const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
  const name = tmpNameSync(opts);
  var fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
  if (opts.discardDescriptor) {
    fs.closeSync(fd); 
    fd = undefined;
  }

  return {
    name: name,
    fd: fd,
    removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts)
  };
}

/**
 * Removes files and folders in a directory recursively.
 *
 * @param {string} root
 * @private
 */
function _rmdirRecursiveSync(root) {
  const dirs = [root];

  do {
    var
      dir = dirs.pop(),
      deferred = false,
      files = fs.readdirSync(dir);

    for (var i = 0, length = files.length; i < length; i++) {
      var
        file = path.join(dir, files[i]),
        stat = fs.lstatSync(file); // lstat so we don't recurse into symlinked directories

      if (stat.isDirectory()) {
        if (!deferred) {
          deferred = true;
          dirs.push(dir);
        }
        dirs.push(file);
      } else {
        fs.unlinkSync(file);
      }
    }

    if (!deferred) {
      fs.rmdirSync(dir);
    }
  } while (dirs.length !== 0);
}

/**
 * Creates a temporary directory.
 *
 * @param {(Options|dirCallback)} options the options or the callback function
 * @param {?dirCallback} callback
 */
function dir(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
      if (err) return cb(err);

      cb(null, name, _prepareTmpDirRemoveCallback(name, opts));
    });
  });
}

/**
 * Synchronous version of dir.
 *
 * @param {Options} options
 * @returns {DirSyncObject} object consists of name and removeCallback
 * @throws {Error} if it cannot create a directory
 */
function dirSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

  const name = tmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || DIR_MODE);

  return {
    name: name,
    removeCallback: _prepareTmpDirRemoveCallback(name, opts)
  };
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * @param {string} name the path of the file
 * @param {number} fd file descriptor
 * @param {Object} opts
 * @returns {fileCallback}
 * @private
 */
function _prepareTmpFileRemoveCallback(name, fd, opts) {
  const removeCallback = _prepareRemoveCallback(function _removeCallback(fdPath) {
    try {
      if (0 <= fdPath[0]) {
        fs.closeSync(fdPath[0]);
      }
    }
    catch (e) {
      // under some node/windows related circumstances, a temporary file
      // may have not be created as expected or the file was already closed
      // by the user, in which case we will simply ignore the error
      if (!isEBADF(e) && !isENOENT(e)) {
        // reraise any unanticipated error
        throw e;
      }
    }
    try {
      fs.unlinkSync(fdPath[1]);
    }
    catch (e) {
      if (!isENOENT(e)) {
        // reraise any unanticipated error
        throw e;
      }
    }
  }, [fd, name]);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * @param {string} name
 * @param {Object} opts
 * @returns {Function} the callback
 * @private
 */
function _prepareTmpDirRemoveCallback(name, opts) {
  const removeFunction = opts.unsafeCleanup ? _rmdirRecursiveSync : fs.rmdirSync.bind(fs);
  const removeCallback = _prepareRemoveCallback(removeFunction, name);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
}

/**
 * Creates a guarded function wrapping the removeFunction call.
 *
 * @param {Function} removeFunction
 * @param {Object} arg
 * @returns {Function}
 * @private
 */
function _prepareRemoveCallback(removeFunction, arg) {
  var called = false;

  return function _cleanupCallback(next) {
    if (!called) {
      const index = _removeObjects.indexOf(_cleanupCallback);
      if (index >= 0) {
        _removeObjects.splice(index, 1);
      }

      called = true;
      removeFunction(arg);
    }

    if (next) next(null);
  };
}

/**
 * The garbage collector.
 *
 * @private
 */
function _garbageCollector() {
  if (_uncaughtException && !_gracefulCleanup) {
    return;
  }

  // the function being called removes itself from _removeObjects,
  // loop until _removeObjects is empty
  while (_removeObjects.length) {
    try {
      _removeObjects[0].call(null);
    } catch (e) {
      // already removed?
    }
  }
}

/**
 * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
 */
function isEBADF(error) {
  return isExpectedError(error, -EBADF, 'EBADF');
}

/**
 * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
 */
function isENOENT(error) {
  return isExpectedError(error, -ENOENT, 'ENOENT');
}

/**
 * Helper to determine whether the expected error code matches the actual code and errno,
 * which will differ between the supported node versions.
 *
 * - Node >= 7.0:
 *   error.code {String}
 *   error.errno {String|Number} any numerical value will be negated
 *
 * - Node >= 6.0 < 7.0:
 *   error.code {String}
 *   error.errno {Number} negated
 *
 * - Node >= 4.0 < 6.0: introduces SystemError
 *   error.code {String}
 *   error.errno {Number} negated
 *
 * - Node >= 0.10 < 4.0:
 *   error.code {Number} negated
 *   error.errno n/a
 */
function isExpectedError(error, code, errno) {
  return error.code == code || error.code == errno;
}

/**
 * Sets the graceful cleanup.
 *
 * Also removes the created files and directories when an uncaught exception occurs.
 */
function setGracefulCleanup() {
  _gracefulCleanup = true;
}

const version = process.versions.node.split('.').map(function (value) {
  return parseInt(value, 10);
});

if (version[0] === 0 && (version[1] < 9 || version[1] === 9 && version[2] < 5)) {
  process.addListener('uncaughtException', function _uncaughtExceptionThrown(err) {
    _uncaughtException = true;
    _garbageCollector();

    throw err;
  });
}

process.addListener('exit', function _exit(code) {
  if (code) _uncaughtException = true;
  _garbageCollector();
});

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {?number} tries the number of tries before give up the name generation
 * @property {?string} template the "mkstemp" like filename template
 * @property {?string} name fix name
 * @property {?string} dir the tmp directory to use
 * @property {?string} prefix prefix for the generated name
 * @property {?string} postfix postfix for the generated name
 */

/**
 * @typedef {Object} FileSyncObject
 * @property {string} name the name of the file
 * @property {string} fd the file descriptor
 * @property {fileCallback} removeCallback the callback function to remove the file
 */

/**
 * @typedef {Object} DirSyncObject
 * @property {string} name the name of the directory
 * @property {fileCallback} removeCallback the callback function to remove the directory
 */

/**
 * @callback tmpNameCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 */

/**
 * @callback fileCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback dirCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallback
 * @param {simpleCallback} [next] function to call after entry was removed
 */

/**
 * Callback function for function composition.
 * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
 *
 * @callback simpleCallback
 */

// exporting all the needed methods
module.exports.tmpdir = tmpDir;

module.exports.dir = dir;
module.exports.dirSync = dirSync;

module.exports.file = file;
module.exports.fileSync = fileSync;

module.exports.tmpName = tmpName;
module.exports.tmpNameSync = tmpNameSync;

module.exports.setGracefulCleanup = setGracefulCleanup;


/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/debugSession.js":
/*!**************************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/debugSession.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __webpack_require__(/*! ./protocol */ "./node_modules/vscode-debugadapter/lib/protocol.js");
const messages_1 = __webpack_require__(/*! ./messages */ "./node_modules/vscode-debugadapter/lib/messages.js");
const Net = __webpack_require__(/*! net */ "net");
const url_1 = __webpack_require__(/*! url */ "url");
class Source {
    constructor(name, path, id = 0, origin, data) {
        this.name = name;
        this.path = path;
        this.sourceReference = id;
        if (origin) {
            this.origin = origin;
        }
        if (data) {
            this.adapterData = data;
        }
    }
}
exports.Source = Source;
class Scope {
    constructor(name, reference, expensive = false) {
        this.name = name;
        this.variablesReference = reference;
        this.expensive = expensive;
    }
}
exports.Scope = Scope;
class StackFrame {
    constructor(i, nm, src, ln = 0, col = 0) {
        this.id = i;
        this.source = src;
        this.line = ln;
        this.column = col;
        this.name = nm;
    }
}
exports.StackFrame = StackFrame;
class Thread {
    constructor(id, name) {
        this.id = id;
        if (name) {
            this.name = name;
        }
        else {
            this.name = 'Thread #' + id;
        }
    }
}
exports.Thread = Thread;
class Variable {
    constructor(name, value, ref = 0, indexedVariables, namedVariables) {
        this.name = name;
        this.value = value;
        this.variablesReference = ref;
        if (typeof namedVariables === 'number') {
            this.namedVariables = namedVariables;
        }
        if (typeof indexedVariables === 'number') {
            this.indexedVariables = indexedVariables;
        }
    }
}
exports.Variable = Variable;
class Breakpoint {
    constructor(verified, line, column, source) {
        this.verified = verified;
        const e = this;
        if (typeof line === 'number') {
            e.line = line;
        }
        if (typeof column === 'number') {
            e.column = column;
        }
        if (source) {
            e.source = source;
        }
    }
}
exports.Breakpoint = Breakpoint;
class Module {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Module = Module;
class CompletionItem {
    constructor(label, start, length = 0) {
        this.label = label;
        this.start = start;
        this.length = length;
    }
}
exports.CompletionItem = CompletionItem;
class StoppedEvent extends messages_1.Event {
    constructor(reason, threadId, exceptionText) {
        super('stopped');
        this.body = {
            reason: reason
        };
        if (typeof threadId === 'number') {
            this.body.threadId = threadId;
        }
        if (typeof exceptionText === 'string') {
            this.body.text = exceptionText;
        }
    }
}
exports.StoppedEvent = StoppedEvent;
class ContinuedEvent extends messages_1.Event {
    constructor(threadId, allThreadsContinued) {
        super('continued');
        this.body = {
            threadId: threadId
        };
        if (typeof allThreadsContinued === 'boolean') {
            this.body.allThreadsContinued = allThreadsContinued;
        }
    }
}
exports.ContinuedEvent = ContinuedEvent;
class InitializedEvent extends messages_1.Event {
    constructor() {
        super('initialized');
    }
}
exports.InitializedEvent = InitializedEvent;
class TerminatedEvent extends messages_1.Event {
    constructor(restart) {
        super('terminated');
        if (typeof restart === 'boolean' || restart) {
            const e = this;
            e.body = {
                restart: restart
            };
        }
    }
}
exports.TerminatedEvent = TerminatedEvent;
class OutputEvent extends messages_1.Event {
    constructor(output, category = 'console', data) {
        super('output');
        this.body = {
            category: category,
            output: output
        };
        if (data !== undefined) {
            this.body.data = data;
        }
    }
}
exports.OutputEvent = OutputEvent;
class ThreadEvent extends messages_1.Event {
    constructor(reason, threadId) {
        super('thread');
        this.body = {
            reason: reason,
            threadId: threadId
        };
    }
}
exports.ThreadEvent = ThreadEvent;
class BreakpointEvent extends messages_1.Event {
    constructor(reason, breakpoint) {
        super('breakpoint');
        this.body = {
            reason: reason,
            breakpoint: breakpoint
        };
    }
}
exports.BreakpointEvent = BreakpointEvent;
class ModuleEvent extends messages_1.Event {
    constructor(reason, module) {
        super('module');
        this.body = {
            reason: reason,
            module: module
        };
    }
}
exports.ModuleEvent = ModuleEvent;
class LoadedSourceEvent extends messages_1.Event {
    constructor(reason, source) {
        super('loadedSource');
        this.body = {
            reason: reason,
            source: source
        };
    }
}
exports.LoadedSourceEvent = LoadedSourceEvent;
class CapabilitiesEvent extends messages_1.Event {
    constructor(capabilities) {
        super('capabilities');
        this.body = {
            capabilities: capabilities
        };
    }
}
exports.CapabilitiesEvent = CapabilitiesEvent;
var ErrorDestination;
(function (ErrorDestination) {
    ErrorDestination[ErrorDestination["User"] = 1] = "User";
    ErrorDestination[ErrorDestination["Telemetry"] = 2] = "Telemetry";
})(ErrorDestination = exports.ErrorDestination || (exports.ErrorDestination = {}));
;
class DebugSession extends protocol_1.ProtocolServer {
    constructor(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super();
        const linesAndColumnsStartAt1 = typeof obsolete_debuggerLinesAndColumnsStartAt1 === 'boolean' ? obsolete_debuggerLinesAndColumnsStartAt1 : false;
        this._debuggerLinesStartAt1 = linesAndColumnsStartAt1;
        this._debuggerColumnsStartAt1 = linesAndColumnsStartAt1;
        this._debuggerPathsAreURIs = false;
        this._clientLinesStartAt1 = true;
        this._clientColumnsStartAt1 = true;
        this._clientPathsAreURIs = false;
        this._isServer = typeof obsolete_isServer === 'boolean' ? obsolete_isServer : false;
        this.on('close', () => {
            this.shutdown();
        });
        this.on('error', (error) => {
            this.shutdown();
        });
    }
    setDebuggerPathFormat(format) {
        this._debuggerPathsAreURIs = format !== 'path';
    }
    setDebuggerLinesStartAt1(enable) {
        this._debuggerLinesStartAt1 = enable;
    }
    setDebuggerColumnsStartAt1(enable) {
        this._debuggerColumnsStartAt1 = enable;
    }
    setRunAsServer(enable) {
        this._isServer = enable;
    }
    /**
     * A virtual constructor...
     */
    static run(debugSession) {
        // parse arguments
        let port = 0;
        const args = process.argv.slice(2);
        args.forEach(function (val, index, array) {
            const portMatch = /^--server=(\d{4,5})$/.exec(val);
            if (portMatch) {
                port = parseInt(portMatch[1], 10);
            }
        });
        if (port > 0) {
            // start as a server
            console.error(`waiting for debug protocol on port ${port}`);
            Net.createServer((socket) => {
                console.error('>> accepted connection from client');
                socket.on('end', () => {
                    console.error('>> client connection closed\n');
                });
                const session = new debugSession(false, true);
                session.setRunAsServer(true);
                session.start(socket, socket);
            }).listen(port);
        }
        else {
            // start a session
            //console.error('waiting for debug protocol on stdin/stdout');
            const session = new debugSession(false);
            process.on('SIGTERM', () => {
                session.shutdown();
            });
            session.start(process.stdin, process.stdout);
        }
    }
    shutdown() {
        if (this._isServer) {
            // shutdown ignored in server mode
        }
        else {
            // wait a bit before shutting down
            setTimeout(() => {
                process.exit(0);
            }, 100);
        }
    }
    sendErrorResponse(response, codeOrMessage, format, variables, dest = ErrorDestination.User) {
        let msg;
        if (typeof codeOrMessage === 'number') {
            msg = {
                id: codeOrMessage,
                format: format
            };
            if (variables) {
                msg.variables = variables;
            }
            if (dest & ErrorDestination.User) {
                msg.showUser = true;
            }
            if (dest & ErrorDestination.Telemetry) {
                msg.sendTelemetry = true;
            }
        }
        else {
            msg = codeOrMessage;
        }
        response.success = false;
        response.message = DebugSession.formatPII(msg.format, true, msg.variables);
        if (!response.body) {
            response.body = {};
        }
        response.body.error = msg;
        this.sendResponse(response);
    }
    runInTerminalRequest(args, timeout, cb) {
        this.sendRequest('runInTerminal', args, timeout, cb);
    }
    dispatchRequest(request) {
        const response = new messages_1.Response(request);
        try {
            if (request.command === 'initialize') {
                var args = request.arguments;
                if (typeof args.linesStartAt1 === 'boolean') {
                    this._clientLinesStartAt1 = args.linesStartAt1;
                }
                if (typeof args.columnsStartAt1 === 'boolean') {
                    this._clientColumnsStartAt1 = args.columnsStartAt1;
                }
                if (args.pathFormat !== 'path') {
                    this.sendErrorResponse(response, 2018, 'debug adapter only supports native paths', null, ErrorDestination.Telemetry);
                }
                else {
                    const initializeResponse = response;
                    initializeResponse.body = {};
                    this.initializeRequest(initializeResponse, args);
                }
            }
            else if (request.command === 'launch') {
                this.launchRequest(response, request.arguments);
            }
            else if (request.command === 'attach') {
                this.attachRequest(response, request.arguments);
            }
            else if (request.command === 'disconnect') {
                this.disconnectRequest(response, request.arguments);
            }
            else if (request.command === 'terminate') {
                this.terminateRequest(response, request.arguments);
            }
            else if (request.command === 'restart') {
                this.restartRequest(response, request.arguments);
            }
            else if (request.command === 'setBreakpoints') {
                this.setBreakPointsRequest(response, request.arguments);
            }
            else if (request.command === 'setFunctionBreakpoints') {
                this.setFunctionBreakPointsRequest(response, request.arguments);
            }
            else if (request.command === 'setExceptionBreakpoints') {
                this.setExceptionBreakPointsRequest(response, request.arguments);
            }
            else if (request.command === 'configurationDone') {
                this.configurationDoneRequest(response, request.arguments);
            }
            else if (request.command === 'continue') {
                this.continueRequest(response, request.arguments);
            }
            else if (request.command === 'next') {
                this.nextRequest(response, request.arguments);
            }
            else if (request.command === 'stepIn') {
                this.stepInRequest(response, request.arguments);
            }
            else if (request.command === 'stepOut') {
                this.stepOutRequest(response, request.arguments);
            }
            else if (request.command === 'stepBack') {
                this.stepBackRequest(response, request.arguments);
            }
            else if (request.command === 'reverseContinue') {
                this.reverseContinueRequest(response, request.arguments);
            }
            else if (request.command === 'restartFrame') {
                this.restartFrameRequest(response, request.arguments);
            }
            else if (request.command === 'goto') {
                this.gotoRequest(response, request.arguments);
            }
            else if (request.command === 'pause') {
                this.pauseRequest(response, request.arguments);
            }
            else if (request.command === 'stackTrace') {
                this.stackTraceRequest(response, request.arguments);
            }
            else if (request.command === 'scopes') {
                this.scopesRequest(response, request.arguments);
            }
            else if (request.command === 'variables') {
                this.variablesRequest(response, request.arguments);
            }
            else if (request.command === 'setVariable') {
                this.setVariableRequest(response, request.arguments);
            }
            else if (request.command === 'setExpression') {
                this.setExpressionRequest(response, request.arguments);
            }
            else if (request.command === 'source') {
                this.sourceRequest(response, request.arguments);
            }
            else if (request.command === 'threads') {
                this.threadsRequest(response);
            }
            else if (request.command === 'terminateThreads') {
                this.terminateThreadsRequest(response, request.arguments);
            }
            else if (request.command === 'evaluate') {
                this.evaluateRequest(response, request.arguments);
            }
            else if (request.command === 'stepInTargets') {
                this.stepInTargetsRequest(response, request.arguments);
            }
            else if (request.command === 'gotoTargets') {
                this.gotoTargetsRequest(response, request.arguments);
            }
            else if (request.command === 'completions') {
                this.completionsRequest(response, request.arguments);
            }
            else if (request.command === 'exceptionInfo') {
                this.exceptionInfoRequest(response, request.arguments);
            }
            else if (request.command === 'loadedSources') {
                this.loadedSourcesRequest(response, request.arguments);
            }
            else if (request.command === 'dataBreakpointInfo') {
                this.dataBreakpointInfoRequest(response, request.arguments);
            }
            else if (request.command === 'setDataBreakpoints') {
                this.setDataBreakpointsRequest(response, request.arguments);
            }
            else if (request.command === 'readMemory') {
                this.readMemoryRequest(response, request.arguments);
            }
            else if (request.command === 'disassemble') {
                this.disassembleRequest(response, request.arguments);
            }
            else {
                this.customRequest(request.command, response, request.arguments);
            }
        }
        catch (e) {
            this.sendErrorResponse(response, 1104, '{_stack}', { _exception: e.message, _stack: e.stack }, ErrorDestination.Telemetry);
        }
    }
    initializeRequest(response, args) {
        // This default debug adapter does not support conditional breakpoints.
        response.body.supportsConditionalBreakpoints = false;
        // This default debug adapter does not support hit conditional breakpoints.
        response.body.supportsHitConditionalBreakpoints = false;
        // This default debug adapter does not support function breakpoints.
        response.body.supportsFunctionBreakpoints = false;
        // This default debug adapter implements the 'configurationDone' request.
        response.body.supportsConfigurationDoneRequest = true;
        // This default debug adapter does not support hovers based on the 'evaluate' request.
        response.body.supportsEvaluateForHovers = false;
        // This default debug adapter does not support the 'stepBack' request.
        response.body.supportsStepBack = false;
        // This default debug adapter does not support the 'setVariable' request.
        response.body.supportsSetVariable = false;
        // This default debug adapter does not support the 'restartFrame' request.
        response.body.supportsRestartFrame = false;
        // This default debug adapter does not support the 'stepInTargets' request.
        response.body.supportsStepInTargetsRequest = false;
        // This default debug adapter does not support the 'gotoTargets' request.
        response.body.supportsGotoTargetsRequest = false;
        // This default debug adapter does not support the 'completions' request.
        response.body.supportsCompletionsRequest = false;
        // This default debug adapter does not support the 'restart' request.
        response.body.supportsRestartRequest = false;
        // This default debug adapter does not support the 'exceptionOptions' attribute on the 'setExceptionBreakpoints' request.
        response.body.supportsExceptionOptions = false;
        // This default debug adapter does not support the 'format' attribute on the 'variables', 'evaluate', and 'stackTrace' request.
        response.body.supportsValueFormattingOptions = false;
        // This debug adapter does not support the 'exceptionInfo' request.
        response.body.supportsExceptionInfoRequest = false;
        // This debug adapter does not support the 'TerminateDebuggee' attribute on the 'disconnect' request.
        response.body.supportTerminateDebuggee = false;
        // This debug adapter does not support delayed loading of stack frames.
        response.body.supportsDelayedStackTraceLoading = false;
        // This debug adapter does not support the 'loadedSources' request.
        response.body.supportsLoadedSourcesRequest = false;
        // This debug adapter does not support the 'logMessage' attribute of the SourceBreakpoint.
        response.body.supportsLogPoints = false;
        // This debug adapter does not support the 'terminateThreads' request.
        response.body.supportsTerminateThreadsRequest = false;
        // This debug adapter does not support the 'setExpression' request.
        response.body.supportsSetExpression = false;
        // This debug adapter does not support the 'terminate' request.
        response.body.supportsTerminateRequest = false;
        // This debug adapter does not support data breakpoints.
        response.body.supportsDataBreakpoints = false;
        /** This debug adapter does not support the 'readMemory' request. */
        response.body.supportsReadMemoryRequest = false;
        /** The debug adapter does not support the 'disassemble' request. */
        response.body.supportsDisassembleRequest = false;
        this.sendResponse(response);
    }
    disconnectRequest(response, args) {
        this.sendResponse(response);
        this.shutdown();
    }
    launchRequest(response, args) {
        this.sendResponse(response);
    }
    attachRequest(response, args) {
        this.sendResponse(response);
    }
    terminateRequest(response, args) {
        this.sendResponse(response);
    }
    restartRequest(response, args) {
        this.sendResponse(response);
    }
    setBreakPointsRequest(response, args) {
        this.sendResponse(response);
    }
    setFunctionBreakPointsRequest(response, args) {
        this.sendResponse(response);
    }
    setExceptionBreakPointsRequest(response, args) {
        this.sendResponse(response);
    }
    configurationDoneRequest(response, args) {
        this.sendResponse(response);
    }
    continueRequest(response, args) {
        this.sendResponse(response);
    }
    nextRequest(response, args) {
        this.sendResponse(response);
    }
    stepInRequest(response, args) {
        this.sendResponse(response);
    }
    stepOutRequest(response, args) {
        this.sendResponse(response);
    }
    stepBackRequest(response, args) {
        this.sendResponse(response);
    }
    reverseContinueRequest(response, args) {
        this.sendResponse(response);
    }
    restartFrameRequest(response, args) {
        this.sendResponse(response);
    }
    gotoRequest(response, args) {
        this.sendResponse(response);
    }
    pauseRequest(response, args) {
        this.sendResponse(response);
    }
    sourceRequest(response, args) {
        this.sendResponse(response);
    }
    threadsRequest(response) {
        this.sendResponse(response);
    }
    terminateThreadsRequest(response, args) {
        this.sendResponse(response);
    }
    stackTraceRequest(response, args) {
        this.sendResponse(response);
    }
    scopesRequest(response, args) {
        this.sendResponse(response);
    }
    variablesRequest(response, args) {
        this.sendResponse(response);
    }
    setVariableRequest(response, args) {
        this.sendResponse(response);
    }
    setExpressionRequest(response, args) {
        this.sendResponse(response);
    }
    evaluateRequest(response, args) {
        this.sendResponse(response);
    }
    stepInTargetsRequest(response, args) {
        this.sendResponse(response);
    }
    gotoTargetsRequest(response, args) {
        this.sendResponse(response);
    }
    completionsRequest(response, args) {
        this.sendResponse(response);
    }
    exceptionInfoRequest(response, args) {
        this.sendResponse(response);
    }
    loadedSourcesRequest(response, args) {
        this.sendResponse(response);
    }
    dataBreakpointInfoRequest(response, args) {
        this.sendResponse(response);
    }
    setDataBreakpointsRequest(response, args) {
        this.sendResponse(response);
    }
    readMemoryRequest(response, args) {
        this.sendResponse(response);
    }
    disassembleRequest(response, args) {
        this.sendResponse(response);
    }
    /**
     * Override this hook to implement custom requests.
     */
    customRequest(command, response, args) {
        this.sendErrorResponse(response, 1014, 'unrecognized request', null, ErrorDestination.Telemetry);
    }
    //---- protected -------------------------------------------------------------------------------------------------
    convertClientLineToDebugger(line) {
        if (this._debuggerLinesStartAt1) {
            return this._clientLinesStartAt1 ? line : line + 1;
        }
        return this._clientLinesStartAt1 ? line - 1 : line;
    }
    convertDebuggerLineToClient(line) {
        if (this._debuggerLinesStartAt1) {
            return this._clientLinesStartAt1 ? line : line - 1;
        }
        return this._clientLinesStartAt1 ? line + 1 : line;
    }
    convertClientColumnToDebugger(column) {
        if (this._debuggerColumnsStartAt1) {
            return this._clientColumnsStartAt1 ? column : column + 1;
        }
        return this._clientColumnsStartAt1 ? column - 1 : column;
    }
    convertDebuggerColumnToClient(column) {
        if (this._debuggerColumnsStartAt1) {
            return this._clientColumnsStartAt1 ? column : column - 1;
        }
        return this._clientColumnsStartAt1 ? column + 1 : column;
    }
    convertClientPathToDebugger(clientPath) {
        if (this._clientPathsAreURIs !== this._debuggerPathsAreURIs) {
            if (this._clientPathsAreURIs) {
                return DebugSession.uri2path(clientPath);
            }
            else {
                return DebugSession.path2uri(clientPath);
            }
        }
        return clientPath;
    }
    convertDebuggerPathToClient(debuggerPath) {
        if (this._debuggerPathsAreURIs !== this._clientPathsAreURIs) {
            if (this._debuggerPathsAreURIs) {
                return DebugSession.uri2path(debuggerPath);
            }
            else {
                return DebugSession.path2uri(debuggerPath);
            }
        }
        return debuggerPath;
    }
    //---- private -------------------------------------------------------------------------------
    static path2uri(path) {
        if (process.platform === 'win32') {
            if (/^[A-Z]:/.test(path)) {
                path = path[0].toLowerCase() + path.substr(1);
            }
            path = path.replace(/\\/g, '/');
        }
        path = encodeURI(path);
        let uri = new url_1.URL(`file:`); // ignore 'path' for now
        uri.pathname = path; // now use 'path' to get the correct percent encoding (see https://url.spec.whatwg.org)
        return uri.toString();
    }
    static uri2path(sourceUri) {
        let uri = new url_1.URL(sourceUri);
        let s = decodeURIComponent(uri.pathname);
        if (process.platform === 'win32') {
            if (/^\/[a-zA-Z]:/.test(s)) {
                s = s[1].toLowerCase() + s.substr(2);
            }
            s = s.replace(/\//g, '\\');
        }
        return s;
    }
    /*
    * If argument starts with '_' it is OK to send its value to telemetry.
    */
    static formatPII(format, excludePII, args) {
        return format.replace(DebugSession._formatPIIRegexp, function (match, paramName) {
            if (excludePII && paramName.length > 0 && paramName[0] !== '_') {
                return match;
            }
            return args[paramName] && args.hasOwnProperty(paramName) ?
                args[paramName] :
                match;
        });
    }
}
DebugSession._formatPIIRegexp = /{([^}]+)}/g;
exports.DebugSession = DebugSession;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdTZXNzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlYnVnU2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztnR0FHZ0c7O0FBR2hHLHlDQUEwQztBQUMxQyx5Q0FBMkM7QUFDM0MsMkJBQTJCO0FBQzNCLDZCQUF3QjtBQUd4QixNQUFhLE1BQU07SUFLbEIsWUFBbUIsSUFBWSxFQUFFLElBQWEsRUFBRSxLQUFhLENBQUMsRUFBRSxNQUFlLEVBQUUsSUFBVTtRQUMxRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLE1BQU0sRUFBRTtZQUNMLElBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxJQUFJLEVBQUU7WUFDSCxJQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUMvQjtJQUNGLENBQUM7Q0FDRDtBQWhCRCx3QkFnQkM7QUFFRCxNQUFhLEtBQUs7SUFLakIsWUFBbUIsSUFBWSxFQUFFLFNBQWlCLEVBQUUsWUFBcUIsS0FBSztRQUM3RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzVCLENBQUM7Q0FDRDtBQVZELHNCQVVDO0FBRUQsTUFBYSxVQUFVO0lBT3RCLFlBQW1CLENBQVMsRUFBRSxFQUFVLEVBQUUsR0FBWSxFQUFFLEtBQWEsQ0FBQyxFQUFFLE1BQWMsQ0FBQztRQUN0RixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxD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QUssT0FBTyxFQUFFO1lBQ2pDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1lBQ0QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0lBSUQ7O01BRUU7SUFDTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWEsRUFBRSxVQUFtQixFQUFFLElBQTZCO1FBQ3pGLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsVUFBUyxLQUFLLEVBQUUsU0FBUztZQUM3RSxJQUFJLFVBQVUsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUMvRCxPQUFPLEtBQUssQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDOztBQWRjLDZCQUFnQixHQUFHLFlBQVksQ0FBQztBQTVrQmhELG9DQTJsQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0IHtEZWJ1Z1Byb3RvY29sfSBmcm9tICd2c2NvZGUtZGVidWdwcm90b2NvbCc7XG5pbXBvcnQge1Byb3RvY29sU2VydmVyfSBmcm9tICcuL3Byb3RvY29sJztcbmltcG9ydCB7UmVzcG9uc2UsIEV2ZW50fSBmcm9tICcuL21lc3NhZ2VzJztcbmltcG9ydCAqIGFzIE5ldCBmcm9tICduZXQnO1xuaW1wb3J0IHtVUkx9IGZyb20gJ3VybCc7XG5cblxuZXhwb3J0IGNsYXNzIFNvdXJjZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuU291cmNlIHtcblx0bmFtZTogc3RyaW5nO1xuXHRwYXRoOiBzdHJpbmc7XG5cdHNvdXJjZVJlZmVyZW5jZTogbnVtYmVyO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHBhdGg/OiBzdHJpbmcsIGlkOiBudW1iZXIgPSAwLCBvcmlnaW4/OiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMucGF0aCA9IHBhdGg7XG5cdFx0dGhpcy5zb3VyY2VSZWZlcmVuY2UgPSBpZDtcblx0XHRpZiAob3JpZ2luKSB7XG5cdFx0XHQoPGFueT50aGlzKS5vcmlnaW4gPSBvcmlnaW47XG5cdFx0fVxuXHRcdGlmIChkYXRhKSB7XG5cdFx0XHQoPGFueT50aGlzKS5hZGFwdGVyRGF0YSA9IGRhdGE7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBTY29wZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuU2NvcGUge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHZhcmlhYmxlc1JlZmVyZW5jZTogbnVtYmVyO1xuXHRleHBlbnNpdmU6IGJvb2xlYW47XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcmVmZXJlbmNlOiBudW1iZXIsIGV4cGVuc2l2ZTogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnZhcmlhYmxlc1JlZmVyZW5jZSA9IHJlZmVyZW5jZTtcblx0XHR0aGlzLmV4cGVuc2l2ZSA9IGV4cGVuc2l2ZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tGcmFtZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuU3RhY2tGcmFtZSB7XG5cdGlkOiBudW1iZXI7XG5cdHNvdXJjZTogU291cmNlO1xuXHRsaW5lOiBudW1iZXI7XG5cdGNvbHVtbjogbnVtYmVyO1xuXHRuYW1lOiBzdHJpbmc7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGk6IG51bWJlciwgbm06IHN0cmluZywgc3JjPzogU291cmNlLCBsbjogbnVtYmVyID0gMCwgY29sOiBudW1iZXIgPSAwKSB7XG5cdFx0dGhpcy5pZCA9IGk7XG5cdFx0dGhpcy5zb3VyY2UgPSBzcmM7XG5cdFx0dGhpcy5saW5lID0gbG47XG5cdFx0dGhpcy5jb2x1bW4gPSBjb2w7XG5cdFx0dGhpcy5uYW1lID0gbm07XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFRocmVhZCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuVGhyZWFkIHtcblx0aWQ6IG51bWJlcjtcblx0bmFtZTogc3RyaW5nO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubmFtZSA9ICdUaHJlYWQgIycgKyBpZDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5WYXJpYWJsZSB7XG5cdG5hbWU6IHN0cmluZztcblx0dmFsdWU6IHN0cmluZztcblx0dmFyaWFibGVzUmVmZXJlbmNlOiBudW1iZXI7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcmVmOiBudW1iZXIgPSAwLCBpbmRleGVkVmFyaWFibGVzPzogbnVtYmVyLCBuYW1lZFZhcmlhYmxlcz86IG51bWJlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHRcdHRoaXMudmFyaWFibGVzUmVmZXJlbmNlID0gcmVmO1xuXHRcdGlmICh0eXBlb2YgbmFtZWRWYXJpYWJsZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHQoPERlYnVnUHJvdG9jb2wuVmFyaWFibGU+dGhpcykubmFtZWRWYXJpYWJsZXMgPSBuYW1lZFZhcmlhYmxlcztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBpbmRleGVkVmFyaWFibGVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0KDxEZWJ1Z1Byb3RvY29sLlZhcmlhYmxlPnRoaXMpLmluZGV4ZWRWYXJpYWJsZXMgPSBpbmRleGVkVmFyaWFibGVzO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuQnJlYWtwb2ludCB7XG5cdHZlcmlmaWVkOiBib29sZWFuO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcih2ZXJpZmllZDogYm9vbGVhbiwgbGluZT86IG51bWJlciwgY29sdW1uPzogbnVtYmVyLCBzb3VyY2U/OiBTb3VyY2UpIHtcblx0XHR0aGlzLnZlcmlmaWVkID0gdmVyaWZpZWQ7XG5cdFx0Y29uc3QgZTogRGVidWdQcm90b2NvbC5CcmVha3BvaW50ID0gdGhpcztcblx0XHRpZiAodHlwZW9mIGxpbmUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRlLmxpbmUgPSBsaW5lO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGNvbHVtbiA9PT0gJ251bWJlcicpIHtcblx0XHRcdGUuY29sdW1uID0gY29sdW1uO1xuXHRcdH1cblx0XHRpZiAoc291cmNlKSB7XG5cdFx0XHRlLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vZHVsZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuTW9kdWxlIHtcblx0aWQ6IG51bWJlciB8IHN0cmluZztcblx0bmFtZTogc3RyaW5nO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyIHwgc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcGxldGlvbkl0ZW0gaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkNvbXBsZXRpb25JdGVtIHtcblx0bGFiZWw6IHN0cmluZztcblx0c3RhcnQ6IG51bWJlcjtcblx0bGVuZ3RoOiBudW1iZXI7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGxhYmVsOiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyID0gMCkge1xuXHRcdHRoaXMubGFiZWwgPSBsYWJlbDtcblx0XHR0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0b3BwZWRFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5TdG9wcGVkRXZlbnQge1xuXHRib2R5OiB7XG5cdFx0cmVhc29uOiBzdHJpbmc7XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogc3RyaW5nLCB0aHJlYWRJZD86IG51bWJlciwgZXhjZXB0aW9uVGV4dD86IHN0cmluZykge1xuXHRcdHN1cGVyKCdzdG9wcGVkJyk7XG5cdFx0dGhpcy5ib2R5ID0ge1xuXHRcdFx0cmVhc29uOiByZWFzb25cblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgdGhyZWFkSWQgPT09ICdudW1iZXInKSB7XG5cdFx0XHQodGhpcyBhcyBEZWJ1Z1Byb3RvY29sLlN0b3BwZWRFdmVudCkuYm9keS50aHJlYWRJZCA9IHRocmVhZElkO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGV4Y2VwdGlvblRleHQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHQodGhpcyBhcyBEZWJ1Z1Byb3RvY29sLlN0b3BwZWRFdmVudCkuYm9keS50ZXh0ID0gZXhjZXB0aW9uVGV4dDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbnRpbnVlZEV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkNvbnRpbnVlZEV2ZW50IHtcblx0Ym9keToge1xuXHRcdHRocmVhZElkOiBudW1iZXI7XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHRocmVhZElkOiBudW1iZXIsIGFsbFRocmVhZHNDb250aW51ZWQ/OiBib29sZWFuKSB7XG5cdFx0c3VwZXIoJ2NvbnRpbnVlZCcpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHRocmVhZElkOiB0aHJlYWRJZFxuXHRcdH07XG5cblx0XHRpZiAodHlwZW9mIGFsbFRocmVhZHNDb250aW51ZWQgPT09ICdib29sZWFuJykge1xuXHRcdFx0KDxEZWJ1Z1Byb3RvY29sLkNvbnRpbnVlZEV2ZW50PnRoaXMpLmJvZHkuYWxsVGhyZWFkc0NvbnRpbnVlZCA9IGFsbFRocmVhZHNDb250aW51ZWQ7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBJbml0aWFsaXplZEV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkluaXRpYWxpemVkRXZlbnQge1xuXHRwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoJ2luaXRpYWxpemVkJyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm1pbmF0ZWRFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5UZXJtaW5hdGVkRXZlbnQge1xuXHRwdWJsaWMgY29uc3RydWN0b3IocmVzdGFydD86IGFueSkge1xuXHRcdHN1cGVyKCd0ZXJtaW5hdGVkJyk7XG5cdFx0aWYgKHR5cGVvZiByZXN0YXJ0ID09PSAnYm9vbGVhbicgfHwgcmVzdGFydCkge1xuXHRcdFx0Y29uc3QgZTogRGVidWdQcm90b2NvbC5UZXJtaW5hdGVkRXZlbnQgPSB0aGlzO1xuXHRcdFx0ZS5ib2R5ID0ge1xuXHRcdFx0XHRyZXN0YXJ0OiByZXN0YXJ0XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgT3V0cHV0RXZlbnQgZXh0ZW5kcyBFdmVudCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuT3V0cHV0RXZlbnQge1xuXHRib2R5OiB7XG5cdFx0Y2F0ZWdvcnk6IHN0cmluZyxcblx0XHRvdXRwdXQ6IHN0cmluZyxcblx0XHRkYXRhPzogYW55XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG91dHB1dDogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nID0gJ2NvbnNvbGUnLCBkYXRhPzogYW55KSB7XG5cdFx0c3VwZXIoJ291dHB1dCcpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdGNhdGVnb3J5OiBjYXRlZ29yeSxcblx0XHRcdG91dHB1dDogb3V0cHV0XG5cdFx0fTtcblx0XHRpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLmJvZHkuZGF0YSA9IGRhdGE7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBUaHJlYWRFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5UaHJlYWRFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246IHN0cmluZyxcblx0XHR0aHJlYWRJZDogbnVtYmVyXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogc3RyaW5nLCB0aHJlYWRJZDogbnVtYmVyKSB7XG5cdFx0c3VwZXIoJ3RocmVhZCcpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHJlYXNvbjogcmVhc29uLFxuXHRcdFx0dGhyZWFkSWQ6IHRocmVhZElkXG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkJyZWFrcG9pbnRFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246IHN0cmluZyxcblx0XHRicmVha3BvaW50OiBCcmVha3BvaW50XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogc3RyaW5nLCBicmVha3BvaW50OiBCcmVha3BvaW50KSB7XG5cdFx0c3VwZXIoJ2JyZWFrcG9pbnQnKTtcblx0XHR0aGlzLmJvZHkgPSB7XG5cdFx0XHRyZWFzb246IHJlYXNvbixcblx0XHRcdGJyZWFrcG9pbnQ6IGJyZWFrcG9pbnRcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBNb2R1bGVFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5Nb2R1bGVFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246ICduZXcnIHwgJ2NoYW5nZWQnIHwgJ3JlbW92ZWQnLFxuXHRcdG1vZHVsZTogTW9kdWxlXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogJ25ldycgfCAnY2hhbmdlZCcgfCAncmVtb3ZlZCcsIG1vZHVsZTogTW9kdWxlKSB7XG5cdFx0c3VwZXIoJ21vZHVsZScpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHJlYXNvbjogcmVhc29uLFxuXHRcdFx0bW9kdWxlOiBtb2R1bGVcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2FkZWRTb3VyY2VFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5Mb2FkZWRTb3VyY2VFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246ICduZXcnIHwgJ2NoYW5nZWQnIHwgJ3JlbW92ZWQnLFxuXHRcdHNvdXJjZTogU291cmNlXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogJ25ldycgfCAnY2hhbmdlZCcgfCAncmVtb3ZlZCcsIHNvdXJjZTogU291cmNlKSB7XG5cdFx0c3VwZXIoJ2xvYWRlZFNvdXJjZScpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHJlYXNvbjogcmVhc29uLFxuXHRcdFx0c291cmNlOiBzb3VyY2Vcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDYXBhYmlsaXRpZXNFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5DYXBhYmlsaXRpZXNFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRjYXBhYmlsaXRpZXM6IERlYnVnUHJvdG9jb2wuQ2FwYWJpbGl0aWVzXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGNhcGFiaWxpdGllczogRGVidWdQcm90b2NvbC5DYXBhYmlsaXRpZXMpIHtcblx0XHRzdXBlcignY2FwYWJpbGl0aWVzJyk7XG5cdFx0dGhpcy5ib2R5ID0ge1xuXHRcdFx0Y2FwYWJpbGl0aWVzOiBjYXBhYmlsaXRpZXNcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBlbnVtIEVycm9yRGVzdGluYXRpb24ge1xuXHRVc2VyID0gMSxcblx0VGVsZW1ldHJ5ID0gMlxufTtcblxuZXhwb3J0IGNsYXNzIERlYnVnU2Vzc2lvbiBleHRlbmRzIFByb3RvY29sU2VydmVyIHtcblxuXHRwcml2YXRlIF9kZWJ1Z2dlckxpbmVzU3RhcnRBdDE6IGJvb2xlYW47XG5cdHByaXZhdGUgX2RlYnVnZ2VyQ29sdW1uc1N0YXJ0QXQxOiBib29sZWFuO1xuXHRwcml2YXRlIF9kZWJ1Z2dlclBhdGhzQXJlVVJJczogYm9vbGVhbjtcblxuXHRwcml2YXRlIF9jbGllbnRMaW5lc1N0YXJ0QXQxOiBib29sZWFuO1xuXHRwcml2YXRlIF9jbGllbnRDb2x1bW5zU3RhcnRBdDE6IGJvb2xlYW47XG5cdHByaXZhdGUgX2NsaWVudFBhdGhzQXJlVVJJczogYm9vbGVhbjtcblxuXHRwcm90ZWN0ZWQgX2lzU2VydmVyOiBib29sZWFuO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihvYnNvbGV0ZV9kZWJ1Z2dlckxpbmVzQW5kQ29sdW1uc1N0YXJ0QXQxPzogYm9vbGVhbiwgb2Jzb2xldGVfaXNTZXJ2ZXI/OiBib29sZWFuKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdGNvbnN0IGxpbmVzQW5kQ29sdW1uc1N0YXJ0QXQxID0gdHlwZW9mIG9ic29sZXRlX2RlYnVnZ2VyTGluZXNBbmRDb2x1bW5zU3RhcnRBdDEgPT09ICdib29sZWFuJyA/IG9ic29sZXRlX2RlYnVnZ2VyTGluZXNBbmRDb2x1bW5zU3RhcnRBdDEgOiBmYWxzZTtcblx0XHR0aGlzLl9kZWJ1Z2dlckxpbmVzU3RhcnRBdDEgPSBsaW5lc0FuZENvbHVtbnNTdGFydEF0MTtcblx0XHR0aGlzLl9kZWJ1Z2dlckNvbHVtbnNTdGFydEF0MSA9IGxpbmVzQW5kQ29sdW1uc1N0YXJ0QXQxO1xuXHRcdHRoaXMuX2RlYnVnZ2VyUGF0aHNBcmVVUklzID0gZmFsc2U7XG5cblx0XHR0aGlzLl9jbGllbnRMaW5lc1N0YXJ0QXQxID0gdHJ1ZTtcblx0XHR0aGlzLl9jbGllbnRDb2x1bW5zU3RhcnRBdDEgPSB0cnVlO1xuXHRcdHRoaXMuX2NsaWVudFBhdGhzQXJlVVJJcyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5faXNTZXJ2ZXIgPSB0eXBlb2Ygb2Jzb2xldGVfaXNTZXJ2ZXIgPT09ICdib29sZWFuJyA/IG9ic29sZXRlX2lzU2VydmVyIDogZmFsc2U7XG5cblx0XHR0aGlzLm9uKCdjbG9zZScsICgpID0+IHtcblx0XHRcdHRoaXMuc2h1dGRvd24oKTtcblx0XHR9KTtcblx0XHR0aGlzLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuXHRcdFx0dGhpcy5zaHV0ZG93bigpO1xuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIHNldERlYnVnZ2VyUGF0aEZvcm1hdChmb3JtYXQ6IHN0cmluZykge1xuXHRcdHRoaXMuX2RlYnVnZ2VyUGF0aHNBcmVVUklzID0gZm9ybWF0ICE9PSAncGF0aCc7XG5cdH1cblxuXHRwdWJsaWMgc2V0RGVidWdnZXJMaW5lc1N0YXJ0QXQxKGVuYWJsZTogYm9vbGVhbikge1xuXHRcdHRoaXMuX2RlYnVnZ2VyTGluZXNTdGFydEF0MSA9IGVuYWJsZTtcblx0fVxuXG5cdHB1YmxpYyBzZXREZWJ1Z2dlckNvbHVtbnNTdGFydEF0MShlbmFibGU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9kZWJ1Z2dlckNvbHVtbnNTdGFydEF0MSA9IGVuYWJsZTtcblx0fVxuXG5cdHB1YmxpYyBzZXRSdW5Bc1NlcnZlcihlbmFibGU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9pc1NlcnZlciA9IGVuYWJsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHZpcnR1YWwgY29uc3RydWN0b3IuLi5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgcnVuKGRlYnVnU2Vzc2lvbjogdHlwZW9mIERlYnVnU2Vzc2lvbikge1xuXG5cdFx0Ly8gcGFyc2UgYXJndW1lbnRzXG5cdFx0bGV0IHBvcnQgPSAwO1xuXHRcdGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG5cdFx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uICh2YWwsIGluZGV4LCBhcnJheSkge1xuXHRcdFx0Y29uc3QgcG9ydE1hdGNoID0gL14tLXNlcnZlcj0oXFxkezQsNX0pJC8uZXhlYyh2YWwpO1xuXHRcdFx0aWYgKHBvcnRNYXRjaCkge1xuXHRcdFx0XHRwb3J0ID0gcGFyc2VJbnQocG9ydE1hdGNoWzFdLCAxMCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAocG9ydCA+IDApIHtcblx0XHRcdC8vIHN0YXJ0IGFzIGEgc2VydmVyXG5cdFx0XHRjb25zb2xlLmVycm9yKGB3YWl0aW5nIGZvciBkZWJ1ZyBwcm90b2NvbCBvbiBwb3J0ICR7cG9ydH1gKTtcblx0XHRcdE5ldC5jcmVhdGVTZXJ2ZXIoKHNvY2tldCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCc+PiBhY2NlcHRlZCBjb25uZWN0aW9uIGZyb20gY2xpZW50Jyk7XG5cdFx0XHRcdHNvY2tldC5vbignZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJz4+IGNsaWVudCBjb25uZWN0aW9uIGNsb3NlZFxcbicpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbiA9IG5ldyBkZWJ1Z1Nlc3Npb24oZmFsc2UsIHRydWUpO1xuXHRcdFx0XHRzZXNzaW9uLnNldFJ1bkFzU2VydmVyKHRydWUpO1xuXHRcdFx0XHRzZXNzaW9uLnN0YXJ0KHNvY2tldCwgc29ja2V0KTtcblx0XHRcdH0pLmxpc3Rlbihwb3J0KTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBzdGFydCBhIHNlc3Npb25cblx0XHRcdC8vY29uc29sZS5lcnJvcignd2FpdGluZyBmb3IgZGVidWcgcHJvdG9jb2wgb24gc3RkaW4vc3Rkb3V0Jyk7XG5cdFx0XHRjb25zdCBzZXNzaW9uID0gbmV3IGRlYnVnU2Vzc2lvbihmYWxzZSk7XG5cdFx0XHRwcm9jZXNzLm9uKCdTSUdURVJNJywgKCkgPT4ge1xuXHRcdFx0XHRzZXNzaW9uLnNodXRkb3duKCk7XG5cdFx0XHR9KTtcblx0XHRcdHNlc3Npb24uc3RhcnQocHJvY2Vzcy5zdGRpbiwgcHJvY2Vzcy5zdGRvdXQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzaHV0ZG93bigpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5faXNTZXJ2ZXIpIHtcblx0XHRcdC8vIHNodXRkb3duIGlnbm9yZWQgaW4gc2VydmVyIG1vZGVcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gd2FpdCBhIGJpdCBiZWZvcmUgc2h1dHRpbmcgZG93blxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHByb2Nlc3MuZXhpdCgwKTtcblx0XHRcdH0sIDEwMCk7XG5cdFx0fVxuXHR9XG5cblx0cHJvdGVjdGVkIHNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlLCBjb2RlT3JNZXNzYWdlOiBudW1iZXIgfCBEZWJ1Z1Byb3RvY29sLk1lc3NhZ2UsIGZvcm1hdD86IHN0cmluZywgdmFyaWFibGVzPzogYW55LCBkZXN0OiBFcnJvckRlc3RpbmF0aW9uID0gRXJyb3JEZXN0aW5hdGlvbi5Vc2VyKTogdm9pZCB7XG5cblx0XHRsZXQgbXNnIDogRGVidWdQcm90b2NvbC5NZXNzYWdlO1xuXHRcdGlmICh0eXBlb2YgY29kZU9yTWVzc2FnZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdG1zZyA9IDxEZWJ1Z1Byb3RvY29sLk1lc3NhZ2U+IHtcblx0XHRcdFx0aWQ6IDxudW1iZXI+IGNvZGVPck1lc3NhZ2UsXG5cdFx0XHRcdGZvcm1hdDogZm9ybWF0XG5cdFx0XHR9O1xuXHRcdFx0aWYgKHZhcmlhYmxlcykge1xuXHRcdFx0XHRtc2cudmFyaWFibGVzID0gdmFyaWFibGVzO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRlc3QgJiBFcnJvckRlc3RpbmF0aW9uLlVzZXIpIHtcblx0XHRcdFx0bXNnLnNob3dVc2VyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChkZXN0ICYgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpIHtcblx0XHRcdFx0bXNnLnNlbmRUZWxlbWV0cnkgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtc2cgPSBjb2RlT3JNZXNzYWdlO1xuXHRcdH1cblxuXHRcdHJlc3BvbnNlLnN1Y2Nlc3MgPSBmYWxzZTtcblx0XHRyZXNwb25zZS5tZXNzYWdlID0gRGVidWdTZXNzaW9uLmZvcm1hdFBJSShtc2cuZm9ybWF0LCB0cnVlLCBtc2cudmFyaWFibGVzKTtcblx0XHRpZiAoIXJlc3BvbnNlLmJvZHkpIHtcblx0XHRcdHJlc3BvbnNlLmJvZHkgPSB7IH07XG5cdFx0fVxuXHRcdHJlc3BvbnNlLmJvZHkuZXJyb3IgPSBtc2c7XG5cblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwdWJsaWMgcnVuSW5UZXJtaW5hbFJlcXVlc3QoYXJnczogRGVidWdQcm90b2NvbC5SdW5JblRlcm1pbmFsUmVxdWVzdEFyZ3VtZW50cywgdGltZW91dDogbnVtYmVyLCBjYjogKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJ1bkluVGVybWluYWxSZXNwb25zZSkgPT4gdm9pZCkge1xuXHRcdHRoaXMuc2VuZFJlcXVlc3QoJ3J1bkluVGVybWluYWwnLCBhcmdzLCB0aW1lb3V0LCBjYik7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZGlzcGF0Y2hSZXF1ZXN0KHJlcXVlc3Q6IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UocmVxdWVzdCk7XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2luaXRpYWxpemUnKSB7XG5cdFx0XHRcdHZhciBhcmdzID0gPERlYnVnUHJvdG9jb2wuSW5pdGlhbGl6ZVJlcXVlc3RBcmd1bWVudHM+IHJlcXVlc3QuYXJndW1lbnRzO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXJncy5saW5lc1N0YXJ0QXQxID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0XHR0aGlzLl9jbGllbnRMaW5lc1N0YXJ0QXQxID0gYXJncy5saW5lc1N0YXJ0QXQxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2YgYXJncy5jb2x1bW5zU3RhcnRBdDEgPT09ICdib29sZWFuJykge1xuXHRcdFx0XHRcdHRoaXMuX2NsaWVudENvbHVtbnNTdGFydEF0MSA9IGFyZ3MuY29sdW1uc1N0YXJ0QXQxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFyZ3MucGF0aEZvcm1hdCAhPT0gJ3BhdGgnKSB7XG5cdFx0XHRcdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMjAxOCwgJ2RlYnVnIGFkYXB0ZXIgb25seSBzdXBwb3J0cyBuYXRpdmUgcGF0aHMnLCBudWxsLCBFcnJvckRlc3RpbmF0aW9uLlRlbGVtZXRyeSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5pdGlhbGl6ZVJlc3BvbnNlID0gPERlYnVnUHJvdG9jb2wuSW5pdGlhbGl6ZVJlc3BvbnNlPiByZXNwb25zZTtcblx0XHRcdFx0XHRpbml0aWFsaXplUmVzcG9uc2UuYm9keSA9IHt9O1xuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZVJlcXVlc3QoaW5pdGlhbGl6ZVJlc3BvbnNlLCBhcmdzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2xhdW5jaCcpIHtcblx0XHRcdFx0dGhpcy5sYXVuY2hSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkxhdW5jaFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2F0dGFjaCcpIHtcblx0XHRcdFx0dGhpcy5hdHRhY2hSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkF0dGFjaFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2Rpc2Nvbm5lY3QnKSB7XG5cdFx0XHRcdHRoaXMuZGlzY29ubmVjdFJlcXVlc3QoPERlYnVnUHJvdG9jb2wuRGlzY29ubmVjdFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3Rlcm1pbmF0ZScpIHtcblx0XHRcdFx0dGhpcy50ZXJtaW5hdGVSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3Jlc3RhcnQnKSB7XG5cdFx0XHRcdHRoaXMucmVzdGFydFJlcXVlc3QoPERlYnVnUHJvdG9jb2wuUmVzdGFydFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldEJyZWFrcG9pbnRzJykge1xuXHRcdFx0XHR0aGlzLnNldEJyZWFrUG9pbnRzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TZXRCcmVha3BvaW50c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldEZ1bmN0aW9uQnJlYWtwb2ludHMnKSB7XG5cdFx0XHRcdHRoaXMuc2V0RnVuY3Rpb25CcmVha1BvaW50c1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0RnVuY3Rpb25CcmVha3BvaW50c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldEV4Y2VwdGlvbkJyZWFrcG9pbnRzJykge1xuXHRcdFx0XHR0aGlzLnNldEV4Y2VwdGlvbkJyZWFrUG9pbnRzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TZXRFeGNlcHRpb25CcmVha3BvaW50c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2NvbmZpZ3VyYXRpb25Eb25lJykge1xuXHRcdFx0XHR0aGlzLmNvbmZpZ3VyYXRpb25Eb25lUmVxdWVzdCg8RGVidWdQcm90b2NvbC5Db25maWd1cmF0aW9uRG9uZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2NvbnRpbnVlJykge1xuXHRcdFx0XHR0aGlzLmNvbnRpbnVlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5Db250aW51ZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ25leHQnKSB7XG5cdFx0XHRcdHRoaXMubmV4dFJlcXVlc3QoPERlYnVnUHJvdG9jb2wuTmV4dFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3N0ZXBJbicpIHtcblx0XHRcdFx0dGhpcy5zdGVwSW5SZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlN0ZXBJblJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3N0ZXBPdXQnKSB7XG5cdFx0XHRcdHRoaXMuc3RlcE91dFJlcXVlc3QoPERlYnVnUHJvdG9jb2wuU3RlcE91dFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3N0ZXBCYWNrJykge1xuXHRcdFx0XHR0aGlzLnN0ZXBCYWNrUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TdGVwQmFja1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3JldmVyc2VDb250aW51ZScpIHtcblx0XHRcdFx0dGhpcy5yZXZlcnNlQ29udGludWVSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlJldmVyc2VDb250aW51ZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3Jlc3RhcnRGcmFtZScpIHtcblx0XHRcdFx0dGhpcy5yZXN0YXJ0RnJhbWVSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlJlc3RhcnRGcmFtZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2dvdG8nKSB7XG5cdFx0XHRcdHRoaXMuZ290b1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuR290b1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3BhdXNlJykge1xuXHRcdFx0XHR0aGlzLnBhdXNlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5QYXVzZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3N0YWNrVHJhY2UnKSB7XG5cdFx0XHRcdHRoaXMuc3RhY2tUcmFjZVJlcXVlc3QoPERlYnVnUHJvdG9jb2wuU3RhY2tUcmFjZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3Njb3BlcycpIHtcblx0XHRcdFx0dGhpcy5zY29wZXNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlNjb3Blc1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3ZhcmlhYmxlcycpIHtcblx0XHRcdFx0dGhpcy52YXJpYWJsZXNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlZhcmlhYmxlc1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldFZhcmlhYmxlJykge1xuXHRcdFx0XHR0aGlzLnNldFZhcmlhYmxlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TZXRWYXJpYWJsZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldEV4cHJlc3Npb24nKSB7XG5cdFx0XHRcdHRoaXMuc2V0RXhwcmVzc2lvblJlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0RXhwcmVzc2lvblJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NvdXJjZScpIHtcblx0XHRcdFx0dGhpcy5zb3VyY2VSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlNvdXJjZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3RocmVhZHMnKSB7XG5cdFx0XHRcdHRoaXMudGhyZWFkc1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuVGhyZWFkc1Jlc3BvbnNlPiByZXNwb25zZSk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAndGVybWluYXRlVGhyZWFkcycpIHtcblx0XHRcdFx0dGhpcy50ZXJtaW5hdGVUaHJlYWRzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5UZXJtaW5hdGVUaHJlYWRzUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnZXZhbHVhdGUnKSB7XG5cdFx0XHRcdHRoaXMuZXZhbHVhdGVSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkV2YWx1YXRlUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnc3RlcEluVGFyZ2V0cycpIHtcblx0XHRcdFx0dGhpcy5zdGVwSW5UYXJnZXRzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TdGVwSW5UYXJnZXRzUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnZ290b1RhcmdldHMnKSB7XG5cdFx0XHRcdHRoaXMuZ290b1RhcmdldHNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkdvdG9UYXJnZXRzUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnY29tcGxldGlvbnMnKSB7XG5cdFx0XHRcdHRoaXMuY29tcGxldGlvbnNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkNvbXBsZXRpb25zUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnZXhjZXB0aW9uSW5mbycpIHtcblx0XHRcdFx0dGhpcy5leGNlcHRpb25JbmZvUmVxdWVzdCg8RGVidWdQcm90b2NvbC5FeGNlcHRpb25JbmZvUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnbG9hZGVkU291cmNlcycpIHtcblx0XHRcdFx0dGhpcy5sb2FkZWRTb3VyY2VzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5Mb2FkZWRTb3VyY2VzUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnZGF0YUJyZWFrcG9pbnRJbmZvJykge1xuXHRcdFx0XHR0aGlzLmRhdGFCcmVha3BvaW50SW5mb1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuRGF0YUJyZWFrcG9pbnRJbmZvUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnc2V0RGF0YUJyZWFrcG9pbnRzJykge1xuXHRcdFx0XHR0aGlzLnNldERhdGFCcmVha3BvaW50c1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0RGF0YUJyZWFrcG9pbnRzUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAncmVhZE1lbW9yeScpIHtcblx0XHRcdFx0dGhpcy5yZWFkTWVtb3J5UmVxdWVzdCg8RGVidWdQcm90b2NvbC5SZWFkTWVtb3J5UmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSBpZiAocmVxdWVzdC5jb21tYW5kID09PSAnZGlzYXNzZW1ibGUnKSB7XG5cdFx0XHRcdHRoaXMuZGlzYXNzZW1ibGVSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkRpc2Fzc2VtYmxlUmVzcG9uc2U+IHJlc3BvbnNlLCByZXF1ZXN0LmFyZ3VtZW50cyk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY3VzdG9tUmVxdWVzdChyZXF1ZXN0LmNvbW1hbmQsIDxEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDExMDQsICd7X3N0YWNrfScsIHsgX2V4Y2VwdGlvbjogZS5tZXNzYWdlLCBfc3RhY2s6IGUuc3RhY2sgfSwgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpO1xuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCBpbml0aWFsaXplUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5Jbml0aWFsaXplUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuSW5pdGlhbGl6ZVJlcXVlc3RBcmd1bWVudHMpOiB2b2lkIHtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgY29uZGl0aW9uYWwgYnJlYWtwb2ludHMuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0NvbmRpdGlvbmFsQnJlYWtwb2ludHMgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgaGl0IGNvbmRpdGlvbmFsIGJyZWFrcG9pbnRzLlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNIaXRDb25kaXRpb25hbEJyZWFrcG9pbnRzID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGZ1bmN0aW9uIGJyZWFrcG9pbnRzLlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNGdW5jdGlvbkJyZWFrcG9pbnRzID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBpbXBsZW1lbnRzIHRoZSAnY29uZmlndXJhdGlvbkRvbmUnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0NvbmZpZ3VyYXRpb25Eb25lUmVxdWVzdCA9IHRydWU7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGhvdmVycyBiYXNlZCBvbiB0aGUgJ2V2YWx1YXRlJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNFdmFsdWF0ZUZvckhvdmVycyA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3N0ZXBCYWNrJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNTdGVwQmFjayA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3NldFZhcmlhYmxlJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNTZXRWYXJpYWJsZSA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3Jlc3RhcnRGcmFtZScgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzUmVzdGFydEZyYW1lID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnc3RlcEluVGFyZ2V0cycgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzU3RlcEluVGFyZ2V0c1JlcXVlc3QgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdnb3RvVGFyZ2V0cycgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzR290b1RhcmdldHNSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnY29tcGxldGlvbnMnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0NvbXBsZXRpb25zUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3Jlc3RhcnQnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1Jlc3RhcnRSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnZXhjZXB0aW9uT3B0aW9ucycgYXR0cmlidXRlIG9uIHRoZSAnc2V0RXhjZXB0aW9uQnJlYWtwb2ludHMnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0V4Y2VwdGlvbk9wdGlvbnMgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdmb3JtYXQnIGF0dHJpYnV0ZSBvbiB0aGUgJ3ZhcmlhYmxlcycsICdldmFsdWF0ZScsIGFuZCAnc3RhY2tUcmFjZScgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzVmFsdWVGb3JtYXR0aW5nT3B0aW9ucyA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdleGNlcHRpb25JbmZvJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNFeGNlcHRpb25JbmZvUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdUZXJtaW5hdGVEZWJ1Z2dlZScgYXR0cmlidXRlIG9uIHRoZSAnZGlzY29ubmVjdCcgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRUZXJtaW5hdGVEZWJ1Z2dlZSA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgZGVsYXllZCBsb2FkaW5nIG9mIHN0YWNrIGZyYW1lcy5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRGVsYXllZFN0YWNrVHJhY2VMb2FkaW5nID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ2xvYWRlZFNvdXJjZXMnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0xvYWRlZFNvdXJjZXNSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ2xvZ01lc3NhZ2UnIGF0dHJpYnV0ZSBvZiB0aGUgU291cmNlQnJlYWtwb2ludC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzTG9nUG9pbnRzID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3Rlcm1pbmF0ZVRocmVhZHMnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1Rlcm1pbmF0ZVRocmVhZHNSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3NldEV4cHJlc3Npb24nIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1NldEV4cHJlc3Npb24gPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAndGVybWluYXRlJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNUZXJtaW5hdGVSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCBkYXRhIGJyZWFrcG9pbnRzLlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNEYXRhQnJlYWtwb2ludHMgPSBmYWxzZTtcblxuXHRcdC8qKiBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3JlYWRNZW1vcnknIHJlcXVlc3QuICovXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1JlYWRNZW1vcnlSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvKiogVGhlIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ2Rpc2Fzc2VtYmxlJyByZXF1ZXN0LiAqL1xuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNEaXNhc3NlbWJsZVJlcXVlc3QgPSBmYWxzZTtcblxuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBkaXNjb25uZWN0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5EaXNjb25uZWN0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuRGlzY29ubmVjdEFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHR0aGlzLnNodXRkb3duKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgbGF1bmNoUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5MYXVuY2hSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5MYXVuY2hSZXF1ZXN0QXJndW1lbnRzKTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGF0dGFjaFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQXR0YWNoUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuQXR0YWNoUmVxdWVzdEFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCB0ZXJtaW5hdGVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZXN0YXJ0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXN0YXJ0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuUmVzdGFydEFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRCcmVha1BvaW50c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0QnJlYWtwb2ludHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRCcmVha3BvaW50c0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRGdW5jdGlvbkJyZWFrUG9pbnRzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TZXRGdW5jdGlvbkJyZWFrcG9pbnRzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2V0RnVuY3Rpb25CcmVha3BvaW50c0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRFeGNlcHRpb25CcmVha1BvaW50c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0RXhjZXB0aW9uQnJlYWtwb2ludHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRFeGNlcHRpb25CcmVha3BvaW50c0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBjb25maWd1cmF0aW9uRG9uZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQ29uZmlndXJhdGlvbkRvbmVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Db25maWd1cmF0aW9uRG9uZUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBjb250aW51ZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQ29udGludWVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Db250aW51ZUFyZ3VtZW50cykgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgbmV4dFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuTmV4dFJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLk5leHRBcmd1bWVudHMpIDogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHN0ZXBJblJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU3RlcEluUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcEluQXJndW1lbnRzKSA6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzdGVwT3V0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TdGVwT3V0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcE91dEFyZ3VtZW50cykgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgc3RlcEJhY2tSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlN0ZXBCYWNrUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcEJhY2tBcmd1bWVudHMpIDogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJldmVyc2VDb250aW51ZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmV2ZXJzZUNvbnRpbnVlUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuUmV2ZXJzZUNvbnRpbnVlQXJndW1lbnRzKSA6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZXN0YXJ0RnJhbWVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3RhcnRGcmFtZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlJlc3RhcnRGcmFtZUFyZ3VtZW50cykgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ290b1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuR290b1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkdvdG9Bcmd1bWVudHMpIDogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHBhdXNlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5QYXVzZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlBhdXNlQXJndW1lbnRzKSA6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzb3VyY2VSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNvdXJjZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNvdXJjZUFyZ3VtZW50cykgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgdGhyZWFkc1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuVGhyZWFkc1Jlc3BvbnNlKTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHRlcm1pbmF0ZVRocmVhZHNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZVRocmVhZHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5UZXJtaW5hdGVUaHJlYWRzUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzdGFja1RyYWNlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TdGFja1RyYWNlUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RhY2tUcmFjZUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzY29wZXNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNjb3Blc1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNjb3Blc0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCB2YXJpYWJsZXNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlZhcmlhYmxlc1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlZhcmlhYmxlc0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRWYXJpYWJsZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0VmFyaWFibGVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRWYXJpYWJsZUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRFeHByZXNzaW9uUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TZXRFeHByZXNzaW9uUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2V0RXhwcmVzc2lvbkFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBldmFsdWF0ZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuRXZhbHVhdGVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5FdmFsdWF0ZUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzdGVwSW5UYXJnZXRzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TdGVwSW5UYXJnZXRzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcEluVGFyZ2V0c0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnb3RvVGFyZ2V0c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuR290b1RhcmdldHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Hb3RvVGFyZ2V0c0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBjb21wbGV0aW9uc1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQ29tcGxldGlvbnNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Db21wbGV0aW9uc0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBleGNlcHRpb25JbmZvUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5FeGNlcHRpb25JbmZvUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuRXhjZXB0aW9uSW5mb0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBsb2FkZWRTb3VyY2VzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5Mb2FkZWRTb3VyY2VzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuTG9hZGVkU291cmNlc0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBkYXRhQnJlYWtwb2ludEluZm9SZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkRhdGFCcmVha3BvaW50SW5mb1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkRhdGFCcmVha3BvaW50SW5mb0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXREYXRhQnJlYWtwb2ludHNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNldERhdGFCcmVha3BvaW50c1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNldERhdGFCcmVha3BvaW50c0FyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZWFkTWVtb3J5UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZWFkTWVtb3J5UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuUmVhZE1lbW9yeUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBkaXNhc3NlbWJsZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuRGlzYXNzZW1ibGVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5EaXNhc3NlbWJsZUFyZ3VtZW50cyk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPdmVycmlkZSB0aGlzIGhvb2sgdG8gaW1wbGVtZW50IGN1c3RvbSByZXF1ZXN0cy5cblx0ICovXG5cdHByb3RlY3RlZCBjdXN0b21SZXF1ZXN0KGNvbW1hbmQ6IHN0cmluZywgcmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UsIGFyZ3M6IGFueSk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDEwMTQsICd1bnJlY29nbml6ZWQgcmVxdWVzdCcsIG51bGwsIEVycm9yRGVzdGluYXRpb24uVGVsZW1ldHJ5KTtcblx0fVxuXG5cdC8vLS0tLSBwcm90ZWN0ZWQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByb3RlY3RlZCBjb252ZXJ0Q2xpZW50TGluZVRvRGVidWdnZXIobGluZTogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAodGhpcy5fZGVidWdnZXJMaW5lc1N0YXJ0QXQxKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2xpZW50TGluZXNTdGFydEF0MSA/IGxpbmUgOiBsaW5lICsgMTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NsaWVudExpbmVzU3RhcnRBdDEgPyBsaW5lIC0gMSA6IGxpbmU7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY29udmVydERlYnVnZ2VyTGluZVRvQ2xpZW50KGxpbmU6IG51bWJlcik6IG51bWJlciB7XG5cdFx0aWYgKHRoaXMuX2RlYnVnZ2VyTGluZXNTdGFydEF0MSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NsaWVudExpbmVzU3RhcnRBdDEgPyBsaW5lIDogbGluZSAtIDE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9jbGllbnRMaW5lc1N0YXJ0QXQxID8gbGluZSArIDEgOiBsaW5lO1xuXHR9XG5cblx0cHJvdGVjdGVkIGNvbnZlcnRDbGllbnRDb2x1bW5Ub0RlYnVnZ2VyKGNvbHVtbjogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAodGhpcy5fZGVidWdnZXJDb2x1bW5zU3RhcnRBdDEpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jbGllbnRDb2x1bW5zU3RhcnRBdDEgPyBjb2x1bW4gOiBjb2x1bW4gKyAxO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2xpZW50Q29sdW1uc1N0YXJ0QXQxID8gY29sdW1uIC0gMSA6IGNvbHVtbjtcblx0fVxuXG5cdHByb3RlY3RlZCBjb252ZXJ0RGVidWdnZXJDb2x1bW5Ub0NsaWVudChjb2x1bW46IG51bWJlcik6IG51bWJlciB7XG5cdFx0aWYgKHRoaXMuX2RlYnVnZ2VyQ29sdW1uc1N0YXJ0QXQxKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2xpZW50Q29sdW1uc1N0YXJ0QXQxID8gY29sdW1uIDogY29sdW1uIC0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NsaWVudENvbHVtbnNTdGFydEF0MSA/IGNvbHVtbiArIDEgOiBjb2x1bW47XG5cdH1cblxuXHRwcm90ZWN0ZWQgY29udmVydENsaWVudFBhdGhUb0RlYnVnZ2VyKGNsaWVudFBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuX2NsaWVudFBhdGhzQXJlVVJJcyAhPT0gdGhpcy5fZGVidWdnZXJQYXRoc0FyZVVSSXMpIHtcblx0XHRcdGlmICh0aGlzLl9jbGllbnRQYXRoc0FyZVVSSXMpIHtcblx0XHRcdFx0cmV0dXJuIERlYnVnU2Vzc2lvbi51cmkycGF0aChjbGllbnRQYXRoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBEZWJ1Z1Nlc3Npb24ucGF0aDJ1cmkoY2xpZW50UGF0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBjbGllbnRQYXRoO1xuXHR9XG5cblx0cHJvdGVjdGVkIGNvbnZlcnREZWJ1Z2dlclBhdGhUb0NsaWVudChkZWJ1Z2dlclBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuX2RlYnVnZ2VyUGF0aHNBcmVVUklzICE9PSB0aGlzLl9jbGllbnRQYXRoc0FyZVVSSXMpIHtcblx0XHRcdGlmICh0aGlzLl9kZWJ1Z2dlclBhdGhzQXJlVVJJcykge1xuXHRcdFx0XHRyZXR1cm4gRGVidWdTZXNzaW9uLnVyaTJwYXRoKGRlYnVnZ2VyUGF0aCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gRGVidWdTZXNzaW9uLnBhdGgydXJpKGRlYnVnZ2VyUGF0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBkZWJ1Z2dlclBhdGg7XG5cdH1cblxuXHQvLy0tLS0gcHJpdmF0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJpdmF0ZSBzdGF0aWMgcGF0aDJ1cmkocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblxuXHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0XHRpZiAoL15bQS1aXTovLnRlc3QocGF0aCkpIHtcblx0XHRcdFx0cGF0aCA9IHBhdGhbMF0udG9Mb3dlckNhc2UoKSArIHBhdGguc3Vic3RyKDEpO1xuXHRcdFx0fVxuXHRcdFx0cGF0aCA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXHRcdH1cblx0XHRwYXRoID0gZW5jb2RlVVJJKHBhdGgpO1xuXG5cdFx0bGV0IHVyaSA9IG5ldyBVUkwoYGZpbGU6YCk7XHQvLyBpZ25vcmUgJ3BhdGgnIGZvciBub3dcblx0XHR1cmkucGF0aG5hbWUgPSBwYXRoO1x0Ly8gbm93IHVzZSAncGF0aCcgdG8gZ2V0IHRoZSBjb3JyZWN0IHBlcmNlbnQgZW5jb2RpbmcgKHNlZSBodHRwczovL3VybC5zcGVjLndoYXR3Zy5vcmcpXG5cdFx0cmV0dXJuIHVyaS50b1N0cmluZygpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgdXJpMnBhdGgoc291cmNlVXJpOiBzdHJpbmcpOiBzdHJpbmcge1xuXG5cdFx0bGV0IHVyaSA9IG5ldyBVUkwoc291cmNlVXJpKTtcblx0XHRsZXQgcyA9IGRlY29kZVVSSUNvbXBvbmVudCh1cmkucGF0aG5hbWUpO1xuXHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0XHRpZiAoL15cXC9bYS16QS1aXTovLnRlc3QocykpIHtcblx0XHRcdFx0cyA9IHNbMV0udG9Mb3dlckNhc2UoKSArIHMuc3Vic3RyKDIpO1xuXHRcdFx0fVxuXHRcdFx0cyA9IHMucmVwbGFjZSgvXFwvL2csICdcXFxcJyk7XG5cdFx0fVxuXHRcdHJldHVybiBzO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX2Zvcm1hdFBJSVJlZ2V4cCA9IC97KFtefV0rKX0vZztcblxuXHQvKlxuXHQqIElmIGFyZ3VtZW50IHN0YXJ0cyB3aXRoICdfJyBpdCBpcyBPSyB0byBzZW5kIGl0cyB2YWx1ZSB0byB0ZWxlbWV0cnkuXG5cdCovXG5cdHByaXZhdGUgc3RhdGljIGZvcm1hdFBJSShmb3JtYXQ6c3RyaW5nLCBleGNsdWRlUElJOiBib29sZWFuLCBhcmdzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGZvcm1hdC5yZXBsYWNlKERlYnVnU2Vzc2lvbi5fZm9ybWF0UElJUmVnZXhwLCBmdW5jdGlvbihtYXRjaCwgcGFyYW1OYW1lKSB7XG5cdFx0XHRpZiAoZXhjbHVkZVBJSSAmJiBwYXJhbU5hbWUubGVuZ3RoID4gMCAmJiBwYXJhbU5hbWVbMF0gIT09ICdfJykge1xuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYXJnc1twYXJhbU5hbWVdICYmIGFyZ3MuaGFzT3duUHJvcGVydHkocGFyYW1OYW1lKSA/XG5cdFx0XHRcdGFyZ3NbcGFyYW1OYW1lXSA6XG5cdFx0XHRcdG1hdGNoO1xuXHRcdH0pXG5cdH1cbn1cbiJdfQ==

/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/handles.js":
/*!*********************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/handles.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class Handles {
    constructor(startHandle) {
        this.START_HANDLE = 1000;
        this._handleMap = new Map();
        this._nextHandle = typeof startHandle === 'number' ? startHandle : this.START_HANDLE;
    }
    reset() {
        this._nextHandle = this.START_HANDLE;
        this._handleMap = new Map();
    }
    create(value) {
        var handle = this._nextHandle++;
        this._handleMap.set(handle, value);
        return handle;
    }
    get(handle, dflt) {
        return this._handleMap.get(handle) || dflt;
    }
}
exports.Handles = Handles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O2dHQUdnRzs7QUFFaEcsTUFBYSxPQUFPO0lBT25CLFlBQW1CLFdBQW9CO1FBTC9CLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBR3BCLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO1FBR3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDdEYsQ0FBQztJQUVNLEtBQUs7UUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBUTtRQUNyQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVNLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBUTtRQUNsQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQztJQUM1QyxDQUFDO0NBQ0Q7QUF6QkQsMEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmV4cG9ydCBjbGFzcyBIYW5kbGVzPFQ+IHtcblxuXHRwcml2YXRlIFNUQVJUX0hBTkRMRSA9IDEwMDA7XG5cblx0cHJpdmF0ZSBfbmV4dEhhbmRsZSA6IG51bWJlcjtcblx0cHJpdmF0ZSBfaGFuZGxlTWFwID0gbmV3IE1hcDxudW1iZXIsIFQ+KCk7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHN0YXJ0SGFuZGxlPzogbnVtYmVyKSB7XG5cdFx0dGhpcy5fbmV4dEhhbmRsZSA9IHR5cGVvZiBzdGFydEhhbmRsZSA9PT0gJ251bWJlcicgPyBzdGFydEhhbmRsZSA6IHRoaXMuU1RBUlRfSEFORExFO1xuXHR9XG5cblx0cHVibGljIHJlc2V0KCk6IHZvaWQge1xuXHRcdHRoaXMuX25leHRIYW5kbGUgPSB0aGlzLlNUQVJUX0hBTkRMRTtcblx0XHR0aGlzLl9oYW5kbGVNYXAgPSBuZXcgTWFwPG51bWJlciwgVD4oKTtcblx0fVxuXG5cdHB1YmxpYyBjcmVhdGUodmFsdWU6IFQpOiBudW1iZXIge1xuXHRcdHZhciBoYW5kbGUgPSB0aGlzLl9uZXh0SGFuZGxlKys7XG5cdFx0dGhpcy5faGFuZGxlTWFwLnNldChoYW5kbGUsIHZhbHVlKTtcblx0XHRyZXR1cm4gaGFuZGxlO1xuXHR9XG5cblx0cHVibGljIGdldChoYW5kbGU6IG51bWJlciwgZGZsdD86IFQpOiBUIHtcblx0XHRyZXR1cm4gdGhpcy5faGFuZGxlTWFwLmdldChoYW5kbGUpIHx8IGRmbHQ7XG5cdH1cbn1cbiJdfQ==

/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/logger.js":
/*!********************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/logger.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const mkdirp = __webpack_require__(/*! mkdirp */ "./node_modules/mkdirp/index.js");
const debugSession_1 = __webpack_require__(/*! ./debugSession */ "./node_modules/vscode-debugadapter/lib/debugSession.js");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Log"] = 1] = "Log";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Stop"] = 4] = "Stop";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor() {
        this._pendingLogQ = [];
    }
    log(msg, level = LogLevel.Log) {
        msg = msg + '\n';
        this._write(msg, level);
    }
    verbose(msg) {
        this.log(msg, LogLevel.Verbose);
    }
    warn(msg) {
        this.log(msg, LogLevel.Warn);
    }
    error(msg) {
        this.log(msg, LogLevel.Error);
    }
    dispose() {
        if (this._currentLogger) {
            const disposeP = this._currentLogger.dispose();
            this._currentLogger = null;
            return disposeP;
        }
        else {
            return Promise.resolve();
        }
    }
    /**
     * `log` adds a newline, `write` doesn't
     */
    _write(msg, level = LogLevel.Log) {
        // [null, undefined] => string
        msg = msg + '';
        if (this._pendingLogQ) {
            this._pendingLogQ.push({ msg, level });
        }
        else if (this._currentLogger) {
            this._currentLogger.log(msg, level);
        }
    }
    /**
     * Set the logger's minimum level to log in the console, and whether to log to the file. Log messages are queued before this is
     * called the first time, because minLogLevel defaults to Warn.
     */
    setup(consoleMinLogLevel, _logFilePath, prependTimestamp = true) {
        const logFilePath = typeof _logFilePath === 'string' ?
            _logFilePath :
            (_logFilePath && this._logFilePathFromInit);
        if (this._currentLogger) {
            const options = {
                consoleMinLogLevel,
                logFilePath,
                prependTimestamp
            };
            this._currentLogger.setup(options).then(() => {
                // Now that we have a minimum logLevel, we can clear out the queue of pending messages
                if (this._pendingLogQ) {
                    const logQ = this._pendingLogQ;
                    this._pendingLogQ = null;
                    logQ.forEach(item => this._write(item.msg, item.level));
                }
            });
        }
    }
    init(logCallback, logFilePath, logToConsole) {
        // Re-init, create new global Logger
        this._pendingLogQ = this._pendingLogQ || [];
        this._currentLogger = new InternalLogger(logCallback, logToConsole);
        this._logFilePathFromInit = logFilePath;
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
/**
 * Manages logging, whether to console.log, file, or VS Code console.
 * Encapsulates the state specific to each logging session
 */
class InternalLogger {
    constructor(logCallback, isServer) {
        /** Dispose and allow exit to continue normally */
        this.beforeExitCallback = () => this.dispose();
        this._logCallback = logCallback;
        this._logToConsole = isServer;
        this._minLogLevel = LogLevel.Warn;
        this.disposeCallback = (signal, code) => {
            this.dispose();
            // Exit with 128 + value of the signal code.
            // https://nodejs.org/api/process.html#process_exit_codes
            code = code || 2; // SIGINT
            code += 128;
            process.exit(code);
        };
    }
    setup(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._minLogLevel = options.consoleMinLogLevel;
            this._prependTimestamp = options.prependTimestamp;
            // Open a log file in the specified location. Overwritten on each run.
            if (options.logFilePath) {
                if (!path.isAbsolute(options.logFilePath)) {
                    this.log(`logFilePath must be an absolute path: ${options.logFilePath}`, LogLevel.Error);
                }
                else {
                    const handleError = err => this.sendLog(`Error creating log file at path: ${options.logFilePath}. Error: ${err.toString()}\n`, LogLevel.Error);
                    try {
                        yield mkdirpPromise(path.dirname(options.logFilePath));
                        this.log(`Verbose logs are written to:\n`, LogLevel.Warn);
                        this.log(options.logFilePath + '\n', LogLevel.Warn);
                        this._logFileStream = fs.createWriteStream(options.logFilePath);
                        this.logDateTime();
                        this.setupShutdownListeners();
                        this._logFileStream.on('error', err => {
                            handleError(err);
                        });
                    }
                    catch (err) {
                        handleError(err);
                    }
                }
            }
        });
    }
    logDateTime() {
        let d = new Date();
        let dateString = d.getUTCFullYear() + '-' + `${d.getUTCMonth() + 1}` + '-' + d.getUTCDate();
        const timeAndDateStamp = dateString + ', ' + getFormattedTimeString();
        this.log(timeAndDateStamp + '\n', LogLevel.Verbose, false);
    }
    setupShutdownListeners() {
        process.addListener('beforeExit', this.beforeExitCallback);
        process.addListener('SIGTERM', this.disposeCallback);
        process.addListener('SIGINT', this.disposeCallback);
    }
    removeShutdownListeners() {
        process.removeListener('beforeExit', this.beforeExitCallback);
        process.removeListener('SIGTERM', this.disposeCallback);
        process.removeListener('SIGINT', this.disposeCallback);
    }
    dispose() {
        return new Promise(resolve => {
            this.removeShutdownListeners();
            if (this._logFileStream) {
                this._logFileStream.end(resolve);
                this._logFileStream = null;
            }
            else {
                resolve();
            }
        });
    }
    log(msg, level, prependTimestamp = true) {
        if (this._minLogLevel === LogLevel.Stop) {
            return;
        }
        if (level >= this._minLogLevel) {
            this.sendLog(msg, level);
        }
        if (this._logToConsole) {
            const logFn = level === LogLevel.Error ? console.error :
                level === LogLevel.Warn ? console.warn :
                    null;
            if (logFn) {
                logFn(trimLastNewline(msg));
            }
        }
        // If an error, prepend with '[Error]'
        if (level === LogLevel.Error) {
            msg = `[${LogLevel[level]}] ${msg}`;
        }
        if (this._prependTimestamp && prependTimestamp) {
            msg = '[' + getFormattedTimeString() + '] ' + msg;
        }
        if (this._logFileStream) {
            this._logFileStream.write(msg);
        }
    }
    sendLog(msg, level) {
        // Truncate long messages, they can hang VS Code
        if (msg.length > 1500) {
            const endsInNewline = !!msg.match(/(\n|\r\n)$/);
            msg = msg.substr(0, 1500) + '[...]';
            if (endsInNewline) {
                msg = msg + '\n';
            }
        }
        if (this._logCallback) {
            const event = new LogOutputEvent(msg, level);
            this._logCallback(event);
        }
    }
}
function mkdirpPromise(folder) {
    return new Promise((resolve, reject) => {
        mkdirp(folder, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
class LogOutputEvent extends debugSession_1.OutputEvent {
    constructor(msg, level) {
        const category = level === LogLevel.Error ? 'stderr' :
            level === LogLevel.Warn ? 'console' :
                'stdout';
        super(msg, category);
    }
}
exports.LogOutputEvent = LogOutputEvent;
function trimLastNewline(str) {
    return str.replace(/(\n|\r\n)$/, '');
}
exports.trimLastNewline = trimLastNewline;
function getFormattedTimeString() {
    let d = new Date();
    let hourString = _padZeroes(2, String(d.getUTCHours()));
    let minuteString = _padZeroes(2, String(d.getUTCMinutes()));
    let secondString = _padZeroes(2, String(d.getUTCSeconds()));
    let millisecondString = _padZeroes(3, String(d.getUTCMilliseconds()));
    return hourString + ':' + minuteString + ':' + secondString + '.' + millisecondString + ' UTC';
}
function _padZeroes(minDesiredLength, numberToPad) {
    if (numberToPad.length >= minDesiredLength) {
        return numberToPad;
    }
    else {
        return String('0'.repeat(minDesiredLength) + numberToPad).slice(-minDesiredLength);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OzREQUU0RDs7Ozs7Ozs7OztBQUU1RCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQyxpREFBMkM7QUFFM0MsSUFBWSxRQU1YO0FBTkQsV0FBWSxRQUFRO0lBQ25CLDZDQUFXLENBQUE7SUFDWCxxQ0FBTyxDQUFBO0lBQ1AsdUNBQVEsQ0FBQTtJQUNSLHlDQUFTLENBQUE7SUFDVCx1Q0FBUSxDQUFBO0FBQ1QsQ0FBQyxFQU5XLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0FBZ0JELE1BQWEsTUFBTTtJQUFuQjtRQUlTLGlCQUFZLEdBQWUsRUFBRSxDQUFDO0lBMkV2QyxDQUFDO0lBekVBLEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHO1FBQ3BDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBVztRQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksQ0FBQyxHQUFXO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBVztRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELE9BQU87UUFDTixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FB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QUcsR0FBRyxHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsaUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBQ2hHLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxnQkFBd0IsRUFBRSxXQUFtQjtJQUNoRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksZ0JBQWdCLEVBQUU7UUFDM0MsT0FBTyxXQUFXLENBQUM7S0FDbkI7U0FBTTtRQUNOLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ25GO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb3B5cmlnaHQgKEMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQge091dHB1dEV2ZW50fSBmcm9tICcuL2RlYnVnU2Vzc2lvbic7XG5cbmV4cG9ydCBlbnVtIExvZ0xldmVsIHtcblx0VmVyYm9zZSA9IDAsXG5cdExvZyA9IDEsXG5cdFdhcm4gPSAyLFxuXHRFcnJvciA9IDMsXG5cdFN0b3AgPSA0XG59XG5cbmV4cG9ydCB0eXBlIElMb2dDYWxsYmFjayA9IChvdXRwdXRFdmVudDogT3V0cHV0RXZlbnQpID0+IHZvaWQ7XG5cbmludGVyZmFjZSBJTG9nSXRlbSB7XG5cdG1zZzogc3RyaW5nO1xuXHRsZXZlbDogTG9nTGV2ZWw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxvZ2dlciB7XG5cdGxvZyhtc2c6IHN0cmluZywgbGV2ZWw/OiBMb2dMZXZlbCk6IHZvaWQ7XG5cdHZlcmJvc2UobXNnOiBzdHJpbmcpOiB2b2lkO1xuXHR3YXJuKG1zZzogc3RyaW5nKTogdm9pZDtcblx0ZXJyb3IobXNnOiBzdHJpbmcpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcblx0cHJpdmF0ZSBfbG9nRmlsZVBhdGhGcm9tSW5pdDogc3RyaW5nO1xuXG5cdHByaXZhdGUgX2N1cnJlbnRMb2dnZXI6IEludGVybmFsTG9nZ2VyO1xuXHRwcml2YXRlIF9wZW5kaW5nTG9nUTogSUxvZ0l0ZW1bXSA9IFtdO1xuXG5cdGxvZyhtc2c6IHN0cmluZywgbGV2ZWwgPSBMb2dMZXZlbC5Mb2cpOiB2b2lkIHtcblx0XHRtc2cgPSBtc2cgKyAnXFxuJztcblx0XHR0aGlzLl93cml0ZShtc2csIGxldmVsKTtcblx0fVxuXG5cdHZlcmJvc2UobXNnOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLmxvZyhtc2csIExvZ0xldmVsLlZlcmJvc2UpO1xuXHR9XG5cblx0d2Fybihtc2c6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMubG9nKG1zZywgTG9nTGV2ZWwuV2Fybik7XG5cdH1cblxuXHRlcnJvcihtc2c6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMubG9nKG1zZywgTG9nTGV2ZWwuRXJyb3IpO1xuXHR9XG5cblx0ZGlzcG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRpZiAodGhpcy5fY3VycmVudExvZ2dlcikge1xuXHRcdFx0Y29uc3QgZGlzcG9zZVAgPSB0aGlzLl9jdXJyZW50TG9nZ2VyLmRpc3Bvc2UoKTtcblx0XHRcdHRoaXMuX2N1cnJlbnRMb2dnZXIgPSBudWxsO1xuXHRcdFx0cmV0dXJuIGRpc3Bvc2VQO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIGBsb2dgIGFkZHMgYSBuZXdsaW5lLCBgd3JpdGVgIGRvZXNuJ3Rcblx0ICovXG5cdHByaXZhdGUgX3dyaXRlKG1zZzogc3RyaW5nLCBsZXZlbCA9IExvZ0xldmVsLkxvZyk6IHZvaWQge1xuXHRcdC8vIFtudWxsLCB1bmRlZmluZWRdID0+IHN0cmluZ1xuXHRcdG1zZyA9IG1zZyArICcnO1xuXHRcdGlmICh0aGlzLl9wZW5kaW5nTG9nUSkge1xuXHRcdFx0dGhpcy5fcGVuZGluZ0xvZ1EucHVzaCh7IG1zZywgbGV2ZWwgfSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9jdXJyZW50TG9nZ2VyKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50TG9nZ2VyLmxvZyhtc2csIGxldmVsKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBsb2dnZXIncyBtaW5pbXVtIGxldmVsIHRvIGxvZyBpbiB0aGUgY29uc29sZSwgYW5kIHdoZXRoZXIgdG8gbG9nIHRvIHRoZSBmaWxlLiBMb2cgbWVzc2FnZXMgYXJlIHF1ZXVlZCBiZWZvcmUgdGhpcyBpc1xuXHQgKiBjYWxsZWQgdGhlIGZpcnN0IHRpbWUsIGJlY2F1c2UgbWluTG9nTGV2ZWwgZGVmYXVsdHMgdG8gV2Fybi5cblx0ICovXG5cdHNldHVwKGNvbnNvbGVNaW5Mb2dMZXZlbDogTG9nTGV2ZWwsIF9sb2dGaWxlUGF0aD86IHN0cmluZ3xib29sZWFuLCBwcmVwZW5kVGltZXN0YW1wOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuXHRcdGNvbnN0IGxvZ0ZpbGVQYXRoID0gdHlwZW9mIF9sb2dGaWxlUGF0aCA9PT0gJ3N0cmluZycgP1xuXHRcdFx0X2xvZ0ZpbGVQYXRoIDpcblx0XHRcdChfbG9nRmlsZVBhdGggJiYgdGhpcy5fbG9nRmlsZVBhdGhGcm9tSW5pdCk7XG5cblx0XHRpZiAodGhpcy5fY3VycmVudExvZ2dlcikge1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0Y29uc29sZU1pbkxvZ0xldmVsLFxuXHRcdFx0XHRsb2dGaWxlUGF0aCxcblx0XHRcdFx0cHJlcGVuZFRpbWVzdGFtcFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2N1cnJlbnRMb2dnZXIuc2V0dXAob3B0aW9ucykudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vIE5vdyB0aGF0IHdlIGhhdmUgYSBtaW5pbXVtIGxvZ0xldmVsLCB3ZSBjYW4gY2xlYXIgb3V0IHRoZSBxdWV1ZSBvZiBwZW5kaW5nIG1lc3NhZ2VzXG5cdFx0XHRcdGlmICh0aGlzLl9wZW5kaW5nTG9nUSkge1xuXHRcdFx0XHRcdGNvbnN0IGxvZ1EgPSB0aGlzLl9wZW5kaW5nTG9nUTtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nTG9nUSA9IG51bGw7XG5cdFx0XHRcdFx0bG9nUS5mb3JFYWNoKGl0ZW0gPT4gdGhpcy5fd3JpdGUoaXRlbS5tc2csIGl0ZW0ubGV2ZWwpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cblxuXHRpbml0KGxvZ0NhbGxiYWNrOiBJTG9nQ2FsbGJhY2ssIGxvZ0ZpbGVQYXRoPzogc3RyaW5nLCBsb2dUb0NvbnNvbGU/OiBib29sZWFuKTogdm9pZCB7XG5cdFx0Ly8gUmUtaW5pdCwgY3JlYXRlIG5ldyBnbG9iYWwgTG9nZ2VyXG5cdFx0dGhpcy5fcGVuZGluZ0xvZ1EgPSB0aGlzLl9wZW5kaW5nTG9nUSB8fCBbXTtcblx0XHR0aGlzLl9jdXJyZW50TG9nZ2VyID0gbmV3IEludGVybmFsTG9nZ2VyKGxvZ0NhbGxiYWNrLCBsb2dUb0NvbnNvbGUpO1xuXHRcdHRoaXMuX2xvZ0ZpbGVQYXRoRnJvbUluaXQgPSBsb2dGaWxlUGF0aDtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG5pbnRlcmZhY2UgSUludGVybmFsTG9nZ2VyT3B0aW9ucyB7XG5cdGNvbnNvbGVNaW5Mb2dMZXZlbDogTG9nTGV2ZWw7XG5cdGxvZ0ZpbGVQYXRoPzogc3RyaW5nO1xuXHRwcmVwZW5kVGltZXN0YW1wPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIGxvZ2dpbmcsIHdoZXRoZXIgdG8gY29uc29sZS5sb2csIGZpbGUsIG9yIFZTIENvZGUgY29uc29sZS5cbiAqIEVuY2Fwc3VsYXRlcyB0aGUgc3RhdGUgc3BlY2lmaWMgdG8gZWFjaCBsb2dnaW5nIHNlc3Npb25cbiAqL1xuY2xhc3MgSW50ZXJuYWxMb2dnZXIge1xuXHRwcml2YXRlIF9taW5Mb2dMZXZlbDogTG9nTGV2ZWw7XG5cdHByaXZhdGUgX2xvZ1RvQ29uc29sZTogYm9vbGVhbjtcblxuXHQvKiogTG9nIGluZm8gdGhhdCBtZWV0cyBtaW5Mb2dMZXZlbCBpcyBzZW50IHRvIHRoaXMgY2FsbGJhY2suICovXG5cdHByaXZhdGUgX2xvZ0NhbGxiYWNrOiBJTG9nQ2FsbGJhY2s7XG5cblx0LyoqIFdyaXRlIHN0ZWFtIGZvciBsb2cgZmlsZSAqL1xuXHRwcml2YXRlIF9sb2dGaWxlU3RyZWFtOiBmcy5Xcml0ZVN0cmVhbTtcblxuXHQvKiogRGlzcG9zZSBhbmQgYWxsb3cgZXhpdCB0byBjb250aW51ZSBub3JtYWxseSAqL1xuXHRwcml2YXRlIGJlZm9yZUV4aXRDYWxsYmFjayA9ICgpID0+IHRoaXMuZGlzcG9zZSgpO1xuXG5cdC8qKiBEaXNwb3NlIGFuZCBleGl0ICovXG5cdHByaXZhdGUgZGlzcG9zZUNhbGxiYWNrO1xuXG5cdC8qKiBXaGV0aGVyIHRvIGFkZCBhIHRpbWVzdGFtcCB0byBtZXNzYWdlcyBpbiB0aGUgbG9nZmlsZSAqL1xuXHRwcml2YXRlIF9wcmVwZW5kVGltZXN0YW1wOiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yKGxvZ0NhbGxiYWNrOiBJTG9nQ2FsbGJhY2ssIGlzU2VydmVyPzogYm9vbGVhbikge1xuXHRcdHRoaXMuX2xvZ0NhbGxiYWNrID0gbG9nQ2FsbGJhY2s7XG5cdFx0dGhpcy5fbG9nVG9Db25zb2xlID0gaXNTZXJ2ZXI7XG5cblx0XHR0aGlzLl9taW5Mb2dMZXZlbCA9IExvZ0xldmVsLldhcm47XG5cblx0XHR0aGlzLmRpc3Bvc2VDYWxsYmFjayA9IChzaWduYWw6IHN0cmluZywgY29kZTogbnVtYmVyKSA9PiB7XG5cdFx0XHR0aGlzLmRpc3Bvc2UoKTtcblxuXHRcdFx0Ly8gRXhpdCB3aXRoIDEyOCArIHZhbHVlIG9mIHRoZSBzaWduYWwgY29kZS5cblx0XHRcdC8vIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfZXhpdF9jb2Rlc1xuXHRcdFx0Y29kZSA9IGNvZGUgfHwgMjsgLy8gU0lHSU5UXG5cdFx0XHRjb2RlICs9IDEyODtcblxuXHRcdFx0cHJvY2Vzcy5leGl0KGNvZGUpO1xuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2V0dXAob3B0aW9uczogSUludGVybmFsTG9nZ2VyT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRoaXMuX21pbkxvZ0xldmVsID0gb3B0aW9ucy5jb25zb2xlTWluTG9nTGV2ZWw7XG5cdFx0dGhpcy5fcHJlcGVuZFRpbWVzdGFtcCA9IG9wdGlvbnMucHJlcGVuZFRpbWVzdGFtcDtcblxuXHRcdC8vIE9wZW4gYSBsb2cgZmlsZSBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uLiBPdmVyd3JpdHRlbiBvbiBlYWNoIHJ1bi5cblx0XHRpZiAob3B0aW9ucy5sb2dGaWxlUGF0aCkge1xuXHRcdFx0aWYgKCFwYXRoLmlzQWJzb2x1dGUob3B0aW9ucy5sb2dGaWxlUGF0aCkpIHtcblx0XHRcdFx0dGhpcy5sb2coYGxvZ0ZpbGVQYXRoIG11c3QgYmUgYW4gYWJzb2x1dGUgcGF0aDogJHtvcHRpb25zLmxvZ0ZpbGVQYXRofWAsIExvZ0xldmVsLkVycm9yKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZUVycm9yID0gZXJyID0+IHRoaXMuc2VuZExvZyhgRXJyb3IgY3JlYXRpbmcgbG9nIGZpbGUgYXQgcGF0aDogJHtvcHRpb25zLmxvZ0ZpbGVQYXRofS4gRXJyb3I6ICR7ZXJyLnRvU3RyaW5nKCl9XFxuYCwgTG9nTGV2ZWwuRXJyb3IpO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0YXdhaXQgbWtkaXJwUHJvbWlzZShwYXRoLmRpcm5hbWUob3B0aW9ucy5sb2dGaWxlUGF0aCkpO1xuXHRcdFx0XHRcdHRoaXMubG9nKGBWZXJib3NlIGxvZ3MgYXJlIHdyaXR0ZW4gdG86XFxuYCwgTG9nTGV2ZWwuV2Fybik7XG5cdFx0XHRcdFx0dGhpcy5sb2cob3B0aW9ucy5sb2dGaWxlUGF0aCArICdcXG4nLCBMb2dMZXZlbC5XYXJuKTtcblxuXHRcdFx0XHRcdHRoaXMuX2xvZ0ZpbGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShvcHRpb25zLmxvZ0ZpbGVQYXRoKTtcblx0XHRcdFx0XHR0aGlzLmxvZ0RhdGVUaW1lKCk7XG5cdFx0XHRcdFx0dGhpcy5zZXR1cFNodXRkb3duTGlzdGVuZXJzKCk7XG5cdFx0XHRcdFx0dGhpcy5fbG9nRmlsZVN0cmVhbS5vbignZXJyb3InLCBlcnIgPT4ge1xuXHRcdFx0XHRcdFx0aGFuZGxlRXJyb3IoZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0aGFuZGxlRXJyb3IoZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgbG9nRGF0ZVRpbWUoKTogdm9pZCB7XG5cdFx0bGV0IGQgPSBuZXcgRGF0ZSgpO1xuXHRcdGxldCBkYXRlU3RyaW5nID0gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgYCR7ZC5nZXRVVENNb250aCgpICsgMX1gICsgJy0nICsgZC5nZXRVVENEYXRlKCk7XG5cdFx0Y29uc3QgdGltZUFuZERhdGVTdGFtcCA9IGRhdGVTdHJpbmcgKyAnLCAnICsgZ2V0Rm9ybWF0dGVkVGltZVN0cmluZygpO1xuXHRcdHRoaXMubG9nKHRpbWVBbmREYXRlU3RhbXAgKyAnXFxuJywgTG9nTGV2ZWwuVmVyYm9zZSwgZmFsc2UpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXR1cFNodXRkb3duTGlzdGVuZXJzKCk6IHZvaWQge1xuXHRcdHByb2Nlc3MuYWRkTGlzdGVuZXIoJ2JlZm9yZUV4aXQnLCB0aGlzLmJlZm9yZUV4aXRDYWxsYmFjayk7XG5cdFx0cHJvY2Vzcy5hZGRMaXN0ZW5lcignU0lHVEVSTScsIHRoaXMuZGlzcG9zZUNhbGxiYWNrKTtcblx0XHRwcm9jZXNzLmFkZExpc3RlbmVyKCdTSUdJTlQnLCB0aGlzLmRpc3Bvc2VDYWxsYmFjayk7XG5cdH1cblxuXHRwcml2YXRlIHJlbW92ZVNodXRkb3duTGlzdGVuZXJzKCk6IHZvaWQge1xuXHRcdHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoJ2JlZm9yZUV4aXQnLCB0aGlzLmJlZm9yZUV4aXRDYWxsYmFjayk7XG5cdFx0cHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcignU0lHVEVSTScsIHRoaXMuZGlzcG9zZUNhbGxiYWNrKTtcblx0XHRwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdTSUdJTlQnLCB0aGlzLmRpc3Bvc2VDYWxsYmFjayk7XG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHR0aGlzLnJlbW92ZVNodXRkb3duTGlzdGVuZXJzKCk7XG5cdFx0XHRpZiAodGhpcy5fbG9nRmlsZVN0cmVhbSkge1xuXHRcdFx0XHR0aGlzLl9sb2dGaWxlU3RyZWFtLmVuZChyZXNvbHZlKTtcblx0XHRcdFx0dGhpcy5fbG9nRmlsZVN0cmVhbSA9IG51bGw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgbG9nKG1zZzogc3RyaW5nLCBsZXZlbDogTG9nTGV2ZWwsIHByZXBlbmRUaW1lc3RhbXAgPSB0cnVlKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX21pbkxvZ0xldmVsID09PSBMb2dMZXZlbC5TdG9wKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGxldmVsID49IHRoaXMuX21pbkxvZ0xldmVsKSB7XG5cdFx0XHR0aGlzLnNlbmRMb2cobXNnLCBsZXZlbCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2xvZ1RvQ29uc29sZSkge1xuXHRcdFx0Y29uc3QgbG9nRm4gPVxuXHRcdFx0XHRsZXZlbCA9PT0gTG9nTGV2ZWwuRXJyb3IgPyBjb25zb2xlLmVycm9yIDpcblx0XHRcdFx0bGV2ZWwgPT09IExvZ0xldmVsLldhcm4gPyBjb25zb2xlLndhcm4gOlxuXHRcdFx0XHRudWxsO1xuXG5cdFx0XHRpZiAobG9nRm4pIHtcblx0XHRcdFx0bG9nRm4odHJpbUxhc3ROZXdsaW5lKG1zZykpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElmIGFuIGVycm9yLCBwcmVwZW5kIHdpdGggJ1tFcnJvcl0nXG5cdFx0aWYgKGxldmVsID09PSBMb2dMZXZlbC5FcnJvcikge1xuXHRcdFx0bXNnID0gYFske0xvZ0xldmVsW2xldmVsXX1dICR7bXNnfWA7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3ByZXBlbmRUaW1lc3RhbXAgJiYgcHJlcGVuZFRpbWVzdGFtcCkge1xuXHRcdFx0bXNnID0gJ1snICsgZ2V0Rm9ybWF0dGVkVGltZVN0cmluZygpICsgJ10gJyArIG1zZztcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fbG9nRmlsZVN0cmVhbSkge1xuXHRcdFx0dGhpcy5fbG9nRmlsZVN0cmVhbS53cml0ZShtc2cpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc2VuZExvZyhtc2c6IHN0cmluZywgbGV2ZWw6IExvZ0xldmVsKTogdm9pZCB7XG5cdFx0Ly8gVHJ1bmNhdGUgbG9uZyBtZXNzYWdlcywgdGhleSBjYW4gaGFuZyBWUyBDb2RlXG5cdFx0aWYgKG1zZy5sZW5ndGggPiAxNTAwKSB7XG5cdFx0XHRjb25zdCBlbmRzSW5OZXdsaW5lID0gISFtc2cubWF0Y2goLyhcXG58XFxyXFxuKSQvKTtcblx0XHRcdG1zZyA9IG1zZy5zdWJzdHIoMCwgMTUwMCkgKyAnWy4uLl0nO1xuXHRcdFx0aWYgKGVuZHNJbk5ld2xpbmUpIHtcblx0XHRcdFx0bXNnID0gbXNnICsgJ1xcbic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2xvZ0NhbGxiYWNrKSB7XG5cdFx0XHRjb25zdCBldmVudCA9IG5ldyBMb2dPdXRwdXRFdmVudChtc2csIGxldmVsKTtcblx0XHRcdHRoaXMuX2xvZ0NhbGxiYWNrKGV2ZW50KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWtkaXJwUHJvbWlzZShmb2xkZXI6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdG1rZGlycChmb2xkZXIsIGVyciA9PiB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGNsYXNzIExvZ091dHB1dEV2ZW50IGV4dGVuZHMgT3V0cHV0RXZlbnQge1xuXHRjb25zdHJ1Y3Rvcihtc2c6IHN0cmluZywgbGV2ZWw6IExvZ0xldmVsKSB7XG5cdFx0Y29uc3QgY2F0ZWdvcnkgPVxuXHRcdFx0bGV2ZWwgPT09IExvZ0xldmVsLkVycm9yID8gJ3N0ZGVycicgOlxuXHRcdFx0bGV2ZWwgPT09IExvZ0xldmVsLldhcm4gPyAnY29uc29sZScgOlxuXHRcdFx0J3N0ZG91dCc7XG5cdFx0c3VwZXIobXNnLCBjYXRlZ29yeSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1MYXN0TmV3bGluZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFxcbnxcXHJcXG4pJC8sICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVGltZVN0cmluZygpOiBzdHJpbmcge1xuXHRsZXQgZCA9IG5ldyBEYXRlKCk7XG5cdGxldCBob3VyU3RyaW5nID0gX3BhZFplcm9lcygyLCBTdHJpbmcoZC5nZXRVVENIb3VycygpKSk7XG5cdGxldCBtaW51dGVTdHJpbmcgPSBfcGFkWmVyb2VzKDIsIFN0cmluZyhkLmdldFVUQ01pbnV0ZXMoKSkpO1xuXHRsZXQgc2Vjb25kU3RyaW5nID0gX3BhZFplcm9lcygyLCBTdHJpbmcoZC5nZXRVVENTZWNvbmRzKCkpKTtcblx0bGV0IG1pbGxpc2Vjb25kU3RyaW5nID0gX3BhZFplcm9lcygzLCBTdHJpbmcoZC5nZXRVVENNaWxsaXNlY29uZHMoKSkpO1xuXHRyZXR1cm4gaG91clN0cmluZyArICc6JyArIG1pbnV0ZVN0cmluZyArICc6JyArIHNlY29uZFN0cmluZyArICcuJyArIG1pbGxpc2Vjb25kU3RyaW5nICsgJyBVVEMnO1xufVxuXG5mdW5jdGlvbiBfcGFkWmVyb2VzKG1pbkRlc2lyZWRMZW5ndGg6IG51bWJlciwgbnVtYmVyVG9QYWQ6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmIChudW1iZXJUb1BhZC5sZW5ndGggPj0gbWluRGVzaXJlZExlbmd0aCkge1xuXHRcdHJldHVybiBudW1iZXJUb1BhZDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gU3RyaW5nKCcwJy5yZXBlYXQobWluRGVzaXJlZExlbmd0aCkgKyBudW1iZXJUb1BhZCkuc2xpY2UoLW1pbkRlc2lyZWRMZW5ndGgpO1xuXHR9XG59XG4iXX0=

/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/loggingDebugSession.js":
/*!*********************************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/loggingDebugSession.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = __webpack_require__(/*! ./logger */ "./node_modules/vscode-debugadapter/lib/logger.js");
const logger = Logger.logger;
const debugSession_1 = __webpack_require__(/*! ./debugSession */ "./node_modules/vscode-debugadapter/lib/debugSession.js");
class LoggingDebugSession extends debugSession_1.DebugSession {
    constructor(obsolete_logFilePath, obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer);
        this.obsolete_logFilePath = obsolete_logFilePath;
        this.on('error', (event) => {
            logger.error(event.body);
        });
    }
    start(inStream, outStream) {
        super.start(inStream, outStream);
        logger.init(e => this.sendEvent(e), this.obsolete_logFilePath, this._isServer);
    }
    /**
     * Overload sendEvent to log
     */
    sendEvent(event) {
        if (!(event instanceof Logger.LogOutputEvent)) {
            // Don't create an infinite loop...
            logger.verbose(`To client: ${JSON.stringify(event)}`);
        }
        super.sendEvent(event);
    }
    /**
     * Overload sendRequest to log
     */
    sendRequest(command, args, timeout, cb) {
        logger.verbose(`To client: ${JSON.stringify(command)}(${JSON.stringify(args)}), timeout: ${timeout}`);
        super.sendRequest(command, args, timeout, cb);
    }
    /**
     * Overload sendResponse to log
     */
    sendResponse(response) {
        logger.verbose(`To client: ${JSON.stringify(response)}`);
        super.sendResponse(response);
    }
    dispatchRequest(request) {
        logger.verbose(`From client: ${request.command}(${JSON.stringify(request.arguments)})`);
        super.dispatchRequest(request);
    }
}
exports.LoggingDebugSession = LoggingDebugSession;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZ0RlYnVnU2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnaW5nRGVidWdTZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O2dHQUdnRzs7QUFJaEcsbUNBQW1DO0FBQ25DLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDN0IsaURBQTRDO0FBRTVDLE1BQWEsbUJBQW9CLFNBQVEsMkJBQVk7SUFDcEQsWUFBMkIsb0JBQTZCLEVBQUUsd0NBQWtELEVBQUUsaUJBQTJCO1FBQ3hJLEtBQUssQ0FBQyx3Q0FBd0MsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRHpDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBUztRQUd2RCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQTBCLEVBQUUsRUFBRTtZQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBK0IsRUFBRSxTQUFnQztRQUM3RSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxLQUEwQjtRQUMxQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzlDLG1DQUFtQztZQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxPQUFlLEVBQUUsSUFBUyxFQUFFLE9BQWUsRUFBRSxFQUE4QztRQUM3RyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdEcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxZQUFZLENBQUMsUUFBZ0M7UUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVTLGVBQWUsQ0FBQyxPQUE4QjtRQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBRSxHQUFHLENBQUMsQ0FBQztRQUN6RixLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDRDtBQTlDRCxrREE4Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0IHtEZWJ1Z1Byb3RvY29sfSBmcm9tICd2c2NvZGUtZGVidWdwcm90b2NvbCc7XG5cbmltcG9ydCAqIGFzIExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5jb25zdCBsb2dnZXIgPSBMb2dnZXIubG9nZ2VyO1xuaW1wb3J0IHtEZWJ1Z1Nlc3Npb259IGZyb20gJy4vZGVidWdTZXNzaW9uJztcblxuZXhwb3J0IGNsYXNzIExvZ2dpbmdEZWJ1Z1Nlc3Npb24gZXh0ZW5kcyBEZWJ1Z1Nlc3Npb24ge1xuXHRwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBvYnNvbGV0ZV9sb2dGaWxlUGF0aD86IHN0cmluZywgb2Jzb2xldGVfZGVidWdnZXJMaW5lc0FuZENvbHVtbnNTdGFydEF0MT86IGJvb2xlYW4sIG9ic29sZXRlX2lzU2VydmVyPzogYm9vbGVhbikge1xuXHRcdHN1cGVyKG9ic29sZXRlX2RlYnVnZ2VyTGluZXNBbmRDb2x1bW5zU3RhcnRBdDEsIG9ic29sZXRlX2lzU2VydmVyKTtcblxuXHRcdHRoaXMub24oJ2Vycm9yJywgKGV2ZW50OiBEZWJ1Z1Byb3RvY29sLkV2ZW50KSA9PiB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoZXZlbnQuYm9keSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgc3RhcnQoaW5TdHJlYW06IE5vZGVKUy5SZWFkYWJsZVN0cmVhbSwgb3V0U3RyZWFtOiBOb2RlSlMuV3JpdGFibGVTdHJlYW0pOiB2b2lkIHtcblx0XHRzdXBlci5zdGFydChpblN0cmVhbSwgb3V0U3RyZWFtKTtcblx0XHRsb2dnZXIuaW5pdChlID0+IHRoaXMuc2VuZEV2ZW50KGUpLCB0aGlzLm9ic29sZXRlX2xvZ0ZpbGVQYXRoLCB0aGlzLl9pc1NlcnZlcik7XG5cdH1cblxuXHQvKipcblx0ICogT3ZlcmxvYWQgc2VuZEV2ZW50IHRvIGxvZ1xuXHQgKi9cblx0cHVibGljIHNlbmRFdmVudChldmVudDogRGVidWdQcm90b2NvbC5FdmVudCk6IHZvaWQge1xuXHRcdGlmICghKGV2ZW50IGluc3RhbmNlb2YgTG9nZ2VyLkxvZ091dHB1dEV2ZW50KSkge1xuXHRcdFx0Ly8gRG9uJ3QgY3JlYXRlIGFuIGluZmluaXRlIGxvb3AuLi5cblx0XHRcdGxvZ2dlci52ZXJib3NlKGBUbyBjbGllbnQ6ICR7SlNPTi5zdHJpbmdpZnkoZXZlbnQpfWApO1xuXHRcdH1cblxuXHRcdHN1cGVyLnNlbmRFdmVudChldmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogT3ZlcmxvYWQgc2VuZFJlcXVlc3QgdG8gbG9nXG5cdCAqL1xuXHRwdWJsaWMgc2VuZFJlcXVlc3QoY29tbWFuZDogc3RyaW5nLCBhcmdzOiBhbnksIHRpbWVvdXQ6IG51bWJlciwgY2I6IChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSkgPT4gdm9pZCk6IHZvaWQge1xuXHRcdGxvZ2dlci52ZXJib3NlKGBUbyBjbGllbnQ6ICR7SlNPTi5zdHJpbmdpZnkoY29tbWFuZCl9KCR7SlNPTi5zdHJpbmdpZnkoYXJncyl9KSwgdGltZW91dDogJHt0aW1lb3V0fWApO1xuXHRcdHN1cGVyLnNlbmRSZXF1ZXN0KGNvbW1hbmQsIGFyZ3MsIHRpbWVvdXQsIGNiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPdmVybG9hZCBzZW5kUmVzcG9uc2UgdG8gbG9nXG5cdCAqL1xuXHRwdWJsaWMgc2VuZFJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlKTogdm9pZCB7XG5cdFx0bG9nZ2VyLnZlcmJvc2UoYFRvIGNsaWVudDogJHtKU09OLnN0cmluZ2lmeShyZXNwb25zZSl9YCk7XG5cdFx0c3VwZXIuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBkaXNwYXRjaFJlcXVlc3QocmVxdWVzdDogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0bG9nZ2VyLnZlcmJvc2UoYEZyb20gY2xpZW50OiAke3JlcXVlc3QuY29tbWFuZH0oJHtKU09OLnN0cmluZ2lmeShyZXF1ZXN0LmFyZ3VtZW50cykgfSlgKTtcblx0XHRzdXBlci5kaXNwYXRjaFJlcXVlc3QocmVxdWVzdCk7XG5cdH1cbn1cbiJdfQ==

/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/main.js":
/*!******************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/main.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const debugSession_1 = __webpack_require__(/*! ./debugSession */ "./node_modules/vscode-debugadapter/lib/debugSession.js");
exports.DebugSession = debugSession_1.DebugSession;
exports.InitializedEvent = debugSession_1.InitializedEvent;
exports.TerminatedEvent = debugSession_1.TerminatedEvent;
exports.StoppedEvent = debugSession_1.StoppedEvent;
exports.ContinuedEvent = debugSession_1.ContinuedEvent;
exports.OutputEvent = debugSession_1.OutputEvent;
exports.ThreadEvent = debugSession_1.ThreadEvent;
exports.BreakpointEvent = debugSession_1.BreakpointEvent;
exports.ModuleEvent = debugSession_1.ModuleEvent;
exports.LoadedSourceEvent = debugSession_1.LoadedSourceEvent;
exports.CapabilitiesEvent = debugSession_1.CapabilitiesEvent;
exports.Thread = debugSession_1.Thread;
exports.StackFrame = debugSession_1.StackFrame;
exports.Scope = debugSession_1.Scope;
exports.Variable = debugSession_1.Variable;
exports.Breakpoint = debugSession_1.Breakpoint;
exports.Source = debugSession_1.Source;
exports.Module = debugSession_1.Module;
exports.CompletionItem = debugSession_1.CompletionItem;
exports.ErrorDestination = debugSession_1.ErrorDestination;
const loggingDebugSession_1 = __webpack_require__(/*! ./loggingDebugSession */ "./node_modules/vscode-debugadapter/lib/loggingDebugSession.js");
exports.LoggingDebugSession = loggingDebugSession_1.LoggingDebugSession;
const Logger = __webpack_require__(/*! ./logger */ "./node_modules/vscode-debugadapter/lib/logger.js");
exports.Logger = Logger;
const messages_1 = __webpack_require__(/*! ./messages */ "./node_modules/vscode-debugadapter/lib/messages.js");
exports.Event = messages_1.Event;
exports.Response = messages_1.Response;
const handles_1 = __webpack_require__(/*! ./handles */ "./node_modules/vscode-debugadapter/lib/handles.js");
exports.Handles = handles_1.Handles;
const logger = Logger.logger;
exports.logger = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Z0dBR2dHO0FBQ2hHLFlBQVksQ0FBQzs7QUFFYixpREFNd0I7QUFTdkIsdUJBZEEsMkJBQVksQ0FjQTtBQUlaLDJCQWpCQSwrQkFBZ0IsQ0FpQkE7QUFBRSwwQkFqQkEsOEJBQWUsQ0FpQkE7QUFBRSx1QkFqQkEsMkJBQVksQ0FpQkE7QUFBRSx5QkFqQkEsNkJBQWMsQ0FpQkE7QUFBRSxzQkFqQkEsMEJBQVcsQ0FpQkE7QUFBRSxzQkFqQkEsMEJBQVcsQ0FpQkE7QUFBRSwwQkFqQkEsOEJBQWUsQ0FpQkE7QUFBRSxzQkFqQkEsMEJBQVcsQ0FpQkE7QUFBRSw0QkFqQkEsZ0NBQWlCLENBaUJBO0FBQUUsNEJBakJBLGdDQUFpQixDQWlCQTtBQUM3SixpQkFqQkEscUJBQU0sQ0FpQkE7QUFBRSxxQkFqQkEseUJBQVUsQ0FpQkE7QUFBRSxnQkFqQkEsb0JBQUssQ0FpQkE7QUFBRSxtQkFqQkEsdUJBQVEsQ0FpQkE7QUFDbkMscUJBakJBLHlCQUFVLENBaUJBO0FBQUUsaUJBakJBLHFCQUFNLENBaUJBO0FBQUUsaUJBakJBLHFCQUFNLENBaUJBO0FBQUUseUJBakJBLDZCQUFjLENBaUJBO0FBQzFDLDJCQWpCQSwrQkFBZ0IsQ0FpQkE7QUFmakIsK0RBQTBEO0FBU3pELDhCQVRPLHlDQUFtQixDQVNQO0FBUnBCLG1DQUFtQztBQVNsQyx3QkFBTTtBQVJQLHlDQUE2QztBQWM1QyxnQkFkUSxnQkFBSyxDQWNSO0FBQUUsbUJBZFEsbUJBQVEsQ0FjUjtBQWJoQix1Q0FBb0M7QUFjbkMsa0JBZFEsaUJBQU8sQ0FjUjtBQVpSLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFNNUIsd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG5cdERlYnVnU2Vzc2lvbixcblx0SW5pdGlhbGl6ZWRFdmVudCwgVGVybWluYXRlZEV2ZW50LCBTdG9wcGVkRXZlbnQsIENvbnRpbnVlZEV2ZW50LCBPdXRwdXRFdmVudCwgVGhyZWFkRXZlbnQsIEJyZWFrcG9pbnRFdmVudCwgTW9kdWxlRXZlbnQsIExvYWRlZFNvdXJjZUV2ZW50LCBDYXBhYmlsaXRpZXNFdmVudCxcblx0VGhyZWFkLCBTdGFja0ZyYW1lLCBTY29wZSwgVmFyaWFibGUsXG5cdEJyZWFrcG9pbnQsIFNvdXJjZSwgTW9kdWxlLCBDb21wbGV0aW9uSXRlbSxcblx0RXJyb3JEZXN0aW5hdGlvblxufSBmcm9tICcuL2RlYnVnU2Vzc2lvbic7XG5pbXBvcnQge0xvZ2dpbmdEZWJ1Z1Nlc3Npb259IGZyb20gJy4vbG9nZ2luZ0RlYnVnU2Vzc2lvbic7XG5pbXBvcnQgKiBhcyBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgRXZlbnQsIFJlc3BvbnNlIH0gZnJvbSAnLi9tZXNzYWdlcyc7XG5pbXBvcnQgeyBIYW5kbGVzIH0gZnJvbSAnLi9oYW5kbGVzJztcblxuY29uc3QgbG9nZ2VyID0gTG9nZ2VyLmxvZ2dlcjtcblxuZXhwb3J0IHtcblx0RGVidWdTZXNzaW9uLFxuXHRMb2dnaW5nRGVidWdTZXNzaW9uLFxuXHRMb2dnZXIsXG5cdGxvZ2dlcixcblx0SW5pdGlhbGl6ZWRFdmVudCwgVGVybWluYXRlZEV2ZW50LCBTdG9wcGVkRXZlbnQsIENvbnRpbnVlZEV2ZW50LCBPdXRwdXRFdmVudCwgVGhyZWFkRXZlbnQsIEJyZWFrcG9pbnRFdmVudCwgTW9kdWxlRXZlbnQsIExvYWRlZFNvdXJjZUV2ZW50LCBDYXBhYmlsaXRpZXNFdmVudCxcblx0VGhyZWFkLCBTdGFja0ZyYW1lLCBTY29wZSwgVmFyaWFibGUsXG5cdEJyZWFrcG9pbnQsIFNvdXJjZSwgTW9kdWxlLCBDb21wbGV0aW9uSXRlbSxcblx0RXJyb3JEZXN0aW5hdGlvbixcblx0RXZlbnQsIFJlc3BvbnNlLFxuXHRIYW5kbGVzXG59XG4iXX0=

/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/messages.js":
/*!**********************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/messages.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(type) {
        this.seq = 0;
        this.type = type;
    }
}
exports.Message = Message;
class Response extends Message {
    constructor(request, message) {
        super('response');
        this.request_seq = request.seq;
        this.command = request.command;
        if (message) {
            this.success = false;
            this.message = message;
        }
        else {
            this.success = true;
        }
    }
}
exports.Response = Response;
class Event extends Message {
    constructor(event, body) {
        super('event');
        this.event = event;
        if (body) {
            this.body = body;
        }
    }
}
exports.Event = Event;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOztBQUtoRyxNQUFhLE9BQU87SUFJbkIsWUFBbUIsSUFBWTtRQUM5QixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLENBQUM7Q0FDRDtBQVJELDBCQVFDO0FBRUQsTUFBYSxRQUFTLFNBQVEsT0FBTztJQUtwQyxZQUFtQixPQUE4QixFQUFFLE9BQWdCO1FBQ2xFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQy9CLElBQUksT0FBTyxFQUFFO1lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDZixJQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUM5QjthQUFNO1lBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDcEI7SUFDRixDQUFDO0NBQ0Q7QUFoQkQsNEJBZ0JDO0FBRUQsTUFBYSxLQUFNLFNBQVEsT0FBTztJQUdqQyxZQUFtQixLQUFhLEVBQUUsSUFBVTtRQUMzQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLElBQUksRUFBRTtZQUNILElBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0YsQ0FBQztDQUNEO0FBVkQsc0JBVUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0IHsgRGVidWdQcm90b2NvbCB9IGZyb20gJ3ZzY29kZS1kZWJ1Z3Byb3RvY29sJztcblxuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuUHJvdG9jb2xNZXNzYWdlIHtcblx0c2VxOiBudW1iZXI7XG5cdHR5cGU6IHN0cmluZztcblxuXHRwdWJsaWMgY29uc3RydWN0b3IodHlwZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXEgPSAwO1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlc3BvbnNlIGV4dGVuZHMgTWVzc2FnZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuUmVzcG9uc2Uge1xuXHRyZXF1ZXN0X3NlcTogbnVtYmVyO1xuXHRzdWNjZXNzOiBib29sZWFuO1xuXHRjb21tYW5kOiBzdHJpbmc7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlcXVlc3Q6IERlYnVnUHJvdG9jb2wuUmVxdWVzdCwgbWVzc2FnZT86IHN0cmluZykge1xuXHRcdHN1cGVyKCdyZXNwb25zZScpO1xuXHRcdHRoaXMucmVxdWVzdF9zZXEgPSByZXF1ZXN0LnNlcTtcblx0XHR0aGlzLmNvbW1hbmQgPSByZXF1ZXN0LmNvbW1hbmQ7XG5cdFx0aWYgKG1lc3NhZ2UpIHtcblx0XHRcdHRoaXMuc3VjY2VzcyA9IGZhbHNlO1xuXHRcdFx0KDxhbnk+dGhpcykubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc3VjY2VzcyA9IHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudCBleHRlbmRzIE1lc3NhZ2UgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkV2ZW50IHtcblx0ZXZlbnQ6IHN0cmluZztcblxuXHRwdWJsaWMgY29uc3RydWN0b3IoZXZlbnQ6IHN0cmluZywgYm9keT86IGFueSkge1xuXHRcdHN1cGVyKCdldmVudCcpO1xuXHRcdHRoaXMuZXZlbnQgPSBldmVudDtcblx0XHRpZiAoYm9keSkge1xuXHRcdFx0KDxhbnk+dGhpcykuYm9keSA9IGJvZHk7XG5cdFx0fVxuXHR9XG59XG4iXX0=

/***/ }),

/***/ "./node_modules/vscode-debugadapter/lib/protocol.js":
/*!**********************************************************!*\
  !*** ./node_modules/vscode-debugadapter/lib/protocol.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const ee = __webpack_require__(/*! events */ "events");
const messages_1 = __webpack_require__(/*! ./messages */ "./node_modules/vscode-debugadapter/lib/messages.js");
class ProtocolServer extends ee.EventEmitter {
    constructor() {
        super();
        this._pendingRequests = new Map();
    }
    start(inStream, outStream) {
        this._sequence = 1;
        this._writableStream = outStream;
        this._rawData = new Buffer(0);
        inStream.on('data', (data) => this._handleData(data));
        inStream.on('close', () => {
            this._emitEvent(new messages_1.Event('close'));
        });
        inStream.on('error', (error) => {
            this._emitEvent(new messages_1.Event('error', 'inStream error: ' + (error && error.message)));
        });
        outStream.on('error', (error) => {
            this._emitEvent(new messages_1.Event('error', 'outStream error: ' + (error && error.message)));
        });
        inStream.resume();
    }
    stop() {
        if (this._writableStream) {
            this._writableStream.end();
        }
    }
    sendEvent(event) {
        this._send('event', event);
    }
    sendResponse(response) {
        if (response.seq > 0) {
            console.error(`attempt to send more than one response for command ${response.command}`);
        }
        else {
            this._send('response', response);
        }
    }
    sendRequest(command, args, timeout, cb) {
        const request = {
            command: command
        };
        if (args && Object.keys(args).length > 0) {
            request.arguments = args;
        }
        if (!this._writableStream) {
            this._emitEvent(new messages_1.Event('error', 'sendRequest: No writableStream'));
            return;
        }
        this._send('request', request);
        if (cb) {
            this._pendingRequests.set(request.seq, cb);
            const timer = setTimeout(() => {
                clearTimeout(timer);
                const clb = this._pendingRequests.get(request.seq);
                if (clb) {
                    this._pendingRequests.delete(request.seq);
                    clb(new messages_1.Response(request, 'timeout'));
                }
            }, timeout);
        }
    }
    // ---- protected ----------------------------------------------------------
    dispatchRequest(request) {
    }
    // ---- private ------------------------------------------------------------
    _emitEvent(event) {
        this.emit(event.event, event);
    }
    _send(typ, message) {
        message.type = typ;
        message.seq = this._sequence++;
        if (this._writableStream) {
            const json = JSON.stringify(message);
            this._writableStream.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`, 'utf8');
        }
    }
    _handleData(data) {
        this._rawData = Buffer.concat([this._rawData, data]);
        while (true) {
            if (this._contentLength >= 0) {
                if (this._rawData.length >= this._contentLength) {
                    const message = this._rawData.toString('utf8', 0, this._contentLength);
                    this._rawData = this._rawData.slice(this._contentLength);
                    this._contentLength = -1;
                    if (message.length > 0) {
                        try {
                            let msg = JSON.parse(message);
                            if (msg.type === 'request') {
                                this.dispatchRequest(msg);
                            }
                            else if (msg.type === 'response') {
                                const response = msg;
                                const clb = this._pendingRequests.get(response.request_seq);
                                if (clb) {
                                    this._pendingRequests.delete(response.request_seq);
                                    clb(response);
                                }
                            }
                        }
                        catch (e) {
                            this._emitEvent(new messages_1.Event('error', 'Error handling data: ' + (e && e.message)));
                        }
                    }
                    continue; // there may be more complete messages to process
                }
            }
            else {
                const idx = this._rawData.indexOf(ProtocolServer.TWO_CRLF);
                if (idx !== -1) {
                    const header = this._rawData.toString('utf8', 0, idx);
                    const lines = header.split('\r\n');
                    for (let i = 0; i < lines.length; i++) {
                        const pair = lines[i].split(/: +/);
                        if (pair[0] == 'Content-Length') {
                            this._contentLength = +pair[1];
                        }
                    }
                    this._rawData = this._rawData.slice(idx + ProtocolServer.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    }
}
ProtocolServer.TWO_CRLF = '\r\n\r\n';
exports.ProtocolServer = ProtocolServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOztBQUVoRyw2QkFBNkI7QUFFN0IseUNBQTZDO0FBRzdDLE1BQWEsY0FBZSxTQUFRLEVBQUUsQ0FBQyxZQUFZO0lBVWxEO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFIRCxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztJQUl6RixDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQStCLEVBQUUsU0FBZ0M7UUFDN0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QixRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTlELFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksZ0JBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksZ0JBQUssQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDL0Is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QUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMxRSxTQUFTO2lCQUNUO2FBQ0Q7WUFDRCxNQUFNO1NBQ047SUFDRixDQUFDOztBQXRKYyx1QkFBUSxHQUFHLFVBQVUsQ0FBQztBQUZ0Qyx3Q0F5SkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0ICogYXMgZWUgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERlYnVnUHJvdG9jb2wgfSBmcm9tICd2c2NvZGUtZGVidWdwcm90b2NvbCc7XG5pbXBvcnQgeyBSZXNwb25zZSwgRXZlbnQgfSBmcm9tICcuL21lc3NhZ2VzJztcblxuXG5leHBvcnQgY2xhc3MgUHJvdG9jb2xTZXJ2ZXIgZXh0ZW5kcyBlZS5FdmVudEVtaXR0ZXIge1xuXG5cdHByaXZhdGUgc3RhdGljIFRXT19DUkxGID0gJ1xcclxcblxcclxcbic7XG5cblx0cHJpdmF0ZSBfcmF3RGF0YTogQnVmZmVyO1xuXHRwcml2YXRlIF9jb250ZW50TGVuZ3RoOiBudW1iZXI7XG5cdHByaXZhdGUgX3NlcXVlbmNlOiBudW1iZXI7XG5cdHByaXZhdGUgX3dyaXRhYmxlU3RyZWFtOiBOb2RlSlMuV3JpdGFibGVTdHJlYW07XG5cdHByaXZhdGUgX3BlbmRpbmdSZXF1ZXN0cyA9IG5ldyBNYXA8bnVtYmVyLCAocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UpID0+IHZvaWQ+KCk7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBzdGFydChpblN0cmVhbTogTm9kZUpTLlJlYWRhYmxlU3RyZWFtLCBvdXRTdHJlYW06IE5vZGVKUy5Xcml0YWJsZVN0cmVhbSk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcXVlbmNlID0gMTtcblx0XHR0aGlzLl93cml0YWJsZVN0cmVhbSA9IG91dFN0cmVhbTtcblx0XHR0aGlzLl9yYXdEYXRhID0gbmV3IEJ1ZmZlcigwKTtcblxuXHRcdGluU3RyZWFtLm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4gdGhpcy5faGFuZGxlRGF0YShkYXRhKSk7XG5cblx0XHRpblN0cmVhbS5vbignY2xvc2UnLCAoKSA9PiB7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQobmV3IEV2ZW50KCdjbG9zZScpKTtcblx0XHR9KTtcblx0XHRpblN0cmVhbS5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcblx0XHRcdHRoaXMuX2VtaXRFdmVudChuZXcgRXZlbnQoJ2Vycm9yJywgJ2luU3RyZWFtIGVycm9yOiAnICsgKGVycm9yICYmIGVycm9yLm1lc3NhZ2UpKSk7XG5cdFx0fSk7XG5cblx0XHRvdXRTdHJlYW0ub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQobmV3IEV2ZW50KCdlcnJvcicsICdvdXRTdHJlYW0gZXJyb3I6ICcgKyAoZXJyb3IgJiYgZXJyb3IubWVzc2FnZSkpKTtcblx0XHR9KTtcblxuXHRcdGluU3RyZWFtLnJlc3VtZSgpO1xuXHR9XG5cblx0cHVibGljIHN0b3AoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX3dyaXRhYmxlU3RyZWFtKSB7XG5cdFx0XHR0aGlzLl93cml0YWJsZVN0cmVhbS5lbmQoKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgc2VuZEV2ZW50KGV2ZW50OiBEZWJ1Z1Byb3RvY29sLkV2ZW50KTogdm9pZCB7XG5cdFx0dGhpcy5fc2VuZCgnZXZlbnQnLCBldmVudCk7XG5cdH1cblxuXHRwdWJsaWMgc2VuZFJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlKTogdm9pZCB7XG5cdFx0aWYgKHJlc3BvbnNlLnNlcSA+IDApIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGF0dGVtcHQgdG8gc2VuZCBtb3JlIHRoYW4gb25lIHJlc3BvbnNlIGZvciBjb21tYW5kICR7cmVzcG9uc2UuY29tbWFuZH1gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fc2VuZCgncmVzcG9uc2UnLCByZXNwb25zZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHNlbmRSZXF1ZXN0KGNvbW1hbmQ6IHN0cmluZywgYXJnczogYW55LCB0aW1lb3V0OiBudW1iZXIsIGNiOiAocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UpID0+IHZvaWQpIDogdm9pZCB7XG5cblx0XHRjb25zdCByZXF1ZXN0OiBhbnkgPSB7XG5cdFx0XHRjb21tYW5kOiBjb21tYW5kXG5cdFx0fTtcblx0XHRpZiAoYXJncyAmJiBPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXF1ZXN0LmFyZ3VtZW50cyA9IGFyZ3M7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLl93cml0YWJsZVN0cmVhbSkge1xuXHRcdFx0dGhpcy5fZW1pdEV2ZW50KG5ldyBFdmVudCgnZXJyb3InLCAnc2VuZFJlcXVlc3Q6IE5vIHdyaXRhYmxlU3RyZWFtJykpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX3NlbmQoJ3JlcXVlc3QnLCByZXF1ZXN0KTtcblxuXHRcdGlmIChjYikge1xuXHRcdFx0dGhpcy5fcGVuZGluZ1JlcXVlc3RzLnNldChyZXF1ZXN0LnNlcSwgY2IpO1xuXG5cdFx0XHRjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHRjb25zdCBjbGIgPSB0aGlzLl9wZW5kaW5nUmVxdWVzdHMuZ2V0KHJlcXVlc3Quc2VxKTtcblx0XHRcdFx0aWYgKGNsYikge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5kZWxldGUocmVxdWVzdC5zZXEpO1xuXHRcdFx0XHRcdGNsYihuZXcgUmVzcG9uc2UocmVxdWVzdCwgJ3RpbWVvdXQnKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRpbWVvdXQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIC0tLS0gcHJvdGVjdGVkIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcm90ZWN0ZWQgZGlzcGF0Y2hSZXF1ZXN0KHJlcXVlc3Q6IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHR9XG5cblx0Ly8gLS0tLSBwcml2YXRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByaXZhdGUgX2VtaXRFdmVudChldmVudDogRGVidWdQcm90b2NvbC5FdmVudCkge1xuXHRcdHRoaXMuZW1pdChldmVudC5ldmVudCwgZXZlbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2VuZCh0eXA6ICdyZXF1ZXN0JyB8ICdyZXNwb25zZScgfCAnZXZlbnQnLCBtZXNzYWdlOiBEZWJ1Z1Byb3RvY29sLlByb3RvY29sTWVzc2FnZSk6IHZvaWQge1xuXG5cdFx0bWVzc2FnZS50eXBlID0gdHlwO1xuXHRcdG1lc3NhZ2Uuc2VxID0gdGhpcy5fc2VxdWVuY2UrKztcblxuXHRcdGlmICh0aGlzLl93cml0YWJsZVN0cmVhbSkge1xuXHRcdFx0Y29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuXHRcdFx0dGhpcy5fd3JpdGFibGVTdHJlYW0ud3JpdGUoYENvbnRlbnQtTGVuZ3RoOiAke0J1ZmZlci5ieXRlTGVuZ3RoKGpzb24sICd1dGY4Jyl9XFxyXFxuXFxyXFxuJHtqc29ufWAsICd1dGY4Jyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfaGFuZGxlRGF0YShkYXRhOiBCdWZmZXIpOiB2b2lkIHtcblxuXHRcdHRoaXMuX3Jhd0RhdGEgPSBCdWZmZXIuY29uY2F0KFt0aGlzLl9yYXdEYXRhLCBkYXRhXSk7XG5cblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0aWYgKHRoaXMuX2NvbnRlbnRMZW5ndGggPj0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5fcmF3RGF0YS5sZW5ndGggPj0gdGhpcy5fY29udGVudExlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9yYXdEYXRhLnRvU3RyaW5nKCd1dGY4JywgMCwgdGhpcy5fY29udGVudExlbmd0aCk7XG5cdFx0XHRcdFx0dGhpcy5fcmF3RGF0YSA9IHRoaXMuX3Jhd0RhdGEuc2xpY2UodGhpcy5fY29udGVudExlbmd0aCk7XG5cdFx0XHRcdFx0dGhpcy5fY29udGVudExlbmd0aCA9IC0xO1xuXHRcdFx0XHRcdGlmIChtZXNzYWdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGxldCBtc2c6IERlYnVnUHJvdG9jb2wuUHJvdG9jb2xNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0aWYgKG1zZy50eXBlID09PSAncmVxdWVzdCcpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmRpc3BhdGNoUmVxdWVzdCg8RGVidWdQcm90b2NvbC5SZXF1ZXN0PiBtc2cpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG1zZy50eXBlID09PSAncmVzcG9uc2UnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSA8RGVidWdQcm90b2NvbC5SZXNwb25zZT4gbXNnO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGNsYiA9IHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5nZXQocmVzcG9uc2UucmVxdWVzdF9zZXEpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChjbGIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5kZWxldGUocmVzcG9uc2UucmVxdWVzdF9zZXEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2xiKHJlc3BvbnNlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2VtaXRFdmVudChuZXcgRXZlbnQoJ2Vycm9yJywgJ0Vycm9yIGhhbmRsaW5nIGRhdGE6ICcgKyAoZSAmJiBlLm1lc3NhZ2UpKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnRpbnVlO1x0Ly8gdGhlcmUgbWF5IGJlIG1vcmUgY29tcGxldGUgbWVzc2FnZXMgdG8gcHJvY2Vzc1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBpZHggPSB0aGlzLl9yYXdEYXRhLmluZGV4T2YoUHJvdG9jb2xTZXJ2ZXIuVFdPX0NSTEYpO1xuXHRcdFx0XHRpZiAoaWR4ICE9PSAtMSkge1xuXHRcdFx0XHRcdGNvbnN0IGhlYWRlciA9IHRoaXMuX3Jhd0RhdGEudG9TdHJpbmcoJ3V0ZjgnLCAwLCBpZHgpO1xuXHRcdFx0XHRcdGNvbnN0IGxpbmVzID0gaGVhZGVyLnNwbGl0KCdcXHJcXG4nKTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBwYWlyID0gbGluZXNbaV0uc3BsaXQoLzogKy8pO1xuXHRcdFx0XHRcdFx0aWYgKHBhaXJbMF0gPT0gJ0NvbnRlbnQtTGVuZ3RoJykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9jb250ZW50TGVuZ3RoID0gK3BhaXJbMV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd0RhdGEgPSB0aGlzLl9yYXdEYXRhLnNsaWNlKGlkeCArIFByb3RvY29sU2VydmVyLlRXT19DUkxGLmxlbmd0aCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuIl19

/***/ }),

/***/ "./src/backend/backend.ts":
/*!********************************!*\
  !*** ./src/backend/backend.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mi_parse_1 = __webpack_require__(/*! ./mi_parse */ "./src/backend/mi_parse.ts");
class VariableObject {
    constructor(node) {
        this.name = mi_parse_1.MINode.valueOf(node, 'name');
        this.exp = mi_parse_1.MINode.valueOf(node, 'exp');
        this.numchild = parseInt(mi_parse_1.MINode.valueOf(node, 'numchild'));
        this.type = mi_parse_1.MINode.valueOf(node, 'type');
        this.value = mi_parse_1.MINode.valueOf(node, 'value');
        this.threadId = mi_parse_1.MINode.valueOf(node, 'thread-id');
        this.frozen = !!mi_parse_1.MINode.valueOf(node, 'frozen');
        this.dynamic = !!mi_parse_1.MINode.valueOf(node, 'dynamic');
        this.displayhint = mi_parse_1.MINode.valueOf(node, 'displayhint');
        this.children = {};
        // TODO: use has_more when it's > 0
        this.hasMore = !!mi_parse_1.MINode.valueOf(node, 'has_more');
    }
    applyChanges(node) {
        this.value = mi_parse_1.MINode.valueOf(node, 'value');
        if (!!mi_parse_1.MINode.valueOf(node, 'type_changed')) {
            this.type = mi_parse_1.MINode.valueOf(node, 'new_type');
        }
        this.dynamic = !!mi_parse_1.MINode.valueOf(node, 'dynamic');
        this.displayhint = mi_parse_1.MINode.valueOf(node, 'displayhint');
        this.hasMore = !!mi_parse_1.MINode.valueOf(node, 'has_more');
    }
    isCompound() {
        return this.numchild > 0 ||
            this.value === '{...}' ||
            (this.dynamic && (this.displayhint === 'array' || this.displayhint === 'map'));
    }
    toProtocolVariable() {
        const res = {
            name: this.exp,
            evaluateName: this.fullExp || this.exp,
            value: (this.value === void 0) ? '<unknown>' : this.value,
            type: this.type,
            presentationHint: {
                kind: this.displayhint
            },
            variablesReference: this.id
        };
        if (this.displayhint) {
            // res.kind = this.displayhint;
        }
        return res;
    }
}
exports.VariableObject = VariableObject;
exports.MIError = class MIError {
    constructor(message, source) {
        Object.defineProperty(this, 'name', {
            get: () => this.constructor.name
        });
        Object.defineProperty(this, 'message', {
            get: () => message
        });
        Object.defineProperty(this, 'source', {
            get: () => source
        });
        Error.captureStackTrace(this, this.constructor);
    }
    toString() {
        return `${this.message} (from ${this.source})`;
    }
};
Object.setPrototypeOf(exports.MIError, Object.create(Error.prototype));
exports.MIError.prototype.constructor = exports.MIError;


/***/ }),

/***/ "./src/backend/gdb_expansion.ts":
/*!**************************************!*\
  !*** ./src/backend/gdb_expansion.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mi_parse_1 = __webpack_require__(/*! ./mi_parse */ "./src/backend/mi_parse.ts");
const resultRegex = /^([a-zA-Z_\-][a-zA-Z0-9_\-]*|\[\d+\])\s*=\s*/;
const variableRegex = /^[a-zA-Z_\-][a-zA-Z0-9_\-]*/;
const errorRegex = /^\<.+?\>/;
const referenceStringRegex = /^(0x[0-9a-fA-F]+\s*)"/;
const referenceRegex = /^0x[0-9a-fA-F]+/;
const nullpointerRegex = /^0x0+\b/;
const charRegex = /^(\d+) ['"]/;
const numberRegex = /^\d+(\.\d+)?/;
const pointerCombineChar = '.';
function isExpandable(value) {
    let match;
    value = value.trim();
    if (value.length === 0) {
        return 0;
    }
    else if (value.startsWith('{...}')) {
        return 2;
    } // lldb string/array
    else if (value[0] === '{') {
        return 1;
    } // object
    else if (value.startsWith('true')) {
        return 0;
    }
    else if (value.startsWith('false')) {
        return 0;
    }
    else if (match = nullpointerRegex.exec(value)) {
        return 0;
    }
    else if (match = referenceStringRegex.exec(value)) {
        return 0;
    }
    else if (match = referenceRegex.exec(value)) {
        return 2;
    } // reference
    else if (match = charRegex.exec(value)) {
        return 0;
    }
    else if (match = numberRegex.exec(value)) {
        return 0;
    }
    else if (match = variableRegex.exec(value)) {
        return 0;
    }
    else if (match = errorRegex.exec(value)) {
        return 0;
    }
    else {
        return 0;
    }
}
exports.isExpandable = isExpandable;
// tslint:disable-next-line:ban-types
function expandValue(variableCreate, value, root = '', extra) {
    const parseCString = () => {
        value = value.trim();
        if (value[0] !== '"' && value[0] !== '\'') {
            return '';
        }
        let stringEnd = 1;
        let inString = true;
        const charStr = value[0];
        let remaining = value.substr(1);
        let escaped = false;
        while (inString) {
            if (escaped) {
                escaped = false;
            }
            else if (remaining[0] === '\\') {
                escaped = true;
            }
            else if (remaining[0] === charStr) {
                inString = false;
            }
            remaining = remaining.substr(1);
            stringEnd++;
        }
        const str = value.substr(0, stringEnd).trim();
        value = value.substr(stringEnd).trim();
        return str;
    };
    const stack = [root];
    let parseValue;
    let parseCommaResult;
    let parseCommaValue;
    let parseResult;
    let createValue;
    let variable = '';
    const getNamespace = (variable) => {
        let namespace = '';
        let prefix = '';
        stack.push(variable);
        stack.forEach((name) => {
            prefix = '';
            if (name !== '') {
                if (name.startsWith('[')) {
                    namespace = namespace + name;
                }
                else {
                    if (namespace) {
                        while (name.startsWith('*')) {
                            prefix += '*';
                            name = name.substr(1);
                        }
                        namespace = namespace + pointerCombineChar + name;
                    }
                    else {
                        namespace = name;
                    }
                }
            }
        });
        stack.pop();
        return prefix + namespace;
    };
    const parseTupleOrList = () => {
        value = value.trim();
        if (value[0] !== '{') {
            return undefined;
        }
        const oldContent = value;
        value = value.substr(1).trim();
        if (value[0] === '}') {
            value = value.substr(1).trim();
            return [];
        }
        if (value.startsWith('...')) {
            value = value.substr(3).trim();
            if (value[0] === '}') {
                value = value.substr(1).trim();
                return '<...>';
            }
        }
        const eqPos = value.indexOf('=');
        const newValPos1 = value.indexOf('{');
        const newValPos2 = value.indexOf(',');
        let newValPos = newValPos1;
        if (newValPos2 !== -1 && newValPos2 < newValPos1) {
            newValPos = newValPos2;
        }
        if (newValPos !== -1 && eqPos > newValPos || eqPos === -1) { // is value list
            const values = [];
            stack.push('[0]');
            let val = parseValue();
            stack.pop();
            values.push(createValue('[0]', val));
            const remaining = value;
            let i = 0;
            while (true) {
                stack.push('[' + (++i) + ']');
                if (!(val = parseCommaValue())) {
                    stack.pop();
                    break;
                }
                stack.pop();
                values.push(createValue('[' + i + ']', val));
            }
            value = value.substr(1).trim(); // }
            return values;
        }
        let result = parseResult(true);
        if (result) {
            const results = [];
            results.push(result);
            while (result = parseCommaResult(true)) {
                results.push(result);
            }
            value = value.substr(1).trim(); // }
            return results;
        }
        return undefined;
    };
    const parsePrimitive = () => {
        let primitive;
        let match;
        value = value.trim();
        if (value.length === 0) {
            primitive = undefined;
        }
        else if (value.startsWith('true')) {
            primitive = 'true';
            value = value.substr(4).trim();
        }
        else if (value.startsWith('false')) {
            primitive = 'false';
            value = value.substr(5).trim();
        }
        else if (match = nullpointerRegex.exec(value)) {
            primitive = '<nullptr>';
            value = value.substr(match[0].length).trim();
        }
        else if (match = referenceStringRegex.exec(value)) {
            value = value.substr(match[1].length).trim();
            primitive = parseCString();
        }
        else if (match = referenceRegex.exec(value)) {
            primitive = '*' + match[0];
            value = value.substr(match[0].length).trim();
        }
        else if (match = charRegex.exec(value)) {
            primitive = match[1];
            value = value.substr(match[0].length - 1);
            primitive += ' ' + parseCString();
        }
        else if (match = numberRegex.exec(value)) {
            primitive = match[0];
            value = value.substr(match[0].length).trim();
        }
        else if (match = variableRegex.exec(value)) {
            primitive = match[0];
            value = value.substr(match[0].length).trim();
        }
        else if (match = errorRegex.exec(value)) {
            primitive = match[0];
            value = value.substr(match[0].length).trim();
        }
        else {
            primitive = value;
        }
        return primitive;
    };
    parseValue = () => {
        value = value.trim();
        if (value[0] === '"') {
            return parseCString();
        }
        else if (value[0] === '{') {
            return parseTupleOrList();
        }
        else {
            return parsePrimitive();
        }
    };
    parseResult = (pushToStack = false) => {
        value = value.trim();
        const variableMatch = resultRegex.exec(value);
        if (!variableMatch) {
            return undefined;
        }
        value = value.substr(variableMatch[0].length).trim();
        const name = variable = variableMatch[1];
        if (pushToStack) {
            stack.push(variable);
        }
        const val = parseValue();
        if (pushToStack) {
            stack.pop();
        }
        return createValue(name, val);
    };
    createValue = (name, val) => {
        let ref = 0;
        if (typeof val === 'object') {
            ref = variableCreate(val);
            val = 'Object';
        }
        if (typeof val === 'string' && val.startsWith('*0x')) {
            if (extra && mi_parse_1.MINode.valueOf(extra, 'arg') === '1') {
                ref = variableCreate(getNamespace('*(' + name), { arg: true });
                val = '<args>';
            }
            else {
                ref = variableCreate(getNamespace('*' + name));
                val = 'Object@' + val;
            }
        }
        if (typeof val === 'string' && val.startsWith('<...>')) {
            ref = variableCreate(getNamespace(name));
            val = '...';
        }
        return {
            name: name,
            value: val,
            variablesReference: ref
        };
    };
    parseCommaValue = () => {
        value = value.trim();
        if (value[0] !== ',') {
            return undefined;
        }
        value = value.substr(1).trim();
        return parseValue();
    };
    parseCommaResult = (pushToStack = false) => {
        value = value.trim();
        if (value[0] !== ',') {
            return undefined;
        }
        value = value.substr(1).trim();
        return parseResult(pushToStack);
    };
    value = value.trim();
    return parseValue();
}
exports.expandValue = expandValue;


/***/ }),

/***/ "./src/backend/mi2/mi2.ts":
/*!********************************!*\
  !*** ./src/backend/mi2/mi2.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const backend_1 = __webpack_require__(/*! ../backend */ "./src/backend/backend.ts");
const ChildProcess = __webpack_require__(/*! child_process */ "child_process");
const events_1 = __webpack_require__(/*! events */ "events");
const mi_parse_1 = __webpack_require__(/*! ../mi_parse */ "./src/backend/mi_parse.ts");
const path_1 = __webpack_require__(/*! path */ "path");
const nativePath = __webpack_require__(/*! path */ "path");
const path = path_1.posix;
function escape(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
exports.escape = escape;
const nonOutput = /^(?:\d*|undefined)[\*\+\=]|[\~\@\&\^]/;
const gdbMatch = /(?:\d*|undefined)\(gdb\)/;
const numRegex = /\d+/;
function couldBeOutput(line) {
    if (nonOutput.exec(line)) {
        return false;
    }
    return true;
}
const trace = false;
class MI2 extends events_1.EventEmitter {
    constructor(application, args) {
        super();
        this.application = application;
        this.args = args;
        this.currentToken = 1;
        this.handlers = {};
    }
    connect(cwd, executable, commands) {
        if (!nativePath.isAbsolute(executable)) {
            executable = nativePath.join(cwd, executable);
        }
        return new Promise((resolve, reject) => {
            const args = [...this.args, executable];
            this.process = ChildProcess.spawn(this.application, args, { cwd: cwd, env: this.procEnv });
            this.process.stdout.on('data', this.stdout.bind(this));
            this.process.stderr.on('data', this.stderr.bind(this));
            this.process.on('exit', (() => { this.emit('quit'); }).bind(this));
            this.process.on('error', ((err) => { this.emit('launcherror', err); }).bind(this));
            const asyncPromise = this.sendCommand('gdb-set target-async on', true);
            const promises = commands.map((c) => this.sendCommand(c));
            promises.push(asyncPromise);
            Promise.all(promises).then(() => {
                this.emit('debug-ready');
                resolve();
            }, reject);
        });
    }
    stdout(data) {
        if (trace) {
            this.log('stderr', 'stdout: ' + data);
        }
        if (typeof data === 'string') {
            this.buffer += data;
        }
        else {
            this.buffer += data.toString('utf8');
        }
        const end = this.buffer.lastIndexOf('\n');
        if (end !== -1) {
            this.onOutput(this.buffer.substr(0, end));
            this.buffer = this.buffer.substr(end + 1);
        }
        if (this.buffer.length) {
            if (this.onOutputPartial(this.buffer)) {
                this.buffer = '';
            }
        }
    }
    stderr(data) {
        if (typeof data === 'string') {
            this.errbuf += data;
        }
        else {
            this.errbuf += data.toString('utf8');
        }
        const end = this.errbuf.lastIndexOf('\n');
        if (end !== -1) {
            this.onOutputStderr(this.errbuf.substr(0, end));
            this.errbuf = this.errbuf.substr(end + 1);
        }
        if (this.errbuf.length) {
            this.logNoNewLine('stderr', this.errbuf);
            this.errbuf = '';
        }
    }
    onOutputStderr(lines) {
        lines = lines.split('\n');
        lines.forEach((line) => {
            this.log('stderr', line);
        });
    }
    onOutputPartial(line) {
        if (couldBeOutput(line)) {
            this.logNoNewLine('stdout', line);
            return true;
        }
        return false;
    }
    onOutput(lines) {
        lines = lines.split('\n');
        lines.forEach((line) => {
            if (couldBeOutput(line)) {
                if (!gdbMatch.exec(line)) {
                    this.log('stdout', line);
                }
            }
            else {
                const parsed = mi_parse_1.parseMI(line);
                if (this.debugOutput) {
                    this.log('log', 'GDB -> App: ' + JSON.stringify(parsed));
                }
                let handled = false;
                if (parsed.token !== undefined) {
                    if (this.handlers[parsed.token]) {
                        this.handlers[parsed.token](parsed);
                        delete this.handlers[parsed.token];
                        handled = true;
                    }
                }
                if (!handled && parsed.resultRecords && parsed.resultRecords.resultClass === 'error') {
                    this.log('stderr', parsed.result('msg') || line);
                }
                if (parsed.outOfBandRecord) {
                    parsed.outOfBandRecord.forEach((record) => {
                        if (record.isStream) {
                            this.log(record.type, record.content);
                        }
                        else {
                            if (record.type === 'exec') {
                                this.emit('exec-async-output', parsed);
                                if (record.asyncClass === 'running') {
                                    this.emit('running', parsed);
                                }
                                else if (record.asyncClass === 'stopped') {
                                    const reason = parsed.record('reason');
                                    if (trace) {
                                        this.log('stderr', 'stop: ' + reason);
                                    }
                                    if (reason === 'breakpoint-hit') {
                                        this.emit('breakpoint', parsed);
                                    }
                                    else if (reason === 'end-stepping-range') {
                                        this.emit('step-end', parsed);
                                    }
                                    else if (reason === 'function-finished') {
                                        this.emit('step-out-end', parsed);
                                    }
                                    else if (reason === 'signal-received') {
                                        this.emit('signal-stop', parsed);
                                    }
                                    else if (reason === 'exited-normally') {
                                        this.emit('exited-normally', parsed);
                                    }
                                    else if (reason === 'exited') { // exit with error code != 0
                                        this.log('stderr', 'Program exited with code ' + parsed.record('exit-code'));
                                        this.emit('exited-normally', parsed);
                                    }
                                    else {
                                        this.log('console', 'Not implemented stop reason (assuming exception): ' + reason);
                                        this.emit('stopped', parsed);
                                    }
                                    this.emit('generic-stopped', parsed);
                                }
                                else {
                                    this.log('log', JSON.stringify(parsed));
                                }
                            }
                            else if (record.type === 'notify') {
                                let tid;
                                let gid;
                                for (const item of record.output) {
                                    if (item[0] === 'id') {
                                        tid = item[1];
                                    }
                                    else if (item[0] === 'group-id') {
                                        gid = item[1];
                                    }
                                }
                                if (record.asyncClass === 'thread-created') {
                                    this.emit('thread-created', { threadId: parseInt(tid), threadGroupId: gid });
                                }
                                else if (record.asyncClass === 'thread-exited') {
                                    this.emit('thread-exited', { threadId: parseInt(tid), threadGroupId: gid });
                                }
                                else if (record.asyncClass === 'thread-selected') {
                                    this.emit('thread-selected', { threadId: parseInt(tid) });
                                }
                                else if (record.asyncClass === 'thread-group-exited') {
                                    this.emit('thread-group-exited', { threadGroupId: tid });
                                }
                            }
                        }
                    });
                    handled = true;
                }
                if (parsed.token === undefined && parsed.resultRecords === undefined && parsed.outOfBandRecord.length === 0) {
                    handled = true;
                }
                if (!handled) {
                    this.log('log', 'Unhandled: ' + JSON.stringify(parsed));
                }
            }
        });
    }
    tryKill() {
        const proc = this.process;
        try {
            process.kill(-proc.pid);
        }
        catch (e) {
            this.log('log', `kill failed for ${-proc.pid}` + e);
        }
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'stop');
            }
            const proc = this.process;
            const to = setTimeout(() => { this.tryKill(); }, 1000);
            this.process.on('exit', (code) => { clearTimeout(to); });
            // Disconnect first. Not doing so and exiting will cause an unwanted detach if the
            // program is in paused state
            yield this.sendCommand('target-disconnect');
            this.sendRaw('-gdb-exit');
        });
    }
    detach() {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'detach');
            }
            yield this.sendCommand('target-detach');
            this.stop();
        });
    }
    interrupt(arg = '') {
        if (trace) {
            this.log('stderr', 'interrupt ' + arg);
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`exec-interrupt ${arg}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'done');
            }, reject);
        });
    }
    continue(threadId) {
        if (trace) {
            this.log('stderr', 'continue');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`exec-continue --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    next(threadId, instruction) {
        if (trace) {
            this.log('stderr', 'next');
        }
        return new Promise((resolve, reject) => {
            const baseCmd = instruction ? 'exec-next-instruction' : 'exec-next';
            this.sendCommand(`${baseCmd} --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    step(threadId, instruction) {
        if (trace) {
            this.log('stderr', 'step');
        }
        return new Promise((resolve, reject) => {
            const baseCmd = instruction ? 'exec-step-instruction' : 'exec-step';
            this.sendCommand(`${baseCmd} --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    stepOut(threadId) {
        if (trace) {
            this.log('stderr', 'stepOut');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`exec-finish --thread ${threadId}`).then((info) => {
                resolve(info.resultRecords.resultClass === 'running');
            }, reject);
        });
    }
    restart(commands) {
        if (trace) {
            this.log('stderr', 'restart');
        }
        return this._sendCommandSequence(commands);
    }
    postStart(commands) {
        if (trace) {
            this.log('stderr', 'post-start');
        }
        return this._sendCommandSequence(commands);
    }
    _sendCommandSequence(commands) {
        return new Promise((resolve, reject) => {
            const nextCommand = ((commands) => {
                if (commands.length === 0) {
                    resolve(true);
                }
                else {
                    const command = commands[0];
                    this.sendCommand(command).then((r) => { nextCommand(commands.slice(1)); }, reject);
                }
            }).bind(this);
            nextCommand(commands);
        });
    }
    changeVariable(name, rawValue) {
        if (trace) {
            this.log('stderr', 'changeVariable');
        }
        return this.sendCommand('gdb-set var ' + name + '=' + rawValue);
    }
    setBreakPointCondition(bkptNum, condition) {
        if (trace) {
            this.log('stderr', 'setBreakPointCondition');
        }
        return this.sendCommand('break-condition ' + bkptNum + ' ' + condition);
    }
    addBreakPoint(breakpoint) {
        if (trace) {
            this.log('stderr', 'addBreakPoint');
        }
        return new Promise((resolve, reject) => {
            let location = '';
            if (breakpoint.countCondition) {
                if (breakpoint.countCondition[0] === '>') {
                    location += '-i ' + numRegex.exec(breakpoint.countCondition.substr(1))[0] + ' ';
                }
                else {
                    const match = numRegex.exec(breakpoint.countCondition)[0];
                    if (match.length !== breakpoint.countCondition.length) {
                        // tslint:disable-next-line:max-line-length
                        this.log('stderr', 'Unsupported break count expression: \'' + breakpoint.countCondition + '\'. Only supports \'X\' for breaking once after X times or \'>X\' for ignoring the first X breaks');
                        location += '-t ';
                    }
                    else if (parseInt(match) !== 0) {
                        location += '-t -i ' + parseInt(match) + ' ';
                    }
                }
            }
            if (breakpoint.raw) {
                location += '*' + escape(breakpoint.raw);
            }
            else {
                location += '"' + escape(breakpoint.file) + ':' + breakpoint.line + '"';
            }
            this.sendCommand(`break-insert ${location}`).then((result) => {
                if (result.resultRecords.resultClass === 'done') {
                    const bkptNum = parseInt(result.result('bkpt.number'));
                    breakpoint.number = bkptNum;
                    if (breakpoint.condition) {
                        this.setBreakPointCondition(bkptNum, breakpoint.condition).then((result) => {
                            if (result.resultRecords.resultClass === 'done') {
                                resolve(breakpoint);
                            }
                            else {
                                resolve(null);
                            }
                        }, reject);
                    }
                    else {
                        resolve(breakpoint);
                    }
                }
                else {
                    resolve(null);
                }
            }, reject);
        });
    }
    removeBreakpoints(breakpoints) {
        if (trace) {
            this.log('stderr', 'removeBreakPoint');
        }
        return new Promise((resolve, reject) => {
            if (breakpoints.length === 0) {
                resolve(true);
            }
            else {
                const cmd = 'break-delete ' + breakpoints.join(' ');
                this.sendCommand(cmd).then((result) => {
                    resolve(result.resultRecords.resultClass === 'done');
                }, reject);
            }
        });
    }
    getFrame(thread, frame) {
        return new Promise((resolve, reject) => {
            const command = `stack-info-frame --thread ${thread} --frame ${frame}`;
            this.sendCommand(command).then((result) => {
                const frame = result.result('frame');
                const level = mi_parse_1.MINode.valueOf(frame, 'level');
                const addr = mi_parse_1.MINode.valueOf(frame, 'addr');
                const func = mi_parse_1.MINode.valueOf(frame, 'func');
                const file = mi_parse_1.MINode.valueOf(frame, 'file');
                const fullname = mi_parse_1.MINode.valueOf(frame, 'fullname');
                let line = 0;
                const linestr = mi_parse_1.MINode.valueOf(frame, 'line');
                if (linestr) {
                    line = parseInt(linestr);
                }
                resolve({
                    address: addr,
                    fileName: file,
                    file: fullname,
                    function: func,
                    level: level,
                    line: line
                });
            }, reject);
        });
    }
    getStack(threadId, startLevel, maxLevels) {
        if (trace) {
            this.log('stderr', 'getStack');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand(`stack-list-frames --thread ${threadId} ${startLevel} ${maxLevels}`).then((result) => {
                const stack = result.result('stack');
                const ret = [];
                stack.forEach((element) => {
                    const level = mi_parse_1.MINode.valueOf(element, '@frame.level');
                    const addr = mi_parse_1.MINode.valueOf(element, '@frame.addr');
                    const func = mi_parse_1.MINode.valueOf(element, '@frame.func');
                    const filename = mi_parse_1.MINode.valueOf(element, '@frame.file');
                    const file = mi_parse_1.MINode.valueOf(element, '@frame.fullname');
                    let line = 0;
                    const lnstr = mi_parse_1.MINode.valueOf(element, '@frame.line');
                    if (lnstr) {
                        line = parseInt(lnstr);
                    }
                    const from = parseInt(mi_parse_1.MINode.valueOf(element, '@frame.from'));
                    ret.push({
                        address: addr,
                        fileName: filename,
                        file: file,
                        function: func || from,
                        level: level,
                        line: line
                    });
                });
                resolve(ret);
            }, reject);
        });
    }
    getStackVariables(thread, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'getStackVariables');
            }
            const result = yield this.sendCommand(`stack-list-variables --thread ${thread} --frame ${frame} --simple-values`);
            const variables = result.result('variables');
            const ret = [];
            for (const element of variables) {
                const key = mi_parse_1.MINode.valueOf(element, 'name');
                const value = mi_parse_1.MINode.valueOf(element, 'value');
                const type = mi_parse_1.MINode.valueOf(element, 'type');
                ret.push({
                    name: key,
                    valueStr: value,
                    type: type,
                    raw: element
                });
            }
            return ret;
        });
    }
    examineMemory(from, length) {
        if (trace) {
            this.log('stderr', 'examineMemory');
        }
        return new Promise((resolve, reject) => {
            this.sendCommand('data-read-memory-bytes 0x' + from.toString(16) + ' ' + length).then((result) => {
                resolve(result.result('memory[0].contents'));
            }, reject);
        });
    }
    // Pass negative threadId/frameId to specify no context or current context
    evalExpression(name, threadId, frameId) {
        if (trace) {
            this.log('stderr', 'evalExpression');
        }
        return new Promise((resolve, reject) => {
            const thFr = MI2.getThreadFrameStr(threadId, frameId);
            this.sendCommand(`data-evaluate-expression ${thFr} ` + name).then((result) => {
                resolve(result);
            }, reject);
        });
    }
    varCreate(expression, name = '-', scope = '@') {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varCreate');
            }
            let fmt = null;
            expression = expression.trim();
            if (/,[bdhonx]$/i.test(expression)) {
                fmt = expression.substring(expression.length - 1).toLocaleLowerCase();
                expression = expression.substring(0, expression.length - 2);
            }
            expression = expression.replace(/"/g, '\\"');
            const createResp = yield this.sendCommand(`var-create ${name} ${scope} "${expression}"`);
            let overrideVal = null;
            if (fmt && name !== '-') {
                const formatResp = yield this.sendCommand(`var-set-format ${name} ${MI2.FORMAT_SPEC_MAP[fmt]}`);
                overrideVal = formatResp.result('value');
            }
            let result = createResp.result('');
            if (overrideVal) {
                result = result.map((r) => r[0] === 'value' ? ['value', overrideVal] : r);
            }
            return new backend_1.VariableObject(result);
        });
    }
    varEvalExpression(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varEvalExpression');
            }
            return this.sendCommand(`var-evaluate-expression ${name}`);
        });
    }
    varListChildren(name, flattenAnonymous) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varListChildren');
            }
            // TODO: add `from` and `to` arguments
            const res = yield this.sendCommand(`var-list-children --all-values ${name}`);
            const children = res.result('children') || [];
            const omg = [];
            for (const item of children) {
                const child = new backend_1.VariableObject(item[1]);
                if (flattenAnonymous && child.exp.startsWith('<anonymous ')) {
                    omg.push(...yield this.varListChildren(child.name, flattenAnonymous));
                }
                else {
                    omg.push(child);
                }
            }
            return omg;
        });
    }
    static getThreadFrameStr(threadId, frameId) {
        const th = threadId > 0 ? `--thread ${threadId} ` : '';
        const fr = frameId >= 0 ? `--frame ${frameId}` : '';
        return th + fr;
    }
    // Pass negative threadId/frameId to specify no context or current context
    varUpdate(name = '*', threadId, frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varUpdate');
            }
            return this.sendCommand(`var-update ${MI2.getThreadFrameStr(threadId, frameId)} --all-values ${name}`);
        });
    }
    // Pass negative threadId/frameId to specify no context or current context
    varAssign(name, rawValue, threadId, frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trace) {
                this.log('stderr', 'varAssign');
            }
            return this.sendCommand(`var-assign ${MI2.getThreadFrameStr(threadId, frameId)} ${name} ${rawValue}`);
        });
    }
    logNoNewLine(type, msg) {
        this.emit('msg', type, msg);
    }
    log(type, msg) {
        this.emit('msg', type, msg[msg.length - 1] === '\n' ? msg : (msg + '\n'));
    }
    sendUserInput(command) {
        if (command.startsWith('-')) {
            return this.sendCommand(command.substr(1));
        }
        else {
            return this.sendCommand(`interpreter-exec console "${command}"`);
        }
    }
    sendRaw(raw) {
        if (this.printCalls || trace) {
            this.log('log', raw);
        }
        if (raw.includes('undefined')) {
            console.log(raw);
        }
        this.process.stdin.write(raw + '\n');
    }
    getCurrentToken() {
        return this.currentToken;
    }
    sendCommand(command, suppressFailure = false) {
        const sel = this.currentToken++;
        return new Promise((resolve, reject) => {
            this.handlers[sel] = (node) => {
                if (node && node.resultRecords && node.resultRecords.resultClass === 'error') {
                    if (suppressFailure) {
                        this.log('stderr', `WARNING: Error executing command '${command}'`);
                        resolve(node);
                    }
                    else {
                        reject(new backend_1.MIError(node.result('msg') || 'Internal error', command));
                    }
                }
                else {
                    resolve(node);
                }
            };
            this.sendRaw(sel + '-' + command);
        });
    }
    isReady() {
        return !!this.process;
    }
}
MI2.FORMAT_SPEC_MAP = {
    b: 'binary',
    d: 'decimal',
    h: 'hexadecimal',
    o: 'octal',
    n: 'natural',
    x: 'hexadecimal'
};
exports.MI2 = MI2;


/***/ }),

/***/ "./src/backend/mi_parse.ts":
/*!*********************************!*\
  !*** ./src/backend/mi_parse.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const octalMatch = /^[0-7]{3}/;
function parseString(str) {
    const ret = Buffer.alloc(str.length * 4);
    let bufIndex = 0;
    if (str[0] !== '"' || str[str.length - 1] !== '"') {
        throw new Error('Not a valid string');
    }
    str = str.slice(1, -1);
    let escaped = false;
    for (let i = 0; i < str.length; i++) {
        if (escaped) {
            let m;
            if (str[i] === '\\') {
                bufIndex += ret.write('\\', bufIndex);
            }
            else if (str[i] === '"') {
                bufIndex += ret.write('"', bufIndex);
            }
            else if (str[i] === '\'') {
                bufIndex += ret.write('\'', bufIndex);
            }
            else if (str[i] === 'n') {
                bufIndex += ret.write('\n', bufIndex);
            }
            else if (str[i] === 'r') {
                bufIndex += ret.write('\r', bufIndex);
            }
            else if (str[i] === 't') {
                bufIndex += ret.write('\t', bufIndex);
            }
            else if (str[i] === 'b') {
                bufIndex += ret.write('\b', bufIndex);
            }
            else if (str[i] === 'f') {
                bufIndex += ret.write('\f', bufIndex);
            }
            else if (str[i] === 'v') {
                bufIndex += ret.write('\v', bufIndex);
            }
            else if (str[i] === '0') {
                bufIndex += ret.write('\0', bufIndex);
            }
            else if (m = octalMatch.exec(str.substr(i))) {
                ret.writeUInt8(parseInt(m[0], 8), bufIndex++);
                i += 2;
            }
            else {
                bufIndex += ret.write(str[i], bufIndex);
            }
            escaped = false;
        }
        else {
            if (str[i] === '\\') {
                escaped = true;
            }
            else if (str[i] === '"') {
                throw new Error('Not a valid string');
            }
            else {
                bufIndex += ret.write(str[i], bufIndex);
            }
        }
    }
    return ret.slice(0, bufIndex).toString('utf8');
}
class MINode {
    static valueOf(start, path) {
        if (!start) {
            return undefined;
        }
        const pathRegex = /^\.?([a-zA-Z_\-][a-zA-Z0-9_\-]*)/;
        const indexRegex = /^\[(\d+)\](?:$|\.)/;
        path = path.trim();
        if (!path) {
            return start;
        }
        let current = start;
        do {
            let target = pathRegex.exec(path);
            if (target) {
                path = path.substr(target[0].length);
                if (current.length && typeof current !== 'string') {
                    const found = [];
                    for (const element of current) {
                        if (element[0] === target[1]) {
                            found.push(element[1]);
                        }
                    }
                    if (found.length > 1) {
                        current = found;
                    }
                    else if (found.length === 1) {
                        current = found[0];
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    return undefined;
                }
            }
            else if (path[0] === '@') {
                current = [current];
                path = path.substr(1);
            }
            else {
                target = indexRegex.exec(path);
                if (target) {
                    path = path.substr(target[0].length);
                    const i = parseInt(target[1]);
                    if (current.length && typeof current !== 'string' && i >= 0 && i < current.length) {
                        current = current[i];
                    }
                    else if (i === 0) {
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    return undefined;
                }
            }
            path = path.trim();
        } while (path);
        return current;
    }
    constructor(token, info, result) {
        this.token = token;
        this.outOfBandRecord = info;
        this.resultRecords = result;
    }
    record(path) {
        if (!this.outOfBandRecord) {
            return undefined;
        }
        return MINode.valueOf(this.outOfBandRecord[0].output, path);
    }
    result(path) {
        if (!this.resultRecords) {
            return undefined;
        }
        return MINode.valueOf(this.resultRecords.results, path);
    }
}
exports.MINode = MINode;
const tokenRegex = /^\d+/;
const outOfBandRecordRegex = /^(?:(\d*|undefined)([\*\+\=])|([\~\@\&]))/;
const resultRecordRegex = /^(\d*)\^(done|running|connected|error|exit)/;
const newlineRegex = /^\r\n?/;
const endRegex = /^\(gdb\)\r\n?/;
const variableRegex = /^([a-zA-Z_\-][a-zA-Z0-9_\-]*)/;
const asyncClassRegex = /^(.*?),/;
function parseMI(output) {
    /*
        output ==>
            (
                exec-async-output     = [ token ] "*" ("stopped" | others) ( "," variable "=" (const | tuple | list) )* \n
                status-async-output   = [ token ] "+" ("stopped" | others) ( "," variable "=" (const | tuple | list) )* \n
                notify-async-output   = [ token ] "=" ("stopped" | others) ( "," variable "=" (const | tuple | list) )* \n
                console-stream-output = "~" c-string \n
                target-stream-output  = "@" c-string \n
                log-stream-output     = "&" c-string \n
            )*
            [
                [ token ] "^" ("done" | "running" | "connected" | "error" | "exit") ( "," variable "=" (const | tuple | list) )* \n
            ]
            "(gdb)" \n
    */
    let token;
    const outOfBandRecord = [];
    let resultRecords;
    const asyncRecordType = {
        '*': 'exec',
        '+': 'status',
        '=': 'notify'
    };
    const streamRecordType = {
        '~': 'console',
        '@': 'target',
        '&': 'log'
    };
    const parseCString = () => {
        if (output[0] !== '"') {
            return '';
        }
        let stringEnd = 1;
        let inString = true;
        let remaining = output.substr(1);
        let escaped = false;
        while (inString) {
            if (escaped) {
                escaped = false;
            }
            else if (remaining[0] === '\\') {
                escaped = true;
            }
            else if (remaining[0] === '"') {
                inString = false;
            }
            remaining = remaining.substr(1);
            stringEnd++;
        }
        let str;
        try {
            str = parseString(output.substr(0, stringEnd));
        }
        catch (e) {
            str = output.substr(0, stringEnd);
        }
        output = output.substr(stringEnd);
        return str;
    };
    let parseValue;
    let parseCommaResult;
    let parseCommaValue;
    let parseResult;
    const parseTupleOrList = () => {
        if (output[0] !== '{' && output[0] !== '[') {
            return undefined;
        }
        const oldContent = output;
        const canBeValueList = output[0] === '[';
        output = output.substr(1);
        if (output[0] === '}' || output[0] === ']') {
            output = output.substr(1);
            return [];
        }
        if (canBeValueList) {
            let value = parseValue();
            if (value) { // is value list
                const values = [];
                values.push(value);
                const remaining = output;
                while ((value = parseCommaValue()) !== undefined) {
                    values.push(value);
                }
                output = output.substr(1); // ]
                return values;
            }
        }
        let result = parseResult();
        if (result) {
            const results = [];
            results.push(result);
            while (result = parseCommaResult()) {
                results.push(result);
            }
            output = output.substr(1); // }
            return results;
        }
        output = (canBeValueList ? '[' : '{') + output;
        return undefined;
    };
    parseValue = () => {
        if (output[0] === '"') {
            return parseCString();
        }
        else if (output[0] === '{' || output[0] === '[') {
            return parseTupleOrList();
        }
        else {
            return undefined;
        }
    };
    parseResult = () => {
        const variableMatch = variableRegex.exec(output);
        if (!variableMatch) {
            return undefined;
        }
        output = output.substr(variableMatch[0].length + 1);
        const variable = variableMatch[1];
        return [variable, parseValue()];
    };
    parseCommaValue = () => {
        if (output[0] !== ',') {
            return undefined;
        }
        output = output.substr(1);
        return parseValue();
    };
    parseCommaResult = () => {
        if (output[0] !== ',') {
            return undefined;
        }
        output = output.substr(1);
        return parseResult();
    };
    let match;
    while (match = outOfBandRecordRegex.exec(output)) {
        output = output.substr(match[0].length);
        if (match[1] && token === undefined && match[1] !== 'undefined') {
            token = parseInt(match[1]);
        }
        if (match[2]) {
            const classMatch = asyncClassRegex.exec(output);
            output = output.substr(classMatch[1].length);
            const asyncRecord = {
                isStream: false,
                type: asyncRecordType[match[2]],
                asyncClass: classMatch[1],
                output: []
            };
            let result;
            while (result = parseCommaResult()) {
                asyncRecord.output.push(result);
            }
            outOfBandRecord.push(asyncRecord);
        }
        else if (match[3]) {
            const streamRecord = {
                isStream: true,
                type: streamRecordType[match[3]],
                content: parseCString()
            };
            outOfBandRecord.push(streamRecord);
        }
        output = output.replace(newlineRegex, '');
    }
    if (match = resultRecordRegex.exec(output)) {
        output = output.substr(match[0].length);
        if (match[1] && token === undefined) {
            token = parseInt(match[1]);
        }
        resultRecords = {
            resultClass: match[2],
            results: []
        };
        let result;
        while (result = parseCommaResult()) {
            resultRecords.results.push(result);
        }
        output = output.replace(newlineRegex, '');
    }
    return new MINode(token, outOfBandRecord || [], resultRecords);
}
exports.parseMI = parseMI;


/***/ }),

/***/ "./src/backend/server.ts":
/*!*******************************!*\
  !*** ./src/backend/server.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ChildProcess = __webpack_require__(/*! child_process */ "child_process");
const os = __webpack_require__(/*! os */ "os");
const events_1 = __webpack_require__(/*! events */ "events");
const timers_1 = __webpack_require__(/*! timers */ "timers");
const tcpportscanner_1 = __webpack_require__(/*! ../tcpportscanner */ "./src/tcpportscanner.ts");
class GDBServer extends events_1.EventEmitter {
    constructor(cwd, application, args, initMatch, port) {
        super();
        this.cwd = cwd;
        this.application = application;
        this.args = args;
        this.initMatch = initMatch;
        this.port = port;
        this.outBuffer = '';
        this.errBuffer = '';
    }
    init() {
        return new Promise((resolve, reject) => {
            if (this.application !== null) {
                this.initResolve = resolve;
                this.initReject = reject;
                this.process = ChildProcess.spawn(this.application, this.args, { cwd: this.cwd });
                this.process.stdout.on('data', this.onStdout.bind(this));
                this.process.stderr.on('data', this.onStderr.bind(this));
                this.process.on('exit', this.onExit.bind(this));
                this.process.on('error', this.onError.bind(this));
                if ((typeof this.port === 'number') && (this.port > 0)) {
                    // We monitor for port getting into Listening mode. This is a backup for initMatch
                    // TcpPortScanner.waitForPortOpenOSUtil(this.port, 250, GDBServer.SERVER_TIMEOUT - 1000, true, false)
                    tcpportscanner_1.TcpPortScanner.waitForPortOpen(this.port, GDBServer.LOCALHOST, true, 50, GDBServer.SERVER_TIMEOUT - 1000)
                        .then(() => {
                        if (this.initResolve) {
                            this.initResolve(true);
                            this.initReject = null;
                            this.initResolve = null;
                        }
                    }).catch((e) => {
                        // We could reject here if it is truly a timeout and not something else, caller already has a timeout
                        // ALso, waitForPortOpenOSUtil is not bullet proof if it fails, we don't know why because of differences
                        // in OSes, upgrades, etc. But, when it works, we know for sure it worked.
                    });
                }
                if (this.application.indexOf('st-util') !== -1 && os.platform() === 'win32') {
                    // For some reason we are not able to capture the st-util output on Windows
                    // For now assume that it will launch properly within 1/2 second and resolve the init
                    timers_1.setTimeout(() => {
                        if (this.initResolve) {
                            this.initResolve(true);
                            this.initReject = null;
                            this.initResolve = null;
                        }
                    }, 500);
                }
                if (this.initMatch == null) {
                    // If there is no init match string (e.g. QEMU) assume launch in 1/2 second and resolve
                    timers_1.setTimeout(() => {
                        if (this.initResolve) {
                            this.initResolve(true);
                            this.initReject = null;
                            this.initResolve = null;
                        }
                    }, 1000);
                }
            }
            else { // For servers like BMP that are always running directly on the probe
                resolve();
            }
        });
    }
    exit() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
    }
    onExit(code, signal) {
        this.emit('exit', code, signal);
    }
    onError(err) {
        if (this.initReject) {
            this.initReject(err);
            this.initReject = null;
            this.initResolve = null;
        }
        this.emit('launcherror', err);
    }
    onStdout(data) {
        if (typeof data === 'string') {
            this.outBuffer += data;
        }
        else {
            this.outBuffer += data.toString('utf8');
        }
        if (this.initResolve && this.initMatch.test(this.outBuffer)) {
            // console.log(`********* Got initmatch on stdout ${Date.now() - this.startTime}ms`);
            this.initResolve(true);
            this.initResolve = null;
            this.initReject = null;
        }
        const end = this.outBuffer.lastIndexOf('\n');
        if (end !== -1) {
            this.emit('output', this.outBuffer.substring(0, end));
            this.outBuffer = this.outBuffer.substring(end + 1);
        }
    }
    onStderr(data) {
        if (typeof data === 'string') {
            this.errBuffer += data;
        }
        else {
            this.errBuffer += data.toString('utf8');
        }
        if (this.initResolve && this.initMatch.test(this.errBuffer)) {
            // console.log(`********* Got initmatch on stderr ${Date.now() - this.startTime}ms`);
            this.initResolve(true);
            this.initResolve = null;
            this.initReject = null;
        }
        const end = this.errBuffer.lastIndexOf('\n');
        if (end !== -1) {
            this.emit('output', this.errBuffer.substring(0, end));
            this.errBuffer = this.errBuffer.substring(end + 1);
        }
    }
}
GDBServer.SERVER_TIMEOUT = 10000;
GDBServer.LOCALHOST = '0.0.0.0';
exports.GDBServer = GDBServer;


/***/ }),

/***/ "./src/backend/symbols.ts":
/*!********************************!*\
  !*** ./src/backend/symbols.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = __webpack_require__(/*! child_process */ "child_process");
const os = __webpack_require__(/*! os */ "os");
const path = __webpack_require__(/*! path */ "path");
const symbols_1 = __webpack_require__(/*! ../symbols */ "./src/symbols.ts");
const SYMBOL_REGEX = /^([0-9a-f]{8})\s([lg\ !])([w\ ])([C\ ])([W\ ])([I\ ])([dD\ ])([FfO\ ])\s([^\s]+)\s([0-9a-f]+)\s(.*)$/;
const TYPE_MAP = {
    'F': symbols_1.SymbolType.Function,
    'f': symbols_1.SymbolType.File,
    'O': symbols_1.SymbolType.Object,
    ' ': symbols_1.SymbolType.Normal
};
const SCOPE_MAP = {
    'l': symbols_1.SymbolScope.Local,
    'g': symbols_1.SymbolScope.Global,
    ' ': symbols_1.SymbolScope.Neither,
    '!': symbols_1.SymbolScope.Both
};
class SymbolTable {
    constructor(toolchainPath, toolchainPrefix, executable, demangle) {
        this.toolchainPath = toolchainPath;
        this.toolchainPrefix = toolchainPrefix;
        this.executable = executable;
        this.demangle = demangle;
        this.allSymbols = [];
        // The following are caches that are either created on demand or on symbol load. Helps performance
        // on large executables since most of our searches are linear. Or, to avoid a search entirely if possible
        // Case sensitivity for path names is an issue: We follow just what gcc records so inherently case-sensitive
        // or case-preserving. We don't try to re-interpret/massage those path-names. Maybe later
        //
        // TODO: Support for source-maps for both gdb and for symbol/file lookups
        this.staticsByFile = {};
        this.globalVars = [];
        this.globalFuncs = [];
        this.staticVars = [];
        this.staticFuncs = [];
        this.fileMap = {}; // basename of a file to a potential list of aliases we found
    }
    loadSymbols() {
        try {
            let objdumpExePath = os.platform() !== 'win32' ? `${this.toolchainPrefix}-objdump` : `${this.toolchainPrefix}-objdump.exe`;
            if (this.toolchainPath) {
                objdumpExePath = path.normalize(path.join(this.toolchainPath, objdumpExePath));
            }
            const options = ['--syms', '-Wi'];
            if (this.demangle) {
                options.push('-C');
            }
            const objdump = childProcess.spawnSync(objdumpExePath, [...options, this.executable]);
            const output = objdump.stdout.toString();
            const lines = output.split(/[\r\n]+/g);
            this.collectCompilationUnits(lines);
            let currentFile = null;
            let currentMapped = null;
            for (const line of lines) {
                const match = line.match(SYMBOL_REGEX);
                if (match) {
                    if (match[7] === 'd' && match[8] === 'f') {
                        if (match[11]) {
                            currentFile = match[11].trim();
                            currentMapped = this.addToFileMap(currentFile.split('/').pop(), currentFile);
                        }
                        else {
                            // This can happen with C++. Inline and template methods/variables/functions/etc. are listed with
                            // an empty file association. So, symbols after this line can come from multiple compilation
                            // units with no clear owner. These can be locals, globals or other.
                            currentFile = null;
                            currentMapped = null;
                        }
                    }
                    const type = TYPE_MAP[match[8]];
                    const scope = SCOPE_MAP[match[2]];
                    let name = match[11].trim();
                    let hidden = false;
                    if (name.startsWith('.hidden')) {
                        name = name.substring(7).trim();
                        hidden = true;
                    }
                    const sym = {
                        address: parseInt(match[1], 16),
                        type: type,
                        origScope: scope,
                        scope: scope,
                        section: match[9].trim(),
                        length: parseInt(match[10], 16),
                        name: name,
                        file: scope === symbols_1.SymbolScope.Local ? currentFile : null,
                        fileMaps: scope === symbols_1.SymbolScope.Local ? currentMapped : [],
                        instructions: null,
                        hidden: hidden
                    };
                    this.allSymbols.push(sym);
                    if (scope !== symbols_1.SymbolScope.Local) {
                        if (type === symbols_1.SymbolType.Function) {
                            sym.scope = symbols_1.SymbolScope.Global;
                            this.globalFuncs.push(sym);
                        }
                        else if (type === symbols_1.SymbolType.Object) {
                            if (scope === symbols_1.SymbolScope.Global) {
                                this.globalVars.push(sym);
                            }
                            else {
                                // These fail gdb create-vars. So ignoring them. C++ generates them
                                console.log('SymbolTable: ignoring non local object: ' + name);
                            }
                        }
                    }
                    else if (currentFile) {
                        // Yes, you can have statics with no file association in C++. They are neither
                        // truly global or local. Some can be considered but not sure how to filter
                        if (type === symbols_1.SymbolType.Object) {
                            this.staticVars.push(sym);
                        }
                        else if (type === symbols_1.SymbolType.Function) {
                            this.staticFuncs.push(sym);
                        }
                    }
                    else if (type === symbols_1.SymbolType.Function) {
                        sym.scope = symbols_1.SymbolScope.Global;
                        this.globalFuncs.push(sym);
                    }
                    else if (type === symbols_1.SymbolType.Object) {
                        // We are currently ignoring Local objects with no file association for objects.
                        // Revisit later with care and decide how to classify them
                        console.log('SymbolTable: ignoring local object: ' + name);
                    }
                }
            }
        }
        catch (e) { }
    }
    addToFileMap(key, newMap) {
        const value = this.fileMap[key] || [];
        if (value.indexOf(newMap) === -1) {
            value.push(newMap);
        }
        this.fileMap[key] = value;
        return value;
    }
    collectCompilationUnits(lines) {
        // Loop over and collect the set of compilation units. This is where true file names are stored
        // Most file names listed by objdump are just the base-name and I am not sure exactly how the base
        // file-name is supposed to map to an actual compilation unit. Esp. when duplicates exist. This only
        // matters for static variables/functions
        let isCompileUnit = false;
        let curName = '';
        let curDir = '';
        let curSimpleName = '';
        const cUnitRexp = /^ <0>.*Abbrev Number.*\(DW_TAG_compile_unit\)/;
        for (const line of lines) {
            if (cUnitRexp.test(line)) {
                isCompileUnit = true;
            }
            else if (isCompileUnit) {
                const match = line.match(/.*DW_AT_([^\s]*).*\)\:\s(.*)/);
                if (match) {
                    if (match[1] === 'name') {
                        curName = match[2];
                        curSimpleName = curName.split('/').pop();
                        this.addToFileMap(curSimpleName, curSimpleName);
                        this.addToFileMap(curSimpleName, curName);
                    }
                    else if (match[1] === 'comp_dir') {
                        curDir = match[2];
                        if (curName !== '') {
                            this.addToFileMap(curSimpleName, curDir + '/' + curName);
                        }
                    }
                }
                else if (line.startsWith(' <')) {
                    isCompileUnit = false;
                    curSimpleName = curName = curDir = '';
                }
            }
        }
    }
    getFunctionAtAddress(address) {
        return this.allSymbols.find((s) => s.type === symbols_1.SymbolType.Function && s.address <= address && (s.address + s.length) > address);
    }
    getFunctionSymbols() {
        return this.allSymbols.filter((s) => s.type === symbols_1.SymbolType.Function);
    }
    getGlobalVariables() {
        return this.globalVars;
    }
    getStaticVariables(file) {
        let ret = this.staticsByFile[file];
        if (!ret) {
            ret = [];
            for (const s of this.staticVars) {
                if (s.fileMaps.indexOf(file) !== -1) {
                    ret.push(s);
                }
            }
            this.staticsByFile[file] = ret;
        }
        return ret;
    }
    getFunctionByName(name, file) {
        if (file) { // Try to find static function first
            for (const s of this.staticFuncs) { // Try exact matches first (maybe not needed)
                if ((s.name === name) && (s.file === file)) {
                    return s;
                }
            }
            for (const s of this.staticFuncs) { // Try any match
                if ((s.name === name) && (s.fileMaps.indexOf(file) !== -1)) {
                    return s;
                }
            }
        }
        // Fall back to global scope
        return this.globalFuncs.find((s) => s.name === name);
    }
}
exports.SymbolTable = SymbolTable;


/***/ }),

/***/ "./src/bmp.ts":
/*!********************!*\
  !*** ./src/bmp.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const events_1 = __webpack_require__(/*! events */ "events");
class BMPServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'BMP';
        this.portsNeeded = [];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const commands = [
            `target-select extended-remote ${this.args.BMPGDBSerialPort}`
        ];
        if (this.args.powerOverBMP === 'enable') {
            commands.push('interpreter-exec console "monitor tpwr enable"');
            // sleep for 100 ms. MCU need some time to boot up after power up
            commands.push('interpreter-exec console "shell sleep 0.1"');
        }
        else if (this.args.powerOverBMP === 'disable') {
            commands.push('interpreter-exec console "monitor tpwr disable"');
        }
        else {
            // keep last power state (do nothing)
        }
        if (this.args.interface === 'jtag') {
            commands.push('interpreter-exec console "monitor jtag_scan"');
        }
        else {
            commands.push('interpreter-exec console "monitor swdp_scan"');
        }
        commands.push(`interpreter-exec console "attach ${this.args.targetId}"`, 'interpreter-exec console "set mem inaccessible-by-default off"');
        return commands;
    }
    launchCommands() {
        const commands = [
            'target-download',
            'interpreter-exec console "SoftwareReset"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "SoftwareReset"'
        ];
        return commands;
    }
    swoCommands() {
        const commands = [];
        if (this.args.swoConfig.enabled) {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency;
        const cpuFrequency = this.args.swoConfig.cpuFrequency;
        const ratio = Math.floor(cpuFrequency / swoFrequency) - 1;
        const commands = [];
        commands.push('EnableITMAccess', `BaseSWOSetup ${ratio}`, 'SetITMId 1', 'ITMDWTTransferEnable', 'DisableITMPorts 0xFFFFFFFF', `EnableITMPorts ${portMask}`, 'EnableDWTSync', 'ITMSyncEnable', 'ITMGlobalEnable');
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        return null;
    }
    serverArguments() {
        return [];
    }
    initMatch() {
        return null;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            this.emit('event', new common_1.SWOConfigureEvent({ type: 'serial', device: this.args.swoConfig.source, baudRate: this.args.swoConfig.swoFrequency }));
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.BMPServerController = BMPServerController;


/***/ }),

/***/ "./src/common.ts":
/*!***********************!*\
  !*** ./src/common.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_debugadapter_1 = __webpack_require__(/*! vscode-debugadapter */ "./node_modules/vscode-debugadapter/lib/main.js");
var NumberFormat;
(function (NumberFormat) {
    NumberFormat[NumberFormat["Auto"] = 0] = "Auto";
    NumberFormat[NumberFormat["Hexidecimal"] = 1] = "Hexidecimal";
    NumberFormat[NumberFormat["Decimal"] = 2] = "Decimal";
    NumberFormat[NumberFormat["Binary"] = 3] = "Binary";
})(NumberFormat = exports.NumberFormat || (exports.NumberFormat = {}));
class AdapterOutputEvent extends vscode_debugadapter_1.Event {
    constructor(content, type) {
        super('adapter-output', { content: content, type: type });
    }
}
exports.AdapterOutputEvent = AdapterOutputEvent;
class StoppedEvent extends vscode_debugadapter_1.Event {
    constructor(reason, threadId, allThreadsStopped) {
        super('stopped', {
            reason: reason,
            threadId: threadId,
            allThreadsStopped: allThreadsStopped
        });
    }
}
exports.StoppedEvent = StoppedEvent;
class SWOConfigureEvent extends vscode_debugadapter_1.Event {
    constructor(params) {
        const body = params;
        super('swo-configure', body);
    }
}
exports.SWOConfigureEvent = SWOConfigureEvent;
class TelemetryEvent extends vscode_debugadapter_1.Event {
    constructor(category, action, label, parameters = {}) {
        const body = { category: category, action: action, label: label, parameters: parameters };
        super('record-event', body);
    }
}
exports.TelemetryEvent = TelemetryEvent;
function calculatePortMask(decoders) {
    if (!decoders) {
        return 0;
    }
    let mask = 0;
    decoders.forEach((d) => {
        if (d.type === 'advanced') {
            for (const port of d.ports) {
                mask = (mask | (1 << port)) >>> 0;
            }
        }
        else {
            mask = (mask | (1 << d.port)) >>> 0;
        }
    });
    return mask;
}
exports.calculatePortMask = calculatePortMask;


/***/ }),

/***/ "./src/external.ts":
/*!*************************!*\
  !*** ./src/external.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! events */ "events");
class ExternalServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'External';
        this.portsNeeded = [];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const target = this.args.gdbTarget;
        return [
            `target-select extended-remote ${target}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"',
            'target-download',
            'interpreter-exec console "monitor reset halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    swoCommands() {
        return [];
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"'
        ];
        return commands;
    }
    serverExecutable() {
        return null;
    }
    serverArguments() {
        return [];
    }
    initMatch() {
        return null;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() { }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.ExternalServerController = ExternalServerController;


/***/ }),

/***/ "./src/frontend/utils.ts":
/*!*******************************!*\
  !*** ./src/frontend/utils.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function hexFormat(value, padding = 8, includePrefix = true) {
    let base = value.toString(16);
    while (base.length < padding) {
        base = '0' + base;
    }
    return includePrefix ? '0x' + base : base;
}
exports.hexFormat = hexFormat;
function binaryFormat(value, padding = 0, includePrefix = true, group = false) {
    let base = (value >>> 0).toString(2);
    while (base.length < padding) {
        base = '0' + base;
    }
    if (group) {
        const nibRem = 4 - (base.length % 4);
        for (let i = 0; i < nibRem; i++) {
            base = '0' + base;
        }
        const groups = base.match(/[01]{4}/g);
        base = groups.join(' ');
        base = base.substring(nibRem);
    }
    return includePrefix ? '0b' + base : base;
}
exports.binaryFormat = binaryFormat;
function createMask(offset, width) {
    let r = 0;
    const a = offset;
    const b = offset + width - 1;
    for (let i = a; i <= b; i++) {
        r = (r | (1 << i)) >>> 0;
    }
    return r;
}
exports.createMask = createMask;
function extractBits(value, offset, width) {
    const mask = createMask(offset, width);
    const bvalue = ((value & mask) >>> offset) >>> 0;
    return bvalue;
}
exports.extractBits = extractBits;
function parseInteger(value) {
    if ((/^0b([01]+)$/i).test(value)) {
        return parseInt(value.substring(2), 2);
    }
    else if ((/^0x([0-9a-f]+)$/i).test(value)) {
        return parseInt(value.substring(2), 16);
    }
    else if ((/^[0-9]+/i).test(value)) {
        return parseInt(value, 10);
    }
    else if ((/^#[0-1]+/i).test(value)) {
        return parseInt(value.substring(1), 2);
    }
    return undefined;
}
exports.parseInteger = parseInteger;
function parseDimIndex(spec, count) {
    if (spec.indexOf(',') !== -1) {
        const components = spec.split(',').map((c) => c.trim());
        if (components.length !== count) {
            throw new Error('dimIndex Element has invalid specification.');
        }
        return components;
    }
    if (/^([0-9]+)\-([0-9]+)$/i.test(spec)) {
        const parts = spec.split('-').map((p) => parseInteger(p));
        const start = parts[0];
        const end = parts[1];
        const numElements = end - start + 1;
        if (numElements < count) {
            throw new Error('dimIndex Element has invalid specification.');
        }
        const components = [];
        for (let i = 0; i < count; i++) {
            components.push(`${start + i}`);
        }
        return components;
    }
    if (/^[a-zA-Z]\-[a-zA-Z]$/.test(spec)) {
        const start = spec.charCodeAt(0);
        const end = spec.charCodeAt(2);
        const numElements = end - start + 1;
        if (numElements < count) {
            throw new Error('dimIndex Element has invalid specification.');
        }
        const components = [];
        for (let i = 0; i < count; i++) {
            components.push(String.fromCharCode(start + i));
        }
        return components;
    }
    return [];
}
exports.parseDimIndex = parseDimIndex;


/***/ }),

/***/ "./src/gdb.ts":
/*!********************!*\
  !*** ./src/gdb.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_debugadapter_1 = __webpack_require__(/*! vscode-debugadapter */ "./node_modules/vscode-debugadapter/lib/main.js");
const mi2_1 = __webpack_require__(/*! ./backend/mi2/mi2 */ "./src/backend/mi2/mi2.ts");
const utils_1 = __webpack_require__(/*! ./frontend/utils */ "./src/frontend/utils.ts");
const backend_1 = __webpack_require__(/*! ./backend/backend */ "./src/backend/backend.ts");
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const server_1 = __webpack_require__(/*! ./backend/server */ "./src/backend/server.ts");
const mi_parse_1 = __webpack_require__(/*! ./backend/mi_parse */ "./src/backend/mi_parse.ts");
const gdb_expansion_1 = __webpack_require__(/*! ./backend/gdb_expansion */ "./src/backend/gdb_expansion.ts");
const os = __webpack_require__(/*! os */ "os");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const hasbin = __webpack_require__(/*! hasbin */ "./node_modules/hasbin/lib/hasbin.js");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const timers_1 = __webpack_require__(/*! timers */ "timers");
const events_1 = __webpack_require__(/*! events */ "events");
const jlink_1 = __webpack_require__(/*! ./jlink */ "./src/jlink.ts");
const openocd_1 = __webpack_require__(/*! ./openocd */ "./src/openocd.ts");
const stutil_1 = __webpack_require__(/*! ./stutil */ "./src/stutil.ts");
const pyocd_1 = __webpack_require__(/*! ./pyocd */ "./src/pyocd.ts");
const bmp_1 = __webpack_require__(/*! ./bmp */ "./src/bmp.ts");
const pemicro_1 = __webpack_require__(/*! ./pemicro */ "./src/pemicro.ts");
const qemu_1 = __webpack_require__(/*! ./qemu */ "./src/qemu.ts");
const external_1 = __webpack_require__(/*! ./external */ "./src/external.ts");
const symbols_1 = __webpack_require__(/*! ./backend/symbols */ "./src/backend/symbols.ts");
const symbols_2 = __webpack_require__(/*! ./symbols */ "./src/symbols.ts");
const tcpportscanner_1 = __webpack_require__(/*! ./tcpportscanner */ "./src/tcpportscanner.ts");
const SERVER_TYPE_MAP = {
    jlink: jlink_1.JLinkServerController,
    openocd: openocd_1.OpenOCDServerController,
    stutil: stutil_1.STUtilServerController,
    pyocd: pyocd_1.PyOCDServerController,
    pe: pemicro_1.PEServerController,
    bmp: bmp_1.BMPServerController,
    qemu: qemu_1.QEMUServerController,
    external: external_1.ExternalServerController
};
class ExtendedVariable {
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
}
const GLOBAL_HANDLE_ID = 0xFE;
const STACK_HANDLES_START = 0x100;
const STACK_HANDLES_FINISH = 0xFFFF;
const STATIC_HANDLES_START = 0x010000;
const STATIC_HANDLES_FINISH = 0x01FFFF;
const VAR_HANDLES_START = 0x020000;
const COMMAND_MAP = (c) => c.startsWith('-') ? c.substring(1) : `interpreter-exec console "${c}"`;
class CustomStoppedEvent extends vscode_debugadapter_1.Event {
    constructor(reason, threadID) {
        super('custom-stop', { reason: reason, threadID: threadID });
    }
}
class CustomContinuedEvent extends vscode_debugadapter_1.Event {
    constructor(threadID, allThreads = true) {
        super('custom-continued', { threadID: threadID, allThreads: allThreads });
    }
}
const traceThreads = false;
class GDBDebugSession extends vscode_debugadapter_1.DebugSession {
    constructor(debuggerLinesStartAt1, isServer = false, threadID = 1) {
        super(debuggerLinesStartAt1, isServer);
        this.variableHandles = new vscode_debugadapter_1.Handles(VAR_HANDLES_START);
        this.variableHandlesReverse = {};
        this.forceDisassembly = false;
        this.activeEditorPath = null;
        // currentThreadId is the currently selected thread or where execution has stopped. It not very
        // meaningful since the current thread id in gdb can change in many ways (when you use a --thread
        // option on certain commands) 
        this.currentThreadId = 0;
        this.activeThreadIds = new Set(); // Used for consistency check
        /**
         * If we are requested a major switch like restart/disconnect/detach we may have to interrupt the
         * the target to make it happen. That interrupt can cause a chain reaction of events, responses
         * and requests -- considerable gdb chatter -- that affects what we are trying to do. We still rely
         * on our event 'generic-stopped' but not send events to clients like VSCode or our own frontend.
         * We should always keep our own state valid though
         */
        this.disableSendStoppedEvents = false;
        this.stopped = false;
        this.stoppedReason = '';
        // stoppedThreadId represents where execution stopped because of a pause, exception, step or breakpoint
        // Generally continuing execution can only work from that thread for embedded processors. It is bit
        // different from 'currentThreadId'. This is also the last thread-id used to notify VSCode about
        // the current thread so the call-stack will initially point to this thread. Maybe currentThreadId
        // can be made stricter and we can remove this variable
        this.stoppedThreadId = 0;
        this.stoppedEventPending = false;
        this.breakpointMap = new Map();
        this.fileExistsCache = new Map();
        this.onConfigDone = new events_1.EventEmitter();
        /*
        // floatingVariableMap is meant for things that are not relevant to the current thread/frame.
        // It is organized by ths scope reference and then a map is held for each simple name.
        // Technically, we can put even non global/static variable here, but cleanup can be an issue.
        //
        // See also scopesRequest().
        //
        // Note that this becomes important in implementing set-variable where not much info is available
        */
        this.floatingVariableMap = {};
    }
    initDebugger() {
        this.miDebugger.on('launcherror', this.launchError.bind(this));
        this.miDebugger.on('quit', this.quitEvent.bind(this));
        this.miDebugger.on('exited-normally', this.quitEvent.bind(this));
        this.miDebugger.on('stopped', this.stopEvent.bind(this));
        this.miDebugger.on('msg', this.handleMsg.bind(this));
        this.miDebugger.on('breakpoint', this.handleBreakpoint.bind(this));
        this.miDebugger.on('step-end', this.handleBreak.bind(this));
        this.miDebugger.on('step-out-end', this.handleBreak.bind(this));
        this.miDebugger.on('signal-stop', this.handlePause.bind(this));
        this.miDebugger.on('running', this.handleRunning.bind(this));
        this.miDebugger.on('thread-created', this.handleThreadCreated.bind(this));
        this.miDebugger.on('thread-exited', this.handleThreadExited.bind(this));
        this.miDebugger.on('thread-selected', this.handleThreadSelected.bind(this));
        this.miDebugger.on('thread-group-exited', this.handleThreadGroupExited.bind(this));
        this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
    }
    initializeRequest(response, args) {
        response.body.supportsHitConditionalBreakpoints = true;
        response.body.supportsConfigurationDoneRequest = true;
        response.body.supportsConditionalBreakpoints = true;
        response.body.supportsFunctionBreakpoints = true;
        response.body.supportsEvaluateForHovers = true;
        response.body.supportsSetVariable = true;
        response.body.supportsRestartRequest = true;
        this.sendResponse(response);
    }
    launchRequest(response, args) {
        this.args = this.normalizeArguments(args);
        this.symbolTable = new symbols_1.SymbolTable(args.toolchainPath, args.toolchainPrefix, args.executable, args.demangle);
        this.symbolTable.loadSymbols();
        this.breakpointMap = new Map();
        this.fileExistsCache = new Map();
        this.processLaunchAttachRequest(response, false);
    }
    attachRequest(response, args) {
        this.args = this.normalizeArguments(args);
        this.symbolTable = new symbols_1.SymbolTable(args.toolchainPath, args.toolchainPrefix, args.executable, args.demangle);
        this.symbolTable.loadSymbols();
        this.breakpointMap = new Map();
        this.fileExistsCache = new Map();
        this.processLaunchAttachRequest(response, true);
    }
    normalizeArguments(args) {
        args.graphConfig = args.graphConfig || [];
        if (args.executable && !path.isAbsolute(args.executable)) {
            args.executable = path.normalize(path.join(args.cwd, args.executable));
        }
        if (args.svdFile && !path.isAbsolute(args.svdFile)) {
            args.svdFile = path.normalize(path.join(args.cwd, args.svdFile));
        }
        if (args.swoConfig && args.swoConfig.decoders) {
            args.swoConfig.decoders = args.swoConfig.decoders.map((dec) => {
                if (dec.type === 'advanced' && dec.decoder && !path.isAbsolute(dec.decoder)) {
                    dec.decoder = path.normalize(path.join(args.cwd, dec.decoder));
                }
                return dec;
            });
        }
        return args;
    }
    processLaunchAttachRequest(response, attach) {
        if (!fs.existsSync(this.args.executable)) {
            this.sendErrorResponse(response, 103, `Unable to find executable file at ${this.args.executable}.`);
            return;
        }
        const ControllerClass = SERVER_TYPE_MAP[this.args.servertype];
        this.serverController = new ControllerClass();
        this.serverController.setArguments(this.args);
        this.serverController.on('event', this.serverControllerEvent.bind(this));
        this.quit = false;
        this.attached = false;
        this.started = false;
        this.crashed = false;
        this.debugReady = false;
        this.stopped = false;
        this.activeThreadIds.clear();
        const portFinderOpts = { min: 50000, max: 52000, retrieve: this.serverController.portsNeeded.length };
        tcpportscanner_1.TcpPortScanner.findFreePorts(portFinderOpts, server_1.GDBServer.LOCALHOST).then((ports) => {
            this.ports = {};
            this.serverController.portsNeeded.forEach((val, idx) => {
                this.ports[val] = ports[idx];
            });
            this.serverController.setPorts(this.ports);
            const executable = this.serverController.serverExecutable();
            const args = this.serverController.serverArguments();
            let gdbExePath = os.platform() !== 'win32' ? `${this.args.toolchainPrefix}-gdb` : `${this.args.toolchainPrefix}-gdb.exe`;
            if (this.args.toolchainPath) {
                gdbExePath = path.normalize(path.join(this.args.toolchainPath, gdbExePath));
            }
            if (this.args.gdbpath) {
                gdbExePath = this.args.gdbpath;
            }
            // Check to see if gdb exists.
            if (path.isAbsolute(gdbExePath)) {
                if (fs.existsSync(gdbExePath) === false) {
                    this.sendErrorResponse(response, 103, `${this.serverController.name} GDB executable "${gdbExePath}" was not found.\n` +
                        'Please configure "cortex-debug.armToolchainPath" correctly.');
                    return;
                }
            }
            else {
                if (!hasbin.sync(gdbExePath.replace('.exe', ''))) {
                    this.sendErrorResponse(response, 103, `${this.serverController.name} GDB executable "${gdbExePath}" was not found.\n` +
                        'Please configure "cortex-debug.armToolchainPath" correctly.');
                    return;
                }
            }
            if (executable) {
                this.handleMsg('log', `Please check OUTPUT tab (Adapter Output) for output from ${executable}` + '\n');
                const dbgMsg = `Launching server: "${executable}" ` + args.map((s) => {
                    return '"' + s.replace(/"/g, '\\"') + '"';
                }).join(' ') + '\n';
                this.handleMsg('log', dbgMsg);
            }
            let initMatch = this.serverController.initMatch();
            if (this.args.overrideGDBServerStartedRegex) {
                initMatch = new RegExp(this.args.overrideGDBServerStartedRegex, 'i');
            }
            this.server = new server_1.GDBServer(this.args.cwd, executable, args, initMatch, this.ports['gdbPort']);
            this.server.on('output', this.handleAdapterOutput.bind(this));
            this.server.on('quit', () => {
                if (this.started) {
                    this.quitEvent();
                }
                else {
                    this.sendErrorResponse(response, 103, `${this.serverController.name} GDB Server Quit Unexpectedly. See Adapter Output for more details.`);
                }
            });
            this.server.on('launcherror', (err) => {
                this.sendErrorResponse(response, 103, `Failed to launch ${this.serverController.name} GDB Server: ${err.toString()}`);
            });
            let timeout = timers_1.setTimeout(() => {
                this.server.exit();
                this.sendEvent(new common_1.TelemetryEvent('Error', 'Launching Server', `Failed to launch ${this.serverController.name} GDB Server: Timeout.`));
                this.sendErrorResponse(response, 103, `Failed to launch ${this.serverController.name} GDB Server: Timeout.`);
            }, server_1.GDBServer.SERVER_TIMEOUT);
            this.serverController.serverLaunchStarted();
            this.server.init().then((started) => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                this.serverController.serverLaunchCompleted();
                let gdbargs = ['-q', '--interpreter=mi2'];
                gdbargs = gdbargs.concat(this.args.debuggerArgs || []);
                this.miDebugger = new mi2_1.MI2(gdbExePath, gdbargs);
                this.initDebugger();
                this.miDebugger.printCalls = !!this.args.showDevDebugOutput;
                this.miDebugger.debugOutput = !!this.args.showDevDebugOutput;
                const commands = [`interpreter-exec console "source ${this.args.extensionPath}/support/gdbsupport.init"`];
                if (this.args.demangle) {
                    commands.push('interpreter-exec console "set print demangle on"');
                    commands.push('interpreter-exec console "set print asm-demangle on"');
                }
                commands.push(...this.serverController.initCommands());
                if (attach) {
                    commands.push(...this.args.preAttachCommands.map(COMMAND_MAP));
                    const attachCommands = this.args.overrideAttachCommands != null ?
                        this.args.overrideAttachCommands.map(COMMAND_MAP) : this.serverController.attachCommands();
                    commands.push(...attachCommands);
                    commands.push(...this.args.postAttachCommands.map(COMMAND_MAP));
                    commands.push(...this.serverController.swoCommands());
                }
                else {
                    commands.push(...this.args.preLaunchCommands.map(COMMAND_MAP));
                    const launchCommands = this.args.overrideLaunchCommands != null ?
                        this.args.overrideLaunchCommands.map(COMMAND_MAP) : this.serverController.launchCommands();
                    commands.push(...launchCommands);
                    commands.push(...this.args.postLaunchCommands.map(COMMAND_MAP));
                    commands.push(...this.serverController.swoCommands());
                }
                this.serverController.debuggerLaunchStarted();
                this.miDebugger.once('debug-ready', () => {
                    this.debugReady = true;
                    this.attached = attach;
                });
                if (true) {
                    const dbgMsg = `Launching GDB: "${gdbExePath}" ` + gdbargs.map((s) => {
                        return '"' + s.replace(/"/g, '\\"') + '"';
                    }).join(' ') + '\n';
                    this.handleMsg('log', dbgMsg);
                }
                this.miDebugger.connect(this.args.cwd, this.args.executable, commands).then(() => {
                    this.started = true;
                    this.serverController.debuggerLaunchCompleted();
                    this.sendResponse(response);
                    const launchComplete = () => {
                        timers_1.setTimeout(() => {
                            this.stopped = true;
                            this.stoppedReason = 'start';
                            this.stoppedThreadId = this.currentThreadId;
                            this.sendEvent(new common_1.StoppedEvent('start', this.currentThreadId, true));
                            this.sendEvent(new CustomStoppedEvent('start', this.currentThreadId));
                        }, 50);
                    };
                    if (this.args.runToMain) {
                        this.miDebugger.sendCommand('break-insert -t --function main').then(() => {
                            this.miDebugger.once('generic-stopped', launchComplete);
                            // To avoid race conditions between finishing configuration, we should stay
                            // in stopped mode. Or, we end up clobbering the stopped event that might come
                            // during setting of any additional breakpoints.
                            this.onConfigDone.once('done', () => {
                                this.miDebugger.sendCommand('exec-continue');
                            });
                        });
                    }
                    else {
                        launchComplete();
                        this.onConfigDone.once('done', () => {
                            this.runPostStartSessionCommands(false);
                        });
                    }
                }, (err) => {
                    this.sendErrorResponse(response, 103, `Failed to launch GDB: ${err.toString()}`);
                    this.sendEvent(new common_1.TelemetryEvent('Error', 'Launching GDB', err.toString()));
                });
            }, (error) => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                this.sendEvent(new common_1.TelemetryEvent('Error', 'Launching Server', `Failed to launch ${this.serverController.name} GDB Server: ${error.toString()}`));
                this.sendErrorResponse(response, 103, `Failed to launch ${this.serverController.name} GDB Server: ${error.toString()}`);
            });
        }, (err) => {
            this.sendEvent(new common_1.TelemetryEvent('Error', 'Launching Server', `Failed to find open ports: ${err.toString()}`));
            this.sendErrorResponse(response, 103, `Failed to find open ports: ${err.toString()}`);
        });
    }
    // Runs a set of commands after a quiet time and is no other gdb transactions are happening
    runPostStartSessionCommands(isRestart, interval = 10) {
        let commands = isRestart ? this.args.postRestartSessionCommands : this.args.postStartSessionCommands;
        if (commands && (commands.length > 0)) {
            let curToken = this.miDebugger.getCurrentToken();
            commands = commands.map(COMMAND_MAP);
            // We want to let things quiet down before we run the next set of commands. Note that while
            // we are running this command sequence, some results can cause other gdb commands to be generated if
            // running state changes. Can't help it for now
            const to = setInterval(() => {
                const nxtToken = this.miDebugger.getCurrentToken();
                if (curToken === nxtToken) {
                    clearInterval(to);
                    this.miDebugger.postStart(commands);
                }
                else {
                    curToken = nxtToken;
                }
            }, interval);
        }
    }
    customRequest(command, response, args) {
        if (this.serverController.customRequest(command, response, args)) {
            this.sendResponse(response);
            return;
        }
        switch (command) {
            case 'set-force-disassembly':
                response.body = { success: true };
                this.forceDisassembly = args.force;
                if (this.stopped) {
                    this.activeEditorPath = null;
                    this.sendEvent(new vscode_debugadapter_1.ContinuedEvent(this.currentThreadId, true));
                    this.sendEvent(new common_1.StoppedEvent(this.stoppedReason, this.currentThreadId, true));
                }
                this.sendResponse(response);
                break;
            case 'load-function-symbols':
                response.body = { functionSymbols: this.symbolTable.getFunctionSymbols() };
                this.sendResponse(response);
                break;
            case 'set-active-editor':
                if (args.path !== this.activeEditorPath) {
                    this.activeEditorPath = args.path;
                    // if (this.stopped) {
                    //     this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId, true));
                    // }
                }
                response.body = {};
                this.sendResponse(response);
                break;
            case 'get-arguments':
                response.body = this.args;
                this.sendResponse(response);
                break;
            case 'read-memory':
                this.readMemoryRequestCustom(response, args['address'], args['length']);
                break;
            case 'write-memory':
                this.writeMemoryRequest(response, args['address'], args['data']);
                break;
            case 'read-registers':
                this.readRegistersRequest(response);
                break;
            case 'read-register-list':
                this.readRegisterListRequest(response);
                break;
            case 'disassemble':
                this.disassembleRequest(response, args);
                break;
            case 'execute-command':
                let cmd = args['command'];
                if (cmd.startsWith('-')) {
                    cmd = cmd.substring(1);
                }
                else {
                    cmd = `interpreter-exec console "${cmd}"`;
                }
                this.miDebugger.sendCommand(cmd).then((node) => {
                    response.body = node.resultRecords;
                    this.sendResponse(response);
                }, (error) => {
                    response.body = error;
                    this.sendErrorResponse(response, 110, 'Unable to execute command');
                });
                break;
            default:
                response.body = { error: 'Invalid command.' };
                this.sendResponse(response);
                break;
        }
    }
    disassembleRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.function) {
                try {
                    const funcInfo = yield this.getDisassemblyForFunction(args.function, args.file);
                    response.body = {
                        instructions: funcInfo.instructions,
                        name: funcInfo.name,
                        file: funcInfo.file,
                        address: funcInfo.address,
                        length: funcInfo.length
                    };
                    this.sendResponse(response);
                }
                catch (e) {
                    this.sendErrorResponse(response, 1, `Unable to disassemble: ${e.toString()}`);
                }
                return;
            }
            else if (args.startAddress) {
                try {
                    let funcInfo = this.symbolTable.getFunctionAtAddress(args.startAddress);
                    if (funcInfo) {
                        funcInfo = yield this.getDisassemblyForFunction(funcInfo.name, funcInfo.file);
                        response.body = {
                            instructions: funcInfo.instructions,
                            name: funcInfo.name,
                            file: funcInfo.file,
                            address: funcInfo.address,
                            length: funcInfo.length
                        };
                        this.sendResponse(response);
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        const instructions = yield this.getDisassemblyForAddresses(args.startAddress, args.length || 256);
                        response.body = { instructions: instructions };
                        this.sendResponse(response);
                    }
                }
                catch (e) {
                    this.sendErrorResponse(response, 1, `Unable to disassemble: ${e.toString()}`);
                }
                return;
            }
            else {
                this.sendErrorResponse(response, 1, 'Unable to disassemble; invalid parameters.');
            }
        });
    }
    getDisassemblyForFunction(functionName, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const symbol = this.symbolTable.getFunctionByName(functionName, file);
            if (!symbol) {
                throw new Error(`Unable to find function with name ${functionName}.`);
            }
            if (symbol.instructions) {
                return symbol;
            }
            const startAddress = symbol.address;
            const endAddress = symbol.address + symbol.length;
            // tslint:disable-next-line:max-line-length
            const result = yield this.miDebugger.sendCommand(`data-disassemble -s ${utils_1.hexFormat(startAddress, 8)} -e ${utils_1.hexFormat(endAddress, 8)} -- 2`);
            const rawInstructions = result.result('asm_insns');
            const instructions = rawInstructions.map((ri) => {
                const address = mi_parse_1.MINode.valueOf(ri, 'address');
                const functionName = mi_parse_1.MINode.valueOf(ri, 'func-name');
                const offset = parseInt(mi_parse_1.MINode.valueOf(ri, 'offset'));
                const inst = mi_parse_1.MINode.valueOf(ri, 'inst');
                const opcodes = mi_parse_1.MINode.valueOf(ri, 'opcodes');
                return {
                    address: address,
                    functionName: functionName,
                    offset: offset,
                    instruction: inst,
                    opcodes: opcodes
                };
            });
            symbol.instructions = instructions;
            return symbol;
        });
    }
    getDisassemblyForAddresses(startAddress, length) {
        return __awaiter(this, void 0, void 0, function* () {
            const endAddress = startAddress + length;
            // tslint:disable-next-line:max-line-length
            const result = yield this.miDebugger.sendCommand(`data-disassemble -s ${utils_1.hexFormat(startAddress, 8)} -e ${utils_1.hexFormat(endAddress, 8)} -- 2`);
            const rawInstructions = result.result('asm_insns');
            const instructions = rawInstructions.map((ri) => {
                const address = mi_parse_1.MINode.valueOf(ri, 'address');
                const functionName = mi_parse_1.MINode.valueOf(ri, 'func-name');
                const offset = parseInt(mi_parse_1.MINode.valueOf(ri, 'offset'));
                const inst = mi_parse_1.MINode.valueOf(ri, 'inst');
                const opcodes = mi_parse_1.MINode.valueOf(ri, 'opcodes');
                return {
                    address: address,
                    functionName: functionName,
                    offset: offset,
                    instruction: inst,
                    opcodes: opcodes
                };
            });
            return instructions;
        });
    }
    readMemoryRequestCustom(response, startAddress, length) {
        this.miDebugger.sendCommand(`data-read-memory-bytes "${startAddress}" ${length}`).then((node) => {
            const startAddress = node.resultRecords.results[0][1][0][0][1];
            const endAddress = node.resultRecords.results[0][1][0][2][1];
            const data = node.resultRecords.results[0][1][0][3][1];
            const bytes = data.match(/[0-9a-f]{2}/g).map((b) => parseInt(b, 16));
            response.body = {
                startAddress: startAddress,
                endAddress: endAddress,
                bytes: bytes
            };
            this.sendResponse(response);
        }, (error) => {
            response.body = { error: error };
            this.sendErrorResponse(response, 114, `Unable to read memory: ${error.toString()}`);
            this.sendEvent(new common_1.TelemetryEvent('Error', 'Reading Memory', `${startAddress}-${length.toString(16)}`));
        });
    }
    writeMemoryRequest(response, startAddress, data) {
        const address = utils_1.hexFormat(startAddress, 8);
        this.miDebugger.sendCommand(`data-write-memory-bytes ${address} ${data}`).then((node) => {
            this.sendResponse(response);
        }, (error) => {
            response.body = { error: error };
            this.sendErrorResponse(response, 114, `Unable to write memory: ${error.toString()}`);
            this.sendEvent(new common_1.TelemetryEvent('Error', 'Writing Memory', `${startAddress.toString(16)}-${data.length.toString(16)}`));
        });
    }
    readRegistersRequest(response) {
        const fmt = this.args.registerUseNaturalFormat ? 'N' : 'x';
        this.miDebugger.sendCommand(`data-list-register-values ${fmt}`).then((node) => {
            if (node.resultRecords.resultClass === 'done') {
                const rv = node.resultRecords.results[0][1];
                response.body = rv.map((n) => {
                    const val = {};
                    n.forEach((x) => {
                        val[x[0]] = x[1];
                    });
                    return val;
                });
            }
            else {
                response.body = {
                    error: 'Unable to parse response'
                };
            }
            this.sendResponse(response);
        }, (error) => {
            response.body = { error: error };
            this.sendErrorResponse(response, 115, `Unable to read registers: ${error.toString()}`);
            this.sendEvent(new common_1.TelemetryEvent('Error', 'Reading Registers', ''));
        });
    }
    readRegisterListRequest(response) {
        this.miDebugger.sendCommand('data-list-register-names').then((node) => {
            if (node.resultRecords.resultClass === 'done') {
                let registerNames;
                node.resultRecords.results.forEach((rr) => {
                    if (rr[0] === 'register-names') {
                        registerNames = rr[1];
                    }
                });
                response.body = registerNames;
            }
            else {
                response.body = { error: node.resultRecords.results };
            }
            this.sendResponse(response);
        }, (error) => {
            response.body = { error: error };
            this.sendErrorResponse(response, 116, `Unable to read register list: ${error.toString()}`);
            this.sendEvent(new common_1.TelemetryEvent('Error', 'Reading Register List', ''));
        });
    }
    disconnectRequest(response, args) {
        const doDisconnectProcessing = () => {
            if (this.attached) {
                this.attached = false;
                this.miDebugger.detach();
            }
            else {
                this.miDebugger.stop();
            }
            if (this.commandServer) {
                this.commandServer.close();
                this.commandServer = undefined;
            }
            timers_1.setTimeout(() => {
                try {
                    this.disableSendStoppedEvents = false;
                    this.server.exit();
                }
                catch (e) { }
                finally {
                    this.sendResponse(response);
                }
            }, 50);
        };
        this.disableSendStoppedEvents = true;
        if (this.miDebugger) {
            if (this.attached && !this.stopped) {
                this.miDebugger.once('generic-stopped', doDisconnectProcessing);
                this.miDebugger.sendCommand('exec-interrupt');
            }
            else {
                doDisconnectProcessing();
            }
        }
    }
    //
    // I don't think we are following the protocol here. but the protocol doesn't make sense. I got a
    // clarification that for an attach session, restart means detach and re-attach. How does this make
    // any sense? Isn't that like a null operation?
    //
    // https://github.com/microsoft/debug-adapter-protocol/issues/73
    //
    restartRequest(response, args) {
        const restartProcessing = () => __awaiter(this, void 0, void 0, function* () {
            this.disableSendStoppedEvents = false;
            const commands = [];
            commands.push(...this.args.preRestartCommands.map(COMMAND_MAP));
            const restartCommands = this.args.overrideRestartCommands != null ?
                this.args.overrideRestartCommands.map(COMMAND_MAP) : this.serverController.restartCommands();
            commands.push(...restartCommands);
            commands.push(...this.args.postRestartCommands.map(COMMAND_MAP));
            commands.push(...this.serverController.swoCommands());
            this.miDebugger.restart(commands).then((done) => {
                this.sendResponse(response);
                timers_1.setTimeout(() => {
                    this.stopped = true; // This should aleady be true??
                    this.stoppedReason = 'restart';
                    this.sendEvent(new vscode_debugadapter_1.ContinuedEvent(this.currentThreadId, true));
                    this.sendEvent(new common_1.StoppedEvent('restart', this.currentThreadId, true));
                    this.sendEvent(new CustomStoppedEvent('restart', this.currentThreadId));
                    this.runPostStartSessionCommands(true, 50);
                }, 50);
            }, (msg) => {
                this.sendErrorResponse(response, 6, `Could not restart: ${msg}`);
            });
        });
        this.disableSendStoppedEvents = true;
        if (this.stopped) {
            restartProcessing();
        }
        else {
            this.miDebugger.once('generic-stopped', restartProcessing);
            this.miDebugger.sendCommand('exec-interrupt');
        }
    }
    handleAdapterOutput(output) {
        this.sendEvent(new common_1.AdapterOutputEvent(output, 'out'));
    }
    serverControllerEvent(event) {
        this.sendEvent(event);
    }
    handleMsg(type, msg) {
        if (type === 'target') {
            type = 'stdout';
        }
        if (type === 'log') {
            type = 'stderr';
        }
        this.sendEvent(new vscode_debugadapter_1.OutputEvent(msg, type));
    }
    handleRunning(info) {
        this.stopped = false;
        this.sendEvent(new vscode_debugadapter_1.ContinuedEvent(this.currentThreadId, true));
        this.sendEvent(new CustomContinuedEvent(this.currentThreadId, true));
    }
    findPausedThread(info) {
        if (info.outOfBandRecord && info.outOfBandRecord[0] && info.outOfBandRecord[0].output) {
            for (const item of info.outOfBandRecord[0].output) {
                if (item[0] === 'thread-id') {
                    this.currentThreadId = parseInt(item[1]);
                    this.stoppedThreadId = this.currentThreadId;
                    if (traceThreads) {
                        this.handleMsg('stdout', `**** Paused Thread: ${this.stoppedThreadId}\n`);
                    }
                    return;
                }
            }
        }
        if (traceThreads) {
            this.handleMsg('stdout', `**** Paused Thread: not found. Using ID ${this.stoppedThreadId}. Not good\n`);
        }
    }
    handleBreakpoint(info) {
        this.stopped = true;
        this.stoppedReason = 'breakpoint';
        this.findPausedThread(info);
        if (!this.disableSendStoppedEvents) {
            this.sendEvent(new common_1.StoppedEvent('breakpoint', this.currentThreadId, true));
            this.sendEvent(new CustomStoppedEvent('breakpoint', this.currentThreadId));
        }
        else {
            this.stoppedEventPending = true;
        }
    }
    handleBreak(info) {
        this.stopped = true;
        this.stoppedReason = 'step';
        this.findPausedThread(info);
        if (!this.disableSendStoppedEvents) {
            this.sendEvent(new common_1.StoppedEvent('step', this.currentThreadId, true));
            this.sendEvent(new CustomStoppedEvent('step', this.currentThreadId));
        }
        else {
            this.stoppedEventPending = true;
        }
    }
    sendEvent(event) {
        super.sendEvent(event);
        if (traceThreads && (event instanceof common_1.StoppedEvent || event instanceof vscode_debugadapter_1.ContinuedEvent)) {
            this.handleMsg('log', '**** Event: ' + JSON.stringify(event) + '\n');
        }
    }
    handlePause(info) {
        this.stopped = true;
        this.stoppedReason = 'user request';
        this.findPausedThread(info);
        if (!this.disableSendStoppedEvents) {
            this.sendEvent(new common_1.StoppedEvent('user request', this.currentThreadId, true));
            this.sendEvent(new CustomStoppedEvent('user request', this.currentThreadId));
        }
        else {
            this.stoppedEventPending = true;
        }
    }
    handleThreadCreated(info) {
        if (!this.activeThreadIds.has(info.threadId)) {
            if (traceThreads) {
                this.handleMsg('log', `**** Thread created ${info.threadId}\n`);
            }
            this.activeThreadIds.add(info.threadId);
            this.sendEvent(new vscode_debugadapter_1.ThreadEvent('started', info.threadId));
        }
        else {
            this.handleMsg('log', `Thread Error: GDB trying to create thread '${info.threadId}' that already exists`);
        }
    }
    handleThreadExited(info) {
        if (traceThreads) {
            this.handleMsg('log', `**** Thread exited ${info.threadId}\n`);
        }
        if (this.activeThreadIds.has(info.threadId)) {
            this.activeThreadIds.delete(info.threadId);
        }
        else {
            this.handleMsg('log', `Thread Error: GDB trying to delete thread '${info.threadId}' that does not exist.\n`);
        }
        if (this.currentThreadId === info.threadId) {
            this.currentThreadId = 0;
        }
        if (this.stoppedThreadId === info.threadId) {
            this.stoppedThreadId = 0;
        }
        this.sendEvent(new vscode_debugadapter_1.ThreadEvent('exited', info.threadId));
    }
    handleThreadSelected(info) {
        if (traceThreads) {
            this.handleMsg('log', `**** Thread selected ${info.threadId}\n`);
        }
        if (!this.activeThreadIds.has(info.threadId)) {
            // We are seeing this happen. Not sure why and and can this event be relied upon?
            this.handleMsg('log', `Thread Error: GDB trying to select thread '${info.threadId}' that does not exist. No harm done\n`);
        }
        else {
            this.currentThreadId = info.threadId;
        }
    }
    handleThreadGroupExited(info) {
        if (traceThreads) {
            this.handleMsg('log', `**** Thread group exited ${info.threadGroupId}\n`);
        }
        // When a thread group exits for whaever reason (especially for a re-start) cleanup
        // and notify VSCode or it will be in a bad state. This can be distinct from a quitEvent
        // A crash, hd/tcp disconnect in the gdb-server can also cause this event.
        this.currentThreadId = 0;
        for (const thId of this.activeThreadIds.values()) {
            this.sendEvent(new vscode_debugadapter_1.ThreadEvent('exited', thId));
        }
        this.activeThreadIds.clear();
    }
    stopEvent(info) {
        if (!this.started) {
            this.crashed = true;
        }
        if (!this.quit) {
            this.stopped = true;
            this.stoppedReason = 'exception';
            this.findPausedThread(info);
            this.sendEvent(new common_1.StoppedEvent('exception', this.currentThreadId, true));
            this.sendEvent(new CustomStoppedEvent('exception', this.currentThreadId));
        }
    }
    quitEvent() {
        if (traceThreads) {
            this.handleMsg('log', '**** quit event\n');
        }
        this.quit = true;
        this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
    }
    launchError(err) {
        this.handleMsg('stderr', 'Could not start debugger process, does the program exist in filesystem?\n');
        this.handleMsg('stderr', err.toString() + '\n');
        this.quitEvent();
    }
    // returns [threadId, frameId]
    static decodeReference(varRef) {
        return [(varRef & 0xFF00) >>> 8, varRef & 0xFF];
    }
    static encodeReference(threadId, frameId) {
        return ((threadId << 8) | (frameId & 0xFF)) & 0xFFFF;
    }
    setVariableRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let name = args.name;
                let threadId = -1;
                let frameId = -1;
                const varRef = args.variablesReference;
                const globOrStatic = this.getFloatingVariable(varRef, name);
                if (globOrStatic) {
                    name = globOrStatic.name;
                }
                else if (varRef >= VAR_HANDLES_START) {
                    const parent = this.variableHandles.get(args.variablesReference);
                    const fullName = parent.children[name];
                    name = fullName ? fullName : `${parent.name}.${name}`;
                }
                else if (varRef >= STACK_HANDLES_START && varRef < STACK_HANDLES_FINISH) {
                    const tryName = this.createStackVarName(name, varRef);
                    if (this.variableHandlesReverse.hasOwnProperty(tryName)) {
                        name = tryName;
                    }
                    [threadId, frameId] = GDBDebugSession.decodeReference(varRef);
                }
                const res = yield this.miDebugger.varAssign(name, args.value, threadId, frameId);
                response.body = {
                    value: res.result('value')
                };
                this.sendResponse(response);
            }
            catch (err) {
                this.sendErrorResponse(response, 11, `Could not set variable: ${err}`);
            }
        });
    }
    setFunctionBreakPointsRequest(response, args) {
        const createBreakpoints = (shouldContinue) => __awaiter(this, void 0, void 0, function* () {
            const all = [];
            args.breakpoints.forEach((brk) => {
                all.push(this.miDebugger.addBreakPoint({ raw: brk.name, condition: brk.condition, countCondition: brk.hitCondition }));
            });
            try {
                const breakpoints = yield Promise.all(all);
                const finalBrks = [];
                breakpoints.forEach((brkp) => {
                    if (brkp[0]) {
                        finalBrks.push({ line: brkp[1].line });
                    }
                });
                response.body = {
                    breakpoints: finalBrks
                };
                this.sendResponse(response);
            }
            catch (msg) {
                this.sendErrorResponse(response, 10, msg.toString());
            }
            if (shouldContinue) {
                yield this.miDebugger.sendCommand('exec-continue');
            }
        });
        const process = () => __awaiter(this, void 0, void 0, function* () {
            if (this.stopped) {
                yield createBreakpoints(false);
            }
            else {
                this.miDebugger.sendCommand('exec-interrupt');
                this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
            }
        });
        if (this.debugReady) {
            process();
        }
        else {
            this.miDebugger.once('debug-ready', process);
        }
    }
    setBreakPointsRequest(response, args) {
        const createBreakpoints = (shouldContinue) => __awaiter(this, void 0, void 0, function* () {
            this.debugReady = true;
            const currentBreakpoints = (this.breakpointMap.get(args.source.path) || []).map((bp) => bp.number);
            try {
                yield this.miDebugger.removeBreakpoints(currentBreakpoints);
                this.breakpointMap.set(args.source.path, []);
                const all = [];
                const sourcepath = decodeURIComponent(args.source.path);
                if (sourcepath.startsWith('disassembly:/')) {
                    let sidx = 13;
                    if (sourcepath.startsWith('disassembly:///')) {
                        sidx = 15;
                    }
                    const path = sourcepath.substring(sidx, sourcepath.length - 6); // Account for protocol and extension
                    const parts = path.split(':::');
                    let func;
                    let file;
                    if (parts.length === 2) {
                        func = parts[1];
                        file = parts[0];
                    }
                    else {
                        func = parts[0];
                    }
                    const symbol = yield this.getDisassemblyForFunction(func, file);
                    if (symbol) {
                        args.breakpoints.forEach((brk) => {
                            if (brk.line <= symbol.instructions.length) {
                                const line = symbol.instructions[brk.line - 1];
                                all.push(this.miDebugger.addBreakPoint({
                                    file: args.source.path,
                                    line: brk.line,
                                    condition: brk.condition,
                                    countCondition: brk.hitCondition,
                                    raw: line.address
                                }));
                            }
                        });
                    }
                }
                else {
                    args.breakpoints.forEach((brk) => {
                        all.push(this.miDebugger.addBreakPoint({
                            file: args.source.path,
                            line: brk.line,
                            condition: brk.condition,
                            countCondition: brk.hitCondition
                        }));
                    });
                }
                const brkpoints = yield Promise.all(all);
                const finalBrks = brkpoints.filter((bp) => bp !== null);
                response.body = {
                    breakpoints: finalBrks.map((bp) => {
                        return {
                            line: bp.line,
                            id: bp.number,
                            verified: true
                        };
                    })
                };
                this.breakpointMap.set(args.source.path, finalBrks);
                this.sendResponse(response);
            }
            catch (msg) {
                this.sendErrorResponse(response, 9, msg.toString());
            }
            if (shouldContinue) {
                yield this.miDebugger.sendCommand('exec-continue');
            }
        });
        const process = () => __awaiter(this, void 0, void 0, function* () {
            if (this.stopped) {
                yield createBreakpoints(false);
            }
            else {
                yield this.miDebugger.sendCommand('exec-interrupt');
                this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
            }
        });
        if (this.debugReady) {
            process();
        }
        else {
            this.miDebugger.once('debug-ready', process);
        }
    }
    threadsRequest(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.stopped || this.disableSendStoppedEvents) {
                response.body = { threads: [] };
                this.sendResponse(response);
                return Promise.resolve();
            }
            try {
                const threadIdNode = yield this.miDebugger.sendCommand('thread-list-ids');
                const threadIds = threadIdNode.result('thread-ids').map((ti) => parseInt(ti[1]));
                const currentThread = threadIdNode.result('current-thread-id');
                if (!threadIds || (threadIds.length === 0)) {
                    // Yes, this does happen at the very beginning of an RTOS session
                    response.body = { threads: [] };
                    this.sendResponse(response);
                    return Promise.resolve();
                }
                for (const thId of threadIds) {
                    // Make sure VSCode knows about all the threads. GDB may still be in the process of notifying
                    // new threads while we already have a thread-list. Technically, this should never happen
                    if (!this.activeThreadIds.has(thId)) {
                        this.handleThreadCreated({ threadId: thId, threadGroupId: 'i1' });
                    }
                }
                if (!currentThread) {
                    this.currentThreadId = threadIds.findIndex((x) => {
                        return x === this.stoppedThreadId;
                    }) >= 0 ? this.stoppedThreadId : threadIds[0];
                    if (traceThreads) {
                        this.handleMsg('log', `**** thread-list-ids: no current thread, setting to ${this.currentThreadId}\n`);
                    }
                    if (threadIds.length > 1) { // No confusion when there is only one thread
                        // thread-select doesn't actually work on most embedded gdb-servers. But we will at least
                        // be in sync with gdb for querying local variables, etc. Things may rectify themselves like
                        // they do with OpenOCD bit later. In general, this only happens with buggy gdb-servers
                        yield this.miDebugger.sendCommand(`thread-select ${this.currentThreadId}`);
                    }
                }
                else {
                    this.currentThreadId = parseInt(currentThread);
                    if (traceThreads) {
                        this.handleMsg('log', `**** thread-list-ids: current thread = ${this.currentThreadId}\n`);
                    }
                }
                // We have to send this event or else VSCode may have the last/wrong/no thread selected
                // because when we stopped, we may not have had a valid thread (gdb-server issues). Needed even
                // where there is is just one thread to make sure call-stack window has proper focus and
                // selection for the debug buttons to have proper state. Esp. matters on restart with runToMain = false
                // and on an attach
                if (this.stoppedEventPending || (this.currentThreadId !== this.stoppedThreadId)) {
                    this.stoppedEventPending = false;
                    this.stoppedThreadId = this.currentThreadId;
                    this.sendEvent(new common_1.StoppedEvent(this.stoppedReason, this.currentThreadId, true));
                    this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
                }
                const nodes = yield Promise.all(threadIds.map((id) => this.miDebugger.sendCommand(`thread-info ${id}`)));
                const threads = nodes.map((node) => {
                    let th = node.result('threads');
                    if (th.length === 1) {
                        th = th[0];
                        const id = parseInt(mi_parse_1.MINode.valueOf(th, 'id'));
                        const tid = mi_parse_1.MINode.valueOf(th, 'target-id');
                        const details = mi_parse_1.MINode.valueOf(th, 'details');
                        return new vscode_debugadapter_1.Thread(id, details || tid);
                    }
                    else {
                        return null;
                    }
                }).filter((t) => t !== null);
                response.body = {
                    threads: threads
                };
                this.sendResponse(response);
            }
            catch (e) {
                this.sendErrorResponse(response, 1, `Unable to get thread information: ${e}`);
            }
        });
    }
    stackTraceRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stack = yield this.miDebugger.getStack(args.threadId, args.startFrame, args.levels);
                const ret = [];
                for (const element of stack) {
                    const stackId = GDBDebugSession.encodeReference(args.threadId, element.level);
                    const file = element.file;
                    let disassemble = this.forceDisassembly || !file;
                    if (!disassemble) {
                        disassemble = !(yield this.checkFileExists(file));
                    }
                    if (!disassemble && this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
                        const symbolInfo = this.symbolTable.getFunctionByName(element.function, element.fileName);
                        let url;
                        if (symbolInfo) {
                            if (symbolInfo.file && (symbolInfo.scope !== symbols_2.SymbolScope.Global)) {
                                url = `disassembly:///${symbolInfo.file}:::${symbolInfo.name}.cdasm`;
                            }
                            else {
                                url = `disassembly:///${symbolInfo.name}.cdasm`;
                            }
                            if (url === this.activeEditorPath) {
                                disassemble = true;
                            }
                        }
                    }
                    try {
                        if (disassemble) {
                            const symbolInfo = yield this.getDisassemblyForFunction(element.function, element.fileName);
                            let line = -1;
                            symbolInfo.instructions.forEach((inst, idx) => {
                                if (inst.address === element.address) {
                                    line = idx + 1;
                                }
                            });
                            if (line !== -1) {
                                let fname;
                                if (symbolInfo.file && (symbolInfo.scope !== symbols_2.SymbolScope.Global)) {
                                    fname = `${symbolInfo.file}:::${symbolInfo.name}.cdasm`;
                                }
                                else {
                                    fname = `${symbolInfo.name}.cdasm`;
                                }
                                const url = 'disassembly:///' + fname;
                                ret.push(new vscode_debugadapter_1.StackFrame(stackId, `${element.function}@${element.address}`, new vscode_debugadapter_1.Source(fname, url), line, 0));
                            }
                            else {
                                ret.push(new vscode_debugadapter_1.StackFrame(stackId, element.function + '@' + element.address, null, element.line, 0));
                            }
                        }
                        else {
                            ret.push(new vscode_debugadapter_1.StackFrame(stackId, element.function + '@' + element.address, new vscode_debugadapter_1.Source(element.fileName, file), element.line, 0));
                        }
                    }
                    catch (e) {
                        ret.push(new vscode_debugadapter_1.StackFrame(stackId, element.function + '@' + element.address, null, element.line, 0));
                    }
                }
                response.body = {
                    stackFrames: ret
                };
                this.sendResponse(response);
            }
            catch (err) {
                this.sendErrorResponse(response, 12, `Failed to get Stack Trace: ${err.toString()}`);
            }
        });
    }
    configurationDoneRequest(response, args) {
        this.sendResponse(response);
        this.onConfigDone.emit('done');
    }
    scopesRequest(response, args) {
        const scopes = new Array();
        scopes.push(new vscode_debugadapter_1.Scope('Local', parseInt(args.frameId), false));
        scopes.push(new vscode_debugadapter_1.Scope('Global', GLOBAL_HANDLE_ID, false));
        const staticId = STATIC_HANDLES_START + parseInt(args.frameId);
        scopes.push(new vscode_debugadapter_1.Scope('Static', staticId, false));
        this.floatingVariableMap[staticId] = {}; // Clear any previously stored stuff for this scope
        response.body = {
            scopes: scopes
        };
        this.sendResponse(response);
    }
    globalVariablesRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const symbolInfo = this.symbolTable.getGlobalVariables();
            const globals = [];
            try {
                for (const symbol of symbolInfo) {
                    const varObjName = `global_var_${symbol.name}`;
                    let varObj;
                    try {
                        const changes = yield this.miDebugger.varUpdate(varObjName, -1, -1);
                        const changelist = changes.result('changelist');
                        changelist.forEach((change) => {
                            const name = mi_parse_1.MINode.valueOf(change, 'name');
                            const vId = this.variableHandlesReverse[name];
                            const v = this.variableHandles.get(vId);
                            v.applyChanges(change);
                        });
                        const varId = this.variableHandlesReverse[varObjName];
                        varObj = this.variableHandles.get(varId);
                    }
                    catch (err) {
                        try {
                            if (err instanceof backend_1.MIError && err.message === 'Variable object not found') {
                                varObj = yield this.miDebugger.varCreate(symbol.name, varObjName);
                                const varId = this.findOrCreateVariable(varObj);
                                varObj.exp = symbol.name;
                                varObj.id = varId;
                            }
                            else {
                                throw err;
                            }
                        }
                        catch (err) {
                            if (this.args.showDevDebugOutput) {
                                this.handleMsg('stderr', `Could not create global variable ${symbol.name}\n`);
                                this.handleMsg('stderr', `Error: ${err}\n`);
                            }
                            varObj = null;
                        }
                    }
                    if (varObj) {
                        this.putFloatingVariable(args.variablesReference, symbol.name, varObj);
                        globals.push(varObj.toProtocolVariable());
                    }
                }
                response.body = { variables: globals };
                this.sendResponse(response);
            }
            catch (err) {
                this.sendErrorResponse(response, 1, `Could not get global variable information: ${err}`);
            }
        });
    }
    createStaticVarName(fHash, name) {
        const varObjName = `static_var_${name}_${fHash}`;
        return varObjName;
    }
    putFloatingVariable(scopeId, name, varObj) {
        const scopeMap = this.floatingVariableMap[scopeId] || {};
        scopeMap[name] = varObj;
        this.floatingVariableMap[scopeId] = scopeMap;
    }
    getFloatingVariable(scopeId, name) {
        const scopeMap = this.floatingVariableMap[scopeId];
        const ret = scopeMap ? scopeMap[name] : null;
        return ret;
    }
    staticVariablesRequest(threadId, frameId, response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const statics = [];
            try {
                const frame = yield this.miDebugger.getFrame(threadId, frameId);
                const file = frame.fileName;
                const staticSymbols = this.symbolTable.getStaticVariables(file);
                const hasher = crypto.createHash('sha256');
                hasher.update(file);
                const fHash = hasher.digest('hex');
                for (const symbol of staticSymbols) {
                    const varObjName = this.createStaticVarName(fHash, symbol.name);
                    let varObj;
                    try {
                        const changes = yield this.miDebugger.varUpdate(varObjName, -1, -1);
                        const changelist = changes.result('changelist');
                        changelist.forEach((change) => {
                            const name = mi_parse_1.MINode.valueOf(change, 'name');
                            const vId = this.variableHandlesReverse[name];
                            const v = this.variableHandles.get(vId);
                            v.applyChanges(change);
                        });
                        const varId = this.variableHandlesReverse[varObjName];
                        varObj = this.variableHandles.get(varId);
                    }
                    catch (err) {
                        try {
                            // Not all static variables found via objdump can be found with gdb. Happens
                            // with function/block scoped static variables (objdump uses one name and gdb uses another)
                            // Try to report what we can. Others show up under the Locals section hopefully.
                            if (err instanceof backend_1.MIError && err.message === 'Variable object not found') {
                                varObj = yield this.miDebugger.varCreate(symbol.name, varObjName);
                                const varId = this.findOrCreateVariable(varObj);
                                varObj.exp = symbol.name;
                                varObj.id = varId;
                            }
                            else {
                                throw err;
                            }
                        }
                        catch (err) {
                            if (this.args.showDevDebugOutput) {
                                this.handleMsg('stderr', `Could not create static variable ${file}:${symbol.name}\n`);
                                this.handleMsg('stderr', `Error: ${err}\n`);
                            }
                            varObj = null;
                        }
                    }
                    if (varObj) {
                        this.putFloatingVariable(args.variablesReference, symbol.name, varObj);
                        statics.push(varObj.toProtocolVariable());
                    }
                }
                response.body = { variables: statics };
                this.sendResponse(response);
            }
            catch (err) {
                this.sendErrorResponse(response, 1, `Could not get static variable information: ${err}`);
            }
        });
    }
    createVariable(arg, options) {
        if (options) {
            return this.variableHandles.create(new ExtendedVariable(arg, options));
        }
        else {
            return this.variableHandles.create(arg);
        }
    }
    findOrCreateVariable(varObj) {
        let id;
        if (this.variableHandlesReverse.hasOwnProperty(varObj.name)) {
            id = this.variableHandlesReverse[varObj.name];
        }
        else {
            id = this.createVariable(varObj);
            this.variableHandlesReverse[varObj.name] = id;
        }
        return varObj.isCompound() ? id : 0;
    }
    createStackVarName(name, varRef) {
        return `var_${name}_${varRef}`;
    }
    stackVariablesRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const [threadId, frameId] = GDBDebugSession.decodeReference(args.variablesReference);
            const variables = [];
            let stack;
            try {
                stack = yield this.miDebugger.getStackVariables(threadId, frameId);
                for (const variable of stack) {
                    try {
                        const varObjName = this.createStackVarName(variable.name, args.variablesReference);
                        let varObj;
                        try {
                            const changes = yield this.miDebugger.varUpdate(varObjName, threadId, frameId);
                            const changelist = changes.result('changelist');
                            changelist.forEach((change) => {
                                const name = mi_parse_1.MINode.valueOf(change, 'name');
                                const vId = this.variableHandlesReverse[name];
                                const v = this.variableHandles.get(vId);
                                v.applyChanges(change);
                            });
                            const varId = this.variableHandlesReverse[varObjName];
                            varObj = this.variableHandles.get(varId);
                        }
                        catch (err) {
                            if (err instanceof backend_1.MIError && err.message === 'Variable object not found') {
                                // Create variable in current frame/thread context. Matters when we have to set the variable */
                                varObj = yield this.miDebugger.varCreate(variable.name, varObjName, '*');
                                const varId = this.findOrCreateVariable(varObj);
                                varObj.exp = variable.name;
                                varObj.id = varId;
                            }
                            else {
                                throw err;
                            }
                        }
                        variables.push(varObj.toProtocolVariable());
                    }
                    catch (err) {
                        variables.push({
                            name: variable.name,
                            value: `<${err}>`,
                            variablesReference: 0
                        });
                    }
                }
                response.body = {
                    variables: variables
                };
                this.sendResponse(response);
            }
            catch (err) {
                this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
            }
        });
    }
    variableMembersRequest(id, response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Variable members
            let variable;
            try {
                variable = yield this.miDebugger.evalExpression(JSON.stringify(id), -1, -1);
                try {
                    let expanded = gdb_expansion_1.expandValue(this.createVariable.bind(this), variable.result('value'), id, variable);
                    if (!expanded) {
                        this.sendErrorResponse(response, 2, 'Could not expand variable');
                    }
                    else {
                        if (typeof expanded[0] === 'string') {
                            expanded = [
                                {
                                    name: '<value>',
                                    value: prettyStringArray(expanded),
                                    variablesReference: 0
                                }
                            ];
                        }
                        response.body = {
                            variables: expanded
                        };
                        this.sendResponse(response);
                    }
                }
                catch (e) {
                    this.sendErrorResponse(response, 2, `Could not expand variable: ${e}`);
                }
            }
            catch (err) {
                this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
            }
        });
    }
    variablesRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let id;
            /*
            // How to deal with multiple anonymous unions/structs in the same scope. gdb uses the same display name for
            // all of them. VSCode requires that all children have unique display names. So, we make them unique. The next
            // issue is should we use the programming model which essentially flattens the union/struct or the natural one.
            // We have three objectives we have to satisfy
            //
            // 1. Does it display correctly?
            // 2. Can I do 'Add to Watch' or 'Copy as Expression' in the Variables Window?
            // 3. Can I set a value on a field?
            //
            // We meet all three objectives, whether we flatten or not. I believe the natural model is better
            // because it is closely aligned with the source code. Visual Studio and Eclipse use the flattened model.
            // So, we have a config option to let the user decide. Not many people uae multiple anonymous stuff but
            // Zephyr OS does and since it is legal C, we have to try our best to support it.
            //
            // Note: VSCode has a bug where if a union member is modified by the user, it does not refresh the Variables window
            // but it will re-evaluate everything in the Watch window. Basically, it has no concept of a union and there is no
            // way I know of to force a refresh
            */
            if (args.variablesReference === GLOBAL_HANDLE_ID) {
                return this.globalVariablesRequest(response, args);
            }
            else if (args.variablesReference >= STATIC_HANDLES_START && args.variablesReference <= STATIC_HANDLES_FINISH) {
                const [threadId, frameId] = GDBDebugSession.decodeReference(args.variablesReference);
                return this.staticVariablesRequest(threadId, frameId, response, args);
            }
            else if (args.variablesReference >= STACK_HANDLES_START && args.variablesReference < STACK_HANDLES_FINISH) {
                return this.stackVariablesRequest(response, args);
            }
            else {
                id = this.variableHandles.get(args.variablesReference);
                if (typeof id === 'string') {
                    return this.variableMembersRequest(id, response, args);
                }
                else if (typeof id === 'object') {
                    if (id instanceof backend_1.VariableObject) {
                        const pvar = id;
                        // Variable members
                        let children;
                        const childMap = {};
                        try {
                            children = yield this.miDebugger.varListChildren(id.name, this.args.flattenAnonymous);
                            const vars = children.map((child) => {
                                const varId = this.findOrCreateVariable(child);
                                child.id = varId;
                                if (/^\d+$/.test(child.exp)) {
                                    child.fullExp = `${pvar.fullExp || pvar.exp}[${child.exp}]`;
                                }
                                else {
                                    let suffix = '.' + child.exp; // A normal suffix
                                    if (child.exp.startsWith('<anonymous')) { // We can have duplicates!!
                                        const prev = childMap[child.exp];
                                        if (prev) {
                                            childMap[child.exp] = prev + 1;
                                            child.exp += '#' + prev.toString(10);
                                        }
                                        childMap[child.exp] = 1;
                                        suffix = ''; // Anonymous ones don't have a suffix. Have to use parent name
                                    }
                                    else {
                                        // The full-name is not always derivable from the parent and child info. Esp. children
                                        // of anonymous stuff. Might as well store all of them or set-value will not work.
                                        pvar.children[child.exp] = child.name;
                                    }
                                    child.fullExp = `${pvar.fullExp || pvar.exp}${suffix}`;
                                }
                                return child.toProtocolVariable();
                            });
                            response.body = {
                                variables: vars
                            };
                            this.sendResponse(response);
                        }
                        catch (err) {
                            this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
                        }
                    }
                    else if (id instanceof ExtendedVariable) {
                        const variables = [];
                        const varReq = id;
                        if (varReq.options.arg) {
                            const strArr = [];
                            let argsPart = true;
                            let arrIndex = 0;
                            const submit = () => {
                                response.body = {
                                    variables: strArr
                                };
                                this.sendResponse(response);
                            };
                            const addOne = () => __awaiter(this, void 0, void 0, function* () {
                                const variable = yield this.miDebugger.evalExpression(JSON.stringify(`${varReq.name}+${arrIndex})`), -1, -1);
                                try {
                                    const expanded = gdb_expansion_1.expandValue(this.createVariable.bind(this), variable.result('value'), varReq.name, variable);
                                    if (!expanded) {
                                        this.sendErrorResponse(response, 15, 'Could not expand variable');
                                    }
                                    else {
                                        if (typeof expanded === 'string') {
                                            if (expanded === '<nullptr>') {
                                                if (argsPart) {
                                                    argsPart = false;
                                                }
                                                else {
                                                    return submit();
                                                }
                                            }
                                            else if (expanded[0] !== '"') {
                                                strArr.push({
                                                    name: '[err]',
                                                    value: expanded,
                                                    variablesReference: 0
                                                });
                                                return submit();
                                            }
                                            strArr.push({
                                                name: `[${(arrIndex++)}]`,
                                                value: expanded,
                                                variablesReference: 0
                                            });
                                            addOne();
                                        }
                                        else {
                                            strArr.push({
                                                name: '[err]',
                                                value: expanded,
                                                variablesReference: 0
                                            });
                                            submit();
                                        }
                                    }
                                }
                                catch (e) {
                                    this.sendErrorResponse(response, 14, `Could not expand variable: ${e}`);
                                }
                            });
                            addOne();
                        }
                        else {
                            this.sendErrorResponse(response, 13, `Unimplemented variable request options: ${JSON.stringify(varReq.options)}`);
                        }
                    }
                    else {
                        response.body = {
                            variables: id
                        };
                        this.sendResponse(response);
                    }
                }
                else {
                    response.body = {
                        variables: []
                    };
                    this.sendResponse(response);
                }
            }
        });
    }
    pauseRequest(response, args) {
        this.miDebugger.interrupt().then((done) => {
            this.sendResponse(response);
        }, (msg) => {
            this.sendErrorResponse(response, 3, `Could not pause: ${msg}`);
        });
    }
    continueRequest(response, args) {
        this.miDebugger.continue(args.threadId).then((done) => {
            response.body = { allThreadsContinued: true };
            this.sendResponse(response);
        }, (msg) => {
            this.sendErrorResponse(response, 2, `Could not continue: ${msg}`);
        });
    }
    stepInRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let assemblyMode = this.forceDisassembly;
                if (!assemblyMode) {
                    const frame = yield this.miDebugger.getFrame(args.threadId, 0);
                    assemblyMode = !(yield this.checkFileExists(frame.file));
                    if (this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
                        const symbolInfo = this.symbolTable.getFunctionByName(frame.function, frame.fileName);
                        let url;
                        if (symbolInfo.file && (symbolInfo.scope !== symbols_2.SymbolScope.Global)) {
                            url = `disassembly:///${symbolInfo.file}:::${symbolInfo.name}.cdasm`;
                        }
                        else {
                            url = `disassembly:///${symbolInfo.name}.cdasm`;
                        }
                        if (url === this.activeEditorPath) {
                            assemblyMode = true;
                        }
                    }
                }
                const done = yield this.miDebugger.step(args.threadId, assemblyMode);
                this.sendResponse(response);
            }
            catch (msg) {
                this.sendErrorResponse(response, 6, `Could not step over: ${msg}`);
            }
        });
    }
    stepOutRequest(response, args) {
        this.miDebugger.stepOut(args.threadId).then((done) => {
            this.sendResponse(response);
        }, (msg) => {
            this.sendErrorResponse(response, 5, `Could not step out: ${msg}`);
        });
    }
    nextRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let assemblyMode = this.forceDisassembly;
                if (!assemblyMode) {
                    const frame = yield this.miDebugger.getFrame(args.threadId, 0);
                    assemblyMode = !(yield this.checkFileExists(frame.file));
                    if (this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
                        const symbolInfo = this.symbolTable.getFunctionByName(frame.function, frame.fileName);
                        let url;
                        if (symbolInfo.file && (symbolInfo.scope !== symbols_2.SymbolScope.Global)) {
                            url = `disassembly:///${symbolInfo.file}:::${symbolInfo.name}.cdasm`;
                        }
                        else {
                            url = `disassembly:///${symbolInfo.name}.cdasm`;
                        }
                        if (url === this.activeEditorPath) {
                            assemblyMode = true;
                        }
                    }
                }
                const done = yield this.miDebugger.next(args.threadId, assemblyMode);
                this.sendResponse(response);
            }
            catch (msg) {
                this.sendErrorResponse(response, 6, `Could not step over: ${msg}`);
            }
        });
    }
    checkFileExists(name) {
        if (!name) {
            return Promise.resolve(false);
        }
        if (this.fileExistsCache.has(name)) { // Check cache
            return Promise.resolve(this.fileExistsCache.get(name));
        }
        return new Promise((resolve, reject) => {
            fs.exists(name, (exists) => {
                this.fileExistsCache.set(name, exists);
                resolve(exists);
            });
        });
    }
    evaluateRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const createVariable = (arg, options) => {
                if (options) {
                    return this.variableHandles.create(new ExtendedVariable(arg, options));
                }
                else {
                    return this.variableHandles.create(arg);
                }
            };
            const findOrCreateVariable = (varObj) => {
                let id;
                if (this.variableHandlesReverse.hasOwnProperty(varObj.name)) {
                    id = this.variableHandlesReverse[varObj.name];
                }
                else {
                    id = createVariable(varObj);
                    this.variableHandlesReverse[varObj.name] = id;
                }
                return varObj.isCompound() ? id : 0;
            };
            // Spec says if 'frameId' is specified, evaluate in the scope specified or in the global scope. Well,
            // we don't have a way to specify global scope ... use current thread then.
            let threadId = this.currentThreadId;
            let frameId = 0;
            if (args.frameId) { // Should always be valid
                [threadId, frameId] = GDBDebugSession.decodeReference(args.frameId);
                if (traceThreads) {
                    this.handleMsg('log', `**** evaluateRequest: ${args.context} '${args.expression}' in thread#${threadId} frame#${frameId}\n`);
                }
            }
            else {
                // In practice, never seen this unless it comes from a custom request
                this.handleMsg('log', `Thread Warning: ${args.context}: eval. expression '${args.expression}' with no thread context. Using default\n`);
            }
            if (args.context === 'watch') {
                try {
                    const exp = args.expression;
                    const hasher = crypto.createHash('sha256');
                    hasher.update(exp);
                    const watchName = hasher.digest('hex');
                    const varObjName = `watch_${watchName}`;
                    let varObj;
                    try {
                        const changes = yield this.miDebugger.varUpdate(varObjName, threadId, frameId);
                        const changelist = changes.result('changelist');
                        changelist.forEach((change) => {
                            const name = mi_parse_1.MINode.valueOf(change, 'name');
                            const vId = this.variableHandlesReverse[name];
                            const v = this.variableHandles.get(vId);
                            v.applyChanges(change);
                        });
                        const varId = this.variableHandlesReverse[varObjName];
                        varObj = this.variableHandles.get(varId);
                        response.body = {
                            result: varObj.value,
                            variablesReference: varObj.id
                        };
                    }
                    catch (err) {
                        if (err instanceof backend_1.MIError && err.message === 'Variable object not found') {
                            varObj = yield this.miDebugger.varCreate(exp, varObjName, '@'); // Create floating variable
                            const varId = findOrCreateVariable(varObj);
                            varObj.exp = exp;
                            varObj.id = varId;
                            response.body = {
                                result: varObj.value,
                                variablesReference: varObj.id
                            };
                        }
                        else {
                            throw err;
                        }
                    }
                    this.sendResponse(response);
                }
                catch (err) {
                    response.body = {
                        result: `<${err.toString()}>`,
                        variablesReference: 0
                    };
                    this.sendErrorResponse(response, 7, err.toString());
                }
            }
            else if (args.context === 'hover') {
                try {
                    const res = yield this.miDebugger.evalExpression(args.expression, threadId, frameId);
                    response.body = {
                        variablesReference: 0,
                        result: res.result('value')
                    };
                    this.sendResponse(response);
                }
                catch (e) {
                    this.sendErrorResponse(response, 7, e.toString());
                }
            }
            else {
                // REPL: Set the proper thread/frame context before sending command to gdb. We don't know
                // what the command is but it needs to be run in the proper context.
                this.miDebugger.sendCommand(`thread-select ${threadId}`);
                this.miDebugger.sendCommand(`stack-select-frame ${frameId}`);
                this.miDebugger.sendUserInput(args.expression).then((output) => {
                    if (typeof output === 'undefined') {
                        response.body = {
                            result: '',
                            variablesReference: 0
                        };
                    }
                    else {
                        response.body = {
                            result: JSON.stringify(output),
                            variablesReference: 0
                        };
                    }
                    this.sendResponse(response);
                }, (msg) => {
                    this.sendErrorResponse(response, 8, msg.toString());
                });
            }
        });
    }
}
exports.GDBDebugSession = GDBDebugSession;
function prettyStringArray(strings) {
    if (typeof strings === 'object') {
        if (strings.length !== undefined) {
            return strings.join(', ');
        }
        else {
            return JSON.stringify(strings);
        }
    }
    else {
        return strings;
    }
}
vscode_debugadapter_1.DebugSession.run(GDBDebugSession);


/***/ }),

/***/ "./src/jlink.ts":
/*!**********************!*\
  !*** ./src/jlink.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const os = __webpack_require__(/*! os */ "os");
const events_1 = __webpack_require__(/*! events */ "events");
const commandExistsSync = __webpack_require__(/*! command-exists */ "./node_modules/command-exists/index.js").sync;
const EXECUTABLE_NAMES = ['JLinkGDBServerCLExe', 'JLinkGDBServerCL', 'JLinkGDBServer'];
class JLinkServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.portsNeeded = ['gdbPort', 'swoPort', 'consolePort'];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'interpreter-exec console "monitor reset"',
            'target-download',
            'interpreter-exec console "monitor reset"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'interpreter-exec console "monitor reset"'
        ];
        return commands;
    }
    swoCommands() {
        const commands = [];
        if (this.args.swoConfig.enabled) {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency | 0;
        const cpuFrequency = this.args.swoConfig.cpuFrequency | 0;
        const commands = [
            `monitor SWO EnableTarget ${cpuFrequency} ${swoFrequency} ${portMask} 0`,
            'DisableITMPorts 0xFFFFFFFF',
            `EnableITMPorts ${portMask}`,
            'EnableDWTSync',
            'ITMSyncEnable'
        ];
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            if (os.platform() === 'win32') {
                return 'JLinkGDBServerCL.exe';
            }
            else {
                for (const name in EXECUTABLE_NAMES) {
                    if (commandExistsSync(name)) {
                        return name;
                    }
                }
                return 'JLinkGDBServer';
            }
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        const swoport = this.ports['swoPort'];
        const consoleport = this.ports['consolePort'];
        let cmdargs = [
            '-if', this.args.interface,
            '-port', gdbport.toString(),
            '-swoport', swoport.toString(),
            '-telnetport', consoleport.toString(),
            '-device', this.args.device
        ];
        if (this.args.serialNumber) {
            cmdargs.push('-select', `usb=${this.args.serialNumber}`);
        }
        else if (this.args.ipAddress) {
            cmdargs.push('-select', `ip=${this.args.ipAddress}`);
        }
        if (this.args.rtos) {
            cmdargs.push('-rtos', this.args.rtos);
        }
        if (this.args.jlinkscript) {
            cmdargs.push('-jlinkscriptfile', this.args.jlinkscript);
        }
        if (this.args.serverArgs) {
            cmdargs = cmdargs.concat(this.args.serverArgs);
        }
        return cmdargs;
    }
    initMatch() {
        return /Waiting for GDB connection\.\.\./g;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled) {
            if (this.args.swoConfig.source === 'probe') {
                this.emit('event', new common_1.SWOConfigureEvent({ type: 'socket', port: this.ports['swoPort'] }));
            }
            else {
                this.emit('event', new common_1.SWOConfigureEvent({
                    type: 'serial',
                    device: this.args.swoConfig.source,
                    baudRate: this.args.swoConfig.swoFrequency
                }));
            }
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.JLinkServerController = JLinkServerController;


/***/ }),

/***/ "./src/openocd.ts":
/*!************************!*\
  !*** ./src/openocd.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const os = __webpack_require__(/*! os */ "os");
const tmp = __webpack_require__(/*! tmp */ "./node_modules/tmp/lib/tmp.js");
const fs = __webpack_require__(/*! fs */ "fs");
const ChildProcess = __webpack_require__(/*! child_process */ "child_process");
const events_1 = __webpack_require__(/*! events */ "events");
class OpenOCDServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.portsNeeded = ['gdbPort'];
        this.name = 'OpenOCD';
        this.swoPath = tmp.tmpNameSync();
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"',
            'target-download',
            'interpreter-exec console "monitor reset halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"'
        ];
        return commands;
    }
    swoCommands() {
        const commands = [];
        if (this.args.swoConfig.enabled) {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency;
        const cpuFrequency = this.args.swoConfig.cpuFrequency;
        const ratio = Math.floor(cpuFrequency / swoFrequency) - 1;
        const commands = [
            'EnableITMAccess',
            `BaseSWOSetup ${ratio}`,
            'SetITMId 1',
            'ITMDWTTransferEnable',
            'DisableITMPorts 0xFFFFFFFF',
            `EnableITMPorts ${portMask}`,
            'EnableDWTSync',
            'ITMSyncEnable',
            'ITMGlobalEnable'
        ];
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            return os.platform() === 'win32' ? 'openocd.exe' : 'openocd';
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = [];
        serverargs.push('-c', `gdb_port ${gdbport}`);
        this.args.searchDir.forEach((cs, idx) => {
            serverargs.push('-s', cs);
        });
        if (this.args.searchDir.length === 0) {
            serverargs.push('-s', this.args.cwd);
        }
        for (const cmd of this.args.openOCDPreConfigLaunchCommands || []) {
            serverargs.push('-c', cmd);
        }
        this.args.configFiles.forEach((cf, idx) => {
            serverargs.push('-f', cf);
        });
        if (this.args.rtos) {
            const tmpCfgPath = tmp.tmpNameSync();
            fs.writeFileSync(tmpCfgPath, `$_TARGETNAME configure -rtos ${this.args.rtos}\n`, 'utf8');
            serverargs.push('-f', tmpCfgPath);
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        const commands = [];
        if (this.args.swoConfig.enabled) {
            let tpiuIntExt;
            if (os.platform() === 'win32') {
                this.swoPath = this.swoPath.replace(/\\/g, '/');
            }
            if (this.args.swoConfig.source === 'probe') {
                tpiuIntExt = `internal ${this.swoPath}`;
            }
            else {
                tpiuIntExt = 'external';
            }
            // tslint:disable-next-line:max-line-length
            commands.push(`tpiu config ${tpiuIntExt} uart off ${this.args.swoConfig.cpuFrequency} ${this.args.swoConfig.swoFrequency}`);
        }
        if (commands.length > 0) {
            serverargs.push('-c', commands.join('; '));
        }
        for (const cmd of this.args.openOCDLaunchCommands || []) {
            serverargs.push('-c', cmd);
        }
        return serverargs;
    }
    initMatch() {
        /*
        // Following will work with or without the -d flag to openocd or using the tcl
        // command `debug_level 3`; and we are looking specifically for gdb port(s) opening up
        // When debug is enabled, you get too many matches looking for the cpu. This message
        // has been there atleast since 2016-12-19
        */
        return /Info\s:[^\n]*Listening on port \d+ for gdb connection/i;
    }
    serverLaunchStarted() {
        if (this.args.swoConfig.enabled && this.args.swoConfig.source === 'probe' && os.platform() !== 'win32') {
            const mkfifoReturn = ChildProcess.spawnSync('mkfifo', [this.swoPath]);
            this.emit('event', new common_1.SWOConfigureEvent({ type: 'fifo', path: this.swoPath }));
        }
    }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled) {
            if (this.args.swoConfig.source === 'probe' && os.platform() === 'win32') {
                this.emit('event', new common_1.SWOConfigureEvent({ type: 'file', path: this.swoPath }));
            }
            else if (this.args.swoConfig.source !== 'probe') {
                this.emit('event', new common_1.SWOConfigureEvent({
                    type: 'serial',
                    device: this.args.swoConfig.source,
                    baudRate: this.args.swoConfig.swoFrequency
                }));
            }
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.OpenOCDServerController = OpenOCDServerController;


/***/ }),

/***/ "./src/pemicro.ts":
/*!************************!*\
  !*** ./src/pemicro.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(/*! os */ "os");
const events_1 = __webpack_require__(/*! events */ "events");
const commandExistsSync = __webpack_require__(/*! command-exists */ "./node_modules/command-exists/index.js").sync;
class PEServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.portsNeeded = ['gdbPort', 'swoPort', 'consolePort'];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor _reset"',
            'target-download',
            'interpreter-exec console "monitor _reset"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor _reset"'
        ];
        return commands;
    }
    swoCommands() {
        return [];
    }
    serverExecutable() {
        console.log('Getting Exec');
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            if (os.platform() === 'win32') {
                return 'pegdbserver_console.exe';
            }
            else {
                return 'pegdbserver_console';
            }
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = [];
        serverargs.push('-startserver');
        serverargs.push('-singlesession');
        serverargs.push(`-device=${this.args.device}`);
        serverargs.push(`-serverport=${gdbport}`);
        if (this.args.ipAddress) {
            serverargs.push(`-serverip=${this.args.ipAddress}`);
        }
        if (this.args.rtos) {
            serverargs.push(`-kernal=${this.args.rtos}`);
        }
        if (this.args.interface) {
            serverargs.push(`-interface=${this.args.interface}`);
        }
        if (this.args.configFiles) {
            serverargs.push(`-configfile=${this.args.configFiles[0]}`);
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        return serverargs;
    }
    initMatch() {
        return /All Servers Running/g;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() { }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.PEServerController = PEServerController;


/***/ }),

/***/ "./src/pyocd.ts":
/*!**********************!*\
  !*** ./src/pyocd.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const events_1 = __webpack_require__(/*! events */ "events");
class PyOCDServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'PyOCD';
        this.portsNeeded = ['gdbPort'];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor reset halt"',
            'target-download',
            'interpreter-exec console "monitor reset halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const gdbport = this.ports['gdbPort'];
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor reset"'
        ];
        return commands;
    }
    swoCommands() {
        const commands = [];
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency;
        const cpuFrequency = this.args.swoConfig.cpuFrequency;
        const ratio = Math.floor(cpuFrequency / swoFrequency) - 1;
        const commands = [
            'EnableITMAccess',
            `BaseSWOSetup ${ratio}`,
            'SetITMId 1',
            'ITMDWTTransferEnable',
            'DisableITMPorts 0xFFFFFFFF',
            `EnableITMPorts ${portMask}`,
            'EnableDWTSync',
            'ITMSyncEnable',
            'ITMGlobalEnable'
        ];
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        return this.args.serverpath ? this.args.serverpath : 'pyocd-gdbserver';
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = ['--persist', '--port', gdbport.toString(), '--reset-break'];
        if (this.args.boardId) {
            serverargs.push('--board');
            serverargs.push(this.args.boardId);
        }
        if (this.args.targetId) {
            serverargs.push('--target');
            serverargs.push(this.args.targetId.toString());
        }
        if (this.args.cmsisPack) {
            serverargs.push('--pack');
            serverargs.push(this.args.cmsisPack.toString());
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        return serverargs;
    }
    initMatch() {
        return /GDB server started (at|on) port/;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            this.emit('event', new common_1.SWOConfigureEvent({
                type: 'serial',
                device: this.args.swoConfig.source,
                baudRate: this.args.swoConfig.swoFrequency
            }));
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.PyOCDServerController = PyOCDServerController;


/***/ }),

/***/ "./src/qemu.ts":
/*!*********************!*\
  !*** ./src/qemu.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! events */ "events");
const commandExistsSync = __webpack_require__(/*! command-exists */ "./node_modules/command-exists/index.js").sync;
const EXECUTABLE_NAMES = ['qemu-system-arm'];
class QEMUServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.portsNeeded = ['gdbPort'];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor stop"',
            'interpreter-exec console "monitor system_reset"'
        ];
        return commands;
    }
    swoCommands() {
        return [];
    }
    serverExecutable() {
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            for (const name in EXECUTABLE_NAMES) {
                if (commandExistsSync(name)) {
                    return name;
                }
            }
            return 'qemu-system-arm';
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let cmdargs = [
            '-cpu', this.args.cpu,
            '-machine', this.args.machine,
            '-nographic',
            '-semihosting-config', 'enable=on,target=native',
            '-gdb', 'tcp::' + gdbport.toString(),
            '-S',
            '-kernel', this.args.executable
        ];
        if (this.args.serverArgs) {
            cmdargs = cmdargs.concat(this.args.serverArgs);
        }
        return cmdargs;
    }
    initMatch() {
        return null;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() { }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.QEMUServerController = QEMUServerController;


/***/ }),

/***/ "./src/stutil.ts":
/*!***********************!*\
  !*** ./src/stutil.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
const os = __webpack_require__(/*! os */ "os");
const events_1 = __webpack_require__(/*! events */ "events");
class STUtilServerController extends events_1.EventEmitter {
    constructor() {
        super();
        this.name = 'ST-Util';
        this.portsNeeded = ['gdbPort'];
    }
    setPorts(ports) {
        this.ports = ports;
    }
    setArguments(args) {
        this.args = args;
    }
    customRequest(command, response, args) {
        return false;
    }
    initCommands() {
        const gdbport = this.ports['gdbPort'];
        return [
            `target-select extended-remote localhost:${gdbport}`
        ];
    }
    launchCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'interpreter-exec console "monitor reset"',
            'target-download',
            'interpreter-exec console "monitor reset"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    attachCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'enable-pretty-printing'
        ];
        return commands;
    }
    restartCommands() {
        const commands = [
            'interpreter-exec console "monitor halt"',
            'interpreter-exec console "monitor reset"'
        ];
        return commands;
    }
    swoCommands() {
        const commands = [];
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            const swocommands = this.SWOConfigurationCommands();
            commands.push(...swocommands);
        }
        return commands;
    }
    SWOConfigurationCommands() {
        const portMask = '0x' + common_1.calculatePortMask(this.args.swoConfig.decoders).toString(16);
        const swoFrequency = this.args.swoConfig.swoFrequency;
        const cpuFrequency = this.args.swoConfig.cpuFrequency;
        const ratio = Math.floor(cpuFrequency / swoFrequency) - 1;
        const commands = [
            'EnableITMAccess',
            `BaseSWOSetup ${ratio}`,
            'SetITMId 1',
            'ITMDWTTransferEnable',
            'DisableITMPorts 0xFFFFFFFF',
            `EnableITMPorts ${portMask}`,
            'EnableDWTSync',
            'ITMSyncEnable',
            'ITMGlobalEnable'
        ];
        commands.push(this.args.swoConfig.profile ? 'EnablePCSample' : 'DisablePCSample');
        return commands.map((c) => `interpreter-exec console "${c}"`);
    }
    serverExecutable() {
        if (this.args.serverpath) {
            return this.args.serverpath;
        }
        else {
            return os.platform() === 'win32' ? 'st-util.exe' : 'st-util';
        }
    }
    serverArguments() {
        const gdbport = this.ports['gdbPort'];
        let serverargs = ['-p', gdbport.toString(), '-v', '--no-reset'];
        if (this.args.v1) {
            serverargs.push('--stlinkv1');
        }
        if (this.args.serverArgs) {
            serverargs = serverargs.concat(this.args.serverArgs);
        }
        return serverargs;
    }
    initMatch() {
        return /Listening at \*/g;
    }
    serverLaunchStarted() { }
    serverLaunchCompleted() {
        if (this.args.swoConfig.enabled && this.args.swoConfig.source !== 'probe') {
            this.emit('event', new common_1.SWOConfigureEvent({
                type: 'serial',
                device: this.args.swoConfig.source,
                baudRate: this.args.swoConfig.swoFrequency
            }));
        }
    }
    debuggerLaunchStarted() { }
    debuggerLaunchCompleted() { }
}
exports.STUtilServerController = STUtilServerController;


/***/ }),

/***/ "./src/symbols.ts":
/*!************************!*\
  !*** ./src/symbols.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SymbolType;
(function (SymbolType) {
    SymbolType[SymbolType["Function"] = 0] = "Function";
    SymbolType[SymbolType["File"] = 1] = "File";
    SymbolType[SymbolType["Object"] = 2] = "Object";
    SymbolType[SymbolType["Normal"] = 3] = "Normal";
})(SymbolType = exports.SymbolType || (exports.SymbolType = {}));
var SymbolScope;
(function (SymbolScope) {
    SymbolScope[SymbolScope["Local"] = 0] = "Local";
    SymbolScope[SymbolScope["Global"] = 1] = "Global";
    SymbolScope[SymbolScope["Neither"] = 2] = "Neither";
    SymbolScope[SymbolScope["Both"] = 3] = "Both";
})(SymbolScope = exports.SymbolScope || (exports.SymbolScope = {}));


/***/ }),

/***/ "./src/tcpportscanner.ts":
/*!*******************************!*\
  !*** ./src/tcpportscanner.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Author to Blame: haneefdm on github
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tcpPortUsed = __webpack_require__(/*! tcp-port-used */ "./node_modules/tcp-port-used/index.js");
const os = __webpack_require__(/*! os */ "os");
const net = __webpack_require__(/*! net */ "net");
const child_process = __webpack_require__(/*! child_process */ "child_process");
const command_exists = __webpack_require__(/*! command-exists */ "./node_modules/command-exists/index.js");
class TcpPortScanner {
    /**
     * Checks to see if the port is in use by creating a server on that port. You should use the function
     * `isPortInUseEx()` if you want to do a more exhaustive check or a general purpose use for any host
     *
     * @param port port to use. Must be > 0 and <= 65535
     * @param host host ip address to use. This should be an alias to a localhost. Can be null or empty string
     * in which case the Node.js default rules apply.
     */
    static isPortInUse(port, host) {
        return new Promise((resolve, reject) => {
            const server = net.createServer((c) => {
            });
            server.once('error', (e) => {
                const code = e.code;
                if (code && (code === 'EADDRINUSE') || (code === 'EACCES')) {
                    // console.log(`port ${host}:${port} is used`, code);
                    if (code === 'EACCES') {
                        // Technically, EACCES means permission denied, so we consider it as used
                        console.log(`port ${host}:${port} returned code EACCES?`);
                    }
                    resolve(true); // Port in use
                }
                else {
                    // This should never happen so, log it always
                    console.log(`port ${host}:${port} unexpected error `, e);
                    reject(e); // some other failure
                }
                server.close();
            });
            server.listen(port, host, () => {
                // Port not in use
                // console.log(`port ${host}:${port} is in free`);
                resolve(false);
                server.close();
            });
        });
    }
    /**
     * Checks to see if the port is in use by creating a server on that port if a localhost or alias
     * or try to connect to an existing server.
     *
     * If we think it is a localhost, It tries to make sure it and its aliases are all free. For
     * instance 0.0.0.0, 127.0.0.1, ::1 are true aliases on some systems and distinct ones on others.
     *
     * @param port port to use. Must be > 0 and <= 65535
     * @param host host ip address to use.
     */
    static isPortInUseEx(port, host) {
        if (TcpPortScanner.shouldUseServerMethod(host)) {
            const tries = TcpPortScanner.getLocalHostAliases();
            let ix = 0;
            // We don't use Promise.all method because we are trying to create a bunch of
            // servers on the same machine/port, they could interfere with each other if you
            // do it asynchronously/parallel.
            // There is also a slight benefit that we can bail early if a port is in use
            return new Promise((resolve, reject) => {
                function next(port, host) {
                    TcpPortScanner.isPortInUse(port, host).then((inUse) => {
                        if (inUse) {
                            resolve(inUse);
                        }
                        else if (++ix === tries.length) {
                            resolve(false);
                        }
                        else {
                            next(port, tries[ix]);
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }
                next(port, tries[ix]);
            });
        }
        else {
            // This function is too slow on windows when checking on an open port.
            return tcpPortUsed.check(port, host);
        }
    }
    /**
     * Scan for free ports (no one listening) on the specified host.
     * Don't like the interface but trying to keep compatibility with `portastic.find()`. Unlike
     * `portastic` the default ports to retrieve is 1 and we also have the option of returning
     * consecutive ports
     *
     * Detail: While this function is async, promises are chained to find open ports recursively
     *
     * @param0
     * @param host Use any string that is a valid host name or ip address
     * @return a Promise with an array of ports or null when cb is used
     */
    static findFreePorts({ min, max, retrieve = 1, consecutive = false, doLog = false }, host = TcpPortScanner.DefaultHost) {
        let freePorts = [];
        const busyPorts = []; // Mostly for debug
        const needed = retrieve;
        const functor = TcpPortScanner.shouldUseServerMethod(host) ? TcpPortScanner.isPortInUseEx : tcpPortUsed.tcpPortUsed;
        return new Promise((resolve, reject) => {
            if (needed <= 0) {
                resolve(freePorts);
                return;
            }
            function next(port, host) {
                const startTine = process.hrtime();
                functor(port, host).then((inUse) => {
                    const endTime = process.hrtime(startTine);
                    if (inUse) {
                        busyPorts.push(port);
                    }
                    else {
                        if (consecutive && (freePorts.length > 0) &&
                            (port !== (1 + freePorts[freePorts.length - 1]))) {
                            if (doLog) {
                                console.log('TcpPortHelper.find: Oops, reset for consecutive ports requirement');
                            }
                            freePorts = [];
                        }
                        freePorts.push(port);
                    }
                    if (doLog) {
                        const ms = (endTime[1] / 1e6).toFixed(2);
                        const t = `${endTime[0]}s ${ms}ms`;
                        console.log(`TcpPortHelper.find Port ${host}:${port} ` +
                            (inUse ? 'busy' : 'free') + `, Found: ${freePorts.length} of ${needed} needed ${t}`);
                    }
                    if (freePorts.length === needed) {
                        resolve(freePorts);
                    }
                    else if (port < max) {
                        next(port + 1, host);
                    }
                    else {
                        reject(new Error(`Only found ${freePorts.length} of ${needed} ports`));
                    }
                }).catch((err) => {
                    reject(err);
                });
            }
            next(min, host); // Start the hunt
        });
    }
    /**
     * @deprecated This a synchronous version of `findFreePorts()`. Use it instead. This function
     * maybe slightly faster but will not play nice in a truely async. system.
     */
    static findFreePortsSync({ min, max, retrieve = 1, consecutive = false, doLog = false }, host = TcpPortScanner.DefaultHost, cb = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let freePorts = [];
            const busyPorts = [];
            const needed = retrieve;
            let error = null;
            if (needed <= 0) {
                return new Promise((resolve) => { resolve(freePorts); });
            }
            const functor = TcpPortScanner.shouldUseServerMethod(host) ? TcpPortScanner.isPortInUseEx : tcpPortUsed.tcpPortUsed;
            for (let port = min; port <= max; port++) {
                if (needed <= 0) {
                    return;
                }
                const startTime = process.hrtime();
                yield functor(port, host)
                    .then((inUse) => {
                    const endTime = process.hrtime(startTime);
                    if (inUse) {
                        busyPorts.push(port);
                    }
                    else {
                        if (consecutive && (freePorts.length > 0) &&
                            (port !== (1 + freePorts[freePorts.length - 1]))) {
                            if (doLog) {
                                console.log('TcpPortHelper.finnd: Oops, reset for consecutive requirement');
                            }
                            freePorts = [];
                        }
                        freePorts.push(port);
                    }
                    if (doLog) {
                        const ms = (endTime[1] / 1e6).toFixed(2);
                        const t = `${endTime[0]}s ${ms}ms`;
                        console.log(`TcpPortHelper.find Port ${host}:${port} ` +
                            (inUse ? 'busy' : 'free') + `, Found: ${freePorts.length} of ${needed} needed ` + t);
                    }
                }, (err) => {
                    if (doLog) {
                        console.error('Error on check:', err.message);
                    }
                    error = err;
                });
                if (error || (freePorts.length === needed)) {
                    break;
                }
            }
            if (!cb) {
                return new Promise((resolve, reject) => {
                    if (!error && (freePorts.length === needed)) {
                        resolve(freePorts);
                    }
                    else {
                        reject(error ? error : `Only found ${freePorts.length} of ${needed} ports`);
                    }
                });
            }
            else {
                if (!error && (freePorts.length === needed)) {
                    cb(freePorts);
                }
                return null;
            }
        });
    }
    static getOsNetProbeCmd() {
        /**
         * Notes:
         * `netstat` does not exist on Linux by default. Replacement is `ss`
         * `netstat` and `ss` are faster than lsof. netstat on mac is super fast.
         * what program to use is baed of platform and availability
         */
        if (TcpPortScanner.OSNetProbeCmd === '') {
            const commandExistsSync = command_exists.sync;
            const platform = os.platform();
            const isWin = platform === 'win32';
            const isMac = platform === 'darwin';
            /**
             * for `netstat` and `ss` We are looking for things that are in the 'local address' field for
             * ports that are listening. Technically, you can have multiple matches because the local machine
             * can have multiple addresses
             */
            if (!isWin && !isMac && commandExistsSync('ss')) {
                TcpPortScanner.OSNetProbeCmd = 'ss -nlt';
                TcpPortScanner.OSNetProbeCmdRegexpStr = 'LISTEN\\s+[^\\n]*:XYZZY\\s+[^\\s]+[^\\n]*\\n';
            }
            else if (commandExistsSync('netstat')) {
                // On windows, if you ask for tcp it will only give you ipv4. On Mac, it gives both, so we have to
                // use the -f on Mac
                TcpPortScanner.OSNetProbeCmd = isWin ? 'netstat -nap tcp' : 'netstat -nap tcp -f inet';
                // netstat output varies wildly, so be careful
                TcpPortScanner.OSNetProbeCmdRegexpStr = '[tT][cC][pP][^\\n]*[:\\.]XYZZY\\s+[^\\s]+\\s+LISTEN[^\\n]*\\n';
            }
            else if (isMac && commandExistsSync('lsof')) {
                // This is the slowest of all but probably the most consistent
                TcpPortScanner.OSNetProbeCmd = 'lsof -n -iTCP:XYZZY -sTCP:LISTEN';
                TcpPortScanner.OSNetProbeCmdRegexpStr = 'IPv4[^\\n]+:XYZZY\\s[^\\n]*\\(LISTEN\\)[^\\n]*\\n';
            }
            else {
                TcpPortScanner.OSNetProbeCmd = '?';
            }
        }
        return TcpPortScanner.OSNetProbeCmd;
    }
    /**
     * This is the most unobtrusive way of figuring out if a port is open. It does not try
     * to create servers or clients but use system commands to figure out if a port is open
     * On Mac, the runtime is not bad 1.5 to 2X of the time take to do it the other ways.
     * On windows, surprise!, it is an order of magnititude slower.
     *
     * But, it is also not bulletproof. depends on version of the OS and if some things do
     * not get installed by default. This is limited to looking for IPv4 addresses
     *
     * @param port look for port to be open. don't matter what
     * @param retryTimeMs retry after that many milliseconds.
     * @param timeOutMs max timeout
     * @param fallback Fallback to using the intrusive method if proper OS command is not available
     */
    static waitForPortOpenOSUtl(port, retryTimeMs = 100, timeOutMs = 5000, fallback = true, doLog = true) {
        const cmd = TcpPortScanner.getOsNetProbeCmd().replace('XYZZY', port.toString());
        if (doLog) {
            console.log(cmd);
        }
        if (fallback && (cmd === '?')) {
            return TcpPortScanner.waitForPortOpen(port, TcpPortScanner.DefaultHost, true, retryTimeMs, timeOutMs);
        }
        const rexStr = TcpPortScanner.OSNetProbeCmdRegexpStr.replace('XYZZY', port.toString());
        if (doLog) {
            console.log(rexStr);
        }
        const rex = new RegExp(rexStr);
        const startTimeMs = Date.now();
        let first = true;
        retryTimeMs = Math.max(retryTimeMs, 1);
        return new Promise(function tryAgain(resolve, reject) {
            if (cmd === '?') {
                return reject(new Error('failed'));
            }
            child_process.exec(cmd, (error, stdout) => {
                if (error && !cmd.startsWith('lsof')) {
                    // lsof returns an error code if nothing matches. May match later
                    return reject(error);
                }
                else if (rex.test(stdout)) {
                    if (doLog) {
                        console.log(stdout.match(rex).join('\n'));
                    }
                    return resolve();
                }
                else {
                    if (first) {
                        // if (doLog) { console.log(stdout); }
                        first = false;
                    }
                    const t = Date.now() - startTimeMs;
                    if (t < timeOutMs) {
                        if (doLog) {
                            console.log(`waitForPortOpenOSUtl: Setting timeout for ${retryTimeMs}ms, curTime = ${t}ms`);
                        }
                        setTimeout(() => {
                            tryAgain(resolve, reject);
                        }, retryTimeMs);
                    }
                    else {
                        return reject(new Error('timeout'));
                    }
                }
            });
        });
    }
    /**
     * This is the workhorse function for all kinds of status queries on port:localhost
     *
     * @param opts
     */
    static waitForPortStatusEx(opts) {
        opts.startTimeMs = Date.now();
        const functor = opts.checkLocalHostAliases ? TcpPortScanner.isPortInUseEx : TcpPortScanner.isPortInUse;
        return new Promise(function tryAgain(resolve, reject) {
            functor(opts.port, opts.host)
                .then((inUse) => {
                // console.log(`${functor.name} returned ${inUse}`)
                if (inUse === opts.desiredStatus) { // status match
                    return resolve();
                }
                else {
                    throw new Error('tryagain');
                }
            }).catch((e) => {
                if (e.message !== 'tryagain') {
                    return reject(e);
                }
                else {
                    const t = Date.now() - opts.startTimeMs;
                    if (t < opts.timeOutMs) {
                        // console.log(`Setting timeout for ${opts.retryTimeMs}ms, curTime = ${t}ms`);
                        setTimeout(() => {
                            tryAgain(resolve, reject);
                        }, opts.retryTimeMs);
                    }
                    else {
                        return reject(new Error('timeout'));
                    }
                }
            });
        });
    }
    /**
     * Wait for particular port status. We always do a minium of one try regardless of timeouts, so setting a timeout
     * of 0 means only one try
     *
     * @param inUse true means wait for port to be ready to use. False means wait for port to close
     * @return a promise. On failure, the error is Error('timeout') for a true timeout or something else
     * for other failures
     */
    static waitForPortStatus(port, host = TcpPortScanner.DefaultHost, inUse = true, checkLocalHostAliaes = true, retryTimeMs = 100, timeOutMs = 5000) {
        retryTimeMs = Math.max(retryTimeMs, 1);
        if (!TcpPortScanner.shouldUseServerMethod(host)) {
            return tcpPortUsed.waitForStatus(port, host, inUse, retryTimeMs, timeOutMs);
        }
        else {
            const opts = new PortStatusArgs(inUse, port, host, checkLocalHostAliaes, retryTimeMs, timeOutMs);
            return TcpPortScanner.waitForPortStatusEx(opts);
        }
    }
    /**
     * Wait for port to open. We always do a minium of one try regardless of timeouts, so setting a timeout
     * of 0 means only one try
     *
     * @return a promise. On failure, the error is Error('timeout') for a true timeout or something else
     * for other failures
     */
    static waitForPortOpen(port, host = TcpPortScanner.DefaultHost, checkLocalHostAliaes = true, retryTimeMs = 100, timeOutMs = 5000) {
        retryTimeMs = Math.max(retryTimeMs, 1);
        if (!TcpPortScanner.shouldUseServerMethod(host)) {
            return tcpPortUsed.waitUntilUsedOnHost(port, host, retryTimeMs, timeOutMs);
        }
        else {
            const opts = new PortStatusArgs(true, port, host, checkLocalHostAliaes, retryTimeMs, timeOutMs);
            return TcpPortScanner.waitForPortStatusEx(opts);
        }
    }
    /**
     * Wait for port to close. We always do a minium of one try regardless of timeouts, so setting a timeout
     * of 0 means only one try
     *
     * @return a promise. On failure, the error is Error('timeout') for a true timeout or something else
     * for other failures
     */
    static waitForPortClosed(port, host = TcpPortScanner.DefaultHost, checkLocalHostAliaes = true, retryTimeMs = 100, timeOutMs = 5000) {
        retryTimeMs = Math.max(retryTimeMs, 1);
        if (!TcpPortScanner.shouldUseServerMethod(host)) {
            return tcpPortUsed.waitUntilFreeOnHost(port, host, retryTimeMs, timeOutMs);
        }
        else {
            const opts = new PortStatusArgs(false, port, host, checkLocalHostAliaes, retryTimeMs, timeOutMs);
            return TcpPortScanner.waitForPortStatusEx(opts);
        }
    }
    static getLocalHostAliases() {
        if (TcpPortScanner.localHostAliases.length === 0) {
            // On Unixes, the first two are treated like true aliases but on Windows
            // you have distint servers on all of them. So, try everything.
            TcpPortScanner.localHostAliases = ['0.0.0.0', '127.0.0.1', ''];
            const ifaces = os.networkInterfaces();
            Object.keys(ifaces).forEach((ifname) => {
                ifaces[ifname].forEach((iface) => {
                    // Skip external interfaces (VPN tunnels, actual IP, etc). Only want loopbacks
                    if (iface.internal && ('ipv4' === iface.family.toLowerCase())) {
                        if (TcpPortScanner.localHostAliases.indexOf(iface.address) === -1) {
                            TcpPortScanner.localHostAliases.push(iface.address);
                        }
                    }
                });
            });
            // console.log(aliases.join(','));
        }
        return TcpPortScanner.localHostAliases;
    }
    /**
     * quick/dirty way of figuring out if this is a local host. guaranteed way would have
     * been to do a dns.resolve() or dns.lookup(). server method only works for local hosts.
     * Client method works for anything but super slow on windows.
     *
     * FIXME: should we use server-method only on windows?
     *
     * @param host an ip-address
     */
    static shouldUseServerMethod(host) {
        if (TcpPortScanner.ForceClientMethod) {
            return false;
        }
        return (!host || (host.toLowerCase() === 'localhost') ||
            (TcpPortScanner.getLocalHostAliases().indexOf(host) >= 0));
    }
}
//
// Strategies: There are two ways we can check/look for open ports or get status
//
// 1. Client: Try to see if we can connect to that port. This is the preferred method
//    because you can probe for remote hosts as well but on Windows each probe on an free
//    port takes 1 second even on localhost
//
// 2. Server: See if we can create a server on that port. It is super fast on all platforms,
//    but, we can only do this on a localhost. We use this method is we can quickly determine
//    if it is a localhost. We also look for ports on its aliases because, you can
//    run servers on some aliases
//
//    CAVEAT: First time you use it, you might get a dialog box warning user that a program
//    is creating a server you will have to allow it. Firewall rules. Connection still succeeds
//    unless there is a compony policy
//
TcpPortScanner.ForceClientMethod = false;
TcpPortScanner.DefaultHost = '0.0.0.0';
TcpPortScanner.OSNetProbeCmd = '';
TcpPortScanner.OSNetProbeCmdRegexpStr = '';
// we cache only ipv4 address and the default ipv6 address for the localhost. All ipv6 aliases
// seem to be true aliases on all systems but ipv4 aliases may or may not be.
TcpPortScanner.localHostAliases = [];
exports.TcpPortScanner = TcpPortScanner;
class PortStatusArgs {
    constructor(desiredStatus, // true means looking for open
    port, host = TcpPortScanner.DefaultHost, checkLocalHostAliases = true, retryTimeMs = 100, timeOutMs = 5000) {
        this.desiredStatus = desiredStatus;
        this.port = port;
        this.host = host;
        this.checkLocalHostAliases = checkLocalHostAliases;
        this.retryTimeMs = retryTimeMs;
        this.timeOutMs = timeOutMs;
        this.startTimeMs = 0;
        this.retryTimeMs = Math.max(this.retryTimeMs, 1);
    }
}
exports.PortStatusArgs = PortStatusArgs;


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "timers":
/*!*************************!*\
  !*** external "timers" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("timers");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=debugadapter.js.map