import { Component } from '@angular/core';
import { Order } from "../Order";
import { Queue } from "../Queue";
import { Inject } from '@angular/core';

@Component({
  selector: 'app-suto',
  templateUrl: './suto.component.html',
  styleUrls: ['./suto.component.css']
})
export class SutoComponent {

  private static sutokSzama: number; // sütők száma
  private static sutesIdo: number; // sütés idő mp-ben
  private static sutoOra: any; // sütők órája
  private static szabadSutok = new Map<number, boolean>(); //sütők + foglalt vagy sem
  private static elkeszultLog : string; // elkészült pizzák

  SutoComponent = SutoComponent;

  public constructor(@Inject(Number) db: number, @Inject(Number) mperc: number) {
    SutoComponent.sutokSzama = db;
    SutoComponent.sutesIdo = mperc;
    SutoComponent.sutoOra = new Array(SutoComponent.sutokSzama);
    for (let i = 0; i < SutoComponent.sutokSzama; i++) {
      SutoComponent.sutoOra[i] = 0;
    }
    for (let i = 0; i < SutoComponent.sutokSzama; i++) {
      SutoComponent.szabadSutok.set(i + 1, true);
    }
    SutoComponent.elkeszultLog = "";
  }

  public static async Sut(sor: Queue<Order>) {
    while (!sor.isEmpty()) {
      for (let i = 0; i < this.sutokSzama; i++) {
        if (SutoComponent.szabadSutok.get(i + 1)) {
          SutoComponent.szabadSutok.set(i + 1, false);
          SutoComponent.pizzaSutes(i, sor);

        } else {
          await SutoComponent.sutoreVar();
        }
      }
    }
  }

  private static async pizzaSutes(suto: number, sor: Queue<Order>) {
    await SutoComponent.pizzaraVar(SutoComponent.sutesIdo);
    SutoComponent.sutoOra[suto] = 0;
    SutoComponent.releaseSuto(suto + 1);
    SutoComponent.elkeszultLogger("Elkészült a #" + sor.peek().getID() + " rendelés " + (sor.peek().getQuantity() - sor.peek().getRemainingQuantity() + 1) + "/" + sor.peek().getQuantity() + " pizzája.");
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
    SutoComponent.szabadSutok.set(suto, true);
  }

  private static elkeszultLogger(str: string) {
    SutoComponent.elkeszultLog += str;
  }

  public getElkeszultLog() {
    return SutoComponent.elkeszultLog;
  }

}
