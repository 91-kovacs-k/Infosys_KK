import { Vevo } from "./Vevo";

export class Rendeles {
    private static seged = 1; // segéd változó az ID beállításhoz, amíg nem adatbázisból jön
    private ID; // rendelés azonosító
    private Quantity: number; // rendelt mennyiség
    private remainingQuantity: number; // hátralévő mennyiség
    private vevo!: Vevo; // vevő

    // konstruktorban darabszámot vár, amivel beállítja, hogy mennyi mennyi pizzát rendeltek
    public constructor(vevo: Vevo, db: number) {
        this.ID = Rendeles.setID();        // ID beállítása
        this.Quantity = db;             // darabszám beállítása
        this.remainingQuantity = db;    // hátralévő darabszám beállítása
        this.vevo = vevo;               // vevő beállítása
    }
    // get ID
    public getID() {
        return this.ID;
    }
    // get rendelt mennyiség
    public getQuantity() {
        return this.Quantity;
    }
    // get hátralévő mennyiség
    public getRemainingQuantity() {
        return this.remainingQuantity;
    }
    // get vevő 
    public getVevo() {
        return this.vevo;
    }
    // hátralévő mennyiség csökkentése
    public DecrementRemainingQuantity() {
        this.remainingQuantity = this.remainingQuantity - 1;
    }
    // ID beállítása
    private static setID() {
        return Rendeles.seged++;
    }


}