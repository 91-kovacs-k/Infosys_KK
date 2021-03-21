export class Suto {
    private static seged = 1; // segéd változó
    private ID; // sütő azonosító
    private sutoOra;
    private elerheto;

    public constructor() {
        this.ID = Suto.setID();
        this.sutoOra = 0;
        this.elerheto = true;
    }

    public getID() {
        return this.ID;
    }

    public getSutoOra() {
        return this.sutoOra;
    }

    public setSutoOra(n : number) {
        this.sutoOra = n;
    }

    public getElerheto() {
        return this.elerheto;
    }

    public setElerheto(bool : boolean) {
        this.elerheto = bool;
    }

    private static setID() {
        return Suto.seged++;
    }


}