import {Component, OnInit } from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import 'rxjs/Rx';

//import * as _ from 'lodash';
//import * as $ from 'jquery';

//import _ from 'lodash';
//import $ from 'jquery';

//import 'bootstrap/js/bootstrap.js';

import {lsName, showAlert, peSvcUrl, invokeSvc} from "../appcommon";
import {getDataService} from "../getData.service";
import {getLocalDataService} from "../getLocalData.service";
import {LocalLoginData, LoginData} from "../interfaces";
import {LoginData, Unit, Units} from "./../../interfaces";

import Observable = Rx.Observable;

@Component({

    selector: 'loginForm',
    templateUrl: 'app/login/loginForm.html',
    providers: [getDataService, getLocalDataService]

})
export class LoginComponent implements OnInit {

    sloginTime:number;
    eloginTime:number;
    obUnits: any;

    constructor(
        public _ds:getDataService,
        public _ls: getLocalDataService,
        public _router: Router
    ) {
        console.log('login component constructor');
    }

    ngOnInit() {
        console.log('Logincomponent oninit');
        var url     = peSvcUrl + "units";
        this.obUnits = this._ds.getData(url, "GET", null);

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
                    data => { this.parseLoginData(this._ls, this._ds,  data) },
                    err =>  { this.parseLoginDataErr( err) }
                );
            //invokeSvc(url, "POST", auser, this.parseLoginData);


        }

    };

    parseLoginData = (lss: getLocalDataService, dss: getDataService, data:LoginData) => {

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

            //var page = "grid.html";
            //window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + page;

            lss.setLocalData(lsName, o );

            //invokeSvc(url, "GET", null, parseAllUnitsData);

            this.obUnits.subscribe(
                data => { this.parseAllUnitsData(this._ls, this._ds,  data) },
                err =>  { this.parseAllUnitsDataErr( err) }
            );

            this._router.navigate(['Wrapper']);

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

    parseAllUnitsDataErr(data:Units) {

        console.log(data.Status + "," + data.ErrMsg);

        showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')

        return;

    }

    parseAllUnitsData(data:Units) {

        if (data.Status != "ok") {

            console.log(data.Status + "," + data.ErrMsg);

            showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')

            return;

        }

        var allUnits:Unit[] = data.Units;

        ////separate east units from west units
        //var unitsByCampus:Dictionary<Unit[]> = _.groupBy(allUnits, function (aunit:Unit) {
        //    return aunit.campus;
        //});
        //
        //this.eunits = unitsByCampus['E'];
        //this.wunits = unitsByCampus['W'];
        //
        ////it appears that properties are now preserved across asynch actions, so refresh
        //this.loggedInUser = this._ls.getLocalData(lsName, 'parseallunitdata');
        //
        ////if user previously chose a campus activate it
        //switch (this.loggedInUser.preferredCampus) {
        //
        //    case "W":
        //        this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
        //        break;
        //
        //    case "E":
        //        this.activateCampus("#eastUnits", "#westUnits", "#lblEast", this.eunits);
        //        break;
        //
        //    default:
        //        this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
        //        this.loggedInUser.preferredCampus = "W";
        //
        //        break;
        //}
        //
        ////if user previously selected a unit, go get beds on unit now
        //if (this.loggedInUser.preferredUnit != null) {
        //
        //    //find index of preferred unit
        //    var preferredUnitIdx:any = _.result(_.find(allUnits, 'unitName', this.loggedInUser.preferredUnit), 'idUnit');
        //
        //    //trigger click event on link to get all beds on unit
        //    $("#u" + preferredUnitIdx).trigger('click');
        //
        //}

    }

    //activateCampus(activeListGroup:string, inactiveListGroup:string, label:string, units:Unit[]) {
    //
    //    $(activeListGroup).toggle(true);
    //    $(inactiveListGroup).toggle(false);
    //    $(label).addClass('active');
    //    // $(inactiveListGroup).empty();
    //    // $(activeListGroup).empty();
    //
    //    // this.units = units;
    //
    //    //var unitsList = $(activeListGroup);
    //    //
    //    //$.each(units, function (idx:number, aunit:Unit) {
    //    //
    //    //    var li = $('<li/>')
    //    //        .addClass('list-group-item')
    //    //        .appendTo(unitsList);
    //    //
    //    //    var a = $('<a/>', {
    //    //        id: "u" + aunit.idUnit,
    //    //        text: aunit.unitName
    //    //        , href: "#"
    //    //
    //    //    });
    //    //
    //    //    a.bind('click', this.getBedsOnUnit).appendTo(li);
    //    //
    //    //});
    //
    //}

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


