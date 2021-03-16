import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBeadando';


  sutokSzama = 5; //sütők száma
  sutesIdo = 10; //sütés idő mp-ben
  szabadSutok = new Map<number, boolean>(); //sütők + foglalt vagy sem
  Ora; //sütők órája
  inQueue: any; //sorban állók
  orderNumber = 1;
  quantity = 1;
  rendelesLog = "";
  elkeszultLog = "";

  constructor() {
    for (let i = 0; i < this.sutokSzama; i++) {
      this.szabadSutok.set(i + 1, true);
    }
    this.Ora = new Array(this.sutokSzama);
    for (let i = 0; i < this.sutokSzama; i++) {
      this.Ora[i] = 0;
    }
    this.inQueue = new Array(2);
    this.inQueue[0] = 0;
    this.inQueue[1] = 0;
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

  pizzaRendeles(orderNumber : number) {
    let suto = this.getSuto();
    if (suto != -1) {
      this.pizzaSutes(suto, orderNumber);
      return 0;
    } else {
      let waitModifier = this.inQueue[1];
      let waitTime = this.Ora[this.inQueue[0]];
      for (let i = this.inQueue[0] + 1; i < this.sutokSzama; i++) {
        if (waitTime < this.Ora[i]) {
          waitTime = this.Ora[i];
        }
      }
      return this.sutesIdo - waitTime + this.sutesIdo * waitModifier;
    }
  }

  rendeles(n: Number) {
    let waitTimeSum = 0;
    for (let i = 0; i < n; i++) {
      /*waitTimeSum = waitTimeSum + this.pizzaRendeles();*/
      let temp = this.pizzaRendeles(this.orderNumber);
      if (temp > 0) {
        this.queue(temp, this.orderNumber);
        this.queueIncrement();
        waitTimeSum = waitTimeSum + temp;
      }
    }
    if (waitTimeSum == 0) {
      this.rendelesLogger("Rendelés #"+this.orderNumber+": A pizza(k) " + this.sutesIdo + " percen belül elkészül(nek)!\n");
      this.orderNumber++;
    }
    else {
      this.rendelesLogger("Rendelés #"+this.orderNumber+": A " + this.sutesIdo + " perc sütési időn felül " + waitTimeSum + " percet kell még várni a pizza(k) elkészülésére!\n");
      this.orderNumber++;
    }
  }

  rendelesLogger(str: string) {
    this.rendelesLog += str;
  }

  elkeszultLogger(str: string) {
    this.elkeszultLog += str;
  }

  queueIncrement() {
    if (this.inQueue[0] == this.sutokSzama-1) {
      this.inQueue[0] = 0;
      this.inQueue[1]++;
    } else {
      this.inQueue[0]++;
    }
  }
  queueDecrement() {
    if (this.inQueue[1] > 0 && this.inQueue[0] == 0) {
      this.inQueue[1]--;
      this.inQueue[0] = this.sutokSzama-1;
    } else {
      this.inQueue[0]--;
    }
  }


  async queue(wait: number, orderNumber : number) {
    await this.pizzaraVar(wait * 1000 + 1);
    this.pizzaRendeles(orderNumber);
    this.queueDecrement();
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

  pizzaraVar(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
