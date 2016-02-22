import {bootstrap} from 'angular2/platform/browser';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

import {sidebar} from './content/sidebar/sidebar';
import {listOfUnits} from './content/sidebar/listOfUnits';
import {Content} from './content/tables/content';
import {Wrapper} from './content/wrapper';

console.log('bootgrid boot');
bootstrap(Wrapper, [Http, HTTP_PROVIDERS]);

