///<reference path='../typings/tsd.d.ts'/>
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var http_1 = require('angular2/http');
var app_1 = require('./app/app');
angular2_1.bootstrap(app_1.App, [
    angular2_1.FORM_PROVIDERS,
    router_1.ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS
]);
