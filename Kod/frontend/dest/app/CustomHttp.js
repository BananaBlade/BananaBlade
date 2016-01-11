var http_1 = require('angular2/http');
var CustomHttp = (function () {
    function CustomHttp(angularHttp) {
        this.angularHttp = angularHttp;
    }
    CustomHttp.prototype.post = function (url, body, options) {
        this.angularHttp.post(url, new http_1.URLSearchParams(body).toString(), options);
    };
    return CustomHttp;
})();
exports.CustomHttp = CustomHttp;
//# sourceMappingURL=CustomHttp.js.map