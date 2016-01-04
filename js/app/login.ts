import * as _ from 'lodash';
import $ from 'jquery';

import 'bootstrap/js/bootstrap.js';

import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";

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


class Login {

    sloginTime:number;
    eloginTime:number;

    constructor(msg:string) {

        console.log(msg);

    }


    doLogin = () => {

        //var u = $("#username").val();
        //var p = $("#password").val();

        var u = "irc9012";// $("#username").val();
        var p = "Word16nyh";//$("#password").val();


        if ( ( _.isEmpty(u) == true ) || ( _.isEmpty(p) == true ) ) {

            showAlert("Please enter all fields", "glyphicon-exclamation-sign");

        }
        else {

            showAlert("Logging in....", "glyphicon-info-sign", "alert-info");

            $("#btnSubmit").prop("disabled", true);
            $("#btnSubmit").css("cursor", "wait");

            var auser = {UserName: u, Password: p};

            //var url = "http://" + window.location.host + "/login";

            var url = peSvcUrl + "login";

            this.sloginTime = new Date().getTime();

            invokeSvc(url, "POST", auser, this.parseLoginData);

        }

    };

    logReady = () => {

        console.log('hee');

        $(document).ready(() => {

            $("#btnSubmit").on("click", this.doLogin);
            $('.container').keypress((e:KeyboardEvent) => {
                if (e.which == 13) {

                    this.doLogin();
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

            //var page = (window.location.search != '?q=2') ? "/stats.html" : "/index.html";
            //var page = (o.isAdmin == 'Y') ? "/stats.html" : "/index.html";
            var page = "index.html";
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "index.html";

        }
        else {

            showAlert("Invalid cwid and/or password", "glyphicon-exclamation-sign", "alert-danger");

            $("#btnSubmit").button('reset');
            $("#btnSubmit").prop("disabled", false);
            $("#btnSubmit").css("cursor", "none");

        }

    };

}

var x = new Login("hello");

x.logReady();


