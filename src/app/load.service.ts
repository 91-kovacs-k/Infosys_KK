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

  async modifyCostumer(costumer: Costumer) {
    await this.loadCostumersIfEmpty();
    for (let i = 0; i < this.costumers.length; i++) {
      if (this.costumers[i].id == costumer.id) {
        this.costumers[i].name = costumer.name;
        this.costumers[i].zip = costumer.zip;
        this.costumers[i].city = costumer.city;
        this.costumers[i].address1 = costumer.address1;
        this.costumers[i].address2 = costumer.address2;
        this.costumers[i].telephonePrefix = costumer.telephonePrefix;
        this.costumers[i].telephone = costumer.telephone;
        break;
      }
    }
  }

  async deleteCostumer(id: number) {
    await this.loadCostumersIfEmpty();
    for (let i = 0; i < this.costumers.length; i++) {
      if (this.costumers[i].id == id) {
        for (let j = i; j < this.costumers.length; j++) {
          this.costumers[j] = this.costumers[j + 1]; //elemek előrébb mozgatása
        }
        break;
      }
    }
    this.costumers.length--;
  }
}
