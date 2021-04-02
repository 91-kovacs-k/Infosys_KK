import { Costumer } from './costumer';

export class Order {
  private static varForId = 1; // segéd változó az ID beállításhoz, amíg nem adatbázisból jön
  private id: number; // rendelés azonosító
  private quantity: number; // rendelt mennyiség
  private remainingQuantity: number; // hátralévő mennyiség
  private costumer: Costumer; // vevő

  // konstruktorban darabszámot vár, amivel beállítja, hogy mennyi mennyi pizzát rendeltek
  public constructor(vevo: Costumer, db: number) {
    this.id = Order.setID(); // ID beállítása
    this.quantity = db; // darabszám beállítása
    this.remainingQuantity = db; // hátralévő darabszám beállítása
    this.costumer = vevo; // vevő beállítása
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
  // hátralévő mennyiség csökkentése
  public DecrementRemainingQuantity() {
    this.remainingQuantity = this.remainingQuantity - 1;
  }
  // ID beállítása
  private static setID() {
    return Order.varForId++;
  }
}
