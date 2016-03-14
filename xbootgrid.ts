import {bootstrap} from './node_modules/angular2/platform/browser';
import {Http, HTTP_PROVIDERS} from './node_modules/angular2/http';

import {SideBarComponent} from './app/content/sidebar/sidebar';
import {listOfUnits} from './app/content/sidebar/listOfUnits';
import {ContentComponent} from './app/content/tables/content';
import {AWrapperComponent} from './app/awrapper';

console.log('bootgrid boot');
bootstrap(AWrapperComponent, [Http, HTTP_PROVIDERS]);

