import { Component } from '@angular/core';
import { Queue } from './Queue';
import { Order } from './Order';
import { SutoManagementComponent } from './suto-management/suto-management.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBeadando';

  private varakozoSor = new Queue<Order>(180); //180 a maximum várakozó pizza, mert 12 órát van nyitva a pizzéria egy nap, 5 sütő van és egy pizza 20 percig sül: 12*60/20*5=180
  private rendelesLog: string = "";
  private varakozasLog: string = "";
  konyha = new SutoManagementComponent();
  wrongPizzaDb = false;

  constructor() {

  }

  public rendeles(pizzaDB: number) {
    if(!(pizzaDB > 0 && pizzaDB < 10)){
      this.wrongPizzaDb = true;
    }else{
      this.wrongPizzaDb = false;
    }
    if(!this.wrongPizzaDb){
      let rendeles = new Order(pizzaDB);
      this.rendelesLogger(rendeles);
      if (this.varakozoSor.isEmpty()) {
        this.varakozoSor.enqueue(rendeles);
        this.konyha.Sut(this.varakozoSor);
      } else {
        this.varakozoSor.enqueue(rendeles);
      }
      let varakozas;
      varakozas = this.konyha.mikorKerulSorra(rendeles, this.varakozoSor);
      this.varakozasLogger(rendeles, varakozas);
    }
  }

  private rendelesLogger(rendeles: Order) {
    this.rendelesLog = this.rendelesLog + "A #" + rendeles.getID() + " számú rendelést felvettük (" + rendeles.getQuantity() + " db pizza).\n";
  }

  public getRendelesLog() {
    return this.rendelesLog;
  }

  private varakozasLogger(rendeles: Order, varakozas : number[]){
    let varas = -1;
    for(let i = 0; i < varakozas.length; i++){
      if(varas < varakozas[i]){
        varas = varakozas[i];
      }
    }
    this.varakozasLog = this.varakozasLog + "A #" + rendeles.getID() + " számú rendelésre " + varas + " percet kell várni!\n";
  }

  public getVarakozasLog(){
    return this.varakozasLog;
  }
}
