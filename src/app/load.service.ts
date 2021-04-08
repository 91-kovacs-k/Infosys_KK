import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Costumer } from './models/costumer';
import { Pizza } from './models/pizza';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  costumers!: Costumer[];
  pizza!: Pizza[];

  constructor(private http: HttpClient) {}

  async loadCostumersIfEmpty() {
    if (!this.costumers || this.costumers.length === 0) {
      this.costumers = await this.http
        .get<Costumer[]>('assets/costumers.json')
        .toPromise();
    }
  }

  async loadCostumers() {
    await this.loadCostumersIfEmpty();
    return this.costumers;
  }

  async loadPizzaIfEmpty() {
    if (!this.pizza || this.pizza.length === 0) {
      this.pizza = await this.http
        .get<Pizza[]>('assets/pizza.json')
        .toPromise();
    }
  }

  async loadPizza() {
    await this.loadPizzaIfEmpty();
    return this.pizza;
  }

  async addCostumer(costumer: Costumer) {
    await this.loadCostumersIfEmpty();
    this.costumers.push(costumer);
  }

  async addPizza(pizza: Pizza) {
    await this.loadPizzaIfEmpty();
    this.pizza.push(pizza);
  }

  async filterCostumers(query: string) {
    await this.loadCostumersIfEmpty();

    return this.costumers.filter((costumers) => {
      if (!costumers.name) {
        return false;
      } else {
        return costumers.name.toLowerCase().includes(query.toLowerCase());
      }
    });
  }

  async filterPizza(query: string) {
    await this.loadPizzaIfEmpty();

    return this.pizza.filter((pizza) => {
      if (!pizza.name) {
        return false;
      } else {
        return pizza.name.toLowerCase().includes(query.toLowerCase());
      }
    });
  }
}
