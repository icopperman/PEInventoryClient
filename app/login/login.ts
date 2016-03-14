import {Component, OnInit } from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import 'rxjs/Rx';

//import * as _ from 'lodash';
//import * as $ from 'jquery';

//import _ from 'lodash';
//import $ from 'jquery';

//import 'bootstrap/js/bootstrap.js';

import {lsName, showAlert, peSvcUrl, invokeSvc } from "../Utilities/appcommon";
import {getDataService} from "../Utilities/getData.service";
import {getLocalDataService} from "../Utilities/getLocalData.service";
import {LocalLoginData, LoginData, Unit, Units} from "../Utilities/interfaces";

//import Observable = Rx.Observable;

@Component({

    selector: 'loginForm',
   // templateUrl: 'app/login/loginForm.html',
    providers: [getDataService, getLocalDataService]

})
export class LoginComponent implements OnInit {

    sloginTime:number;
    eloginTime:number;
 //   obUnits: any;

    constructor(
        public _ds:getDataService,
        public _ls: getLocalDataService,
        public _router: Router
    ) {
        console.log('login component constructor ' + lsName);
    }

    ngOnInit() {

        console.log('Logincomponent oninit ' + lsName);

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

            this.sloginTime = new Date().getTime();

            var auser    = {UserName: u, Password: p};
            var url      = peSvcUrl + "login";
            let obLogin  = this._ds.getData(url, "POST", auser);
            
            obLogin.subscribe(
                    data => { this.parseLoginData(  data) },
                    err =>  { this.parseLoginDataErr( err) }
                );
            //invokeSvc(url, "POST", auser, this.parseLoginData);


        }

    };

    parseLoginData = (/*lss: getLocalDataService, dss: getDataService,*/ data:LoginData) => {

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
                loginTime: currTime,
                allUnits: null

            };

            //var page = "xgrid.html";
            //window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + page;

            this._ls.setLocalData(lsName, o );

            this._router.navigate(['Wrapper']);
            //invokeSvc(url, "GET", null, parseAllUnitsData);




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


