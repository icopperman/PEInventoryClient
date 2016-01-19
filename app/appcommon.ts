//import * as _ from 'lodash';
//import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

//import _ from 'lodash';
//import $ from 'jquery';
//import bootstrap from 'bootstrap';

export var peSvcUrl = "http://webdev.nyp.org/InventoryTrackerSvcProd/"
//export var peSvcUrl = "http://webdev.nyp.org/InventoryTrackerSvc/";
//var peSvcUrl = "http://nypstag1mn:999/";
//var peSvcUrl = "http://localhost:58087/";

export var lsName = "loggedInUserClient";

export function showAlert(msg:string, icon?:string, alertClass?:string) {

    if (alertClass != null) {

        $("#divAlert").removeClass().addClass("alert " + alertClass);

    }

    $("#msgIcon").removeClass();
    $("#msgIcon").addClass("glyphicon " + icon);
    $("#msgAlert").text(msg);

    $("#divAlert").toggle(true);

}

export function invokeSvc(url:string, op:string, user:any, responseFunc:Function) {

    var xx = JSON.stringify(user);

    $.support.cors = true;

    $.ajax(url,
        {
            type: op,
            contentType: "application/json",
            data: xx,
            success: function (data:any) {
                responseFunc(data);
            },
            error: function (jqxhr:JQueryXHR, textstatus:string, errorthrown:string) {

                console.log("invoked webapi svc, error: " + textstatus + "," + errorthrown);

                showAlert("Comunication error, please try later", "glyphicon-exclamation-sign");

                $("#btnSubmit").button('reset');
                $("#btnSubmit").prop("disabled", false);
                $("#btnSubmit").css("cursor", "pointer");
                $("#waitForBedInfo").modal('hide');

            }
            //,beforeSend: function () {
            //    console.log("invoke webapi svc, before send");
            //}
            //,complete: function (jqxhr, textstatus) {
            //    console.log("invoked webapi svc, complete: " + textstatus);
            //}
        });

}


