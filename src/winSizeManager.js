(function (win, doc, exports) {

    'use strict';

    var WinSizeManager = (function () {
    
        var instance,
            events = {};

        function WinSizeManager() {
        
            if (instance) {
                return instance;
            }

            $(window).resize($.proxy(this._onResize, this));

            instance = this;
        }

        WinSizeManager.fn = WinSizeManager.prototype = {
            add: function (range, callback, context) {
            
                var c, sp, query, type;

                query = range.replace(/\s+/ig, '');
                dir   = query.charAt(0);
                type  = query.slice(-1);
                if (dir === '>' || dir === '<') {
                    query = query.slice(1, query.length);
                }
                else {
                    query = query.slice(1);
                }
                sp    = query.split('-');

                if (!(c === '>' || c === '<' || (sp[1] || (type === 'w' || type === 'h')))) {
                    return false;
                }

                (events[range] || (events[range] = [])).push([callback, (context || callback), type]);
            },
            _onResize: function (e) {
            
                var evts = events,
                    dist = 0,
                    types = {
                        h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                        w: window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth
                    },
                    key, tmp,
                    fns,
                    dir, range, startRange, endRange, chk, type,
                    i, l;

                for (key in evts) if (evts.hasOwnProperty(key)) {
                    dir = key.charAt(0);
                    type = key.slice(-1);
                    if (/^[<>]/.test(dir)) {
                        range = key.slice(1, -1);
                    }
                    else {
                        range = key.slice(0, -1);
                    }
                    fns = evts[key];

                    if (dir === '<') {
                        startRange = 0;
                        endRange  = Number(range) - 1;
                    }
                    else if (dir === '>') {
                        startRange = Number(range) + 1;
                        endRange   = types[type];
                    }
                    else {
                        tmp = range.split('-');
                        dir = '-';
                        startRange = Number(tmp[0]);
                        endRange   = Number(tmp[1]);
                    }

                    chk = (types[type] >= startRange && types[type] <= endRange);
                    i = 0;
                    l = fns.length;

                    if (!chk) {
                        continue;
                    }

                    for (; i < l; i++) {
                        fns[i][0].call(fns[i][1], {
                            type: type,
                            currentRange: types[type],
                            startRange: startRange,
                            endRange: endRange,
                            direction: dir
                        });
                    }
                }
            },
            remove: function (range, callback) {
            
                var evts = events,
                    fns,
                    key,
                    i, l,
                    ret;

                range = range.replace(/\s+/ig, '');

                for (key in evts) if (evts.hasOwnProperty(key)) {
                    fns = evts[key];
                    ret = [];
                    i   = 0;
                    l   = fns.length;

                    if (key !== range) {
                        continue;
                    }

                    for (; i < l; i++) {
                        if (fns[i][0] !== callback) {
                            ret.push(fns[i]);
                        }
                    }

                    evts[key] = ret;
                }
            }
        };

        return WinSizeManager;
    }());


    /*! -------------------------------------------------------
        EXPORTS
    ----------------------------------------------------------- */
    exports.WinSizeManager = WinSizeManager;

}(window, document, window);
