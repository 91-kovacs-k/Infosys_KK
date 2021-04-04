import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';
import { Queue } from '../models/queue';
import { Oven } from '../models/oven';
import { FormGroup } from '@angular/forms';

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
  bakingInProgress = false;
  wrongAmount = false;
  wrongTime = false;

  OvenManagementComponent = OvenManagementComponent;

  public constructor() {}

  public ovenInicialization(fg: FormGroup) {
    let db = fg.value.ovens;
    let perc = fg.value.bakeTime;
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

  public async bake(queue: Queue<Order>) {
    if (this.inicialized) {
      this.bakingInProgress = true;
      while (!queue.isEmpty()) {
        let everyOvenBusy = true;
        for (let i = 0; i < this.ovens.length; i++) {
          if (this.ovens[i].getAvailability() == true) {
            everyOvenBusy = false;
            break;
          }
        }
        if (!everyOvenBusy) {
          for (let i = 0; i < this.ovens.length; i++) {
            if (this.ovens[i].getAvailability()) {
              if (queue.peek().getRemainingQuantity() == 1) {
                this.bakePizza(
                  this.ovens[i],
                  queue.peek().getID(),
                  queue.peek().getRemainingQuantity(),
                  queue.peek().getQuantity()
                );
                queue.dequeue();
              } else {
                this.bakePizza(
                  this.ovens[i],
                  queue.peek().getID(),
                  queue.peek().getRemainingQuantity(),
                  queue.peek().getQuantity()
                );
                queue.peek().DecrementRemainingQuantity();
              }
            } else {
              continue;
            }
          }
        } else {
          await this.waitingForOven();
        }
      }
      this.bakingInProgress = false;
    } else {
      alert('Még nincs inicializálva a sütő!');
    }
  }

  private async bakePizza(
    oven: Oven,
    ID: number,
    remaining: number,
    quantity: number
  ) {
    oven.setAvailability(false);
    oven.setProduct(ID, quantity - remaining + 1);
    for (let i = 0; i < this.bakingTime; i++) {
      for (let j = 0; j < 60; j++) {
        await this.waitingForPizza(1);
        oven.getOvenTimer().setSeconds(j + 1);
        oven.progress = Math.ceil(
          ((oven.getOvenTimer().getMinutes() * 60 +
            oven.getOvenTimer().getSeconds()) /
            (this.bakingTime * 60)) *
            100
        );
      }
      oven.getOvenTimer().setSeconds(0);
      oven.getOvenTimer().setMinutes(i + 1);
    }
    oven.progress = 0;
    oven.setProduct(0, 0);
    oven.getOvenTimer().Reset();
    oven.setAvailability(true);

    if (remaining == 1) {
      OvenManagementComponent.readyLogger(
        'Elkészült a #' +
          ID +
          ' rendelés ' +
          quantity +
          '/' +
          quantity +
          ' pizzája.\n'
      );
    } else {
      OvenManagementComponent.readyLogger(
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

  private waitingForPizza(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms * 1000));
  }

  private async waitingForOven() {
    let waitTime = 0;
    for (let i = 0; i < this.ovens.length; i++) {
      if (this.ovens[i].timeCompare(waitTime)) {
        waitTime = this.ovens[i].getTimeInSeconds();
      }
    }
    await this.waitingForPizza(this.bakingTime * 60 - waitTime);
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  private static readyLogger(str: string) {
    this.readyLog = this.readyLog + str;
  }

  public static getReadyLog() {
    return this.readyLog;
  }

  public whenWillStartBaking(order: Order, queue: Queue<Order>) {
    let everyOvenIsFree = true;
    for (let i = 0; i < this.ovens.length; i++) {
      if (this.ovens[i].getAvailability() == false) {
        everyOvenIsFree = false;
        break;
      }
    }
    if (everyOvenIsFree) {
      let startingNumber = 0;
      let retval = 0;
      for (let i = 0; i < queue.getLength(); i++) {
        if (queue.getObjectByNumber(i).getID() == order.getID()) {
          startingNumber++;
        } else {
          startingNumber += queue.getObjectByNumber(i).getRemainingQuantity();
        }
      }
      let lastNumber = startingNumber + order.getQuantity() - 1;
      let waitingNumber = 0;
      if (lastNumber >= this.ovens.length) {
        waitingNumber = lastNumber - this.ovens.length;
        let tmp = Math.ceil(waitingNumber / this.ovens.length);
        return (tmp + 1) * this.bakingTime * 60;
      } else {
        return this.bakingTime * 60;
      }
    } else {
      let timers = new Array(this.ovens.length);
      for (let i = 0; i < this.ovens.length; i++) {
        timers[i] = this.bakingTime * 60 - this.ovens[i].getTimeInSeconds();
      }
      timers.sort((a, b) => a - b);
      let startingNumber = 0;
      let retval = 0;
      for (let i = 0; i < queue.getLength(); i++) {
        if (queue.getObjectByNumber(i).getID() == order.getID()) {
          startingNumber++;
        } else {
          startingNumber += queue.getObjectByNumber(i).getRemainingQuantity();
        }
      }
      let lastNumber = startingNumber + order.getQuantity() - 1;
      let waitingNumber;
      let number;
      if (lastNumber >= this.ovens.length) {
        waitingNumber = Math.floor(lastNumber / this.ovens.length);
        number = lastNumber - waitingNumber * this.ovens.length;
      } else {
        number = lastNumber;
      }
      let selected = -1;

      if (number == 0) {
        selected = 0;
      } else {
        while (number != 0) {
          if (selected == timers.length - 1) {
            selected = 0;
          } else {
            selected++;
          }
          number--;
        }
      }

      let multiplier = Math.ceil(lastNumber / this.ovens.length);
      retval = multiplier * (this.bakingTime * 60);

      if (this.areThereFreeOvens(lastNumber)) {
        return retval;
      } else {
        //retval += this.sutesIdo * 60;
        retval += timers[selected];
      }
      return retval;
    }
  }

  public areThereFreeOvens(n: number) {
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

  public calculateWait(order: Order, queue: Queue<Order>) {
    let retval = -1;
    let inQueue = false;
    for (let i = 0; i < queue.getLength(); i++) {
      if (queue.getObjectByNumber(i).getID() == order.getID()) {
        inQueue = true;
        break;
      }
    }
    if (inQueue) {
      let startingNumber = 0;
      for (let i = 0; i < queue.getLength(); i++) {
        if (queue.getObjectByNumber(i).getID() == order.getID()) {
          startingNumber++;
          break;
        } else {
          startingNumber += queue.getObjectByNumber(i).getRemainingQuantity();
        }
      }
      let lastNumber = startingNumber + order.getRemainingQuantity() - 1;
      let multiplier = Math.ceil(lastNumber / this.ovens.length);
      let selected = -1;
      let number = lastNumber;

      let timers = new Array(this.ovens.length);
      for (let i = 0; i < this.ovens.length; i++) {
        timers[i] = this.bakingTime * 60 - this.ovens[i].getTimeInSeconds();
      }
      timers.sort((a, b) => a - b);

      while (number != 0) {
        if (selected == timers.length - 1) {
          selected = 0;
        } else {
          selected++;
        }
        number--;
      }

      retval = multiplier * this.bakingTime * 60;
      retval += timers[selected];
      alert(retval);
      return retval;
    } else {
      for (let i = 0; i < this.ovens.length; i++) {
        if (this.ovens[i].getOrder() == order.getID()) {
          if (this.ovens[i].getPizza() == order.getQuantity()) {
            retval =
              this.ovens[i].getOvenTimer().getMinutes() * 60 +
              this.ovens[i].getOvenTimer().getSeconds();
          }
        }
      }
    }
    if (retval > -1) {
      return this.bakingTime * 60 - retval;
    } else {
      return 0;
    }
  }
}
