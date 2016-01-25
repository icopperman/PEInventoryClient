import {Component, OnInit } from 'angular2/core';
import {NgForm} from 'angular2/common';

import Dictionary = _.Dictionary;

import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";
import {getDataService} from "./getData.service";
import {getLocalDataService} from "./getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./interfaces";
import {LoginData, Unit, Units} from "./interfaces";

@Component({

    selector: 'sidebar',
    templateUrl: 'app/sidebar.html',
    providers: [getDataService, getLocalDataService]

})
export class sidebar implements OnInit {

    loggedInUser:LocalLoginData = null;
    eunits:Unit[] = [];
    wunits:Unit[] = [];

    constructor(public _ls:getLocalDataService, public _ds: getDataService) {
        console.log('sidebar constructor');
    }


    ngOnInit() {

        console.log('Index oninit sidebar');
        var isLoggedIn:boolean = this.verifyLogin();

        if (isLoggedIn == false) {

            window.location.href = "http://" + window.location.host + "/login.html";

        }

        //get all units in all campuses
        this.getAllUnits();

        $("#campusHdr").text((this.loggedInUser.preferredCampus == "E") ? "East Campus" : "West Campus")

        //set up click handlers
        $('input[type=radio][name=campuses]').on('change', this.changeCampuses);


        //set focus to input field when bootstrap modal shows
        $('#divPrompt').on('shown.bs.modal', function () {
            $('#tabletid').focus()
        })

    }

    //get all units from all campuses
    getAllUnits() {

        var url = peSvcUrl + "units";

        this._ds.getData(url, "GET", null)
            .subscribe(this.parseAllUnitsData, this.parseAllUnitsDataErr);

        //invokeSvc(url, "GET", null, this.parseAllUnitsData);

    }

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

        //separate east units from west units
        var unitsByCampus:Dictionary<Unit[]> = _.groupBy(allUnits, function (aunit:Unit) {
            return aunit.campus;
        });

        this.eunits = unitsByCampus['E'];
        this.wunits = unitsByCampus['W'];

        //it appears that properties are now preserved across asynch actions, so refresh
        this.loggedInUser = this._ls.getLocalData(lsName);

        //if user previously chose a campus activate it
        switch (this.loggedInUser.preferredCampus) {

            case "W":
                this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
                break;

            case "E":
                this.activateCampus("#eastUnits", "#westUnits", "#lblEast", this.eunits);
                break;

            default:
                this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
                this.loggedInUser.preferredCampus = "W";

                break;
        }

        //if user previously selected a unit, go get beds on unit now
        if (this.loggedInUser.preferredUnit != null) {

            //find index of preferred unit
            var preferredUnitIdx:any = _.result(_.find(allUnits, 'unitName', this.loggedInUser.preferredUnit), 'idUnit');

            //trigger click event on link to get all beds on unit
            $("#u" + preferredUnitIdx).trigger('click');

        }

    }


    changeCampuses() {

        $("#beds").empty();
        $("#beds1").empty();
        $("#hdrDisNoReturn").empty();
        $("#stats").empty();
        $("#unitHdr").empty();

        var xx = $(this).prop('id');

        switch (xx) {

            case 'rbEast':

                $("#lblWest").removeClass('active');
                this.activateCampus("#eastUnits", "#westUnits", "#lblEast", this.eunits);
                this.loggedInUser.preferredCampus = "E";
                $("#campusHdr").text("East Campus");

                break;

            case 'rbWest':

                $("#lblEast").removeClass('active');
                this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
                this.loggedInUser.preferredCampus = "W";
                $("#campusHdr").text("West Campus");
                break;
        }

    }

    verifyLogin():boolean {

        var rc:boolean = true;

        this.loggedInUser = this._ls.getLocalData(lsName);
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



    activateCampus(activeListGroup:string, inactiveListGroup:string, label:string, units:Unit[]) {

        $(activeListGroup).toggle(true);
        $(inactiveListGroup).toggle(false);
        $(label).addClass('active');
        $(inactiveListGroup).empty();
        $(activeListGroup).empty();

        var unitsList = $(activeListGroup);

        $.each(units, function (idx:number, aunit:Unit) {

            var li = $('<li/>')
                .addClass('list-group-item')
                .appendTo(unitsList);

            var a = $('<a/>', {
                id: "u" + aunit.idUnit,
                text: aunit.unitName
                , href: "#"

            });

            a.bind('click', this.getBedsOnUnit).appendTo(li);

        });

    }
}

