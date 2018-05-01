import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class RedditProvider {
  questionBankSize: number;
  sortBy: string;

  constructor(public http: HttpClient) {
    console.log('Hello RedditProvider Provider');
  }

  setSettings(questionBankSize: number, sortBy: string) {
    this.questionBankSize = questionBankSize;
    this.sortBy = sortBy;
  }

  GetRealHeadlines():Observable<any>{
    
    console.log("Reddit.ts questionBankSize: " + this.questionBankSize);
    console.log("Reddit.ts sortBy: " + this.sortBy);
    let url: string = "https://www.reddit.com/r/nottheonion/" + this.sortBy + ".json?" + (this.sortBy === "new" ? "" : "t=all&") + "limit=" + this.questionBankSize;
    console.log("Real headline url: " + url);
    return this.http.get(url);
  }

  GetFakeHeadlines():Observable<any>{
    let url: string = "https://www.reddit.com/r/theonion/" + this.sortBy + ".json?" + (this.sortBy === "new" ? "" : "t=all&") + "limit=" + this.questionBankSize;
    return this.http.get(url);
  }
}
