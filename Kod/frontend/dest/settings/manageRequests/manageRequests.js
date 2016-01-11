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
var ManageRequests = (function () {
    function ManageRequests() {
    }
    ManageRequests = __decorate([
        core_1.Component({
            selector: 'ManageRequests'
        }),
        core_1.View({
            templateUrl: './dest/Settings/ManageRequests/ManageRequests.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ManageRequests);
    return ManageRequests;
})();
exports.ManageRequests = ManageRequests;
//# sourceMappingURL=manageRequests.js.map