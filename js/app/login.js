System.register(['lodash', 'jquery', 'bootstrap/js/bootstrap.js', "./appcommon"], function(exports_1) {
    var _, jquery_1, appcommon_1, appcommon_2, appcommon_3, appcommon_4;
    var Login, x;
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
            Login = (function () {
                function Login(msg) {
                    var _this = this;
                    this.doLogin = function () {
                        //var u = $("#username").val();
                        //var p = $("#password").val();
                        var u = "irc9012"; // $("#username").val();
                        var p = "Word16nyh"; //$("#password").val();
                        if ((_.isEmpty(u) == true) || (_.isEmpty(p) == true)) {
                            appcommon_2.showAlert("Please enter all fields", "glyphicon-exclamation-sign");
                        }
                        else {
                            appcommon_2.showAlert("Logging in....", "glyphicon-info-sign", "alert-info");
                            jquery_1.default("#btnSubmit").prop("disabled", true);
                            jquery_1.default("#btnSubmit").css("cursor", "wait");
                            var auser = { UserName: u, Password: p };
                            //var url = "http://" + window.location.host + "/login";
                            var url = appcommon_3.peSvcUrl + "login";
                            _this.sloginTime = new Date().getTime();
                            appcommon_4.invokeSvc(url, "POST", auser, _this.parseLoginData);
                        }
                    };
                    this.logReady = function () {
                        console.log('hee');
                        jquery_1.default(document).ready(function () {
                            jquery_1.default("#btnSubmit").on("click", _this.doLogin);
                            jquery_1.default('.container').keypress(function (e) {
                                if (e.which == 13) {
                                    _this.doLogin();
                                }
                            });
                        }); //end doc ready
                    };
                    this.parseLoginData = function (data) {
                        _this.eloginTime = new Date().getTime();
                        var diff = (_this.eloginTime - _this.sloginTime) / 1000;
                        if (data.Status == "ok") {
                            console.log(diff + "," + data.timeCwid + "," + data.timePswd + "," + data.timeDb);
                            var currTime = new Date().getTime();
                            var o = {
                                user: data.UserName,
                                preferredCampus: data.PreferredCampus,
                                preferredUnit: data.PreferredUnit,
                                idxUser: data.idxUser,
                                idxLogin: data.idxLogin,
                                isAdmin: data.isAdmin,
                                loginTime: currTime
                            };
                            window.localStorage.setItem(appcommon_1.lsName, JSON.stringify(o));
                            //var page = (window.location.search != '?q=2') ? "/stats.html" : "/index.html";
                            //var page = (o.isAdmin == 'Y') ? "/stats.html" : "/index.html";
                            var page = "index.html";
                            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "index.html";
                        }
                        else {
                            appcommon_2.showAlert("Invalid cwid and/or password", "glyphicon-exclamation-sign", "alert-danger");
                            jquery_1.default("#btnSubmit").button('reset');
                            jquery_1.default("#btnSubmit").prop("disabled", false);
                            jquery_1.default("#btnSubmit").css("cursor", "none");
                        }
                    };
                    console.log(msg);
                }
                return Login;
            })();
            x = new Login("hello");
            x.logReady();
        }
    }
});
//# sourceMappingURL=login.js.map