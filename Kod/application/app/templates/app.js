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
var http_1 = require('angular2/http');
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var listen_1 = require('./user/listen');
var wishlist_1 = require('./user/wishlist');
var settings_1 = require('./user/settings');
var AppComponent = (function () {
    function AppComponent(router, location) {
        this.router = router;
        this.location = location;
    }
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'sartzapp',
            templateUrl: "./navbar.html",
            directives: [listen_1.Listen, wishlist_1.Wishlist, settings_1.Settings, router_1.ROUTER_DIRECTIVES]
        }),
        router_1.RouteConfig([
            new router_1.Route({ path: '/', component: listen_1.Listen, as: 'Listen' }),
            new router_1.Route({ path: '/wishlist', component: wishlist_1.Wishlist, as: 'Wishlist' }),
            new router_1.Route({ path: '/settings', component: settings_1.Settings, as: 'Settings' })
        ]), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
})();
angular2_1.bootstrap(AppComponent, [router_1.ROUTER_PROVIDERS, http_1.HTTP_PROVIDERS,
    angular2_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })]);
