import {bootstrap} from 'angular2/platform/browser';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

import {sidebar} from './sidebar';

console.log('bootgrid boot');
bootstrap(sidebar, [Http, HTTP_PROVIDERS]);

