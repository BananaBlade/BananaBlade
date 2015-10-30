import {Component} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'Wishlist',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: '../templates/user/wishlist.html'
})

export class Wishlist {
  id: string;
  constructor(params: RouteParams) {
    this.id = params.get('id');
  }
}
