import {Injectable} from 'angular2/core';
import {Http, RequestOptions, RequestOptionsArgs} from 'angular2/http';

@Injectable()
export class getDataService{

    constructor(public http: Http) {}

    getData(url: string, httpfunction: string, data: any) {

        //let ro: RequestOptionsArg = { method: httpfunction};

        switch (httpfunction) {

            case "GET":
                this.http.get(url)
                    .map(function(item,idx) {
                        return item.json();
                    })
                    .subscribe(next, error, complete);
                break;
            case "POST":
                this.http.post(url)
                    .map(function(item,idx) {
                        return item.json();
                    })
                    .subscribe(next, error, complete);
                break;

        }
        console.log("getdata");
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