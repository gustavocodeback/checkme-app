import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-not-working',
  templateUrl: 'not-working.html',
})
export class NotWorkingPage {

  constructor(  public viewCtrl: ViewController ) {}

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
