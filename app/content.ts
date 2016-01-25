import {Component, OnInit } from 'angular2/core';
import {NgForm} from 'angular2/common';


import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";
import {getDataService} from "./getData.service";
import {getLocalDataService} from "./getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./interfaces";
import {LoginData, Unit, Units} from "./interfaces";

@Component({

    selector: 'content',
    templateUrl: 'app/content.html',
    providers: [getDataService, getLocalDataService]

})
export class Content implements OnInit {

    loggedInUser:LocalLoginData = null;

    constructor(public _ls: getLocalDataService) {

    }

    ngOnInit() {

        console.log('Index oninit');

        $("#btnLogoff").on("click", this.doLogoff);

        $("#sidebar-toggle").click(this.toggleSidebar);
        //$('[data-toggle="tooltip"]').tooltip();
        $('body').tooltip({selector: '[data-toggle="tooltip"]'});

    }

    toggleSidebar(e:Event) {


        e.preventDefault();
        if ($("#sidebar-toggle-img").hasClass("glyphicon glyphicon-arrow-left") == true) {

            var remove = "glyphicon glyphicon-arrow-left";
            var add = "glyphicon glyphicon-arrow-right"
        }
        else {
            var remove = "glyphicon glyphicon-arrow-right";
            var add = "glyphicon glyphicon-arrow-left"
        }
        $("#sidebar-toggle-img").removeClass(remove);
        $("#sidebar-toggle-img").addClass(add);


        $("#wrapper").toggleClass("toggled");
    }


    doLogoff() {

        var idxLogin = this.loggedInUser.idxLogin;
        var pcampus = this.loggedInUser.preferredCampus;
        var punit = this.loggedInUser.preferredUnit;
        var theuser = this.loggedInUser.user;

        var url = peSvcUrl + "login/" + idxLogin;

        var o = {
            userName: theuser,
            preferredCampus: pcampus,
            preferredUnit: punit
        };

        invokeSvc(url, "PUT", o, this.parseLogoffData);

    }

    parseLogoffData(data:LogoffData) {

        if (data.Status != "ok") {

            console.log(data.Status + "," + data.ErrMsg);
        }

        this._ls.setLocalData(lsName, this.loggedInUser);
        //window.localStorage.setItem(lsName, JSON.stringify(this.loggedInUser));

        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "login.html";

    }

}
