//import * as _ from 'lodash';
//import * as $ from 'jquery';

//import  _ from 'lodash';
//import $ from 'jquery';

//import 'bootstrap/js/bootstrap.js';

import {lsName} from "./appcommon";
import {showAlert} from "./appcommon";
import {peSvcUrl} from "./appcommon";
import {invokeSvc} from "./appcommon";
import Dictionary = _.Dictionary;

import {getDataService} from "./getData.service";
import {LocalLoginData, Bed, Beds, CheckInData, LoginData, LogoffData} from "./interfaces";
import {returnStatus, Unit, Units} from "./interfaces";

var prevSortColumn:string = "";
var currBedIdx:number, currFunc:string;
var beds:Bed[] = [];
var loggedInUser:LocalLoginData = null;
//var doingStats;

//indexReady();
function indexReady() {


    $(document).ready(function () {

        //// doingStats = false;
        //
        //var isLoggedIn:boolean = verifyLogin();
        //
        //if (isLoggedIn == false) {
        //
        //    window.location.href = "http://" + window.location.host + "/login.html";
        //
        //}
        //
        ////get all units in all campuses
        //getAllUnits();
        //
        //$("#campusHdr").text((loggedInUser.preferredCampus == "E") ? "East Campus" : "West Campus")
        //
        ////set up click handlers
        //$('input[type=radio][name=campuses]').on('change', changeCampuses);
        //
        //$("#btnLogoff").on("click", doLogoff);
        //
        //$("#sidebar-toggle").click(toggleSidebar);
        ////$('[data-toggle="tooltip"]').tooltip();
        //$('body').tooltip({selector: '[data-toggle="tooltip"]'});
        //
        ////set focus to input field when bootstrap modal shows
        //$('#divPrompt').on('shown.bs.modal', function () {
        //    $('#tabletid').focus()
        //})

    });
}

function getBedsOnUnit() {

    var preferredUnitIdx:string = this.id.substring(1);
    var preferredUnit:string = $(this).text();

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

function parseBedData(data:Beds) {

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

    var anyNotReturned:boolean = false;

    //normalize time fields and don't put some attributes in the table
    var temp1:Bed[] = <Bed[]>_.map(beds, function (abed) {

        if ((abed.CheckInTime != null) && (abed.CheckInTime.length > 16)) abed.CheckInTime = abed.CheckInTime.replace("T", " ").substring(0, abed.CheckInTime.lastIndexOf(".") - 3);
        if ((abed.CheckOutTime != null) && (abed.CheckOutTime.length > 16)) abed.CheckOutTime = abed.CheckOutTime.replace("T", " ").substring(0, abed.CheckOutTime.lastIndexOf(".") - 3);

        //all entries go into 'ok' table unless discharged and not returned
        var tabletype:string = 'ok';

        //search for discharged patients with tablets still checked out
        if ((abed.Discharged == 'Y') || ( abed.MRN == null )) {

            //discharged
            if ((abed.CheckOutTime != null) && (abed.CheckInTime == null)) { //checked in?

                tabletype = "notreturned";    //no...discharged with tablet still checked out
                anyNotReturned = true;
            }

        }

        _.set(abed, 'tabletype', tabletype);

        return _.omit(abed, ['idInventory', 'Campus', 'Unit', 'Status', 'ErrMsg', 'Discharged']);

    });

    createTable(temp1, "beds", "ok", "BedID", "asc");

    if (anyNotReturned == false) {

        $("#hdrDisNoReturn").html("Tablets assigned to discharged patients, not returned -- None");
        $("#beds1").empty();
    }
    else {

        $("#hdrDisNoReturn").html("Tablets assigned to discharged patients, not returned");

        createTable(temp1, "beds1", "notreturned", "BedID", "asc");

    }

}

var prevSortColumn = "";

function createTable(tableData:Bed[], tableName:string, tabletype:string, sortCol:string, sortDir:string) {

    var bedTable = $("#" + tableName);

    bedTable.empty();
    bedTable.data(tableName, {data: tableData, col: sortCol, dir: sortDir});

    var atrhead = $("<tr>");
    atrhead.css('background-color', 'lightblue');

    var currentDay:string = new Date().toDateString();
    var toolTips:boolean = (tabletype == "ok") ? true : false;
    var doneHeader:boolean = false;

    _.forEach(tableData, function (abed, curridx) {

        if (abed.tabletype != tabletype) return;

        //set up switches for row building
        var checkedOut:boolean = ( ( abed.CheckOutTime != null ) && ( abed.CheckInTime == null ) ) ? true : false;
        var clear_ByFields:boolean = false;

        //if checkin/checkout time present, only display if checkintime is today
        if (( abed.CheckOutTime != null ) && ( abed.CheckInTime != null )) {

            var checkintimeString:string = new Date(abed.CheckInTime).toDateString();

            if (checkintimeString != currentDay) {

                clear_ByFields = true;
            }
        }

        //create row
        var atr = $("<tr>");

        //create row columns
        _.forOwn(abed, function (value, key, item) { //foreach attribute of each bed

            //create header col if first time thru
            if (doneHeader == false) {

                var direction = bedTable.data(key);
                createHeaderCol(direction, atrhead, value, key, item);

            }

            //create row col
            createRowCol(checkedOut, clear_ByFields, curridx, toolTips, atr, value, key, item);

        }); //end row creation

        doneHeader = true;

        atr.appendTo(bedTable);

    }); //end foreach

    //insert header
    atrhead.insertBefore(bedTable.find('tr:first'));

}

function createHeaderCol(direction, atrhead, value, key, item) {

    var akey;

    switch (key) {
        case "BedID":
            akey = "Room#/Bed#";
            break;
        case "FirstName":
            akey = "First Name";
            break;
        case "LastName":
            akey = "Last Name";
            break;
        case "TabletID":
            akey = "Tablet ID";
            break;
        case "CheckedOutBy":
            akey = "Assigned By";
            break;
        case "CheckedInBy":
            akey = "Returned By";
            break;
        case "CheckOutTime":
            akey = "Checked Out";
            break;
        case "xCheckOutTime":
            akey = "Tablet Check Out Time";
            break;
        case "CheckInTime":
            akey = "Returned?";
            break;
        case "Discharged":
            akey = "Dis";
            break;
        case "tabletype":
            akey = "";
            break;

        default:
            akey = key;
    }

    if (akey != "") {

        var glyphClass, glyphColor;

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

        //var ath = $("<th>", { text: akey, onclick: "sortColumn('" + tableName + "', '" + key + "')" });
        var ath = $("<th>", {text: akey});
        //var aspan = $("<span>", { class: glyphClass, style: "; padding-left: 5px; color: " + glyphColor + ";" });

        //aspan.appendTo(ath);
        ath.appendTo(atrhead);

    }

}

function createRowCol(checkedOut, clear_ByFields, idx, toolTipsWanted, atr, value, key, item) {

    var xx = (value == null) ? "" : value;

    switch (key) {

        case "CheckOutTime":

            //is item checked out, and not checked in?
            if (checkedOut == true) {

                //yes, still assigned
                var atd = $("<td>", {id: 'co' + idx, text: "TABLET ASSIGNED"});

            }
            else {

                //item is not checked out or checked out and checked in, so create checkout link
                //however, do not create link if not patient assigned to this bed
                if (item.MRN == null) {

                    var atd = $("<td>", {text: ''});
                }
                else {

                    var bedid = item.BedID;
                    var atd = $("<td>", {id: 'co' + idx});
                    var aa = $("<a>", {href: "#", onclick: "checkOutTablet('" + idx + "')", text: "CHECK OUT"});
                    var aspan = $("<span>", {
                        class: "glyphicon glyphicon-arrow-right",
                        style: "color: green; padding-left: 5px;"
                    });

                    aspan.appendTo(aa);
                    aa.appendTo(atd);
                    atd.appendTo(atr);
                }

            }

            atd.appendTo(atr);

            break;


        case "CheckInTime":

            if (checkedOut == true) {

                //bed has checked out tablet, so set checkin functionality
                var bedid = item.BedID;

                var atd = $("<td>", {id: 'ci' + idx});
                var aa = $("<a>", {href: "#", onclick: "checkInTablet('" + idx + "')", text: "CHECK IN"})
                var aspan = $("<span>", {class: "glyphicon glyphicon-remove", style: "color: red; padding-left: 5px;"});
                aspan.appendTo(aa);

                aa.appendTo(atd);
                atd.appendTo(atr);

            }
            else {
                //
                var atd = $("<td>", {id: 'ci' + idx, text: ""});
            }

            atd.appendTo(atr);

            break

        case "TabletID":

            //clear this element if no patient in bed (mrn == null) or tablet checked in
            if ((clear_ByFields == true) || (item.MRN == null)) {

                //however, tablet id's must be shown for 'notreturned' table
                if (item.tabletype == 'ok') {

                    xx = "";

                }
            }

            var atd = $("<td>", {text: xx, id: 'tablet' + idx});
            atd.appendTo(atr);

            break;

        case "CheckedOutBy":

            if ((clear_ByFields == true) || (item.MRN == null)) {

                xx = "";

            }

            if (xx == "") {

                var atd = $("<td>", {text: xx, id: 'cob' + idx});
            }
            else {

                if (toolTipsWanted == true) { //only tootips for this table

                    var tooltip = "Assigned on " + item.CheckOutTime;
                    var atd = $("<td>", {
                        text: xx,
                        id: 'cob' + idx,
                        "data-toggle": "tooltip",
                        "data-placement": "top",
                        "data-container": "body",
                        title: tooltip
                    });

                }
                else {

                    var atd = $("<td>", {text: xx, id: 'cob' + idx});

                }
            }

            atd.appendTo(atr);

            break;

        case "CheckedInBy":

            if ((clear_ByFields == true) || (item.MRN == null)) {

                xx = "";
            }

            if (xx == "") {

                var atd = $("<td>", {text: xx, id: 'cib' + idx});
            }
            else {

                if (toolTipsWanted == true) { //only tootips for this table

                    var tooltip = "Returned on " + item.CheckInTime;
                    var atd = $("<td>", {
                        text: xx,
                        id: 'cib' + idx,
                        "data-toggle": "tooltip",
                        "data-placement": "top",
                        "data-container": "body",
                        title: tooltip
                    });
                }
                else {
                    var atd = $("<td>", {text: xx, id: 'cib' + idx});

                }
            }

            atd.appendTo(atr);

            break;

        case "tabletype":
            break;

        default:

            var atd = $("<td>", {text: value});
            atd.appendTo(atr);

            break;
    }

}

function checkOutTablet(idx:string) {

    currBedIdx = parseInt(idx);

    currFunc = "checkout";

    $("#tabletid").val("");
    $("#promptError").text("");

    $("#tabletSave").text("Check out tablet");

    $("#promptHdr").text("To check out the tablet, scan its asset tag or manually enter the asset tag number");
    $("#divPrompt").modal('show');

}

function checkInTablet(idx:string) {

    currBedIdx = parseInt(idx);

    currFunc = "checkin";

    $("#tabletid").val("");
    $("#promptError").text("");
    $("#tabletSave").text("Check in tablet");
    $("#promptHdr").text("To check in the tablet, scan its asset tag or manually enter the asset tag number");

    $("#divPrompt").modal('show');

}

function tabletSave(savetype:string) {

    if (currFunc == "checkout") {
        checkoutSave(savetype);
    }
    else {
        checkinSave(savetype);
    }
}

function checkoutSave(savetype:string) {

    var tabletId:string = (savetype == 'cancel') ? "" : $("#tabletid").val();

    $("#divPrompt").modal('hide');

    if (_.isEmpty(tabletId) == true) {
        return;
    }

    var aunit = _.clone(beds[currBedIdx]);
    aunit.TabletID = tabletId;
    aunit.CheckedOutBy = loggedInUser.user;

    var url = peSvcUrl + "units";

    invokeSvc(url, "POST", aunit, parseCheckOutData);

}

function checkinSave(savetype:string) {

    var aunit = beds[currBedIdx];
    var tabletId:string = (savetype == 'cancel') ? "" : $("#tabletid").val();

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


function parseCheckOutData(data:Bed) {

    if (data.Status == "ok") {

        var idx = currBedIdx;// _.findIndex(beds, { BedID: data.BedID });

        if ((data.CheckOutTime != null) && (data.CheckOutTime.length > 16))
            data.CheckOutTime = data.CheckOutTime.replace("T", " ").substring(0, data.CheckOutTime.lastIndexOf(".") - 3);

        beds[idx].CheckOutTime = data.CheckOutTime;
        beds[idx].CheckedOutBy = data.CheckedOutBy;
        beds[idx].CheckInTime = null;
        beds[idx].TabletID = data.TabletID;
        beds[idx].idInventory = data.idInventory;

        buildTables();

        $("#divAlert").toggle(false);

    }
    else {

        showAlert("Error checking out tablet: " + data.ErrMsg, "glyphicon-exclamation-sign");
    }

}

function parseCheckInData(data:Bed) {

    if (data.Status == "ok") {

        var idx = currBedIdx;// _.findIndex(beds, { BedID: data.BedID });

        if ((data.CheckInTime != null) && (data.CheckInTime.length > 16))
            data.CheckInTime = data.CheckInTime.replace("T", " ").substring(0, data.CheckInTime.lastIndexOf(".") - 3);

        beds[idx].CheckInTime = data.CheckInTime;
        beds[idx].Discharged = "N"; //always reset discharge flag...once a tablet is checked in, discharge does not matter

        buildTables();

        $("#divAlert").toggle(false);
    }
    else {
        showAlert("Error checking in tablet:" + data.ErrMsg, "glyphicon-exclamation-sign");
    }
}

function sortColumn(tableName:string, sortColumn:string) {

    var table:JQuery = $(tableName);
    var data:Bed[] = table.data(tableName);

    if (_.isEmpty(data) == true) return;

    var direction:string = table.data(sortColumn);

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

    //createTable(sortedData, table, "ok");

}
