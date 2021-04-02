import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Costumer } from './models/costumer';
import { Pizza } from './models/pizza';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  constructor(private http: HttpClient) {}

  loadCostumers() {
    return this.http.get<Costumer[]>('assets/costumers.json').toPromise();
  }

  loadPizza() {
    return this.http.get<Pizza[]>('assets/pizza.json').toPromise();
  }
}
