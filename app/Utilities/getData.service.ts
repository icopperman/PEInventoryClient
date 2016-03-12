import {Injectable} from '../../node_modules/angular2/core.d';
import {Http,  HTTP_PROVIDERS, Request, RequestMethod, RequestOptions, Headers} from '../../node_modules/angular2/http.d';
import '../../node_modules/rxjs/Rx.d';
//import Observable = Rx.Observable;

@Injectable()
export class getDataService {

    constructor(public http:Http) {

    }

    getData(url:string, httpfunction:string, data:any) {

        //let ro: RequestOptionsArg = { method: httpfunction};

        switch (httpfunction) {

            case "GET":
                return this.http.get(url)
                    .map(function (item, idx) {
                        return item.json();
                    });
                 //   .subscribe(next, error, complete);
                //break;
            case "POST":
                let abody:string = JSON.stringify(data);
                let theheaders:Headers = new Headers();
                theheaders.append("Content-type", "application/json");

                let ro:RequestOptions = new RequestOptions({
                    method: RequestMethod.Post,
                    headers: theheaders,
                    body: abody,
                    url: url

                });
                return this.http.request(new Request(ro))
                    .map(function (item, idx) {
                        return item.json();
                    });

                //    .subscribe(next, error, complete);
                //break;

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