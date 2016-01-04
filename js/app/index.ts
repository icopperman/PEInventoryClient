import * as _ from 'lodash';
import $ from 'jquery';

import 'bootstrap/js/bootstrap.js';

import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";
import Dictionary = _.Dictionary;
import {LocalLoginData} from "./login";

//import {verifyLogin} from './appcommon';
//import {doLogoff} from './appcommon';
//import {getAllUnits} from './appcommon';
interface returnStatus {

    ErrMsg: string;
    Status: string;

}

interface CheckInData {

//    rc: returnStatus;
    ErrMsg: string;
    Status: string;

    CheckedOutBy : string;
    CheckOutTime : string;
    CheckInTime  : string;
    TabletID     : string;
    idInventory  : string;

}

interface LogoffData {

//    rc: returnStatus;
    ErrMsg: string;
    Status: string;

    PreferredCampus: string;
    PreferredUnit: string;
    UserName: string;
}

interface Unit {

    active: string;
    campus: string;
    campus1: string;
    idUnit: number;
    name: string;
    site: string;
    unitCode: string;
    unitName: string;
}

interface Units {

//    rc: returnStatus;
    ErrMsg: string;
    Status: string;

    Units: Unit[];
}

interface Beds {

   // rc: returnStatus;
    ErrMsg: string;
    Status: string;

    BedPatients: Bed[];
}
interface Bed {

BedID: string;
Campus: string;
CheckInTime: string;
CheckOutTime: string;
CheckedInBy: string;
CheckedOutBy: string;
Discharged: string;
ErrMsg: string;
FirstName: string;
LastName: string;
MRN: string;
Status: string;
TabletID: string;
Unit: string;
idInventory: string;
tabletype: string;
}

var prevSortColumn : string = "";
var currBedIdx: number, currFunc: string;
var eunits: Unit[] = [];
var wunits: Unit[] = [];
var beds: Bed[]    = [];
var loggedInUser: LocalLoginData = null;
//var doingStats;

indexReady();
function indexReady() {


    $(document).ready(function () {

       // doingStats = false;

        var isLoggedIn: boolean = verifyLogin();

        if (isLoggedIn == false) {

            window.location.href = "http://" + window.location.host + "/login.html";

        }

        //get all units in all campuses
        getAllUnits();

        $("#campusHdr").text((loggedInUser.preferredCampus == "E") ? "East Campus" : "West Campus")

        //set up click handlers
        $('input[type=radio][name=campuses]').on('change', changeCampuses);

        $("#btnLogoff").on("click", doLogoff);

        $("#sidebar-toggle").click(toggleSidebar);
        //$('[data-toggle="tooltip"]').tooltip();
        $('body').tooltip({selector: '[data-toggle="tooltip"]'});

        //set focus to input field when bootstrap modal shows
        $('#divPrompt').on('shown.bs.modal', function () {
            $('#tabletid').focus()
        })

    });
}
function toggleSidebar(e:Event) {


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
function verifyLogin() : boolean {

    var rc: boolean = true;

    var xx: string = window.localStorage.getItem(lsName);

    if (xx == null) {

        console.log('no login');

        rc = false;

    }
    else {

        loggedInUser = JSON.parse(xx);
        var loginTime = loggedInUser.loginTime;
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
//get all units from all campuses
function getAllUnits() {

    var url = peSvcUrl + "units";

    invokeSvc(url, "GET", null, parseAllUnitsData);

}

function parseAllUnitsData(data: Units) {


    if (data.Status != "ok") {

        console.log(data.Status + "," + data.ErrMsg);

        showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"')

        return;

    }

    var allUnits: Unit[] = data.Units;

    //separate east units from west units
    var unitsByCampus : Dictionary<Unit[]> = _.groupBy(allUnits, function (aunit: Unit) {
        return aunit.campus;
    });

    eunits = unitsByCampus['E'];
    wunits = unitsByCampus['W'];

    //if user previously chose a campus activate it
    switch (loggedInUser.preferredCampus) {

        case "W":
            activateCampus("#westUnits", "#eastUnits", "#lblWest", wunits);
            break;

        case "E":
            activateCampus("#eastUnits", "#westUnits", "#lblEast", eunits);
            break;

        default:
            activateCampus("#westUnits", "#eastUnits", "#lblWest", wunits);
            loggedInUser.preferredCampus = "W";

            break;
    }

    //if user previously selected a unit, go get beds on unit now
    if (loggedInUser.preferredUnit != null) {

        //find index of preferred unit
        var preferredUnitIdx: any = _.result(_.find(allUnits, 'unitName', loggedInUser.preferredUnit), 'idUnit');

        //trigger click event on link to get all beds on unit
        $("#u" + preferredUnitIdx).trigger('click');

    }

}

function changeCampuses() {

    $("#beds").empty();
    $("#beds1").empty();
    $("#hdrDisNoReturn").empty();
    $("#stats").empty();
    $("#unitHdr").empty();

    var xx = $(this).prop('id');

    switch (xx) {

        case 'rbEast':

            $("#lblWest").removeClass('active');
            activateCampus("#eastUnits", "#westUnits", "#lblEast", eunits)
            loggedInUser.preferredCampus = "E";
            $("#campusHdr").text("East Campus");

            break;

        case 'rbWest':

            $("#lblEast").removeClass('active');
            activateCampus("#westUnits", "#eastUnits", "#lblWest", wunits)
            loggedInUser.preferredCampus = "W";
            $("#campusHdr").text("West Campus");
            break;
    }

}

function activateCampus(activeListGroup: string, inactiveListGroup: string, label: string, units: Unit[]) {

    $(activeListGroup).toggle(true);
    $(inactiveListGroup).toggle(false);
    $(label).addClass('active');
    $(inactiveListGroup).empty();
    $(activeListGroup).empty();

    var unitsList = $(activeListGroup);

    $.each(units, function (idx: number, aunit: Unit) {

        var li = $('<li/>')
            .addClass('list-group-item')
            .appendTo(unitsList);

        var a = $('<a/>', {
            id: "u" + aunit.idUnit,
            text: aunit.unitName
            , href: "#"

        });

        a.bind('click', getBedsOnUnit).appendTo(li);

    });

}

function doLogoff() {

    var idxLogin = loggedInUser.idxLogin
    var pcampus = loggedInUser.preferredCampus;
    var punit = loggedInUser.preferredUnit;
    var theuser = loggedInUser.user;

    var url = peSvcUrl + "login/" + idxLogin;

    var o = {
        userName: theuser,
        preferredCampus: pcampus,
        preferredUnit: punit
    };

    invokeSvc(url, "PUT", o, parseLogoffData);

}

function parseLogoffData(data: LogoffData) {

    if (data.Status != "ok") {

        console.log(data.Status + "," + data.ErrMsg);
    }

    window.localStorage.setItem(lsName, JSON.stringify(loggedInUser));

    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "login.html";

}

function getBedsOnUnit() {

    var preferredUnitIdx: string = this.id.substring(1);
    var preferredUnit: string    = $(this).text();

    var actEl = $(this).closest('.list-group').children('.active');

    actEl.removeClass('active').css('background-color', 'white');
    $(this).closest('.list-group-item').addClass('active').css('background-color', 'lightcyan');

    loggedInUser.preferredUnit = preferredUnit;

    var url = peSvcUrl + "units/" + preferredUnitIdx;

    $("#beds").empty();
    $("#beds1").empty();
    $("#hdrDisNoReturn").empty();

    $("#waitingUnit").text("Retrieving bed data for unit " + preferredUnit);
    $("#campusHdr").text((loggedInUser.preferredCampus == "E") ? "East Campus," : "West Campus,")
    $("#unitHdr").text(" unit " + preferredUnit);

    $("#waitForBedInfo").modal();

    invokeSvc(url, "GET", null, parseBedData);

}

function parseBedData(data: Beds) {

    if (data.Status != "ok") {

        console.log(data.Status + ',' + data.ErrMsg);

        showAlert("Error getting bed on unit:" + data.ErrMsg, "glyphicon-exclamation-sign");
        $("#waitForBedInfo").modal('hide');

        return;
    }

    $("#divAlert").toggle(false);

    beds = data.BedPatients;

    //build both tables
    buildTables();

    $("#waitForBedInfo").modal('hide');

}

function buildTables() {

    var anyNotReturned: boolean = false;
    var tabletype: string = 'ok';
    //normalize time fields and don't put some attributes in the table
    var temp1 : Bed[] = <Bed[]>_.map(beds, function (abed) {

        if ((abed.CheckInTime  != null) && (abed.CheckInTime.length  > 16)) abed.CheckInTime  = abed.CheckInTime.replace("T", " ").substring(0, abed.CheckInTime.lastIndexOf(".") - 3);
        if ((abed.CheckOutTime != null) && (abed.CheckOutTime.length > 16)) abed.CheckOutTime = abed.CheckOutTime.replace("T", " ").substring(0, abed.CheckOutTime.lastIndexOf(".") - 3);

        //search forr discharged patients with tablets still checked out
        if (abed.Discharged != 'Y') {

            tabletype = 'ok'; //not discharged, place in first table

        }
        else {
            //discharged
            if (abed.CheckOutTime == null) //tablet checked out?
            {
                tabletype = 'ok';   //no...place in first table
            }
            else {
                //tablet checked out
                if (abed.CheckInTime == null) { //checked in?

                    tabletype = "notreturned";    //no...discharged with tablet still checked out
                    anyNotReturned = true;
                }
                else {

                    tabletype = "ok";    //yes...first table
                }
            }
        }

        _.set(abed, 'tabletype', tabletype);

        return _.omit(abed, ['idInventory', 'Campus', 'Unit', 'Status', 'ErrMsg', 'Discharged']);

    });

    createTable(temp1, $("#beds"), "ok");

    if ( anyNotReturned == false) {

        $("#hdrDisNoReturn").html("Tablets assigned to discharged patients, not returned -- None");
        $("#beds1").empty();
    }
    else {

        $("#hdrDisNoReturn").html("Tablets assigned to discharged patients, not returned");
        //createTable(bedDataForNotReturned, $("#beds1"));
        createTable(temp1, $("#beds1"), "notreturned");

    }

}

function createTable(tableData: Bed[], bedTable : JQuery, tabletype: string) {

    bedTable.empty();

    var tableName: string = bedTable.selector;

    bedTable.data(tableName, tableData);

    var atrhead = $("<tr>");
    atrhead.css('background-color', 'lightblue');

    _.forEach(tableData, function (abed, curridx) {

        if (abed.tabletype == tabletype) {

            var atr = $("<tr>");
            var CheckedOut = false;
        }

        _.forOwn(abed, function (value, key, item) {

            if (curridx == 0) {

                var akey: string;

                switch (key) {
                    case "BedID": akey = "Room#/Bed#"; break;
                    case "FirstName": akey = "First Name"; break;
                    case "LastName": akey = "Last Name"; break;
                    case "TabletID": akey = "Tablet ID"; break;
                    case "CheckedOutBy": akey = "Assigned By"; break;
                    case "CheckedInBy": akey = "Returned By"; break;
                    case "CheckOutTime": akey = "Checked Out"; break;
                    case "xCheckOutTime": akey = "Tablet Check Out Time"; break;
                    case "CheckInTime": akey = "Returned?"; break;
                    case "Discharged": akey = "Dis"; break;
                    case "tabletype": akey = ""; break;

                    default: akey = key;
                }

                if (akey != "") {

                    var direction = bedTable.data(key);
                    var glyphClass: string, glyphColor: string;

                    if (_.isEmpty(direction) == true) {

                        glyphClass = "glyphicon glyphicon-triangle-right";
                        glyphColor = "red";

                    }
                    else {

                        if (direction == "asc") {

                            glyphClass = "glyphicon glyphicon-triangle-top";
                            glyphColor = "green";

                        }
                        else {

                            glyphClass = "glyphicon glyphicon-triangle-bottom";
                            glyphColor = "green";

                        }
                    }
                    var ath = $("<th>", { text: akey /*, onclick: "sortColumn('" + tableName + "', '" + key + "')"*/ });
                    //var aspan = $("<span>", { class: glyphClass, style: "; padding-left: 5px; color: " + glyphColor + ";" });

                    //aspan.appendTo(ath);
                    ath.appendTo(atrhead);

                }

            }

            if (abed.tabletype == tabletype) {

                //var idx = _.findIndex(beds, { BedID: abed.BedID });
                var idx = curridx;

                var xx = (value == null) ? "" : value;

                switch (key) {

                    case "CheckOutTime":

                        if (value == null) {

                            var bedid = item.BedID;
                            var atd = $("<td>", { id: 'co' + idx });
                            var aa = $("<a>", { href: "#", onclick: "checkOutTablet('" + idx + "')", text: "CHECK OUT" });
                            var aspan = $("<span>", { class: "glyphicon glyphicon-arrow-right", style: "color: green; padding-left: 5px;" });
                            aspan.appendTo(aa);
                            aa.appendTo(atd);
                            atd.appendTo(atr);

                        }
                        else {
                            //item is checkedout, but has it been checked in
                            var checkintime = item.CheckInTime;

                            if (_.isEmpty(checkintime) == true) {

                                //no, still assigned
                                var atd = $("<td>", { id: 'co' + idx, text: "TABLET ASSIGNED" });
                                CheckedOut = true;

                            }

                            else {

                                //yes, it can be checked out
                                var bedid = item.BedID;
                                var atd = $("<td>", { id: 'co' + idx });
                                var aa = $("<a>", { href: "#", onclick: "checkOutTablet('" + idx + "')", text: "CHECK OUT" });
                                var aspan = $("<span>", { class: "glyphicon glyphicon-arrow-right", style: "color: green; padding-left: 5px;" });
                                aspan.appendTo(aa);
                                aa.appendTo(atd);
                                atd.appendTo(atr);

                            }
                        }

                        atd.appendTo(atr);


                        break;


                    case "CheckInTime":

                        if (CheckedOut == true) {

                            //bed has checked out tablet, so set checkin functionality
                            var bedid = item.BedID;

                            var atd = $("<td>", { id: 'ci' + idx });
                            var aa = $("<a>", { href: "#", onclick: "checkInTablet('" + idx + "')", text: "CHECK IN" })
                            var aspan = $("<span>", { class: "glyphicon glyphicon-remove", style: "color: red; padding-left: 5px;" });
                            aspan.appendTo(aa);

                            aa.appendTo(atd);
                            atd.appendTo(atr);

                        }
                        else {
                            //
                            var atd = $("<td>", { id: 'ci' + idx, text: "" });
                        }

                        atd.appendTo(atr);

                        break

                    case "TabletID":

                        var atd = $("<td>", { text: xx, id: 'tablet' + idx });
                        atd.appendTo(atr);

                        break;

                    case "CheckedOutBy":

                        if (value == null) {

                            var atd = $("<td>", { text: xx, id: 'cob' + idx });
                        }
                        else {

                            if (bedTable[0].id == "beds") { //only tootips for this table

                                var tooltip = "Assigned on " + item.CheckOutTime;
                                var atd = $("<td>", { text: xx, id: 'cob' + idx, "data-toggle": "tooltip", "data-placement": "top", "data-container": "body", title: tooltip });

                            }
                            else {
                                var atd = $("<td>", { text: xx, id: 'cob' + idx });

                            }
                        }

                        atd.appendTo(atr);

                        break;

                    case "CheckedInBy":

                        if (value == null) {

                            var atd = $("<td>", { text: xx, id: 'cib' + idx });
                        }
                        else {

                            if (bedTable[0].id == "beds") { //only tootips for this table

                                var tooltip = "Returned on " + item.CheckInTime;
                                var atd = $("<td>", { text: xx, id: 'cib' + idx, "data-toggle": "tooltip", "data-placement": "top", "data-container": "body", title: tooltip });
                            }
                            else {
                                var atd = $("<td>", { text: xx, id: 'cib' + idx });

                            }
                        }

                        atd.appendTo(atr);

                        break;

                    case "tabletype":
                        break;

                    default:

                        var atd = $("<td>", { text: value });
                        atd.appendTo(atr);

                        break;
                }
            }

        });//end forown

        if (curridx == 0) atrhead.appendTo(bedTable);

        if (abed.tabletype == tabletype) atr.appendTo(bedTable);

    }); //end foreach

}

function sortColumn(tableName: string, sortColumn: string) {

    var table : JQuery = $(tableName);
    var data : Bed[] = table.data(tableName);

    if (_.isEmpty(data) == true) return;

    var direction : string = table.data(sortColumn);

    if (_.isEmpty(direction) == true) {

        direction = 'asc';
    }
    else {

        direction = (direction == 'asc') ? 'desc' : 'asc';
    }

    if (prevSortColumn != "") {

        table.data(prevSortColumn, "")

    }

    prevSortColumn = sortColumn;
    table.data(sortColumn, direction);

    $(tableName + " th > span").attr('class', 'glyphicon glyphicon-triangle-right').css('color', 'red');
    var sortedData = _.sortByOrder(data, [sortColumn], [direction]);

    createTable(sortedData, table, "ok");

}

function tabletSave(savetype: string) {

    if (currFunc == "checkout") {
        checkoutSave(savetype);
    }
    else {
        checkinSave(savetype);
    }
}

function checkoutSave(savetype: string) {

    var tabletId: string;

    tabletId = (savetype == 'cancel') ? "" : $("#tabletid").val();

    $("#divPrompt").modal('hide');

    if (_.isEmpty(tabletId) == true) {
        return;
    }

    var aunit          = _.clone(beds[currBedIdx]);
    aunit.TabletID     = tabletId;
    aunit.CheckedOutBy = loggedInUser.user;

    var url = peSvcUrl + "units";

    invokeSvc(url, "POST", aunit, parseCheckOutData);

}

function checkinSave(savetype: string) {

    var result: string;
    var tabletId: string;
    var aunit = beds[currBedIdx];

    tabletId = (savetype == 'cancel') ? "" : $("#tabletid").val();


    if (_.isEmpty(tabletId) == true) {//ok, no text

        $("#divPrompt").modal('hide');
        return;
    }

    if (tabletId != aunit.TabletID) {

        var msg = "The id of the checked in tablet must match the id of the checked out tablet. Please reenter";
        $("#promptError").text(msg);
        return;
    }

    $("#divPrompt").modal('hide');

    aunit.CheckedInBy = loggedInUser.user;
    var url = peSvcUrl + "units";

    invokeSvc(url, "PUT", aunit, parseCheckInData);

}

function checkOutTablet(idx: string) {

    currBedIdx = parseInt(idx);

    currFunc = "checkout";

    $("#tabletid").val("");
    $("#promptError").text("");

    $("#tabletSave").text("Check out tablet");

    $("#promptHdr").text("To check out the tablet, scan its asset tag or manually enter the asset tag number");
    $("#divPrompt").modal('show');

}

function checkInTablet(idx: string) {

    currBedIdx = parseInt(idx);

    currFunc = "checkin";

    $("#tabletid").val("");
    $("#promptError").text("");
    $("#tabletSave").text("Check in tablet");
    $("#promptHdr").text("To check in the tablet, scan its asset tag or manually enter the asset tag number");

    $("#divPrompt").modal('show');

}

function parseCheckOutData(data : Bed) {

    if (data.Status == "ok") {

        if ((data.CheckOutTime != null) && (data.CheckOutTime.length > 16)) data.CheckOutTime = data.CheckOutTime.replace("T", " ").substring(0, data.CheckOutTime.lastIndexOf(".") - 3);

        var idx                = currBedIdx;// _.findIndex(beds, { BedID: data.BedID });

        beds[idx].CheckOutTime = data.CheckOutTime;
        beds[idx].CheckedOutBy = data.CheckedOutBy;
        beds[idx].CheckInTime  = null;
        beds[idx].TabletID     = data.TabletID;
        beds[idx].idInventory  = data.idInventory;

        buildTables();

        $("#divAlert").toggle(false);

    }
    else {

        showAlert("Error checking out tablet: " + data.ErrMsg, "glyphicon-exclamation-sign");
    }

}

function parseCheckInData(data : Bed) {

    if (data.Status == "ok") {

        var idx = currBedIdx;// _.findIndex(beds, { BedID: data.BedID });

            if ((data.CheckInTime != null) && (data.CheckInTime.length > 16)) data.CheckInTime = data.CheckInTime.replace("T", " ").substring(0, data.CheckInTime.lastIndexOf(".") - 3);

            beds[idx].CheckInTime = data.CheckInTime;
            beds[idx].Discharged = "N"; //always reset discharge flag...once a tablet is checked in, discharge does not matter

            buildTables();

            $("#divAlert").toggle(false);
    }
    else {
        showAlert("Error checking in tablet:" + data.ErrMsg, "glyphicon-exclamation-sign");
    }
}

