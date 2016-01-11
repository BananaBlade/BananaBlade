var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var http_1 = require('angular2/http');
require('rxjs/Rx');
var UrlEncoder_1 = require('../App/UrlEncoder');
var HeaderBar = (function () {
    function HeaderBar(fb, http) {
        this.http = http;
        this.email = new common_1.Control('', common_1.Validators.required);
        this.password = new common_1.Control('', common_1.Validators.required);
        this.loginForm = fb.group({
            'email': this.email,
            'password': this.password
        });
    }
    HeaderBar.prototype.onSubmit = function (value) {
        var data = { 'email': this.emailModel, 'password': this.passwordModel };
        this.http.post('http://localhost:5000/user/auth/login', UrlEncoder_1.urlEncode(data))
            .map(function (res) { return res.json(); }).map(function (text) {
            console.log('map');
            console.log(text);
            return text;
        }).subscribe(function (val) {
            console.log('subscribe');
            console.log(val);
        });
    };
    HeaderBar = __decorate([
        core_1.Component({
            selector: 'header-bar',
            templateUrl: './dest/App/HeaderBar.html',
            styles: [],
            directives: [common_1.FORM_DIRECTIVES, common_1.COMMON_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http])
    ], HeaderBar);
    return HeaderBar;
})();
exports.HeaderBar = HeaderBar;
//# sourceMappingURL=HeaderBar.js.map