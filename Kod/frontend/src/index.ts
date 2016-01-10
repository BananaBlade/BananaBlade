
import { FORM_PROVIDERS } from 'angular2/common';
import { ROUTER_PROVIDERS, Location, LocationStrategy, HashLocationStrategy } from 'angular2/router';
import { HTTP_PROVIDERS, RequestOptions, BaseRequestOptions } from 'angular2/http';
import { bootstrap } from 'angular2/platform/browser';
import { provide, Injectable } from 'angular2/core';

import { App } from './App/App';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {
    constructor() {
        super();
        this.headers.set("Content-Type", "application/x-www-form-urlencoded");
        this.body = encodeURI(JSON.stringify({'': this.body}));
    }
}

bootstrap(
    App,
    [
        FORM_PROVIDERS,
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        provide(LocationStrategy, { useClass: HashLocationStrategy }),
        provide(RequestOptions, { useClass: DefaultRequestOptions })
    ]
);