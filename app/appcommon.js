System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var peSvcUrl, lsName;
    function showAlert(msg, icon, alertClass) {
        if (alertClass != null) {
            $("#divAlert").removeClass().addClass("alert " + alertClass);
        }
        $("#msgIcon").removeClass();
        $("#msgIcon").addClass("glyphicon " + icon);
        $("#msgAlert").text(msg);
        $("#divAlert").toggle(true);
    }
    exports_1("showAlert", showAlert);
    function invokeSvc(url, op, user, responseFunc) {
        var xx = JSON.stringify(user);
        $.support.cors = true;
        $.ajax(url, {
            type: op,
            contentType: "application/json",
            data: xx,
            success: function (data) {
                responseFunc(data);
            },
            error: function (jqxhr, textstatus, errorthrown) {
                console.log("invoked webapi svc, error: " + textstatus + "," + errorthrown);
                showAlert("Comunication error, please try later", "glyphicon-exclamation-sign");
                $("#btnSubmit").button('reset');
                $("#btnSubmit").prop("disabled", false);
                $("#btnSubmit").css("cursor", "pointer");
                $("#waitForBedInfo").modal('hide');
            }
        });
    }
    exports_1("invokeSvc", invokeSvc);
    return {
        setters:[],
        execute: function() {
            //export var peSvcUrl = "http://webdev.nyp.org/InventoryTrackerSvcProd/"
            exports_1("peSvcUrl", peSvcUrl = "http://webdev.nyp.org/InventoryTrackerSvc/");
            //var peSvcUrl = "http://nypstag1mn:999/";
            //var peSvcUrl = "http://localhost:58087/";
            exports_1("lsName", lsName = "loggedInUserClient");
        }
    }
});
//# sourceMappingURL=appcommon.js.map