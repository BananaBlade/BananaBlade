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
var router_1 = require('angular2/router');
var angular2_jwt_1 = require('angular2-jwt');
var AccountDelete = (function () {
    function AccountDelete() {
    }
    AccountDelete = __decorate([
        core_1.Component({
            selector: 'AccountDelete'
        }),
        core_1.View({
            templateUrl: './dest/Settings/AccountDelete/AccountDelete.html'
        }),
        router_1.CanActivate(function () { return angular2_jwt_1.tokenNotExpired(); }), 
        __metadata('design:paramtypes', [])
    ], AccountDelete);
    return AccountDelete;
})();
exports.AccountDelete = AccountDelete;
//# sourceMappingURL=AccountDelete.js.map