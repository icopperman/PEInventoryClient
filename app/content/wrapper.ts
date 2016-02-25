import {Component, OnInit   } from 'angular2/core';
import {NgSwitch, NgSwitchWhen, FORM_DIRECTIVES} from 'angular2/common';

import Dictionary = _.Dictionary;

import {lsName} from "./../appcommon";
import {showAlert} from "./../appcommon";
import {peSvcUrl} from "./../appcommon";
import {invokeSvc} from "./../appcommon";
import {getDataService} from "./../getData.service";
import {getLocalDataService} from "./../getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./../interfaces";
import {LoginData, Unit, Units} from "./../interfaces";
import {sidebar} from './sidebar/sidebar';
import {Content} from './tables/content';

@Component({

    selector: 'wrapper',
    templateUrl: 'app/content/wrapper.html',
    providers: [getDataService, getLocalDataService],
    directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, sidebar, Content]

})
export class Wrapper implements OnInit {

    loggedInUser:LocalLoginData = null;

    constructor(public _ls:getLocalDataService, public _ds:getDataService) {
        console.log('sidebar constructor');

    }


    ngOnInit() {
        var isLoggedIn:boolean = this.verifyLogin();
        console.log('sidebar oninit: ' + this.loggedInUser.preferredCampus);

        if (isLoggedIn == false) {

            window.location.href = "http://" + window.location.host + "/login.html";

        }
    }

    unitSelected(aunit: Unit) {

        console.log('here');
    }

    verifyLogin():boolean {

        var rc:boolean = true;

        this.loggedInUser = this._ls.getLocalData(lsName, 'verifylogin');
        //    window.localStorage.getItem(lsName);

        if (this.loggedInUser == null) {

            console.log('no login');

            rc = false;

        }
        else {

            //this.loggedInUser = JSON.parse(xx);
            var loginTime = this.loggedInUser.loginTime;
            var currTime = new Date().getTime();
            var diff = currTime - loginTime;

            console.log("time after login " + diff);

            if (diff > 300000) {

                console.log("too long after login " + diff);
                rc = false;

            }

            rc = true;
        }

        return rc;
    }
}