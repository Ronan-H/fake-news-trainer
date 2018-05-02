import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedditProvider } from '../../providers/reddit/reddit';
import { ToastController } from 'ionic-angular';

/**
 * This is where the game where the user can guess which headline
 * is fake and which is real happens.
*/

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  // API settings passed in from settings.ts
  questionBankSize: number;
  sortBy: string;
  // the two headlines to be displayed (updated when user guesses)
  headline1: string = "Loading...";
  headline2: string = "Loading...";
  // either 1 or 2, indicating which headline is the fake one
  fakeHeadlineNum: number;
  // list of real headlines, pulled from Reddit
  realHeadlines: string[]=[];
  // list of fake headlines, pulled from Reddit
  fakeHeadlines: string[]=[];
  // a boolean used when loading the headlines initially;
  // headlines will only be set once both sets of headlines are read in and parsed
  otherHeadlinesReady: boolean = false;
  // a tally kept of the amount the user guessed in total and number that were correct
  // from these  a percentage is also calculated
  numGuessed: number = 0;
  numCorrect: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rp:RedditProvider,
              private toastCtrl: ToastController) {
    // retrieve the variables from when this was pushed onto the nav stack
    this.questionBankSize = navParams.get("questionBankSize");
    this.sortBy = navParams.get("sortBy");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');

    // pass settings over to the provider
    this.rp.setSettings(this.questionBankSize, this.sortBy);

    this.rp.GetRealHeadlines().subscribe(data =>
    {
        // get the string array of headlines from the JSON object
        for (var index in data["data"]["children"]) {
          let titleData: string = data["data"]["children"][index]["data"]["title"];
          // put whole string to lowercase except first char, as /r/theonion
          // headlines are in Title Case while /r/nottheonion headlines tend to be
          // lower case. the user shouldn't be able to use this to tell which is fake.
          titleData = titleData.charAt(0) + titleData.slice(1).toLowerCase();
          this.realHeadlines.push(titleData);
        }

        // only load 2 headlines initially if other headlines are ready
        if (this.otherHeadlinesReady) {
          this.setNewHeadlines();
        }
        else {
          this.otherHeadlinesReady = true;
        }
    })

    this.rp.GetFakeHeadlines().subscribe(data =>
    {
      // get the string array of headlines from the JSON object
      for (var index in data["data"]["children"]) {
        let titleData: string = data["data"]["children"][index]["data"]["title"];
        // put whole string to lowercase except first char, as /r/theonion
        // headlines are in Title Case while /r/nottheonion headlines tend to be
        // lower case. the user shouldn't be able to use this to tell which is fake.
        titleData = titleData.charAt(0) + titleData.slice(1).toLowerCase();
        this.fakeHeadlines.push(titleData);
      }

      // only load 2 headlines initially if other headlines are ready
      if (this.otherHeadlinesReady) {
        this.setNewHeadlines();
      }
      else {
        this.otherHeadlinesReady = true;
      }
    })
  }

  // load in 2 new random headlines for the user to guess which is fake
  setNewHeadlines() {
    // pick which headline is fake, 1 or 2
    this.fakeHeadlineNum = Math.floor(Math.random() * 2) + 1;

    // set the 2 headlines accordingly
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

  // returns a random fake headline from the list
  getNextFakeHeadline(): string {
    return this.fakeHeadlines[Math.floor(Math.random() * this.fakeHeadlines.length)];
  }

  // returns a random real headline from the list
  getNextRealHeadline(): string {
    return this.realHeadlines[Math.floor(Math.random() * this.realHeadlines.length)];
  }

  // called when a headlines is clicked. the headline number, 1 or 2, is passed in.
  headlineClicked(headlineNum: number) {
    // true if the user's guess was correct
    let correct: boolean = (headlineNum == this.fakeHeadlineNum);

    // increment stats and calculate percentage
    this.numGuessed++;
    if (correct) this.numCorrect++;
    let guessPercentage = (this.numCorrect / this.numGuessed) * 100;

    // assemble the toast message
    let message = (correct ? "Correct!" : "Incorrect!") + " Correct guess percentage: " + guessPercentage.toFixed(2) + "%";

    // create and display the toast message
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.present();

    // load in new headlines for the user
    this.setNewHeadlines();
  }

}
