import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { AuthService } from '../../services/authService';
import { UsersCount } from '../../components/stats/usersCount/usersCount'
import { AdminsList } from '../../components/stats/adminsList/adminsList'
import { GlobalWishlist } from '../../components/stats/globalWishlist/globalWishlist'
import { PopularTrack } from '../../components/stats/popularTrack/popularTrack'

@Component({
    selector: 'ShowStats',
    templateUrl: './dist/views/showStats/showStats.html',
    directives: [ COMMON_DIRECTIVES, UsersCount, AdminsList, GlobalWishlist, PopularTrack ]
})
export class ShowStats {
    authService : AuthService;

    constructor( authService : AuthService ){
        this.authService = authService;
    }
}
