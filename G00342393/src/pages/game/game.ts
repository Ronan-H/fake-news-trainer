import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedditProvider } from '../../providers/reddit/reddit';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  questionBankSize: number;
  sortBy: string;
  headline1: string = "Loading...";
  headline2: string = "Loading...";
  fakeHeadlineNum: number;
  realHeadlines: string[]=[];
  fakeHeadlines: string[]=[];
  headlinesSet: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private rp:RedditProvider) {
    this.questionBankSize = navParams.get("questionBankSize");
    this.sortBy = navParams.get("sortBy");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');

    this.rp.setSettings(this.questionBankSize, this.sortBy);

    this.rp.GetRealHeadlines().subscribe(data =>
    {
        for (var index in data["data"]["children"]) {
          var titleData = data["data"]["children"][index]["data"]["title"];
          console.log("titleData: " + titleData);
          this.realHeadlines.push(titleData);
        }
        
        for (var headline of this.realHeadlines) {
          console.log("Real headline: " + headline);
        }
        
        if (!this.headlinesSet) {
          this.setNewHeadlines();
          this.headlinesSet = true;
        }
    })

    this.rp.GetFakeHeadlines().subscribe(data =>
    {
      for (var index in data["data"]["children"]) {
        var titleData = data["data"]["children"][index]["data"]["title"];
        console.log("titleData: " + titleData);
        this.fakeHeadlines.push(titleData);
      }
      
      for (var headline of this.fakeHeadlines) {
        console.log("Fake headline: " + headline);
      }

      if (!this.headlinesSet) {
        this.setNewHeadlines();
        this.headlinesSet = true;
      }
    })
  }

  setNewHeadlines() {
    this.fakeHeadlineNum = Math.floor(Math.random() * 2) + 1;

    if (this.fakeHeadlineNum == 1) {
      this.headline1 = this.getNextFakeHeadline();
      this.headline2 = this.getNextRealHeadline();
    }
    else {
      // fakeHeadlineNum is 2
      this.headline1 = this.getNextRealHeadline();
      this.headline2 = this.getNextFakeHeadline();
    }
  }

  getNextFakeHeadline(): string {
    return this.fakeHeadlines[Math.floor(Math.random() * this.fakeHeadlines.length)];
  }

  getNextRealHeadline(): string {
    return this.fakeHeadlines[Math.floor(Math.random() * this.realHeadlines.length)];
  }

  headlineClicked(headlineNum: number) {
    console.log("Headline " + headlineNum + " clicked.");
    this.setNewHeadlines();
  }

}
