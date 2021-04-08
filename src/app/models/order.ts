import { Costumer } from './costumer';
import { Pizza } from './pizza';

export class Order {
  private static varForId = 1; // segéd változó az ID beállításhoz, amíg nem adatbázisból jön
  private id: number; // rendelés azonosító
  private quantity: number; // rendelt mennyiség
  private remainingQuantity: number; // hátralévő mennyiség
  private costumer: Costumer; // vevő
  private selectedPizza!: Pizza[]; // a rendelt pizzák
  private destinationLog: string = ''; // a cím információk
  private pizzaLog: string = ''; // a rendelt pizzák
  private priceLog: string = ''; // az ár
  private waitLog: string = ''; // az elkészülés idejéhez tartozó információk
  private status: string = ''; // a rendelés állapota

  // konstruktorban darabszámot vár, amivel beállítja, hogy mennyi mennyi pizzát rendeltek
  public constructor(costumer: Costumer, selectedPizza: Pizza[]) {
    this.id = Order.setID(); // ID beállítása
    this.quantity = selectedPizza.length; // darabszám beállítása
    this.remainingQuantity = selectedPizza.length; // hátralévő darabszám beállítása
    this.costumer = costumer; // vevő beállítása
    this.selectedPizza = selectedPizza;
    this.orderLogger();
    this.setStatus('waiting');
  }
  public getStatus() {
    return this.status;
  }
  public setStatus(s: string) {
    this.status = s;
  }
  // get ID
  public getID() {
    return this.id;
  }
  // get rendelt mennyiség
  public getQuantity() {
    return this.quantity;
  }
  // get hátralévő mennyiség
  public getRemainingQuantity() {
    return this.remainingQuantity;
  }
  // get vevő
  public getCostumer() {
    return this.costumer;
  }
  // get rendelt Pizzák
  public getSelectedPizza() {
    return this.selectedPizza;
  }
  // hátralévő mennyiség csökkentése
  public DecrementRemainingQuantity() {
    this.remainingQuantity = this.remainingQuantity - 1;
  }
  // ID beállítása
  private static setID() {
    return Order.varForId++;
  }

  private orderLogger() {
    this.destinationLog =
      this.destinationLog +
      this.getCostumer().address1 +
      '\n' +
      this.getCostumer().address2;
    this.listSelectedPizza(this.getSelectedPizza());
  }

  private listSelectedPizza(selectedPizza: Pizza[]) {
    let sum = 0;
    selectedPizza.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
    let tmp = 1;
    this.pizzaLog += ' - ' + selectedPizza[0].name;
    sum += selectedPizza[0].price;
    for (let i = 1; i < selectedPizza.length; i++) {
      if (selectedPizza[i].name === selectedPizza[i - 1].name) {
        tmp++;
        sum += selectedPizza[i].price;
      } else {
        if (tmp > 1) {
          this.pizzaLog += ' * ' + tmp;
          tmp = 1;
        }
        this.pizzaLog += ',\n - ' + selectedPizza[i].name;
        sum += selectedPizza[i].price;
      }
    }
    if (tmp == 1) {
      this.pizzaLog += '.';
    } else {
      this.pizzaLog += ' * ' + tmp + '.';
    }
    this.priceLog += sum;
  }

  public getDestinationLog() {
    return this.destinationLog;
  }

  public getPizzaLog() {
    return this.pizzaLog;
  }

  public getPriceLog() {
    return this.priceLog;
  }

  public waitLogger(order: Order, waitTime: number) {
    if (waitTime == 0) {
      if (this.getStatus() == 'done') {
        this.waitLog = 'A rendelés elkészült!';
      } else if (this.getStatus() == 'deleted') {
        this.waitLog = 'A rendelés törölve!';
      }
    } else {
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
        'Az elkészülésig ' +
        minutesInString +
        ':' +
        secondsInString +
        ' van hátra!\n';
    }
  }

  public getWaitLog() {
    return this.waitLog;
  }
}
