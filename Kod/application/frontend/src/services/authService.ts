import { Injectable, Injector, Inject, provide } from 'angular2/core';

import { HttpAdvanced } from './../services/services';

let ACCOUNT_TYPE: string = "accountType";

let UNLOGGED = '-1';
let USER = '1';
let EDITOR = '2';
let ADMIN = '3';
let OWNER = '4';

@Injectable()
export class AuthService {
    private http: HttpAdvanced;
    public isLoggedIn: boolean;
    public userRole: string;
    public userName: string;

    public accountType: number = 0;

    constructor(http: HttpAdvanced) {
        this.http = http;
        console.log("CONS");
        this.storeUserAuthentication();
    }

    storeUserAuthentication(callback?: Function) {
        this.http.get('/user/account/type', (res) => {
            if (res.account_type && res.account_type > 0) sessionStorage.setItem(ACCOUNT_TYPE, res.account_type);
            else if (res.account_type === 0) sessionStorage.setItem(ACCOUNT_TYPE, UNLOGGED);
            if (callback) callback();
        });
    }

    isInitialized() {
        return !!sessionStorage.getItem(ACCOUNT_TYPE);
    }

    getAuthLevel() {
        //if (!this.isInitialized()) this.storeUserAuthentication();
        return sessionStorage.getItem(ACCOUNT_TYPE);
    }

    isLoggedInFn() {
        return this.isUser() || this.isEditor() || this.isAdmin() || this.isOwner();
    }

    isUser() {
        return this.getAuthLevel() == USER;
    }

    isEditor() {
        return this.getAuthLevel() == EDITOR;
    }

    isAdmin() {
        return this.getAuthLevel() == ADMIN;
    }

    isOwner() {
        return this.getAuthLevel() == OWNER;
    }

    static isUserInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isUser();
    }
    static isEditorInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isEditor();
    }
    static isAdminInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isAdmin();
    }
    static isOwnerInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isOwner();
    }

    /*
     * Moved from Header Bar
     */

    updateLoginStatus() {
        console.log("UPD");
        this.isLoggedIn = this.isLoggedInFn();
        this.storeUserAuthentication(() => {
            this.isLoggedIn = this.isLoggedInFn();

            if (this.isLoggedInFn()) {
                this.http.getNoError('/user/account/get', (data) => {
                    this.userName = data.first_name + ' ' + data.last_name;
                    let role = data.account_type;
                    this.accountType = role;
                    if (role == 1) this.userRole = "korisnik";
                    if (role == 2) this.userRole = "urednik";
                    if (role == 3) this.userRole = "administrator";
                    if (role == 4) this.userRole = "vlasnik";
                });
            }
        });
    }

    logout(callback?: Function) {
        if (this.isLoggedInFn()) {
            this.http.getNoError('/user/auth/signout', () => {
                this.isLoggedInFn();
                this.storeUserAuthentication(callback);
            });
        }
    }

    loginX(mail: string, password: string) {
        console.log(this.isLoggedInFn());
        if (this.isLoggedInFn()) {
            this.logout(() => {
                this.http.postWithRes('/user/auth/login', { email: mail, password: password }, () => {
                    this.updateLoginStatus();
                });
            });
        }
        else {
            this.http.postWithRes('/user/auth/login', { email: mail, password: password }, () => {
                this.updateLoginStatus();
            });
        }
    }

    loginAdmin() {
        this.loginX('dito@dito.ninja', '1dominik');
    }

    loginOwner() {
        this.loginX('xdwarrior@gmail.com', 'NeprobojnaLozinka');
    }

    loginEditor() {
        this.loginX('dominik.ivosevic@gmail.com', '1dominik');
    }
    loginUser() {
        this.loginX('dominik.ivosevic@dito.ninja', '1dominik');
    }
}
