export class Order {
    private static seged = 1; // segéd változó
    private ID; // rendelés azonosító
    private Quantity: number; // rendelt mennyiség
    private remainingQuantity: number; // hátralévő mennyiség

    public constructor(db: number) {
        this.ID = Order.setID();
        this.Quantity = db;
        this.remainingQuantity = db;
    }

    public getID() {
        return this.ID;
    }

    public getQuantity() {
        return this.Quantity;
    }

    public getRemainingQuantity() {
        return this.remainingQuantity;
    }

    public DecrementRemainingQuantity() {
        this.remainingQuantity = this.remainingQuantity - 1;
    }

    private static setID() {
        return Order.seged++;
    }


}