System.register(['angular2/core', "./appcommon", "./getData.service", "./getLocalData.service"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, appcommon_1, appcommon_2, appcommon_3, getData_service_1, getLocalData_service_1;
    var Index;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (appcommon_1_1) {
                appcommon_1 = appcommon_1_1;
                appcommon_2 = appcommon_1_1;
                appcommon_3 = appcommon_1_1;
            },
            function (getData_service_1_1) {
                getData_service_1 = getData_service_1_1;
            },
            function (getLocalData_service_1_1) {
                getLocalData_service_1 = getLocalData_service_1_1;
            }],
        execute: function() {
            Index = (function () {
                function Index(_ds, _ls) {
                    var _this = this;
                    this._ds = _ds;
                    this._ls = _ls;
                    this.doLogin = function (u, p) {
                        //var u = $("#username").val();
                        //var p = $("#password").val();
                        var u = "irc9012"; // $("#username").val();
                        var p = "Word17nyh"; //$("#password").val();
                        if ((_.isEmpty(u) == true) || (_.isEmpty(p) == true)) {
                            appcommon_2.showAlert("Please enter all fields", "glyphicon-exclamation-sign");
                        }
                        else {
                            appcommon_2.showAlert("Logging in....", "glyphicon-info-sign", "alert-info");
                            //$("#btnSubmit").prop("disabled", true);
                            //$("#btnSubmit").css("cursor", "wait");
                            var auser = { UserName: u, Password: p };
                            //var url = "http://" + window.location.host + "/login";
                            var url = appcommon_3.peSvcUrl + "login";
                            _this.sloginTime = new Date().getTime();
                            _this._ds.getData(url, "POST", auser)
                                .subscribe(_this.parseLoginData, _this.parseLoginDataErr);
                        }
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
                            _this._ls.setLocalData(appcommon_1.lsName, o);
                            //window.localStorage.setItem(lsName, JSON.stringify(o));
                            var page = "grid.html";
                            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + page;
                        }
                        else {
                            var msg = "Invalid cwid and/or password";
                            if (data.ErrMsg.indexOf('exception') != -1) {
                                msg = "Communications error, please contact support";
                            }
                            appcommon_2.showAlert(msg, "glyphicon-exclamation-sign", "alert-danger");
                            $("#btnSubmit").button('reset');
                            $("#btnSubmit").prop("disabled", false);
                            $("#btnSubmit").css("cursor", "pointer");
                        }
                    };
                    this.parseLoginDataErr = function (data) {
                        var msg = "Invalid cwid and/or password";
                        if (data.ErrMsg.indexOf('exception') != -1) {
                            msg = "Communications error, please contact support";
                        }
                        appcommon_2.showAlert(msg, "glyphicon-exclamation-sign", "alert-danger");
                        $("#btnSubmit").button('reset');
                        $("#btnSubmit").prop("disabled", false);
                        $("#btnSubmit").css("cursor", "pointer");
                    };
                    this.logReady = function () {
                        console.log('hee');
                        $(document).ready(function () {
                            //$("#btnSubmit").on("click", this.doLogin);
                            $('.container').keypress(function (e) {
                                if (e.which == 13) {
                                }
                            });
                        }); //end doc ready
                    };
                    console.log('index constructor');
                }
                Index.prototype.ngOnInit = function () {
                    console.log('Index oninit');
                };
                Index = __decorate([
                    core_1.Component({
                        selector: 'loginForm',
                        templateUrl: 'app/loginForm.html',
                        providers: [getData_service_1.getDataService, getLocalData_service_1.getLocalDataService]
                    }), 
                    __metadata('design:paramtypes', [getData_service_1.getDataService, getLocalData_service_1.getLocalDataService])
                ], Index);
                return Index;
            })();
            exports_1("Index", Index);
        }
    }
});
//var x = new Login("hello");
//x.logReady();
//# sourceMappingURL=index.js.map