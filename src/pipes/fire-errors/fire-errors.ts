import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FireErrorsPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'fireErrors',
})
export class FireErrorsPipe implements PipeTransform {

  public errors = {
    'auth/invalid-email': 'O e-mail digitado está incorreto',
    'auth/weak-password' : 'A senha precisa ter entre 6 e 18 caracteres',
    'auth/email-already-in-use' : 'O e-mail digitado já esta sendo utilizado',
    'auth/user-not-found' : 'O usuário nāo está cadastrado',
    'auth/wrong-password' : 'O senha está incorreta',
  };

  /**
   * Takes a value and makes it lowercase.
   */
  transform( value: string ) {
    return this.errors[value] ? this.errors[value] : value;
  }
}
