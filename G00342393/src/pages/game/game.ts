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
  headline1: string = "Alexa exec Charlie Kindel leaves Amazon to spend more time with his smart home";
  headline2: string = "Report: Rest Of Pottery Class Knows Each Other From Previous Pottery Class ";
  realHeadlines: string[]=[];
  fakeHeadlines: string[]=[];

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
    })
  }

}
