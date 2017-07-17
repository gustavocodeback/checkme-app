import { PerfilPage } from './../pages/perfil/perfil';
import { ApiProvider } from './../providers/api/api';
import { AuthProvider } from './../providers/auth/auth';
import { HomePage } from './../pages/home/home';
import { NotWorkingPage } from './../pages/not-working/not-working';
import { TermsOfServicePage } from './../pages/terms-of-service/terms-of-service';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  providers: [ AuthProvider ]
})
export class MyApp {

  public user = {};

  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage: any = HomePage;
  // rootPage: any = TabsNavigationPage;

  pages: Array<{title: string, icon: string, component: any}>;
  pushPages: Array<{title: string, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public auth: AuthProvider,
    public loadingCtrl: LoadingController,
    public api: ApiProvider
  ) {

    // inicializa o firebase
    const config = {
      apiKey: "AIzaSyABW_WTijXJo0Ob6kIM50DawbY2JE20agw",
      authDomain: "neotass-96310.firebaseapp.com",
      databaseURL: "https://neotass-96310.firebaseio.com",
      projectId: "neotass-96310",
      storageBucket: "neotass-96310.appspot.com",
      messagingSenderId: "121979806569"
    };
    
    firebase.initializeApp(config);

    // vigia o status
    firebase.auth().onAuthStateChanged( user => {
      
      // verifica se existe um usuario
      if ( user ) {

        // cria o loading
        const loading = this.loadingCtrl.create( { content: 'Verificando no sistema ...' } );
        loading.present();

        // seta o uid
        this.auth.setUid( user.uid )
        .then( userObj => {
          
          // seta o usuario
          this.user = userObj;

          // vai para a pagina inicial
          this.nav.setRoot( TabsNavigationPage );
        }).catch( err => console.log( err ) )
        .then( () => loading.dismiss() );
      } else {

        // vai para a pagina inicial
        this.nav.setRoot( HomePage );
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });

    this.pages = [
      { title: 'Início', icon: 'home', component: TabsNavigationPage },
    ];

    this.pushPages = [
      { title: 'Termos e condições', icon: 'document', component: TermsOfServicePage },    
      { title: 'Suporte', icon: 'people', component: NotWorkingPage },
      { title: 'Extrato', icon: 'barcode', component: NotWorkingPage },
    ];
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }

  public logout() {
    this.auth.logout();
    this.menu.close();
  }

  public openEditProfile() {
    this.nav.setRoot( PerfilPage );
    this.menu.close();
  }
}
