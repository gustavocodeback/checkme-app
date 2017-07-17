// import { CameraMock } from './../mocks/camera';
import { Camera } from '@ionic-native/camera';
import { ValidateProvider } from './../providers/validate/validate';
import { NotWorkingPage } from './../pages/not-working/not-working';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { InicialPage } from '../pages/inicial/inicial';
import { LoginPage } from '../pages/login/login';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { ListProdutosPage } from '../pages/list-produtos/list-produtos';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { PerfilPage } from '../pages/perfil/perfil';

import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';

import { InicialService } from '../pages/inicial/inicial.service';
import { ListProdutosService } from '../pages/list-produtos/list-produtos.service';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Functionalities
import { DetalhesProdutoPage } from '../pages/detalhes-produto/detalhes-produto';
import { AuthProvider } from '../providers/auth/auth';
import { ApiProvider } from '../providers/api/api';
import { ErrorsPipe } from '../pipes/errors/errors';
import { ClearPipe } from '../pipes/clear/clear';
import { PictureProvider } from './../providers/picture/picture';


@NgModule({
  declarations: [
    MyApp,
    InicialPage,
    LoginPage,
    TabsNavigationPage,
    HomePage,
    ForgotPasswordPage,
    ListProdutosPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    DetalhesProdutoPage,
    NotWorkingPage,
    PerfilPage,
    SignupPage,
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ErrorsPipe,
    ClearPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InicialPage,
    LoginPage,
    TabsNavigationPage,
    HomePage,
    ForgotPasswordPage,
    SignupPage,
    SignupPage,
    ListProdutosPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    DetalhesProdutoPage,
    NotWorkingPage,
    PerfilPage
  ],
  providers: [
    InicialService,
    ListProdutosService,
    Camera,
	  SplashScreen,
	  StatusBar,
    AuthProvider, 
    ApiProvider, 
    ValidateProvider, 
    PictureProvider
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}