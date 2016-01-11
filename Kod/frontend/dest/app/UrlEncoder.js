var http_1 = require('angular2/http');
function urlEncode(obj) {
    var urlSearchParams = new http_1.URLSearchParams();
    for (var key in obj) {
        urlSearchParams.append(key, obj[key]);
    }
    return urlSearchParams.toString();
}
exports.urlEncode = urlEncode;
//# sourceMappingURL=UrlEncoder.js.map