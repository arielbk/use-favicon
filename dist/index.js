Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var useFavicon = function (_a) {
    var icon = _a.icon;
    var letterIndex = react.useState(0)[0];
    var _b = react.useState(true), isNotification = _b[0], setIsNotification = _b[1];
    react.useEffect(function () {
        var favicon = document.querySelector("link[rel='icon']");
        if (favicon)
            favicon.setAttribute("href", icon);
    }, [letterIndex, isNotification]);
    return {
        triggerNotification: react.useCallback(function () { return setIsNotification(true); }, []),
        clearNotification: react.useCallback(function () { return setIsNotification(false); }, []),
    };
};

exports.default = useFavicon;
//# sourceMappingURL=index.js.map
