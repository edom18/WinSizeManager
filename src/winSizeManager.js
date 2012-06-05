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
            
                var c;

                range = range.replace(/\s+/ig, '');
                c = range.charAt(0);

                if (!(c === '>' || c === '<')) {
                    return false;
                }

                (events[range] || (events[range] = [])).push([callback, (context || callback)]);
            },
            _onResize: function (e) {
            
                var evts = events,
                    h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                    key,
                    fns,
                    dir, range, chk,
                    i, l;

                for (key in evts) if (evts.hasOwnProperty(key)) {
                    range = Number(key.slice(1));
                    dir = key.charAt(0);
                    chk = (dir === '<') ? (h < range) : (h > range);
                    fns = evts[key];
                    i = 0;
                    l = fns.length;

                    if (!chk) {
                        continue;
                    }

                    for (; i < l; i++) {
                        fns[i][0].call(fns[i][1], {
                            currentHeight: h,
                            range: range,
                            direction: dir
                        });
                    }
                }
            },
            remove: function (range, callback) {
            
            }
        };

        return WinSizeManager;
    }());

    /*! -------------------------------------------------------
        EXPORTS
    ----------------------------------------------------------- */
    exports.WinSizeManager = WinSizeManager;

}(window, document, window);
