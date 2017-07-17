import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errors',
})
export class ErrorsPipe implements PipeTransform {


  public messages = {
    'auth/cpf': 'O CPF digitado já está em uso.',
    'auth/email-already-in-use': 'O e-mail digitado já está em uso.',
    'auth/invalid-email': 'O e-mail digitado é inválido.',
    'auth/weak-password': 'A senha digitada precisa ter mais de 6 caracteres.',
    'auth/wrong-password': 'A senha está incorreta.',
    'auth/invalid-cpf': 'O CPF não está cadastrado.',
    'auth/invalid_cpf': 'O CPF não está incorreto.',
    'auth/user-not-found': 'Usuário incorreto ou não cadastrado'
  };

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return this.messages[value] ? this.messages[value] : 'Houve um erro: '+value;
  }
}
