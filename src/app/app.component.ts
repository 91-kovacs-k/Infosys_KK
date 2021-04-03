import { Component, OnInit } from '@angular/core';
import { Queue } from './models/queue';
import { Order } from './models/order';
import { LoadService } from './load.service';
import { OvenManagementComponent } from './oven-management/oven-management.component';
import { Costumer } from './models/costumer';
import { Pizza } from './models/pizza';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularBeadando';

  private queue = new Queue<Order>(180); //180 a maximum várakozó pizza, mert 12 órát van nyitva a pizzéria egy nap, 5 sütő van és egy pizza 20 percig sül: 12*60/20*5=180
  private orderLog: string = '';
  private waitLog: string = '';
  public costumers!: Costumer[];
  public pizza!: Pizza[];
  public selectedCostumer!: Costumer;
  public selectedPizza: Pizza[] = [];

  kitchen = new OvenManagementComponent();
  wrongPizzaAmount = false;

  constructor(private loadService: LoadService) {}

  async ngOnInit() {
    this.costumers = await this.loadService.loadCostumers();
    this.pizza = await this.loadService.loadPizza();
  }

  public resetSelection() {
    this.selectedPizza = [];
    this.pizza.forEach((pizza) => (pizza.selected = 0));
    this.selectedCostumer = {
      id: 0,
      name: 'null',
      address: 'null',
      telephone: 'null',
    };
  }

  public rendeles(costumer: Costumer, selectedPizza: Pizza[]) {
    this.resetSelection();

    let rendeles = new Order(costumer, selectedPizza);
    let varakozas;
    this.rendelesLogger(rendeles);
    if (this.queue.isEmpty()) {
      this.queue.enqueue(rendeles);

      varakozas = this.kitchen.mikorKerulSorra(rendeles, this.queue);
      this.kitchen.Sut(this.queue);
    } else {
      this.queue.enqueue(rendeles);
      varakozas = this.kitchen.mikorKerulSorra(rendeles, this.queue);
    }

    this.varakozasLogger(rendeles, varakozas);
  }

  public selectCostumer(costumer: Costumer) {
    this.selectedCostumer = costumer;
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

  private rendelesLogger(rendeles: Order) {
    this.orderLog =
      this.orderLog +
      'A  #' +
      rendeles.getID() +
      ' számú rendelését felvettük (' +
      rendeles.getQuantity() +
      ' db pizza).\nVevő: ' +
      rendeles.getCostumer().name +
      '. Szállítási cím: ' +
      rendeles.getCostumer().address;
    this.listSelectedPizza(rendeles.getSelectedPizza());
  }

  private listSelectedPizza(selectedPizza: Pizza[]) {
    this.orderLog += '\nRendelt Pizzák: ';
    let sum = 0;
    selectedPizza.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
    let tmp = 1;
    this.orderLog += '\n' + selectedPizza[0].name;
    sum += selectedPizza[0].price;
    for (let i = 1; i < selectedPizza.length; i++) {
      if (selectedPizza[i].name === selectedPizza[i - 1].name) {
        tmp++;
        sum += selectedPizza[i].price;
      } else {
        if (tmp > 1) {
          this.orderLog += ' * ' + tmp + ',';
          tmp = 1;
        }
        this.orderLog += '\n' + selectedPizza[i].name;
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

  public getRendelesLog() {
    return this.orderLog;
  }

  private varakozasLogger(rendeles: Order, varakozas: number) {
    let percString;
    let mpercString;
    let perc = Math.floor(varakozas / 60);
    let mperc = varakozas - perc * 60;
    // perc += this.szallitasIdo;

    if (perc < 10) {
      percString = '0' + perc.toString();
    } else {
      percString = perc.toString();
    }
    if (mperc < 10) {
      mpercString = '0' + mperc.toString();
    } else {
      mpercString = mperc.toString();
    }
    this.waitLog =
      this.waitLog +
      'A #' +
      rendeles.getID() +
      ' számú rendelésre ' +
      percString +
      ':' +
      mpercString +
      ' kell várni!\n';
  }

  public getVarakozasLog() {
    return this.waitLog;
  }
}
