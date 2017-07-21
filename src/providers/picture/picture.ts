import { ActionSheetController  } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';

@Injectable()
export class PictureProvider {

  // método contrutor
  constructor(  public actionSheet: ActionSheetController, 
                public camera: Camera ) {}

  // pega a foto
  private _getPicture( sourceType ) {

    // define as opcoes da camera
    const options: CameraOptions = {
      sourceType,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // retorna uma nova promessa
    return new Promise( ( resolve, reject ) => {
      this.camera.getPicture( options ).then( pic => {
        if ( pic ) {
          resolve( `data:image/jpeg;base64,${pic}` );
        } else {
          reject( false );
        }
      })
      .catch( err => { reject( err ); });
    });
  }

  // pega uma imagem do usuário
  public get() {

    // retorna uma nova promessa
    return new Promise( ( resolve, reject ) => {
      
      const opt: any = {
        title: 'Foto de perfil',
        buttons: [ {
            text: 'Galeria',
            handler: () => this._getPicture( 0 ).then( pic => resolve( pic ) ).catch( err => reject( err ) )
        }, {
            text: 'Câmera',
            handler: () => this._getPicture( 1 ).then( pic => resolve( pic ) ).catch( err => reject( err ) )
        }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => reject( false )
        }]
      };

      // define o action sheet
      const actionSheet = this.actionSheet.create( opt );

      // mostra o action sheet
      actionSheet.present();
    });
  }
}
