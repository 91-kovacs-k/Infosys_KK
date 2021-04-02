import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';
import { Queue } from '../models/queue';
import { Oven } from '../models/oven';

@Component({
  selector: 'app-oven-management',
  templateUrl: './oven-management.component.html',
  styleUrls: ['./oven-management.component.css'],
})
export class OvenManagementComponent implements OnInit {
  ngOnInit(): void {}

  ovens!: Oven[]; // sütők típusú tömb, sütők tárolására
  bakingTime!: number; // sütés idő percben
  static readyLog: string = ''; // elkészült pizzák
  inicialized: boolean = false;
  temp!: any;
  bakingInProgress = false;
  wrongAmount = false;
  wrongTime = false;

  OvenManagementComponent = OvenManagementComponent;

  public constructor() {}

  public sutoInicializalas(db: number, perc: number) {
    if (!(perc > 0 && perc < 41)) {
      this.wrongTime = true;
    } else {
      this.wrongTime = false;
    }
    if (!(db > 0 && db < 11)) {
      this.wrongAmount = true;
    } else {
      this.wrongAmount = false;
    }
    if (!(this.wrongTime || this.wrongAmount)) {
      if (this.inicialized) {
        alert('Már inicializálva van!');
      } else {
        this.bakingTime = perc; // percben számolom a sütés időt
        this.ovens = new Array(db);
        for (let i = 0; i < db; i++) {
          this.ovens[i] = new Oven();
        }
        this.inicialized = true;
      }
    }
  }

  public async Sut(sor: Queue<Order>) {
    if (this.inicialized) {
      this.bakingInProgress = true;
      while (!sor.isEmpty()) {
        let mindFoglalt = true;
        for (let i = 0; i < this.ovens.length; i++) {
          if (this.ovens[i].getAvailability() == true) {
            mindFoglalt = false;
            break;
          }
        }
        if (!mindFoglalt) {
          for (let i = 0; i < this.ovens.length; i++) {
            if (this.ovens[i].getAvailability()) {
              if (sor.peek().getRemainingQuantity() == 1) {
                this.pizzaSutes(
                  this.ovens[i],
                  sor.peek().getID(),
                  sor.peek().getRemainingQuantity(),
                  sor.peek().getQuantity()
                );
                sor.dequeue();
              } else {
                this.pizzaSutes(
                  this.ovens[i],
                  sor.peek().getID(),
                  sor.peek().getRemainingQuantity(),
                  sor.peek().getQuantity()
                );
                sor.peek().DecrementRemainingQuantity();
              }
            } else {
              continue;
            }
          }
        } else {
          await this.sutoreVar();
        }
      }
      this.bakingInProgress = false;
    } else {
      alert('Még nincs inicializálva a sütő!');
    }
  }

  private async pizzaSutes(
    suto: Oven,
    ID: number,
    remaining: number,
    quantity: number
  ) {
    suto.setAvailability(false);
    for (let i = 0; i < this.bakingTime; i++) {
      for (let j = 0; j < 60; j++) {
        await this.pizzaraVar(1);
        suto.getOvenTimer().setSeconds(j + 1);
      }
      suto.getOvenTimer().setSeconds(0);
      suto.getOvenTimer().setMinutes(i + 1);
    }
    suto.getOvenTimer().Reset();
    suto.setAvailability(true);

    if (remaining == 1) {
      OvenManagementComponent.elkeszultLogger(
        'Elkészült a #' +
          ID +
          ' rendelés ' +
          quantity +
          '/' +
          quantity +
          ' pizzája.\n'
      );
    } else {
      OvenManagementComponent.elkeszultLogger(
        'Elkészült a #' +
          ID +
          ' rendelés ' +
          (quantity - remaining + 1) +
          '/' +
          quantity +
          ' pizzája.\n'
      );
    }
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  private pizzaraVar(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms * 1000));
  }

  private async sutoreVar() {
    let waitTime = 0;
    for (let i = 0; i < this.ovens.length; i++) {
      if (this.ovens[i].timeCompare(waitTime)) {
        waitTime = this.ovens[i].getTimeInSeconds();
      }
    }
    await this.pizzaraVar(this.bakingTime * 60 - waitTime);
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  private static elkeszultLogger(str: string) {
    this.readyLog = this.readyLog + str;
  }

  public static getElkeszultLog() {
    return this.readyLog;
  }

  public mikorKerulSorra(order: Order, sor: Queue<Order>) {
    let everyOvenIsFree = true;
    for (let i = 0; i < this.ovens.length; i++) {
      if (this.ovens[i].getAvailability() == false) {
        everyOvenIsFree = false;
        break;
      }
    }
    if (everyOvenIsFree) {
      let kezdoSorszam = 0;
      let retval = 0;
      for (let i = 0; i < sor.getLength(); i++) {
        if (sor.getObjectByNumber(i).getID() == order.getID()) {
          kezdoSorszam++;
        } else {
          kezdoSorszam += sor.getObjectByNumber(i).getRemainingQuantity();
        }
      }
      let utolsoSorszam = kezdoSorszam + order.getQuantity() - 1;
      let joSorszam = 0;
      if (utolsoSorszam >= this.ovens.length) {
        joSorszam = utolsoSorszam - this.ovens.length;
        let tmp = Math.ceil(joSorszam / this.ovens.length);
        return (tmp + 1) * this.bakingTime * 60;
      } else {
        return this.bakingTime * 60;
      }
    } else {
      let orak = new Array(this.ovens.length);
      for (let i = 0; i < this.ovens.length; i++) {
        orak[i] = this.bakingTime * 60 - this.ovens[i].getTimeInSeconds();
      }
      orak.sort((a, b) => a - b);
      let kezdoSorszam = 0;
      let retval = 0;
      for (let i = 0; i < sor.getLength(); i++) {
        if (sor.getObjectByNumber(i).getID() == order.getID()) {
          kezdoSorszam++;
        } else {
          kezdoSorszam += sor.getObjectByNumber(i).getRemainingQuantity();
        }
      }
      let utolsoSorszam = kezdoSorszam + order.getQuantity() - 1;
      let seged;
      let sorszam;
      if (utolsoSorszam >= this.ovens.length) {
        seged = Math.floor(utolsoSorszam / this.ovens.length);
        sorszam = utolsoSorszam - seged * this.ovens.length;
      } else {
        sorszam = utolsoSorszam;
      }
      let kivalasztott = -1;

      if (sorszam == 0) {
        kivalasztott = 0;
      } else {
        while (sorszam != 0) {
          if (kivalasztott == orak.length - 1) {
            kivalasztott = 0;
          } else {
            kivalasztott++;
          }
          sorszam--;
        }
      }

      let szorzo = Math.ceil(utolsoSorszam / this.ovens.length);
      retval = szorzo * (this.bakingTime * 60);

      if (this.vanSzabadSuto(utolsoSorszam)) {
        return retval;
      } else {
        //retval += this.sutesIdo * 60;
        retval += orak[kivalasztott];
      }
      return retval;
    }
  }

  public vanSzabadSuto(n: number) {
    let count = 0;
    for (let i = 0; i < this.ovens.length; i++) {
      if (this.ovens[i].getAvailability()) {
        count++;
      }
    }
    if (count >= n) {
      return true;
    } else {
      return false;
    }
  }
}
