System.register(['lodash', 'jquery', 'bootstrap/js/bootstrap.js', "./appcommon"], function(exports_1) {
    var _, jquery_1, appcommon_1, appcommon_2, appcommon_3, appcommon_4;
    var prevSortColumn, currBedIdx, currFunc, eunits, wunits, beds, loggedInUser;
    function indexReady() {
        jquery_1.default(document).ready(function () {
            // doingStats = false;
            var isLoggedIn = verifyLogin();
            if (isLoggedIn == false) {
                window.location.href = "http://" + window.location.host + "/login.html";
            }
            //get all units in all campuses
            getAllUnits();
            jquery_1.default("#campusHdr").text((loggedInUser.preferredCampus == "E") ? "East Campus" : "West Campus");
            //set up click handlers
            jquery_1.default('input[type=radio][name=campuses]').on('change', changeCampuses);
            jquery_1.default("#btnLogoff").on("click", doLogoff);
            jquery_1.default("#sidebar-toggle").click(toggleSidebar);
            //$('[data-toggle="tooltip"]').tooltip();
            jquery_1.default('body').tooltip({ selector: '[data-toggle="tooltip"]' });
            //set focus to input field when bootstrap modal shows
            jquery_1.default('#divPrompt').on('shown.bs.modal', function () {
                jquery_1.default('#tabletid').focus();
            });
        });
    }
    function toggleSidebar(e) {
        e.preventDefault();
        if (jquery_1.default("#sidebar-toggle-img").hasClass("glyphicon glyphicon-arrow-left") == true) {
            var remove = "glyphicon glyphicon-arrow-left";
            var add = "glyphicon glyphicon-arrow-right";
        }
        else {
            var remove = "glyphicon glyphicon-arrow-right";
            var add = "glyphicon glyphicon-arrow-left";
        }
        jquery_1.default("#sidebar-toggle-img").removeClass(remove);
        jquery_1.default("#sidebar-toggle-img").addClass(add);
        jquery_1.default("#wrapper").toggleClass("toggled");
    }
    function verifyLogin() {
        var rc = true;
        var xx = window.localStorage.getItem(appcommon_1.lsName);
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
        var url = appcommon_3.peSvcUrl + "units";
        appcommon_4.invokeSvc(url, "GET", null, parseAllUnitsData);
    }
    function parseAllUnitsData(data) {
        if (data.Status != "ok") {
            console.log(data.Status + "," + data.ErrMsg);
            appcommon_2.showAlert("Error getting campus units:" + data.ErrMsg, 'glyphicon-exclamation-sign"');
            return;
        }
        var allUnits = data.Units;
        //separate east units from west units
        var unitsByCampus = _.groupBy(allUnits, function (aunit) {
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
            var preferredUnitIdx = _.result(_.find(allUnits, 'unitName', loggedInUser.preferredUnit), 'idUnit');
            //trigger click event on link to get all beds on unit
            jquery_1.default("#u" + preferredUnitIdx).trigger('click');
        }
    }
    function changeCampuses() {
        jquery_1.default("#beds").empty();
        jquery_1.default("#beds1").empty();
        jquery_1.default("#hdrDisNoReturn").empty();
        jquery_1.default("#stats").empty();
        jquery_1.default("#unitHdr").empty();
        var xx = jquery_1.default(this).prop('id');
        switch (xx) {
            case 'rbEast':
                jquery_1.default("#lblWest").removeClass('active');
                activateCampus("#eastUnits", "#westUnits", "#lblEast", eunits);
                loggedInUser.preferredCampus = "E";
                jquery_1.default("#campusHdr").text("East Campus");
                break;
            case 'rbWest':
                jquery_1.default("#lblEast").removeClass('active');
                activateCampus("#westUnits", "#eastUnits", "#lblWest", wunits);
                loggedInUser.preferredCampus = "W";
                jquery_1.default("#campusHdr").text("West Campus");
                break;
        }
    }
    function activateCampus(activeListGroup, inactiveListGroup, label, units) {
        jquery_1.default(activeListGroup).toggle(true);
        jquery_1.default(inactiveListGroup).toggle(false);
        jquery_1.default(label).addClass('active');
        jquery_1.default(inactiveListGroup).empty();
        jquery_1.default(activeListGroup).empty();
        var unitsList = jquery_1.default(activeListGroup);
        jquery_1.default.each(units, function (idx, aunit) {
            var li = jquery_1.default('<li/>')
                .addClass('list-group-item')
                .appendTo(unitsList);
            var a = jquery_1.default('<a/>', {
                id: "u" + aunit.idUnit,
                text: aunit.unitName,
                href: "#"
            });
            a.bind('click', getBedsOnUnit).appendTo(li);
        });
    }
    function doLogoff() {
        var idxLogin = loggedInUser.idxLogin;
        var pcampus = loggedInUser.preferredCampus;
        var punit = loggedInUser.preferredUnit;
        var theuser = loggedInUser.user;
        var url = appcommon_3.peSvcUrl + "login/" + idxLogin;
        var o = {
            userName: theuser,
            preferredCampus: pcampus,
            preferredUnit: punit
        };
        appcommon_4.invokeSvc(url, "PUT", o, parseLogoffData);
    }
    function parseLogoffData(data) {
        if (data.Status != "ok") {
            console.log(data.Status + "," + data.ErrMsg);
        }
        window.localStorage.setItem(appcommon_1.lsName, JSON.stringify(loggedInUser));
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "login.html";
    }
    function getBedsOnUnit() {
        var preferredUnitIdx = this.id.substring(1);
        var preferredUnit = jquery_1.default(this).text();
        var actEl = jquery_1.default(this).closest('.list-group').children('.active');
        actEl.removeClass('active').css('background-color', 'white');
        jquery_1.default(this).closest('.list-group-item').addClass('active').css('background-color', 'lightcyan');
        loggedInUser.preferredUnit = preferredUnit;
        var url = appcommon_3.peSvcUrl + "units/" + preferredUnitIdx;
        jquery_1.default("#beds").empty();
        jquery_1.default("#beds1").empty();
        jquery_1.default("#hdrDisNoReturn").empty();
        jquery_1.default("#waitingUnit").text("Retrieving bed data for unit " + preferredUnit);
        jquery_1.default("#campusHdr").text((loggedInUser.preferredCampus == "E") ? "East Campus," : "West Campus,");
        jquery_1.default("#unitHdr").text(" unit " + preferredUnit);
        jquery_1.default("#waitForBedInfo").modal();
        appcommon_4.invokeSvc(url, "GET", null, parseBedData);
    }
    function parseBedData(data) {
        if (data.Status != "ok") {
            console.log(data.Status + ',' + data.ErrMsg);
            appcommon_2.showAlert("Error getting bed on unit:" + data.ErrMsg, "glyphicon-exclamation-sign");
            jquery_1.default("#waitForBedInfo").modal('hide');
            return;
        }
        jquery_1.default("#divAlert").toggle(false);
        beds = data.BedPatients;
        //build both tables
        buildTables();
        jquery_1.default("#waitForBedInfo").modal('hide');
    }
    function buildTables() {
        var anyNotReturned = false;
        var tabletype = 'ok';
        //normalize time fields and don't put some attributes in the table
        var temp1 = _.map(beds, function (abed) {
            if ((abed.CheckInTime != null) && (abed.CheckInTime.length > 16))
                abed.CheckInTime = abed.CheckInTime.replace("T", " ").substring(0, abed.CheckInTime.lastIndexOf(".") - 3);
            if ((abed.CheckOutTime != null) && (abed.CheckOutTime.length > 16))
                abed.CheckOutTime = abed.CheckOutTime.replace("T", " ").substring(0, abed.CheckOutTime.lastIndexOf(".") - 3);
            //search forr discharged patients with tablets still checked out
            if (abed.Discharged != 'Y') {
                tabletype = 'ok'; //not discharged, place in first table
            }
            else {
                //discharged
                if (abed.CheckOutTime == null) {
                    tabletype = 'ok'; //no...place in first table
                }
                else {
                    //tablet checked out
                    if (abed.CheckInTime == null) {
                        tabletype = "notreturned"; //no...discharged with tablet still checked out
                        anyNotReturned = true;
                    }
                    else {
                        tabletype = "ok"; //yes...first table
                    }
                }
            }
            _.set(abed, 'tabletype', tabletype);
            return _.omit(abed, ['idInventory', 'Campus', 'Unit', 'Status', 'ErrMsg', 'Discharged']);
        });
        createTable(temp1, jquery_1.default("#beds"), "ok");
        if (anyNotReturned == false) {
            jquery_1.default("#hdrDisNoReturn").html("Tablets assigned to discharged patients, not returned -- None");
            jquery_1.default("#beds1").empty();
        }
        else {
            jquery_1.default("#hdrDisNoReturn").html("Tablets assigned to discharged patients, not returned");
            //createTable(bedDataForNotReturned, $("#beds1"));
            createTable(temp1, jquery_1.default("#beds1"), "notreturned");
        }
    }
    function createTable(tableData, bedTable, tabletype) {
        bedTable.empty();
        var tableName = bedTable.selector;
        bedTable.data(tableName, tableData);
        var atrhead = jquery_1.default("<tr>");
        atrhead.css('background-color', 'lightblue');
        _.forEach(tableData, function (abed, curridx) {
            if (abed.tabletype == tabletype) {
                var atr = jquery_1.default("<tr>");
                var CheckedOut = false;
            }
            _.forOwn(abed, function (value, key, item) {
                if (curridx == 0) {
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
                        default: akey = key;
                    }
                    if (akey != "") {
                        var direction = bedTable.data(key);
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
                        var ath = jquery_1.default("<th>", { text: akey /*, onclick: "sortColumn('" + tableName + "', '" + key + "')"*/ });
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
                                var atd = jquery_1.default("<td>", { id: 'co' + idx });
                                var aa = jquery_1.default("<a>", { href: "#", onclick: "checkOutTablet('" + idx + "')", text: "CHECK OUT" });
                                var aspan = jquery_1.default("<span>", { class: "glyphicon glyphicon-arrow-right", style: "color: green; padding-left: 5px;" });
                                aspan.appendTo(aa);
                                aa.appendTo(atd);
                                atd.appendTo(atr);
                            }
                            else {
                                //item is checkedout, but has it been checked in
                                var checkintime = item.CheckInTime;
                                if (_.isEmpty(checkintime) == true) {
                                    //no, still assigned
                                    var atd = jquery_1.default("<td>", { id: 'co' + idx, text: "TABLET ASSIGNED" });
                                    CheckedOut = true;
                                }
                                else {
                                    //yes, it can be checked out
                                    var bedid = item.BedID;
                                    var atd = jquery_1.default("<td>", { id: 'co' + idx });
                                    var aa = jquery_1.default("<a>", { href: "#", onclick: "checkOutTablet('" + idx + "')", text: "CHECK OUT" });
                                    var aspan = jquery_1.default("<span>", { class: "glyphicon glyphicon-arrow-right", style: "color: green; padding-left: 5px;" });
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
                                var atd = jquery_1.default("<td>", { id: 'ci' + idx });
                                var aa = jquery_1.default("<a>", { href: "#", onclick: "checkInTablet('" + idx + "')", text: "CHECK IN" });
                                var aspan = jquery_1.default("<span>", { class: "glyphicon glyphicon-remove", style: "color: red; padding-left: 5px;" });
                                aspan.appendTo(aa);
                                aa.appendTo(atd);
                                atd.appendTo(atr);
                            }
                            else {
                                //
                                var atd = jquery_1.default("<td>", { id: 'ci' + idx, text: "" });
                            }
                            atd.appendTo(atr);
                            break;
                        case "TabletID":
                            var atd = jquery_1.default("<td>", { text: xx, id: 'tablet' + idx });
                            atd.appendTo(atr);
                            break;
                        case "CheckedOutBy":
                            if (value == null) {
                                var atd = jquery_1.default("<td>", { text: xx, id: 'cob' + idx });
                            }
                            else {
                                if (bedTable[0].id == "beds") {
                                    var tooltip = "Assigned on " + item.CheckOutTime;
                                    var atd = jquery_1.default("<td>", { text: xx, id: 'cob' + idx, "data-toggle": "tooltip", "data-placement": "top", "data-container": "body", title: tooltip });
                                }
                                else {
                                    var atd = jquery_1.default("<td>", { text: xx, id: 'cob' + idx });
                                }
                            }
                            atd.appendTo(atr);
                            break;
                        case "CheckedInBy":
                            if (value == null) {
                                var atd = jquery_1.default("<td>", { text: xx, id: 'cib' + idx });
                            }
                            else {
                                if (bedTable[0].id == "beds") {
                                    var tooltip = "Returned on " + item.CheckInTime;
                                    var atd = jquery_1.default("<td>", { text: xx, id: 'cib' + idx, "data-toggle": "tooltip", "data-placement": "top", "data-container": "body", title: tooltip });
                                }
                                else {
                                    var atd = jquery_1.default("<td>", { text: xx, id: 'cib' + idx });
                                }
                            }
                            atd.appendTo(atr);
                            break;
                        case "tabletype":
                            break;
                        default:
                            var atd = jquery_1.default("<td>", { text: value });
                            atd.appendTo(atr);
                            break;
                    }
                }
            }); //end forown
            if (curridx == 0)
                atrhead.appendTo(bedTable);
            if (abed.tabletype == tabletype)
                atr.appendTo(bedTable);
        }); //end foreach
    }
    function sortColumn(tableName, sortColumn) {
        var table = jquery_1.default(tableName);
        var data = table.data(tableName);
        if (_.isEmpty(data) == true)
            return;
        var direction = table.data(sortColumn);
        if (_.isEmpty(direction) == true) {
            direction = 'asc';
        }
        else {
            direction = (direction == 'asc') ? 'desc' : 'asc';
        }
        if (prevSortColumn != "") {
            table.data(prevSortColumn, "");
        }
        prevSortColumn = sortColumn;
        table.data(sortColumn, direction);
        jquery_1.default(tableName + " th > span").attr('class', 'glyphicon glyphicon-triangle-right').css('color', 'red');
        var sortedData = _.sortByOrder(data, [sortColumn], [direction]);
        createTable(sortedData, table, "ok");
    }
    function tabletSave(savetype) {
        if (currFunc == "checkout") {
            checkoutSave(savetype);
        }
        else {
            checkinSave(savetype);
        }
    }
    function checkoutSave(savetype) {
        var tabletId;
        tabletId = (savetype == 'cancel') ? "" : jquery_1.default("#tabletid").val();
        jquery_1.default("#divPrompt").modal('hide');
        if (_.isEmpty(tabletId) == true) {
            return;
        }
        var aunit = _.clone(beds[currBedIdx]);
        aunit.TabletID = tabletId;
        aunit.CheckedOutBy = loggedInUser.user;
        var url = appcommon_3.peSvcUrl + "units";
        appcommon_4.invokeSvc(url, "POST", aunit, parseCheckOutData);
    }
    function checkinSave(savetype) {
        var result;
        var tabletId;
        var aunit = beds[currBedIdx];
        tabletId = (savetype == 'cancel') ? "" : jquery_1.default("#tabletid").val();
        if (_.isEmpty(tabletId) == true) {
            jquery_1.default("#divPrompt").modal('hide');
            return;
        }
        if (tabletId != aunit.TabletID) {
            var msg = "The id of the checked in tablet must match the id of the checked out tablet. Please reenter";
            jquery_1.default("#promptError").text(msg);
            return;
        }
        jquery_1.default("#divPrompt").modal('hide');
        aunit.CheckedInBy = loggedInUser.user;
        var url = appcommon_3.peSvcUrl + "units";
        appcommon_4.invokeSvc(url, "PUT", aunit, parseCheckInData);
    }
    function checkOutTablet(idx) {
        currBedIdx = parseInt(idx);
        currFunc = "checkout";
        jquery_1.default("#tabletid").val("");
        jquery_1.default("#promptError").text("");
        jquery_1.default("#tabletSave").text("Check out tablet");
        jquery_1.default("#promptHdr").text("To check out the tablet, scan its asset tag or manually enter the asset tag number");
        jquery_1.default("#divPrompt").modal('show');
    }
    function checkInTablet(idx) {
        currBedIdx = parseInt(idx);
        currFunc = "checkin";
        jquery_1.default("#tabletid").val("");
        jquery_1.default("#promptError").text("");
        jquery_1.default("#tabletSave").text("Check in tablet");
        jquery_1.default("#promptHdr").text("To check in the tablet, scan its asset tag or manually enter the asset tag number");
        jquery_1.default("#divPrompt").modal('show');
    }
    function parseCheckOutData(data) {
        if (data.Status == "ok") {
            if ((data.CheckOutTime != null) && (data.CheckOutTime.length > 16))
                data.CheckOutTime = data.CheckOutTime.replace("T", " ").substring(0, data.CheckOutTime.lastIndexOf(".") - 3);
            var idx = currBedIdx; // _.findIndex(beds, { BedID: data.BedID });
            beds[idx].CheckOutTime = data.CheckOutTime;
            beds[idx].CheckedOutBy = data.CheckedOutBy;
            beds[idx].CheckInTime = null;
            beds[idx].TabletID = data.TabletID;
            beds[idx].idInventory = data.idInventory;
            buildTables();
            jquery_1.default("#divAlert").toggle(false);
        }
        else {
            appcommon_2.showAlert("Error checking out tablet: " + data.ErrMsg, "glyphicon-exclamation-sign");
        }
    }
    function parseCheckInData(data) {
        if (data.Status == "ok") {
            var idx = currBedIdx; // _.findIndex(beds, { BedID: data.BedID });
            if ((data.CheckInTime != null) && (data.CheckInTime.length > 16))
                data.CheckInTime = data.CheckInTime.replace("T", " ").substring(0, data.CheckInTime.lastIndexOf(".") - 3);
            beds[idx].CheckInTime = data.CheckInTime;
            beds[idx].Discharged = "N"; //always reset discharge flag...once a tablet is checked in, discharge does not matter
            buildTables();
            jquery_1.default("#divAlert").toggle(false);
        }
        else {
            appcommon_2.showAlert("Error checking in tablet:" + data.ErrMsg, "glyphicon-exclamation-sign");
        }
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (_2) {},
            function (appcommon_1_1) {
                appcommon_1 = appcommon_1_1;
                appcommon_2 = appcommon_1_1;
                appcommon_3 = appcommon_1_1;
                appcommon_4 = appcommon_1_1;
            }],
        execute: function() {
            prevSortColumn = "";
            eunits = [];
            wunits = [];
            beds = [];
            loggedInUser = null;
            //var doingStats;
            indexReady();
        }
    }
});
//# sourceMappingURL=index.js.map