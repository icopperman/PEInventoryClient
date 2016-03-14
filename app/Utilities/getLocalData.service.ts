import {Injectable} from './../../node_modules/angular2/core';
import {Bed, Beds, CheckInData, LocalLoginData, LogoffData, returnStatus} from "./interfaces";
import {LoginData, Unit, Units} from "./interfaces";

@Injectable()
export class getLocalDataService {

    constructor() {
        console.log('local data service constructor');
    }

    getLocalData(lsName:string, caller: string): LocalLoginData {

        console.log("getlocaldata: " + lsName + ',' + caller);
        var xx: string = window.localStorage.getItem(lsName);
        var rtnObj: LocalLoginData = JSON.parse(xx);
        return rtnObj;
    }

    setLocalData(lsName:string, loggedInUser: LocalLoginData): void {

        console.log("setlocaldata");
        var xx: string = JSON.stringify(loggedInUser);
        window.localStorage.setItem(lsName, xx);

    }

}
function next(arg) {
    console.log('next');
}
function error(arg) {
    console.log('error');
}
function complete() {
    console.log('complete');
}