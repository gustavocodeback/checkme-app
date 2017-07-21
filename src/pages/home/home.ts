import { TermsOfServicePage } from './../terms-of-service/terms-of-service';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  lastSlide = false;

  @ViewChild('slider') slider: Slides;

  constructor( public nav: NavController, public modal: ModalController ) {
  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  showTermsModal() {
    let modal = this.modal.create( TermsOfServicePage );
    modal.present();
  }

  goToLogin() {
    this.nav.push(LoginPage);
  }
}
