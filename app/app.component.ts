import {Component } from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {LoginComponent} from "./login/login";
import {AWrapperComponent} from './awrapper';

@Component({
    selector: 'inventory-app',
    template: `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
@RouteConfig([

   { path: '/login', name: 'Login', component: LoginComponent, useAsDefault: true }
 //   ,{ path: '/awrapper/...', name: 'AWrapper', component: AWrapperComponent }
 //  ,{ path: '/content', name: 'Content', component: Wrapper }
]


)
export class AppComponent {

    constructor() {

        console.log('in appcomponent constructor');
    }
}
