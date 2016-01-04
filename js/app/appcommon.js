System.register(['jquery'], function(exports_1) {
    var jquery_1;
    var peSvcUrl, lsName;
    function showAlert(msg, icon, alertClass) {
        if (alertClass != null) {
            jquery_1.default("#divAlert").removeClass().addClass("alert " + alertClass);
        }
        jquery_1.default("#msgIcon").removeClass();
        jquery_1.default("#msgIcon").addClass("glyphicon " + icon);
        jquery_1.default("#msgAlert").text(msg);
        jquery_1.default("#divAlert").toggle(true);
    }
    exports_1("showAlert", showAlert);
    function invokeSvc(url, op, user, responseFunc) {
        var xx = JSON.stringify(user);
        jquery_1.default.support.cors = true;
        jquery_1.default.ajax(url, {
            type: op,
            contentType: "application/json",
            data: xx,
            success: function (data) {
                responseFunc(data);
            },
            error: function (jqxhr, textstatus, errorthrown) {
                console.log("invoked webapi svc, error: " + textstatus + "," + errorthrown);
                showAlert("Comunication error, please try later", "glyphicon-exclamation-sign");
                jquery_1.default("#btnSubmit").button('reset');
                jquery_1.default("#btnSubmit").prop("disabled", false);
                jquery_1.default("#btnSubmit").css("cursor", "pointer");
                jquery_1.default("#waitForBedInfo").modal('hide');
            }
        });
    }
    exports_1("invokeSvc", invokeSvc);
    return {
        setters:[
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            }],
        execute: function() {
            exports_1("peSvcUrl", peSvcUrl = "http://webdev.nyp.org/InventoryTrackerSvcProd/");
            //export var peSvcUrl = "http://webdev.nyp.org/InventoryTrackerSvc/";
            //var peSvcUrl = "http://nypstag1mn:999/";
            //var peSvcUrl = "http://localhost:58087/";
            exports_1("lsName", lsName = "loggedInUserClient");
        }
    }
});
//# sourceMappingURL=appcommon.js.map