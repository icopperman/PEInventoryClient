import {bootstrap} from 'angular2/platform/browser';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

import {SideBarComponent} from './content/sidebar/sidebar';
import {listOfUnits} from './content/sidebar/listOfUnits';
import {ContentComponent} from './content/tables/content';
import {WrapperComponent} from './content/wrapper';

console.log('bootgrid boot');
bootstrap(WrapperComponent, [Http, HTTP_PROVIDERS]);

