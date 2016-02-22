import {Component, OnInit } from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';


//import * as _ from 'lodash';
//import * as $ from 'jquery';

//import _ from 'lodash';
//import $ from 'jquery';

//import 'bootstrap/js/bootstrap.js';

import {lsName, showAlert, peSvcUrl, invokeSvc} from "../appcommon";
import {getDataService} from "../getData.service";
import {getLocalDataService} from "../getLocalData.service";
import {LocalLoginData, LoginData} from "../interfaces";

@Component({

    selector: 'loginForm',
    templateUrl: 'app/login/loginForm.html',
    providers: [getDataService, getLocalDataService]

})
export class LoginComponent implements OnInit {

    sloginTime:number;
    eloginTime:number;

    constructor(
        public _ds:getDataService,
        public _ls: getLocalDataService,
        public _router: Router
    ) {
        console.log('login component constructor');
    }

    ngOnInit() {
        console.log('Logincomponent oninit');
    }

    doLogin = (u:string, p:string) => {

        //var u = $("#username").val();
        //var p = $("#password").val();

        var u = "irc9012";// $("#username").val();
        var p = "Word17nyh";//$("#password").val();


        if (( _.isEmpty(u) == true ) || ( _.isEmpty(p) == true )) {

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

            this._ds.getData(url, "POST", auser)
                .subscribe(this.parseLoginData, this.parseLoginDataErr);
            //invokeSvc(url, "POST", auser, this.parseLoginData);

        }

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

            this._ls.setLocalData(lsName, o );
            //window.localStorage.setItem(lsName, JSON.stringify(o));

            var page = "grid.html";
            //window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + page;
            this._router.navigate(['Content']);
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

    parseLoginDataErr = (data:LoginData) => {

        var msg = "Invalid cwid and/or password";

        if (data.ErrMsg.indexOf('exception') != -1) {

            msg = "Communications error, please contact support";
        }

        showAlert(msg, "glyphicon-exclamation-sign", "alert-danger");

        $("#btnSubmit").button('reset');
        $("#btnSubmit").prop("disabled", false);
        $("#btnSubmit").css("cursor", "pointer");

    };

    logReady() {

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
}

//var x = new Login("hello");

//x.logReady();


