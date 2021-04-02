export interface Pizza {
  id: number;
  name: string;
  description: string;
  size: number;
  preparationTime: number;
  price: number;
  selected: number;
}

/*
export class Pizza {
    private ar!: number;
    private meret!: number;
    private leiras!: string;
    private elkeszitesiIdo!: number;

    public constructor(ar: number, meret: number, leiras: string, elkeszitesiIdo: number) {
        this.ar = ar;
        this.meret = meret;
        this.leiras = leiras;
        this.elkeszitesiIdo = elkeszitesiIdo;
    }

    public getAr(){
        return this.ar;
    }
    
    public getMeret(){
        return this.meret;
    }

    public getLeairas(){
        return this.leiras;
    }

    public getElkeszitesiIdo(){
        return this.elkeszitesiIdo;
    }
}
*/
