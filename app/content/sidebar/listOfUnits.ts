import {Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';
import {NgForm, NgFor} from 'angular2/common';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import Dictionary = _.Dictionary;

import {lsName, invokeSvc, peSvcUrl, showAlert} from "./../../Utilities/appcommon";

import {ContentComponent} from './../tables/content';
import {getDataService} from "./../../Utilities/getData.service.ts";
import {getLocalDataService} from "./../../Utilities/getLocalData.service.ts";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./../../Utilities/interfaces";
import {LoginData, Unit, Units} from "./../../Utilities/interfaces";

@Component({

    selector: 'listOfUnits',
    templateUrl: 'app/content/sidebar/listOfUnits.html',
    providers: [getDataService, getLocalDataService],
    //directives: [Content],
   // inputs: ['campus', 'eunit', 'wunit']
   // , outputs: ['unitSelected']
})
export class listOfUnits implements OnInit {

    //@Input() eunits: Unit[];
    //@Input() wunits: Unit[];
    @Input() campus: string;
    @Output() unitSelected: EventEmitter<Unit> = new EventEmitter<Unit>();

    loggedInUser:LocalLoginData = null;
    //campus: string;
    units: Unit[];
    eunits:Unit[] = [];
    wunits:Unit[] = [];
    allUnits:Unit[] = [];
    preferredUnitIdx: number;

    selectedUnit: Unit = null;

    constructor(public _ls:getLocalDataService, public _ds: getDataService, public _router: Router) {

        console.log('listofunits constructor: ' + this.campus + ',' + lsName);
    }

    ngOnInit() {

        console.log('ListofUnits oninit: ' + this.campus + ',' + lsName);
        this.getAllUnits();
        //get all units from all campuses
        //get all units in all campuses
        //if (_.isEmpty(this.units) == true) {
        //    this.getAllUnits();
        //}
        //else {

           // this.units = (this.campus == "West") ? this.wunits : this.eunits;

        //}
    }
//
    setSelectedUnit(aunit: Unit) {

        this.selectedUnit = aunit;
        this.unitSelected.emit(aunit);
        //this.unitSelected.emit(this.selectedUnit)
        //this._router.navigate(['Content', {id: aunit.idUnit}])
        //    .then(
        //        function (data) {
        //            console.log('here');
        //        },
        //        function (data) {
        //            console.log('failr');
        //        });



    }

    getAllUnits = () => {

        console.log('getallunits start: ' + this.campus);
        var url = peSvcUrl + "units";

        this._ds.getData(url, "GET", null)
            .subscribe(
                (data:Units) => { this.parseUnitData(data) },
                (err) => { this.parseUnitDataErr(err)}
            );

        //invokeSvc(url, "GET", null, this.parseAllUnitsData);
        console.log('getallunits end: ' + this.campus);
    }

    parseUnitDataErr = (err) => {

        console.log(err);

        showAlert("Error getting campus units:" + err, 'glyphicon-exclamation-sign"')

        return;

    }

    parseUnitData = (data) => {

        if (data.Status != "ok") {

            console.log(data.Status + "," + data.ErrMsg);

            showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')

            return;

        }

        this.allUnits = data.Units;

        //separate east units from west units
        var unitsByCampus:Dictionary<Unit[]> = _.groupBy(this.allUnits, function (aunit:Unit) {
            return aunit.campus;
        });

        this.eunits = unitsByCampus['E'];
        this.wunits = unitsByCampus['W'];

        this.units = (this.campus == "West") ? this.wunits : this.eunits;

        //it appears that properties are not preserved across asynch actions, so refresh
        this.loggedInUser = this._ls.getLocalData(lsName, "getallunits");
        this.loggedInUser.allUnits = this.allUnits;

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
            let xx  = _.findIndex(this.allUnits, 'unitName', this.loggedInUser.preferredUnit);;

            this._router.navigate(['Content', {id: xx}]);
            //trigger click event on link to get all beds on unit
            //  $("#u" + preferredUnitIdx).trigger('click');


        }
        this._ls.setLocalData(lsName, this.loggedInUser);

    }

    activateCampus(activeListGroup:string, inactiveListGroup:string, label:string, units:Unit[]) {

        $(activeListGroup).toggle(true);
        $(inactiveListGroup).toggle(false);
        $(label).addClass('active');
       // $(inactiveListGroup).empty();
       // $(activeListGroup).empty();

       // this.units = units;

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

    //getUnitData() {
    //
    //    var url     = peSvcUrl + "units";
    //    let obUnits = this._ds.getData(url, "GET", null);
    //    obUnits.subscribe(
    //        data => { this.parseAllUnitsData( data) },
    //        err =>  { this.parseAllUnitsDataErr( err) }
    //    );
    //
    //}
    //
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
    //        showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"');
    //
    //        return;
    //
    //    }
    //
    //    this.allUnits = data.Units;
    //    //   this._router.navigate(['Wrapper']);
    //
    //    //separate east units from west units
    //    var unitsByCampus:Dictionary<Unit[]> = _.groupBy(this.allUnits, function (aunit:Unit) {
    //        return aunit.campus;
    //    });
    //
    //    this.eunits = unitsByCampus['E'];
    //    this.wunits = unitsByCampus['W'];
    //
    //    //it appears that properties are not preserved across asynch actions, so refresh
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
    //    //if (this.loggedInUser.preferredUnit != null) {
    //    //
    //    //    //find index of preferred unit
    //    //    var preferredUnitIdx:any = _.result(_.find(allUnits, 'unitName', this.loggedInUser.preferredUnit), 'idUnit');
    //    //
    //    //    //trigger click event on link to get all beds on unit
    //    //    $("#u" + preferredUnitIdx).trigger('click');
    //    //
    //    //}
    //
    //}
    //
    //
    //unitSelectedClick(aunit: Unit) {
    //
    //    console.log('here');
    //    this.unitSelected.emit(aunit);
    //}
    //
    //
    //changeCampuses(campus, type) {
    //
    //    $("#beds").empty();
    //    $("#beds1").empty();
    //    $("#hdrDisNoReturn").empty();
    //    $("#stats").empty();
    //    $("#unitHdr").empty();
    //
    //    //var xx = $(this).prop('id');
    //
    //    switch (campus) {
    //
    //        case 'E':
    //
    //            $("#lblWest").removeClass('active');
    //            //         this.activateCampus("#eastUnits", "#westUnits", "#lblEast", this.eunits);
    //            this.loggedInUser.preferredCampus = "E";
    //            $("#campusHdr").text("East Campus");
    //
    //            break;
    //
    //        case 'W':
    //
    //            $("#lblEast").removeClass('active');
    //            //            this.activateCampus("#westUnits", "#eastUnits", "#lblWest", this.wunits);
    //            this.loggedInUser.preferredCampus = "W";
    //            $("#campusHdr").text("West Campus");
    //            break;
    //    }
    //
    //}
    //
    //activateCampus(activeListGroup:string, inactiveListGroup:string, label:string, units:Unit[]) {
    //
    //    $(activeListGroup).toggle(true);
    //    $(inactiveListGroup).toggle(false);
    //    $(label).addClass('active');
    //    $(inactiveListGroup).empty();
    //    $(activeListGroup).empty();
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