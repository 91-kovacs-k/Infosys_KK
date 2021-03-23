import { Component, OnInit } from '@angular/core';
import { Order } from "../Order";
import { Queue } from "../Queue";
import { Suto } from '../Suto';

@Component({
  selector: 'app-suto-management',
  templateUrl: './suto-management.component.html',
  styleUrls: ['./suto-management.component.css']
})
export class SutoManagementComponent implements OnInit {

  ngOnInit(): void {
  }

  sutok!: Suto[]; // sütők típusú tömb, sütők tárolására
  sutesIdo!: number; // sütés idő percben
  static elkeszultLog: string = ""; // elkészült pizzák
  inicializalva: boolean = false;
  seged!: any;
  sutesInProgress = false;
  wrongDb = false;
  wrongIdo = false;

  SutoManagementComponent = SutoManagementComponent;

  public constructor() {

  }

  getSutokSzama() {
    alert(this.sutok.length);
  }

  public sutoInicializalas(db: number, mperc: number) {
    if (!(mperc > 0 && mperc < 41)) {
      this.wrongIdo = true;
    } else {
      this.wrongIdo = false;
    }
    if (!(db > 0 && db < 11)) {
      this.wrongDb = true;
    } else {
      this.wrongDb = false;
    }
    if (!(this.wrongIdo || this.wrongDb)) {
      if (this.inicializalva) {
        alert("Már inicializálva van!")
      } else {
        this.sutesIdo = mperc /* * 60 */;   // perc vagy mp-ben számolom a sütés időt
        this.sutok = new Array(db);
        for (let i = 0; i < db; i++) {
          this.sutok[i] = new Suto();
        }
        this.inicializalva = true;

      }
    }

  }

  public async Sut(sor: Queue<Order>) {
    if (this.inicializalva) {
      this.sutesInProgress = true;
      while (!sor.isEmpty()) {
        let mindFoglalt = true;
        for (let i = 0; i < this.sutok.length; i++) {
          if (this.sutok[i].getElerheto() == true) {
            mindFoglalt = false;
            break;
          }
        }
        if (!mindFoglalt) {
          for (let i = 0; i < this.sutok.length; i++) {
            if (this.sutok[i].getElerheto()) {
              if (sor.peek().getRemainingQuantity() == 1) {
                this.pizzaSutes(this.sutok[i], sor.peek().getID(), sor.peek().getRemainingQuantity(), sor.peek().getQuantity());
                sor.dequeue();
              } else {
                this.pizzaSutes(this.sutok[i], sor.peek().getID(), sor.peek().getRemainingQuantity(), sor.peek().getQuantity());
                sor.peek().DecrementRemainingQuantity();
              }
            } else {
              continue;
            }
          }
        } else {
          await this.sutoreVar();
        }
      }
      this.sutesInProgress = false;
    } else {
      alert("Még nincs inicializálva a sütő!");
    }
  }

  private async pizzaSutes(suto: Suto, ID: number, remaining: number, quantity: number) {
    suto.setElerheto(false);
    for (let i = 0; i < this.sutesIdo; i++) {
      await this.pizzaraVar(1);
      suto.setSutoOra(i + 1);
    }
    suto.setSutoOra(0);
    suto.setElerheto(true);
    if (remaining == 1) {
      SutoManagementComponent.elkeszultLogger("Elkészült a #" + ID + " rendelés " + quantity + "/" + quantity + " pizzája.\n");
    } else {
      SutoManagementComponent.elkeszultLogger("Elkészült a #" + ID + " rendelés " + (quantity - remaining + 1) + "/" + quantity + " pizzája.\n");
    }
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  private pizzaraVar(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
  }

  private async sutoreVar() {
    let waitTime = 0;
    for (let i = 0; i < this.sutok.length; i++) {
      if (waitTime < this.sutok[i].getSutoOra()) {
        waitTime = this.sutok[i].getSutoOra();
      }
    }
    await this.pizzaraVar(this.sutesIdo - waitTime);
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  private static elkeszultLogger(str: string) {
    this.elkeszultLog = this.elkeszultLog + str;
  }

  public static getElkeszultLog() {
    return this.elkeszultLog;
  }


  public mikorKerulSorra(order : Order, sor : Queue<Order>){
    let sorszamUtolso = 0;
    let retval = 0;
    for(let i = 0; i < sor.getLength(); i++){
      if(sor.getobjectbynumber(i).getID() == order.getID()){
        sorszamUtolso++;
      }else{
        sorszamUtolso += sor.getobjectbynumber(i).getRemainingQuantity();
      }
    }
    let vanszabad = false;
    for(let i = 0; i < this.sutok.length; i++){
      if(this.sutok[i].getElerheto() == true){
        vanszabad = true;
        break;
      }
    }
    if(sorszamUtolso == 1 && vanszabad){
      sorszamUtolso += (order.getQuantity() - 1)
      if(sorszamUtolso <= this.sutok.length){
        sorszamUtolso = 0;
      }else{
        sorszamUtolso -= this.sutok.length
      }
    }else{
      sorszamUtolso += (order.getQuantity() - 1)
    }
    
    let szorzo = Math.ceil(sorszamUtolso / this.sutok.length);
    retval = szorzo * this.sutesIdo;
    
    let seged = 0;
    for(let i = 0; i < this.sutok.length; i++){
      if(this.sutok[i].getElerheto() == true){
        seged = 0;
        break;
      }
      if(seged < this.sutok[i].getSutoOra()){
        seged = this.sutok[i].getSutoOra();
      }
    }
    retval += (this.sutesIdo - seged);

    return retval;
  }

}