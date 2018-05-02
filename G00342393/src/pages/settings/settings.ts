import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GamePage } from '../game/game';

/**
 * A couple of settings the user can set for when the Reddit
 * API is called. The user can pick how many questions should be
 * used in the bank of questions, and which sort method to use
 * from Reddit (i.e. new (sort by time), top (sort by vote popularity)...)
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  // variables to store settings used when Reddit API is called
  questionBankSize: number;
  sortBy: string;

  constructor(private storage:Storage, public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewWillEnter() {
    // load settings from storage
    this.storage.get("QuestionBankSize")
    .then((data) => {
      this.questionBankSize = data;
    })
    .catch((err) => {
      console.log(err);
    })

    this.storage.get("SortBy")
    .then((data) => {
      this.sortBy = data;
    })
    .catch((err) => {
      console.log(err);
    })
  }

  saveSettingsAndBegin() {
    // save settings to storage
    this.storage.set("QuestionBankSize", this.questionBankSize);
    this.storage.set("SortBy", this.sortBy);

    // push the game page onto the navigation stack
    // also pass the API variables to it, to be later passed to the provider
    this.navCtrl.push(GamePage, {questionBankSize: this.questionBankSize, sortBy: this.sortBy});
  }

}
