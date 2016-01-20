import {Component, OnInit } from 'angular2/core';
import {NgForm} from 'angular2/common';

//import * as _ from 'lodash';
//import * as $ from 'jquery';

//import _ from 'lodash';
//import $ from 'jquery';

//import 'bootstrap/js/bootstrap.js';

import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";
import {getDataService} from "./getData.service";

interface LoginData {

    ErrMsg: string;
    PreferredCampus: string;
    PreferredUnit: string;
    Status: string;
    UserName: string;
    idxLogin: string;
    idxUser: string;
    isAdmin: string;
    timeCwid: string;
    timeDb: string;
    timePswd: string;

}

export interface LocalLoginData {

    user: string;
    preferredCampus: string;
    preferredUnit: string;
    idxUser: string;
    idxLogin: string;
    isAdmin: string;
    loginTime: number;
}

@Component({

    selector: 'loginForm',
    templateUrl: 'app/loginForm.html',
    providers: [getDataService]

})
export class Index implements OnInit{

    sloginTime:number;
    eloginTime:number;

    constructor(private _getDataSvc: getDataService) {

        console.log('index constructor');

    }

    ngOnInit() {

        console.log('Index oninit');
    }

    doLogin = (u:string, p: string) => {

        //var u = $("#username").val();
        //var p = $("#password").val();

        var u = "irc9012";// $("#username").val();
        var p = "Word16nyh";//$("#password").val();


        if ( ( _.isEmpty(u) == true ) || ( _.isEmpty(p) == true ) ) {

            showAlert("Please enter all fields", "glyphicon-exclamation-sign");

        }
        else {

            showAlert("Logging in....", "glyphicon-info-sign", "alert-info");

            //$("#btnSubmit").prop("disabled", true);
            //$("#btnSubmit").css("cursor", "wait");

            var auser = {UserName: u, Password: p};

            //var url = "http://" + window.location.host + "/login";

            var url = peSvcUrl + "login";

            this.sloginTime = new Date().getTime();

            this._getDataSvc.getData(url, "POST", auser)

            //invokeSvc(url, "POST", auser, this.parseLoginData);

        }

    };

    logReady = () => {

        console.log('hee');

        $(document).ready(() => {

            //$("#btnSubmit").on("click", this.doLogin);
            $('.container').keypress((e:KeyboardEvent) => {
                if (e.which == 13) {

                 //   this.doLogin();
                }
            });

        }); //end doc ready
    };

    parseLoginData = (data:LoginData) => {

        this.eloginTime = new Date().getTime();
        var diff:number = (this.eloginTime - this.sloginTime) / 1000;

        if (data.Status == "ok") {

            console.log(diff + "," + data.timeCwid + "," + data.timePswd + "," + data.timeDb);
            var currTime:number = new Date().getTime();

            var o:LocalLoginData = {
                user: data.UserName,
                preferredCampus: data.PreferredCampus,
                preferredUnit: data.PreferredUnit,
                idxUser: data.idxUser,
                idxLogin: data.idxLogin,
                isAdmin: data.isAdmin,
                loginTime: currTime

            };

            window.localStorage.setItem(lsName, JSON.stringify(o));

            var page = "index.html";
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + page;

        }
        else {

        var msg = "Invalid cwid and/or password";

        if (data.ErrMsg.indexOf('exception') != -1) {

            msg = "Communications error, please contact support";
        }

        showAlert(msg, "glyphicon-exclamation-sign", "alert-danger");

            $("#btnSubmit").button('reset');
            $("#btnSubmit").prop("disabled", false);
            $("#btnSubmit").css("cursor", "pointer");

        }

    };

}

//var x = new Login("hello");

//x.logReady();


