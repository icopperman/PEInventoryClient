import {bootstrap} from 'node_modules/angular2/platform/browser.d';
import {Http, HTTP_PROVIDERS} from 'node_modules/angular2/http.d';

import {SideBarComponent} from './app/content/sidebar/sidebar';
import {listOfUnits} from './app/content/sidebar/listOfUnits';
import {ContentComponent} from './app/content/tables/content';
import {WrapperComponent} from './app/awrapper';

console.log('bootgrid boot');
bootstrap(WrapperComponent, [Http, HTTP_PROVIDERS]);

