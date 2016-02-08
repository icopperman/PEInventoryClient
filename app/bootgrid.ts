import {bootstrap} from 'angular2/platform/browser';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

import {sidebar} from './sidebar';
import {listOfUnits} from './listOfUnits';
import {Content} from './content';
import {wrapper} from './wrapper';

console.log('bootgrid boot');
bootstrap(wrapper, [Http, HTTP_PROVIDERS]);

