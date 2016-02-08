import {Component, OnInit   } from 'angular2/core';
import {NgSwitch, NgSwitchWhen, FORM_DIRECTIVES} from 'angular2/common';

import Dictionary = _.Dictionary;

import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";
import {getDataService} from "./getData.service";
import {getLocalDataService} from "./getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./interfaces";
import {LoginData, Unit, Units} from "./interfaces";
import {Content} from './content';
import {sidebar} from './sidebar';

@Component({

    selector: 'wrapper',
    templateUrl: 'app/wrapper.html',
    providers: [getDataService, getLocalDataService],
    directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, sidebar, Content]

})
export class wrapper implements OnInit {

   // loggedInUser:LocalLoginData = null;

   // constructor(public _ls:getLocalDataService, public _ds:getDataService) {
   //     console.log('sidebar constructor');
//
  //  }


    ngOnInit() {
    }

    unitSelected(aunit: Unit) {

        console.log('here');
    }
}
