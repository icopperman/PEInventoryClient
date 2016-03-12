import {Component, OnInit, EventEmitter, Output   } from 'angular2/core';
import {NgSwitch, NgSwitchWhen, FORM_DIRECTIVES} from 'angular2/common';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import Dictionary = _.Dictionary;

import {lsName, invokeSvc, peSvcUrl, showAlert} from "./../../Utilities/appcommon";
import {getDataService} from "./../../Utilities/getData.service.ts";
import {getLocalDataService} from "./../../Utilities/getLocalData.service.ts";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./../../Utilities/interfaces";
import {LoginData, Unit, Units} from "./../../Utilities/interfaces";
import {listOfUnits} from './listOfUnits';

@Component({

    selector: 'sidebar',
    templateUrl: 'app/content/sidebar/sidebar.html',
    providers: [getDataService, getLocalDataService],
    directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, listOfUnits]
    //,outputs: ['unitSelected']

})
export class SideBarComponent implements OnInit {

    loggedInUser:LocalLoginData = null;
  //  unitSelected: EventEmitter<Unit> = new EventEmitter();
    eunits: Unit[] = null;
    wunits: Unit[] = null;
    allUnits:Unit[] = null;

    constructor(public _ls:getLocalDataService, public _ds:getDataService,
                    public _rp: RouteParams) {
        console.log('sidebar constructor ' + lsName);

    }


    ngOnInit() {
        console.log('sidebar oninit ' + lsName);
        this.loggedInUser = this._ls.getLocalData(lsName, 'sidebar init');

        //let xx = this._rp.get('obs');
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
        //$('#divPrompt').on('shown.bs.modal', function () {
        //    $('#tabletid').focus()
        //})

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





}

