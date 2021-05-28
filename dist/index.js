Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var useFavicon = function (_a) {
    var icon = _a.icon, emoji = _a.emoji, awayEmoji = _a.awayEmoji;
    var _b = react.useState(true), isNotification = _b[0], setIsNotification = _b[1];
    var _c = react.useState(false), isAway = _c[0], setIsAway = _c[1];
    react.useEffect(function () {
        var favicon = document.querySelector("link[rel='icon']");
        if (!favicon)
            return;
        if (icon)
            favicon.setAttribute("href", icon);
    }, [isNotification]);
    react.useEffect(function () {
        var favicon = document.querySelector("link[rel='icon']");
        if (!favicon)
            return;
        if (emoji) {
            favicon.setAttribute("href", "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text y=\".9em\" font-size=\"90\">" + (isAway ? awayEmoji : emoji) + "</text></svg>");
        }
    }, [isAway]);
    react.useEffect(function () {
        var toggleIsAway = function () { return setIsAway(function (prev) { return !prev; }); };
        document.addEventListener("visibilitychange", toggleIsAway);
    }, []);
    return {
        triggerNotification: react.useCallback(function () { return setIsNotification(true); }, []),
        clearNotification: react.useCallback(function () { return setIsNotification(false); }, []),
    };
};

exports.default = useFavicon;
//# sourceMappingURL=index.js.map
