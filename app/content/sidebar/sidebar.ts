import {Component, OnInit, EventEmitter, Output   } from 'angular2/core';
import {NgSwitch, NgSwitchWhen, FORM_DIRECTIVES} from 'angular2/common';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import Dictionary = _.Dictionary;

import {lsName} from "./../../appcommon";
import {showAlert} from "./../../appcommon";
import {peSvcUrl} from "./../../appcommon";
import {invokeSvc} from "./../../appcommon";
import {getDataService} from "./../../getData.service";
import {getLocalDataService} from "./../../getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./../../interfaces";
import {LoginData, Unit, Units} from "./../../interfaces";
import {listOfUnits} from './listOfUnits';

@Component({

    selector: 'sidebar',
    templateUrl: 'app/content/sidebar/sidebar.html',
    providers: [getDataService, getLocalDataService],
    directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, listOfUnits],
    outputs: ['unitSelected']

})
export class SideBarComponent implements OnInit {

    loggedInUser:LocalLoginData = null;
    unitSelected: EventEmitter<Unit> = new EventEmitter();

    constructor(public _ls:getLocalDataService, public _ds:getDataService,
                    public _rp: RouteParams) {
        console.log('sidebar constructor');

    }


    ngOnInit() {

        let xx = this._rp.get('obs');
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





}

