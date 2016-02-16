import {Component, OnInit, EventEmitter, Output   } from '../../../node_modules/angular2/core.d';
import {NgSwitch, NgSwitchWhen, FORM_DIRECTIVES} from '../../../node_modules/angular2/common.d';

import Dictionary = _.Dictionary;

import {lsName} from "./../../appcommon";
import {showAlert} from "./../../appcommon";
import {peSvcUrl} from "./../../appcommon";
import {invokeSvc} from "./../../appcommon";
import {getDataService} from "./../../getData.service.ts";
import {getLocalDataService} from "./../../getLocalData.service.ts";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./../../interfaces";
import {LoginData, Unit, Units} from "./../../interfaces";
import {listOfUnits} from './listOfUnits';

@Component({

    selector: 'sidebar',
    templateUrl: 'app/sidebar.html',
    providers: [getDataService, getLocalDataService],
    directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, listOfUnits],
    outputs: ['unitSelected']

})
export class sidebar implements OnInit {

    loggedInUser:LocalLoginData = null;
    unitSelected: EventEmitter<Unit> = new EventEmitter();

    constructor(public _ls:getLocalDataService, public _ds:getDataService) {
        console.log('sidebar constructor');

    }


    ngOnInit() {

        //var isLoggedIn:boolean = this.verifyLogin();
        //console.log('sidebar oninit: ' + this.loggedInUser.preferredCampus);
        //
        //if (isLoggedIn == false) {
        //
        //    window.location.href = "http://" + window.location.host + "/login.html";
        //
        //}



       // $("#campusHdr").text((this.loggedInUser.preferredCampus == "E") ? "East Campus" : "West Campus")

        //set up click handlers
       // $('input[type=radio][name=campuses]').on('change', this.changeCampuses);


        //set focus to input field when bootstrap modal shows
        $('#divPrompt').on('shown.bs.modal', function () {
            $('#tabletid').focus()
        })

    }


    unitSelectedClick(aunit: Unit) {

        console.log('here');
        this.unitSelected.emit(aunit);
    }


    changeCampuses(campus, type) {

        $("#beds").empty();
        $("#beds1").empty();
        $("#hdrDisNoReturn").empty();
        $("#stats").empty();
        $("#unitHdr").empty();

        //var xx = $(this).prop('id');

        switch (campus) {

            case 'E':

                $("#lblWest").removeClass('active');
       //         this.activateCampus("#eastUnits", "#westUnits", "#lblEast", this.eunits);
                this.loggedInUser.preferredCampus = "E";
                $("#campusHdr").text("East Campus");

                break;

            case 'W':

                $("#lblEast").removeClass('active');
    //            this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
                this.loggedInUser.preferredCampus = "W";
                $("#campusHdr").text("West Campus");
                break;
        }

    }

    activateCampus(activeListGroup:string, inactiveListGroup:string, label:string, units:Unit[]) {

        $(activeListGroup).toggle(true);
        $(inactiveListGroup).toggle(false);
        $(label).addClass('active');
        $(inactiveListGroup).empty();
        $(activeListGroup).empty();

        //var unitsList = $(activeListGroup);
        //
        //$.each(units, function (idx:number, aunit:Unit) {
        //
        //    var li = $('<li/>')
        //        .addClass('list-group-item')
        //        .appendTo(unitsList);
        //
        //    var a = $('<a/>', {
        //        id: "u" + aunit.idUnit,
        //        text: aunit.unitName
        //        , href: "#"
        //
        //    });
        //
        //    a.bind('click', this.getBedsOnUnit).appendTo(li);
        //
        //});

    }



    //parseAllUnitsDataErr(data:Units) {
    //
    //    console.log(data.Status + "," + data.ErrMsg);
    //
    //    showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')
    //
    //    return;
    //
    //}
    //
    //parseAllUnitsData(data:Units) {
    //
    //    if (data.Status != "ok") {
    //
    //        console.log(data.Status + "," + data.ErrMsg);
    //
    //        showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')
    //
    //        return;
    //
    //    }
    //
    //    var allUnits:Unit[] = data.Units;
    //
    //    //separate east units from west units
    //    var unitsByCampus:Dictionary<Unit[]> = _.groupBy(allUnits, function (aunit:Unit) {
    //        return aunit.campus;
    //    });
    //
    //    this.eunits = unitsByCampus['E'];
    //    this.wunits = unitsByCampus['W'];
    //
    //    //it appears that properties are now preserved across asynch actions, so refresh
    //    this.loggedInUser = this._ls.getLocalData(lsName, 'parseallunitdata');
    //
    //    //if user previously chose a campus activate it
    //    switch (this.loggedInUser.preferredCampus) {
    //
    //        case "W":
    //            this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
    //            break;
    //
    //        case "E":
    //            this.activateCampus("#eastUnits", "#westUnits", "#lblEast", this.eunits);
    //            break;
    //
    //        default:
    //            this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
    //            this.loggedInUser.preferredCampus = "W";
    //
    //            break;
    //    }
    //
    //    //if user previously selected a unit, go get beds on unit now
    //    if (this.loggedInUser.preferredUnit != null) {
    //
    //        //find index of preferred unit
    //        var preferredUnitIdx:any = _.result(_.find(allUnits, 'unitName', this.loggedInUser.preferredUnit), 'idUnit');
    //
    //        //trigger click event on link to get all beds on unit
    //        $("#u" + preferredUnitIdx).trigger('click');
    //
    //    }
    //
    //}


}

