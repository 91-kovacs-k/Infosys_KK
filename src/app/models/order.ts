import { Costumer } from './costumer';
import { Pizza } from './pizza';

export class Order {
  private static varForId = 1; // segéd változó az ID beállításhoz, amíg nem adatbázisból jön
  private id: number; // rendelés azonosító
  private quantity: number; // rendelt mennyiség
  private remainingQuantity: number; // hátralévő mennyiség
  private costumer: Costumer; // vevő
  private selectedPizza!: Pizza[]; // a rendelt pizzák

  // konstruktorban darabszámot vár, amivel beállítja, hogy mennyi mennyi pizzát rendeltek
  public constructor(costumer: Costumer, selectedPizza: Pizza[]) {
    this.id = Order.setID(); // ID beállítása
    this.quantity = selectedPizza.length; // darabszám beállítása
    this.remainingQuantity = selectedPizza.length; // hátralévő darabszám beállítása
    this.costumer = costumer; // vevő beállítása
    this.selectedPizza = selectedPizza;
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
}
