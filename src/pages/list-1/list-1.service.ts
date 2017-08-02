import { ApiProvider } from './../../providers/api/api';
import { Injectable } from "@angular/core";

@Injectable()
export class List1Service {

  // método construtor
  constructor( public api: ApiProvider ) {}

}
