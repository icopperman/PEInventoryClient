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


