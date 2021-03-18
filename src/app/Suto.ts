import { Order } from "./Order";
import { Queue } from "./Queue";

export class Suto {
    private sutokSzama: number; // sütők száma
    private sutesIdo: number; // sütés idő mp-ben
    private sutoOra: any; // sütők órája
    private szabadSutok = new Map<number, boolean>(); //sütők + foglalt vagy sem
    elkeszultLog = ""; // elkészült pizzák

    public constructor(db: number, perc : number) {
        this.sutokSzama = db;
        this.sutesIdo = perc;
        this.sutoOra = new Array(this.sutokSzama);
        for(let i = 0; i < this.sutokSzama; i++){
            this.sutoOra[i] = 0;
        }
        for(let i = 0; i < this.sutokSzama; i++){
            this.szabadSutok.set(i + 1, true);
        }
    }

    public Sut(sor : Queue<Order>){
        while(!sor.isEmpty()){
            for (let i = 0; i < this.sutokSzama; i++) {
                if (this.szabadSutok.get(i + 1)) {
                    this.szabadSutok.set(i + 1, false);
                    if(sor.peek().getRemainingQuantity() == 1){
                        sor.dequeue();
                    }else{
                        sor.peek().DecrementRemainingQuantity();
                    }
                    this.pizzaSutes(i, sor.peek());
                }else{
                    let waitTime = 0;
                    for (let i = 1; i < this.sutokSzama; i++) {
                        if (waitTime < this.sutoOra[i]) {
                            waitTime = this.sutoOra[i];
                        }
                    }
                    this.pizzaraVar(this.sutesIdo - waitTime);
                }
            }
        }
    }

    private async pizzaSutes(suto: number, order: Order) {
        for (this.sutoOra[suto]; this.sutoOra[suto] < this.sutesIdo; this.sutoOra[suto]++) {
          await this.pizzaraVar(1000);
        }
        this.sutoOra[suto] = 0;
        this.releaseSuto(suto + 1);
        if(order.getRemainingQuantity() == 1){
            alert("elkészült");
            this.elkeszultLogger("A #" + order.getID() + " számú rendelés elkészült!\n");
        }else{
            alert("elkészült");
            this.elkeszultLogger("A #" + order.getID() + " számú rendelés " + (order.getQuantity() - order.getRemainingQuantity()) + ". pizzája elkészült!\n");
        }
    }

    private pizzaraVar(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private releaseSuto(suto: number) {
        this.szabadSutok.set(suto, true);
    }

    private elkeszultLogger(str: string) {
        this.elkeszultLog += str;
    }

}