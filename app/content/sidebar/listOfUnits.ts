import {Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';
import {NgForm, NgFor} from 'angular2/common';
import Dictionary = _.Dictionary;

import {lsName} from "./../../appcommon";
import {showAlert} from "./../../appcommon";
import {peSvcUrl} from "./../../appcommon";
import {invokeSvc} from "./../../appcommon";
import {Content} from './../tables/content';
import {getDataService} from "./../../getData.service";
import {getLocalDataService} from "./../../getLocalData.service";
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./../../interfaces";
import {LoginData, Unit, Units} from "./../../interfaces";

@Component({

    selector: 'listOfUnits',
    templateUrl: 'app/content/sidebar/listOfUnits.html',
    providers: [getDataService, getLocalDataService],
    //directives: [Content],
    inputs: ['campus'],
    outputs: ['unitSelected']
})
export class listOfUnits implements OnInit {

    loggedInUser:LocalLoginData = null;
    campus: string;
    units: Unit[];
    eunits:Unit[] = [];
    wunits:Unit[] = [];
    selectedUnit: Unit = null;
    unitSelected: EventEmitter<Unit> = new EventEmitter();

    constructor(public _ls:getLocalDataService, public _ds: getDataService) {

        console.log('listofunits constructor: ' + this.campus);
    }

    ngOnInit() {

        console.log('ListofUnits oninit: ' + this.campus);
        //get all units from all campuses
        //get all units in all campuses
        if (_.isEmpty(this.units) == true) {
            this.getAllUnits();
        }
        else {

            this.units = (this.campus == "West") ? this.wunits : this.eunits;

        }
    }
//
    setSelectedUnit(aunit: Unit) {

        this.selectedUnit = aunit;
        this.unitSelected.emit(this.selectedUnit)

    }
    getAllUnits() {

        console.log('getallunits start: ' + this.campus);
        var url = peSvcUrl + "units";

        this._ds.getData(url, "GET", null)
            .subscribe(
                (data:Units) => {

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

                    this.units = (this.campus == "West") ? this.wunits : this.eunits;

                    //it appears that properties are not preserved across asynch actions, so refresh
                    this.loggedInUser = this._ls.getLocalData(lsName, "getallunits");

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
                ,(data:Units) => {

                    console.log(data.Status + "," + data.ErrMsg);

                    showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')

                    return;

                }
            );

        //invokeSvc(url, "GET", null, this.parseAllUnitsData);
        console.log('getallunits end: ' + this.campus);
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

}