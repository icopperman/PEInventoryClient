import {Injectable} from 'angular2/core';

@Injectable()
export class getDataService{

    getData(url: string, httpfunction: string, data: any) {

        console.log("getdata");
    }

}
