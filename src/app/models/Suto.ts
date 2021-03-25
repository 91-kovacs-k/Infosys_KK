import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

export class Suto {
    private static seged = 1; // segéd változó
    private ID; // sütő azonosító
    private sutoOra : Ora;
    private elerheto;

    public constructor() {
        this.ID = Suto.setID();
        this.elerheto = true;
        this.sutoOra = new Ora();
    }

    public getID() {
        return this.ID;
    }

    public getSutoOra() {
        return this.sutoOra;
    }

    public OraCompare(mp : number){
        let oraMP = this.sutoOra.getPerc() * 60 + this.sutoOra.getMPerc();
        if(mp < oraMP){
            return true;
        }else{
            return false;
        }
    }

    public getOraMP(){
        return this.sutoOra.getPerc() * 60 + this.sutoOra.getMPerc();
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

export class Ora{
    private perc;
    private mperc;

    constructor(){
        this.perc = 0;
        this.mperc = 0;
    }

    public getPerc(){
        return this.perc;
    }

    public getPercString(){
        if(this.perc < 10){
            return "0"+this.perc.toString();
        }else{
            return this.perc.toString();
        }
    }

    public setPerc(n: number){
        if(n > 60 || n < 0){
            throw new Error("Nem jó számot kapott az Ora.setPerc()");
        }else{
            this.perc = n;
        }
    }

    public getMPerc(){
        return this.mperc;
    }
    
    public getMPercString(){
        if(this.mperc < 10){
            return "0"+this.mperc.toString();
        }else{
            return this.mperc.toString();
        }
    }

    public setMPerc(n : number){
        if(n > 60 || n < 0){
            throw new Error("Nem jó számot kapott az Ora.setMPerc()");
        }else{
            this.mperc = n;
        }
    }

    public Reset(){
        this.perc = 0;
        this.mperc = 0;
    }
}