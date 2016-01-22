
import { FORM_PROVIDERS, FormBuilder } from 'angular2/common';
import { ROUTER_PROVIDERS, Location, LocationStrategy, PathLocationStrategy } from 'angular2/router';
import { HTTP_PROVIDERS, RequestOptions, BaseRequestOptions } from 'angular2/http';
import { bootstrap } from 'angular2/platform/browser';
import { provide, Injectable } from 'angular2/core';

import { App } from './app';

import { AuthService, MsgService, HttpAdvanced, FormBuilderAdvanced, MsgServiceInternal } from './services/services';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {
    constructor() {
        super();
        this.headers.set("Content-Type", "application/x-www-form-urlencoded");
    }
}

bootstrap(
    App,
    [
        FORM_PROVIDERS,
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        provide(LocationStrategy, { useClass: PathLocationStrategy }),
        provide(RequestOptions, { useClass: DefaultRequestOptions }),
        MsgService,
        MsgServiceInternal,
        HttpAdvanced,
        AuthService,
        FormBuilderAdvanced
        // provide(MsgService, { useClass: MsgService }),
        // provide(HttpAdvanced, { useClass: HttpAdvanced }),
        // provide(AuthService, { useFactory: (HttpAdvanced) => new AuthService(HttpAdvanced), deps: [HttpAdvanced] }),
        // provide(FormBuilderAdvanced, { useFactory: (FormBuilder, HttpAdvanced) => new FormBuilderAdvanced(FormBuilder, HttpAdvanced), deps: [FormBuilder, HttpAdvanced] }),
        // provide(MsgService, { useClass: MsgService }),
        // provide(MsgServiceInternal, { useClass: MsgServiceInternal })
    ]
);