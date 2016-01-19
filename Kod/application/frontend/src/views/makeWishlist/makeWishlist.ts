
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';

@Component({
  selector: 'MakeWishlist',
  templateUrl: './dest/views/makeWishlist/makeWishlist.html'
})
export class MakeWishlist {
    editable : boolean = false;
}
