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
var core_1 = require("angular2/core");
var common_1 = require("angular2/common");
var router_1 = require('angular2/router');
var HeaderBar_1 = require('../App/HeaderBar');
var RoutingProvider_1 = require('../App/RoutingProvider');
var App = (function () {
    function App(router) {
        this.router = router;
        this.navigation = RoutingProvider_1.getNavigationArray();
        for (var i = 0; i < this.navigation.length; ++i) {
            this.navigation[i].visible = true;
        }
    }
    App.prototype.hideGroup = function (group) {
        group.visible = !group.visible;
    };
    ;
    App = __decorate([
        core_1.Component({
            selector: 'App',
            templateUrl: './dest/App/App.html',
            styles: [],
            directives: [router_1.ROUTER_DIRECTIVES, common_1.COMMON_DIRECTIVES, HeaderBar_1.HeaderBar]
        }),
        router_1.RouteConfig(RoutingProvider_1.getRouteConfig()), 
        __metadata('design:paramtypes', [router_1.Router])
    ], App);
    return App;
})();
exports.App = App;
//# sourceMappingURL=app.js.map