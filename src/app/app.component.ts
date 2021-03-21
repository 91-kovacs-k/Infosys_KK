import { Component } from '@angular/core';
import { Queue } from './Queue';
import { Order } from './Order';
import { SutoComponent } from './suto/suto.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBeadando';

  private varakozoSor = new Queue<Order>(180); //180 a maximum várakozó pizza, mert 12 órát van nyitva a pizzéria egy nap, 5 sütő van és egy pizza 20 percig sül: 12*60/20*5=180
  private konyha = new SutoComponent(2, 6);
  private rendelesLog: string = "";

  constructor() {

  }

  public rendeles(pizzaDB: number) {
    let rendeles = new Order(pizzaDB);
    this.rendelesLogger(rendeles);
    if (this.varakozoSor.isEmpty()) {
      this.varakozoSor.enqueue(rendeles);
      SutoComponent.Sut(this.varakozoSor);
    } else {
      this.varakozoSor.enqueue(rendeles);
    }
  }

  private rendelesLogger(rendeles: Order) {
    this.rendelesLog = this.rendelesLog + "A #" + rendeles.getID() + " számú rendelést felvettük (" + rendeles.getQuantity() + " db pizza)\n";
  }

  public getRendelesLog() {
    return this.rendelesLog;
  }

}
