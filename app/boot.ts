import {bootstrap} from 'angular2/platform/browser';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

import {Index} from './index';

bootstrap(Index, [Http, HTTP_PROVIDERS]);

