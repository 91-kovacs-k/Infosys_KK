import { Component } from '@angular/core';
import { Queue } from './Queue';
import { Order } from './Order';
import { Suto } from './Suto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBeadando';

  varakozoSor = new Queue<Order>(180); //180 a maximum várakozó pizza, mert 12 órát van nyitva a pizzéria egy nap, 5 sütő van és egy pizza 20 percig sül: 12*60/20*5=180
  konyha = new Suto(5, 1);
  rendelesLog = "";
  elkeszultLog = "";

  constructor() {

  }

  rendeles(pizzaDB : number){
    let rendeles = new Order(pizzaDB);
    if(this.varakozoSor.isEmpty()){
      this.varakozoSor.enqueue(rendeles);
      this.konyha.Sut(this.varakozoSor);
    }else{
      this.varakozoSor.enqueue(rendeles);
    }

  }



/*
  rendeles(){
    let id = this.order++;
    this.inQueue.enqueue(id);
    if(!this.inQueue.isEmpty()){
      this.sut();
    }
  }

  async sut(){
    while(!this.inQueue.isEmpty()){
      let suto = this.getSuto();
      if(suto == -1){
        let waitModifier = 0;
        if(this.inQueue.getLength() >= 5){
          waitModifier = this.inQueue.getLength() - 5;
        }
        let waitTime = 0;
        for (let i = waitModifier; i < this.sutokSzama; i++) {
          if (waitTime < this.Ora[i]) {
            waitTime = this.Ora[i];
          }
        }
        let order = this.inQueue.peek();
        let waitTimeSum = this.sutesIdo - waitTime + this.sutesIdo * waitModifier;
        this.rendelesLogger("Rendelés #"+order+": A " + this.sutesIdo + " perc sütési időn felül " + waitTimeSum + " percet kell még várni a pizza(k) elkészülésére!\n");
        await this.pizzaraVar((waitTimeSum)*1000 + 1);
        this.sut();
      }else{
        let order = this.inQueue.peek();
        this.rendelesLogger("Rendelés #"+order+": A pizza(k) " + this.sutesIdo + " percen belül elkészül(nek)!\n");
        this.inQueue.dequeue();
        this.pizzaSutes(suto, order);
      }
    }
  }

  ebreszt(){
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  getSuto() {
    for (let i = 0; i < this.sutokSzama; i++) {
      if (this.szabadSutok.get(i + 1)) {
        this.szabadSutok.set(i + 1, false);
        return i + 1;
      }
    }
    return -1;
  }

  releaseSuto(suto: number) {
    this.szabadSutok.set(suto, true);
  }

  async pizzaSutes(suto: number, orderNumber: number) {
    for (this.Ora[suto - 1]; this.Ora[suto - 1] < this.sutesIdo; this.Ora[suto - 1]++) {
      await this.pizzaraVar(1000);
    }
    this.Ora[suto - 1] = 0;
    this.releaseSuto(suto);
    this.elkeszultLogger("A #" + orderNumber +" számú rendelés elkészült!\n");
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  rendelesLogger(str: string) {
    this.rendelesLog += str;
  }

  elkeszultLogger(str: string) {
    this.elkeszultLog += str;
  }

  pizzaraVar(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

*/
}
