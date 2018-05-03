import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedditProvider } from '../../providers/reddit/reddit';
import { ToastController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Platform } from 'ionic-angular';

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
  // two thumbnail urls for the above headlines
  headline1thumb: string = "";
  headline2thumb: string = "";
  // either 1 or 2, indicating which headline is the fake one
  fakeHeadlineNum: number;
  // list of real headlines, pulled from Reddit
  realHeadlines: string[]=[];
  // list of fake headlines, pulled from Reddit
  fakeHeadlines: string[]=[];
  // thumbnail urls for the real headlines
  realHeadlineThumbs: string[]=[];
  // thumbnail urls for the fake headlines
  fakeHeadlineThumbs: string[]=[];
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
              private toastCtrl: ToastController,
              private nativeAudio: NativeAudio,
              public plt: Platform) {
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
          let thumb: string = data["data"]["children"][index]["data"]["thumbnail"];
          // put whole string to lowercase except first char, as /r/theonion
          // headlines are in Title Case while /r/nottheonion headlines tend to be
          // lower case. the user shouldn't be able to use this to tell which is fake.
          titleData = titleData.charAt(0) + titleData.slice(1).toLowerCase();
          this.realHeadlines.push(titleData);
          this.realHeadlineThumbs.push(thumb);
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
        let thumb: string = data["data"]["children"][index]["data"]["thumbnail"];
        // put whole string to lowercase except first char, as /r/theonion
        // headlines are in Title Case while /r/nottheonion headlines tend to be
        // lower case. the user shouldn't be able to use this to tell which is fake.
        titleData = titleData.charAt(0) + titleData.slice(1).toLowerCase();
        this.fakeHeadlines.push(titleData);
        this.fakeHeadlineThumbs.push(thumb);
      }

      // only load 2 headlines initially if other headlines are ready
      if (this.otherHeadlinesReady) {
        this.setNewHeadlines();
      }
      else {
        this.otherHeadlinesReady = true;
      }
    })

    // load sound effects for correct/incorrect ("ding"/"buzz")
    this.plt.ready().then((readySource) => {
      this.nativeAudio.preloadSimple('ding', 'assets/sfx/ding.mp3').then(this.onAudioLoadSuccess, this.onAudioLoadError);
      this.nativeAudio.preloadSimple('buzz', 'assets/sfx/buzz.mp3').then(this.onAudioLoadSuccess, this.onAudioLoadError);
    })
  }

  // load in 2 new random headlines for the user to guess which is fake
  setNewHeadlines() {
    // pick which headline is fake, 1 or 2
    this.fakeHeadlineNum = Math.floor(Math.random() * 2) + 1;

    let fakeHeadlineIndex = Math.floor(Math.random() * this.fakeHeadlines.length);
    let realHeadlineIndex = Math.floor(Math.random() * this.realHeadlines.length);

    let fakeHeadline = this.fakeHeadlines[fakeHeadlineIndex];
    let realHeadline = this.realHeadlines[realHeadlineIndex];

    let fakeHeadlineThumb = this.fakeHeadlineThumbs[fakeHeadlineIndex];
    let realHeadlineThumb = this.realHeadlineThumbs[realHeadlineIndex];
    // set the 2 headlines and thumbnails accordingly
    if (this.fakeHeadlineNum == 1) {
      this.headline1 = fakeHeadline;
      this.headline2 = realHeadline;

      this.headline1thumb = fakeHeadlineThumb;
      this.headline2thumb = realHeadlineThumb;
    }
    else {
      // fakeHeadlineNum is 2
      this.headline1 = realHeadline;
      this.headline2 = fakeHeadline;

      this.headline1thumb = realHeadlineThumb;
      this.headline2thumb = fakeHeadlineThumb;
    }
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

    // play relevant sound effect (ding/buzz)
    this.plt.ready().then((readySource) => {
      this.nativeAudio.play(correct ? "ding" : "buzz").then(this.onAudioClipPlaySuccess, this.onAudioClipPlayError);
    })

    // load in new headlines for the user
    this.setNewHeadlines();
  }

  // below are functions called on success/error when loading/playing audio clips
  onAudioLoadSuccess() {
    console.log("Successfully loaded audio clip.");
  }

  onAudioLoadError() {
    console.log("Error when loading audio clip.");
  }

  onAudioClipPlaySuccess() {
    console.log("Successfully played audio clip.");
  }

  onAudioClipPlayError() {
    console.log("Error when playing audio clip.");
  }
}
