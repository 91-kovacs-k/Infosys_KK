import { Observable } from "rxjs";
import { Order } from "./Order";
import { Queue } from "./Queue";

export class Suto {
    private static sutokSzama: number; // sütők száma
    private static sutesIdo: number; // sütés idő mp-ben
    private static sutoOra: any; // sütők órája
    private static szabadSutok = new Map<number, boolean>(); //sütők + foglalt vagy sem
    static elkeszultLog = ""; // elkészült pizzák

    public constructor(db: number, mperc: number) {
        Suto.sutokSzama = db;
        Suto.sutesIdo = mperc;
        Suto.sutoOra = new Array(Suto.sutokSzama);
        for (let i = 0; i < Suto.sutokSzama; i++) {
            Suto.sutoOra[i] = 0;
        }
        for (let i = 0; i < Suto.sutokSzama; i++) {
            Suto.szabadSutok.set(i + 1, true);
        }
    }


    public static async Sut(sor: Queue<Order>) {
        while (!sor.isEmpty()) {
            for (let i = 0; i < this.sutokSzama; i++) {
                if (Suto.szabadSutok.get(i + 1)) {
                    Suto.szabadSutok.set(i + 1, false);
                    Suto.pizzaSutes(i, sor);

                } else {
                    await Suto.sutoreVar();
                }
            }
        }
    }

    private static async pizzaSutes(suto: number, sor: Queue<Order>) {
        await Suto.pizzaraVar(Suto.sutesIdo);
        Suto.sutoOra[suto] = 0;
        Suto.releaseSuto(suto + 1);
        alert("elkészült a #" + sor.peek().getID() + " rendelés " + (sor.peek().getQuantity() - sor.peek().getRemainingQuantity() + 1) + "/" + sor.peek().getQuantity() + " pizzája")
        if (sor.peek().getRemainingQuantity() == 1) {
            sor.dequeue();
        } else {
            sor.peek().DecrementRemainingQuantity();
        }
        return new Promise(resolve => setTimeout(resolve, 0));
    }

    private static pizzaraVar(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms * 1000));
    }

    private static async sutoreVar() {
        let waitTime = 0;
        for (let i = 1; i < this.sutokSzama; i++) {
            if (waitTime < this.sutoOra[i]) {
                waitTime = this.sutoOra[i];
            }
        }
        await this.pizzaraVar(waitTime);
        return new Promise(resolve => setTimeout(resolve, 0));
    }

    private static releaseSuto(suto: number) {
        Suto.szabadSutok.set(suto, true);
    }

    private static elkeszultLogger(str: string) {
        Suto.elkeszultLog += str;
    }

}