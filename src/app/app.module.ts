import { CommentsPage } from './../pages/comments/comments';
import { FavoritosPage } from './../pages/favoritos/favoritos';
import { EventosPage } from './../pages/eventos/eventos';
import { CameraMock } from './../mocks/camera';
import { Camera } from '@ionic-native/camera';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { ListingPage } from '../pages/listing/listing';
import { FeedPage } from '../pages/feed/feed';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { List1Page } from '../pages/list-1/list-1';
import { FormLayoutPage } from '../pages/form-layout/form-layout';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';

import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';
import { GoogleMap } from '../components/google-map/google-map';

import { FeedService } from '../pages/feed/feed.service';
import { ListingService } from '../pages/listing/listing.service';
import { ProfileService } from '../pages/profile/profile.service';
import { List1Service } from '../pages/list-1/list-1.service';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// import { FacebookLoginPage } from '../pages/facebook-login/facebook-login';
// import { GoogleLoginPage } from '../pages/google-login/google-login';
import { ContactCardPage } from '../pages/contact-card/contact-card';
import { FireErrorsPipe } from '../pipes/fire-errors/fire-errors';
import { ApiProvider } from '../providers/api/api';

// import { FacebookLoginService } from '../pages/facebook-login/facebook-login.service';
// import { GoogleLoginService } from '../pages/google-login/google-login.service';
// import { GoogleMapsService } from '../pages/maps/maps.service';


@NgModule({
  declarations: [
    MyApp,
    ListingPage,
    FeedPage,
    LoginPage,
    ProfilePage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    SignupPage,
    ForgotPasswordPage,
    List1Page,
    FormLayoutPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    // FacebookLoginPage,
    ContactCardPage,
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ColorRadio,
    CounterInput,
    Rating,
    GoogleMap,
    FireErrorsPipe,
    EventosPage,
    FavoritosPage,
    CommentsPage    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListingPage,
    FeedPage,
    LoginPage,
    ProfilePage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    ForgotPasswordPage,
    SignupPage,
    List1Page,
    FormLayoutPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    // FacebookLoginPage,
    ContactCardPage,
    EventosPage,
    FavoritosPage,
    CommentsPage
  ],
  providers: [
    FeedService,
    ListingService,
    ProfileService,
    List1Service,
    Camera,
    // FacebookLoginService,
	  SplashScreen,
	  StatusBar,
    ApiProvider
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
