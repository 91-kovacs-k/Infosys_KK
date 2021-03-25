export class Vevo {
    private static seged = 1; // segéd változó az ID beállításához
    private ID!: number; // sütő azonosító
    private nev!: Nev; // név
    private cim!: Cim; // rendelési címek
    private telefonszam!: string;

    // konstruktorban alap adatokkal töltöm fel a változókat, hogy egyszerűbb legyen a tesztelés
    public constructor() {
        this.setID();
        this.nev = new Nev();
        this.cim = new Cim();
        this.telefonszam = "+36301234567";
    }

    // getter setterek
    public getTel() {
        return this.telefonszam;
    }

    public setTel(s: string) {
        this.telefonszam = s;
    }

    public getCimek() {
        return this.cim;
    }

    public setCim(irsz: number, varos: string, utca: string, hsz: number) {
        this.cim.setIrsz(irsz);
        this.cim.setVaros(varos);
        this.cim.setUtca(utca);
        this.cim.setHsz(hsz);
    }

    public getNev() {
        return this.nev.getVNev() + " " + this.nev.getKNev();
    }

    public setNev(vnev: string, knev: string) {
        this.nev.setVNev(vnev);
        this.nev.setKNev(knev);
    }

    // ID beállítása
    private setID() {
        this.ID = Vevo.seged++;
    }
}
export class Nev {
    private vezeteknev!: string;
    private keresztnev!: string;

    // konstruktorban alap adatokkal töltöm fel a változókat, hogy egyszerűbb legyen a tesztelés
    public constructor() {
        this.vezeteknev = "Szabó";
        this.keresztnev = "Pista";
    }

    // getter setterek
    getVNev() {
        return this.vezeteknev;
    }

    setVNev(s: string) {
        this.vezeteknev = s;
    }

    getKNev() {
        return this.keresztnev;
    }

    setKNev(s: string) {
        this.keresztnev = s;
    }
}

export class Cim {
    private irsz: number; // irányítószám
    private varos: string; // város
    private utca: string; // utca
    private hsz: number; // házszám

    // konstruktorban alap adatokkal töltöm fel a változókat, hogy egyszerűbb legyen a tesztelés
    public constructor() {
        this.irsz = 3600;
        this.varos = "Ózd";
        this.utca = "Vasvár";
        this.hsz = 4;
    }

    // getter setterek

    public getIrsz() {
        return this.irsz;
    }

    public setIrsz(n: number) {
        this.irsz = n;
    }

    public getVaros() {
        return this.varos;
    }

    public setVaros(s: string) {
        this.varos = s;
    }

    public getUtca() {
        return this.utca;
    }

    public setUtca(s: string) {
        this.utca = s;
    }

    public getHsz() {
        return this.hsz;
    }

    public setHsz(n: number) {
        this.hsz = n;
    }
}