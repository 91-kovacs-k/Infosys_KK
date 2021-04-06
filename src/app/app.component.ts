import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Queue } from './models/queue';
import { Order } from './models/order';
import { LoadService } from './load.service';
import { OvenManagementComponent } from './oven-management/oven-management.component';
import { Costumer } from './models/costumer';
import { Pizza } from './models/pizza';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularBeadando';

  public queue = new Queue<Order>(180); //180 a maximum várakozó pizza, mert 12 órát van nyitva a pizzéria egy nap, 5 sütő van és egy pizza 20 percig sül: 12*60/20*5=180
  private orderLog: string = '';
  private waitLog: string = '';
  public costumers!: Costumer[];
  public pizza!: Pizza[];
  public selectedCostumer!: Costumer;
  public selectedPizza: Pizza[] = [];
  public costumerIsSelected: boolean = false;
  public orders: Order[] = [];

  ovenInicialization = this.fb.group({
    ovens: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    bakeTime: [
      '',
      [Validators.required, Validators.min(1), Validators.max(40)],
    ],
  });
  /*
  newCostumer = this.fb.group({
    //id: [this.costumers[this.costumers.length].id + 1],
    name: ['', Validators.required],
    address1: ['', Validators.required],
    address2: ['', Validators.required],
    telephone: ['', Validators.required],
  });
*/
  kitchen = new OvenManagementComponent();

  constructor(private loadService: LoadService, private fb: FormBuilder) {}

  async ngOnInit() {
    this.costumers = await this.loadService.loadCostumers();
    this.pizza = await this.loadService.loadPizza();
  }
  /*
  public addCostumer() {
    const costumer = this.newCostumer.value;
    this.loadService.addCostumer(costumer);
  }
*/
  public resetSelection() {
    this.selectedPizza = [];
    this.pizza.forEach((pizza) => (pizza.selected = 0));
    this.costumerIsSelected = false;
    this.selectedCostumer = {
      id: 0,
      name: 'null',
      address1: 'null',
      address2: 'null',
      telephone: 'null',
    };
  }

  public requestOrder(costumer: Costumer, selectedPizza: Pizza[]) {
    this.resetSelection();
    let order = new Order(costumer, selectedPizza);
    let waitTime;
    this.orders.push(order);
    //this.orderLogger(order);
    if (this.queue.isEmpty()) {
      this.queue.enqueue(order);

      waitTime = this.kitchen.whenWillStartBaking(order, this.queue);
      this.kitchen.bake(this.queue);
    } else {
      this.queue.enqueue(order);
      waitTime = this.kitchen.whenWillStartBaking(order, this.queue);
    }

    order.waitLogger(order, waitTime);
  }

  public calculateWaitTime(order: Order) {
    let waitTime = this.kitchen.calculateWait(order, this.queue);
    order.waitLogger(order, waitTime);
  }

  public selectCostumer(costumer: Costumer) {
    this.selectedCostumer = costumer;
    this.costumerIsSelected = true;
  }

  public selectPizza(pizza: Pizza) {
    this.selectedPizza.push(pizza);
    for (let i = 0; i < this.pizza.length; i++) {
      if (this.pizza[i] == pizza) {
        this.pizza[i].selected++;
        break;
      }
    }
  }

  public deselectPizza(pizza: Pizza) {
    let contained = false;
    for (let i = 0; i < this.selectedPizza.length; i++) {
      if (this.selectedPizza[i] == pizza) {
        this.selectedPizza.splice(i, 1);
        contained = true;
        break;
      }
    }
    if (contained) {
      for (let i = 0; i < this.pizza.length; i++) {
        if (this.pizza[i] == pizza) {
          this.pizza[i].selected--;
          break;
        }
      }
    }
  }
  /*
  private orderLogger(order: Order) {
    this.orderLog =
      this.orderLog +
      'A  #' +
      order.getID() +
      ' számú rendelését felvettük (' +
      order.getQuantity() +
      ' db pizza).\nVevő: ' +
      order.getCostumer().name +
      '. Szállítási cím: ' +
      order.getCostumer().address1 +
      order.getCostumer().address2;
    this.listSelectedPizza(order.getSelectedPizza());
  }

  private listSelectedPizza(selectedPizza: Pizza[]) {
    this.orderLog += '\nRendelt Pizzák: ';
    let sum = 0;
    selectedPizza.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
    let tmp = 1;
    this.orderLog += '\n' + ' - ' + selectedPizza[0].name;
    sum += selectedPizza[0].price;
    for (let i = 1; i < selectedPizza.length; i++) {
      if (selectedPizza[i].name === selectedPizza[i - 1].name) {
        tmp++;
        sum += selectedPizza[i].price;
      } else {
        if (tmp > 1) {
          this.orderLog += ' * ' + tmp;
          tmp = 1;
        }
        this.orderLog += ',\n - ' + selectedPizza[i].name;
        sum += selectedPizza[i].price;
      }
    }
    if (tmp == 1) {
      this.orderLog += '.';
    } else {
      this.orderLog += ' * ' + tmp + '.';
    }
    this.orderLog += '\n' + 'Ár: ' + sum + '.\n';
  }

  public getOrderLog() {
    return this.orderLog;
  }

  private waitLogger(order: Order, waitTime: number) {
    let minutesInString;
    let secondsInString;
    let minutes = Math.floor(waitTime / 60);
    let seconds = waitTime - minutes * 60;
    // minutes += 20;  // a szállítás idejét hozzáadom

    if (minutes < 10) {
      minutesInString = '0' + minutes.toString();
    } else {
      minutesInString = minutes.toString();
    }
    if (seconds < 10) {
      secondsInString = '0' + seconds.toString();
    } else {
      secondsInString = seconds.toString();
    }
    this.waitLog =
      this.waitLog +
      'A #' +
      order.getID() +
      ' számú rendelésre ' +
      minutesInString +
      ':' +
      secondsInString +
      ' kell várni!\n';
  }

  public getWaitLog() {
    return this.waitLog;
  }
*/
}
