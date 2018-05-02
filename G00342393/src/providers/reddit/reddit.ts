import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class RedditProvider {
  // variables passed in from settings.ts, to be used when calling the Reddit API
  questionBankSize: number;
  sortBy: string;

  constructor(public http: HttpClient) {
    console.log('Hello RedditProvider Provider');
  }

  // called from game.ts
  setSettings(questionBankSize: number, sortBy: string) {
    this.questionBankSize = questionBankSize;
    this.sortBy = sortBy;
  }

  // get real headlines from /r/nottheonion, based on the
  // settings the user set
  GetRealHeadlines():Observable<any>{
    let url: string = "https://www.reddit.com/r/nottheonion/" + this.sortBy + ".json?" + (this.sortBy === "new" ? "" : "t=all&") + "limit=" + this.questionBankSize;
    return this.http.get(url);
  }

  // get fake headlines from /r/theonion, based on the
  // settings the user set
  GetFakeHeadlines():Observable<any>{
    let url: string = "https://www.reddit.com/r/theonion/" + this.sortBy + ".json?" + (this.sortBy === "new" ? "" : "t=all&") + "limit=" + this.questionBankSize;
    return this.http.get(url);
  }
}
