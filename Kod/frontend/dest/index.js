var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('angular2/common');
var router_1 = require('angular2/router');
var http_1 = require('angular2/http');
var browser_1 = require('angular2/platform/browser');
var core_1 = require('angular2/core');
var app_1 = require('./app/app');
var DefaultRequestOptions = (function (_super) {
    __extends(DefaultRequestOptions, _super);
    function DefaultRequestOptions() {
        _super.call(this);
        this.headers.set("Content-Type", "application/x-www-form-urlencoded");
    }
    DefaultRequestOptions = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DefaultRequestOptions);
    return DefaultRequestOptions;
})(http_1.BaseRequestOptions);
exports.DefaultRequestOptions = DefaultRequestOptions;
browser_1.bootstrap(app_1.App, [
    common_1.FORM_PROVIDERS,
    router_1.ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    core_1.provide(router_1.LocationStrategy, { useClass: router_1.PathLocationStrategy }),
    core_1.provide(http_1.RequestOptions, { useClass: DefaultRequestOptions })
]);
//# sourceMappingURL=index.js.map