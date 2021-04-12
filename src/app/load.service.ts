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
  costumersInicialized = false;
  pizzaInicialized = false;
  bakeTime!: number;

  constructor(private http: HttpClient) {}

  async loadCostumersIfEmpty() {
    if (!this.costumersInicialized) {
      if (!this.costumers || this.costumers.length === 0) {
        this.costumers = await this.http
          .get<Costumer[]>('assets/costumers.json')
          .toPromise();
      }
      this.costumersInicialized = true;
    }
  }

  async loadCostumers() {
    await this.loadCostumersIfEmpty();
    return this.costumers;
  }

  async loadPizzaIfEmpty() {
    if (!this.pizzaInicialized) {
      if (!this.pizza || this.pizza.length === 0) {
        this.pizza = await this.http
          .get<Pizza[]>('assets/pizza.json')
          .toPromise();
      }
      this.pizzaInicialized = true;
    }
  }

  async loadPizza() {
    await this.loadPizzaIfEmpty();
    return this.pizza;
  }

  async addCostumer(costumer: Costumer) {
    this.costumers.push(costumer);
  }

  async addPizza(pizza: Pizza) {
    this.pizza.push(pizza);
  }

  async filterCostumers(query: string) {
    if (query == '') {
      return this.costumers;
    } else {
      return this.costumers.filter((costumers) => {
        if (!costumers.name) {
          return false;
        } else {
          return costumers.name.toLowerCase().includes(query.toLowerCase());
        }
      });
    }
  }

  async setBakeTime(n: number) {
    this.bakeTime = n;
    await this.loadPizzaIfEmpty();
    for (let i = 0; i < this.pizza.length; i++) {
      this.pizza[i].preparationTime = this.bakeTime;
    }
  }

  async filterPizza(query: string) {
    if (query == '') {
      return this.pizza;
    } else {
      return this.pizza.filter((pizza) => {
        if (!pizza.name) {
          return false;
        } else {
          return pizza.name.toLowerCase().includes(query.toLowerCase());
        }
      });
    }
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

  async modifyPizza(newPizza: Pizza) {
    await this.loadCostumersIfEmpty();
    for (let i = 0; i < this.pizza.length; i++) {
      if (this.pizza[i].id == newPizza.id) {
        this.pizza[i].name = newPizza.name;
        this.pizza[i].description = newPizza.description;
        this.pizza[i].size = newPizza.size;
        this.pizza[i].preparationTime = newPizza.preparationTime;
        this.pizza[i].price = newPizza.price;
        this.pizza[i].selected = newPizza.selected;
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

        this.costumers.length--;
        break;
      }
    }
  }

  async deletePizza(id: number) {
    await this.loadPizzaIfEmpty();
    for (let i = 0; i < this.pizza.length; i++) {
      if (this.pizza[i].id == id) {
        for (let j = i; j < this.pizza.length; j++) {
          this.pizza[j] = this.pizza[j + 1]; //elemek előrébb mozgatása
        }

        this.pizza.length--;
        break;
      }
    }
  }
}
