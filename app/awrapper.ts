import {Component, OnInit   } from '../node_modules/angular2/core';
import {NgSwitch, NgSwitchWhen, FORM_DIRECTIVES} from '../node_modules/angular2/common';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '../node_modules/angular2/router';

import Dictionary = _.Dictionary;

import {lsName, invokeSvc, peSvcUrl, showAlert} from "./Utilities/appcommon";

import {getDataService} from "./Utilities/getData.service";
import {getLocalDataService} from "./Utilities/getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./Utilities/interfaces";
import {LoginData, Unit, Units} from "./Utilities/interfaces";
import {SideBarComponent} from './content/sidebar/sidebar';
import {ContentComponent} from './content/tables/content';

@Component({

    selector: 'wrapper',
    templateUrl: 'app/content/awrapper.html',
    providers: [getDataService, getLocalDataService],
    directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, SideBarComponent, ContentComponent]

})
@RouteConfig([
        { path: '/', name: 'SideBar', component: SideBarComponent, useAsDefault: true }
       ,{ path: './tables/content:id', name: 'Content', component: ContentComponent }
    ]
)
export class AWrapperComponent implements OnInit {

    loggedInUser:LocalLoginData = null;

    constructor(public _ls:getLocalDataService, public _ds:getDataService,
                public _rp:RouteParams) {
        console.log('wrapper constructor ' + lsName);

    }


    ngOnInit() {

        // let ob = this._rp.get('obs');

        console.log('wrapper oninit: ' );//+ this.loggedInUser.preferredCampus);

        //var isLoggedIn:boolean = this.verifyLogin();
        //
        //if (isLoggedIn == false) {
        //
        //    window.location.href = "http://" + window.location.host + "/login.html";
        //
        //}
    }
}

//    unitSelected(aunit: Unit) {
//
//        console.log('here');
//    }
//
//    verifyLogin():boolean {
//
//        var rc:boolean = true;
//
//        this.loggedInUser = this._ls.getLocalData(lsName, 'verifylogin');
//        //    window.localStorage.getItem(lsName);
//
//        if (this.loggedInUser == null) {
//
//            console.log('no login');
//
//            rc = false;
//
//        }
//        else {
//
//            //this.loggedInUser = JSON.parse(xx);
//            var loginTime = this.loggedInUser.loginTime;
//            var currTime = new Date().getTime();
//            var diff = currTime - loginTime;
//
//            console.log("time after login " + diff);
//
//            if (diff > 300000) {
//
//                console.log("too long after login " + diff);
//                rc = false;
//
//            }
//
//            rc = true;
//        }
//
//        return rc;
//    }
//}
