import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GamePage } from '../game/game';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
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
    console.log("Question bank size: " + this.questionBankSize);
    console.log("Sort By: " + this.sortBy);
    this.storage.set("QuestionBankSize", this.questionBankSize);
    this.storage.set("SortBy", this.sortBy);

    this.navCtrl.push(GamePage, {questionBankSize: this.questionBankSize, sortBy: this.sortBy});
  }

}
