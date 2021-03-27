import { Component, OnInit } from '@angular/core';
import { Rendeles } from "../models/Rendeles";
import { Queue } from "../models/Queue";
import { Suto } from '../models/Suto';

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

  public sutoInicializalas(db: number, perc: number) {
    if (!(perc > 0 && perc < 41)) {
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
        this.sutesIdo = perc;   // percben számolom a sütés időt
        this.sutok = new Array(db);
        for (let i = 0; i < db; i++) {
          this.sutok[i] = new Suto();
        }
        this.inicializalva = true;

      }
    }

  }

  public async Sut(sor: Queue<Rendeles>) {
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
      for (let j = 0; j < 60; j++){
        await this.pizzaraVar(1);
        suto.getSutoOra().setMPerc(j + 1);
      }
      suto.getSutoOra().setMPerc(0);
      suto.getSutoOra().setPerc(i+1);
    }
    suto.getSutoOra().Reset();
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
      if (this.sutok[i].OraCompare(waitTime)) {
        waitTime = this.sutok[i].getOraMP();
      }
    }
    await this.pizzaraVar((this.sutesIdo * 60) - waitTime);
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  private static elkeszultLogger(str: string) {
    this.elkeszultLog = this.elkeszultLog + str;
  }

  public static getElkeszultLog() {
    return this.elkeszultLog;
  }

public mikorKerulSorra(order : Rendeles, sor : Queue<Rendeles>){
  let orak = new Array(this.sutok.length);
  for(let i = 0; i < this.sutok.length; i++){
    orak[i] = ((this.sutesIdo * 60) - this.sutok[i].getOraMP());
  }
  orak.sort((a, b) => a - b);
  let kezdoSorszam = 0;
  let retval = 0;
  for(let i = 0; i < sor.getLength(); i++){
    if(sor.getObjectByNumber(i).getID() == order.getID()){
      kezdoSorszam++;
    }else{
      kezdoSorszam += sor.getObjectByNumber(i).getRemainingQuantity();
    }
  }
  let utolsoSorszam = kezdoSorszam + order.getQuantity() -1 ;
  let seged;
  let sorszam;
  if(utolsoSorszam >= this.sutok.length){
    seged = Math.floor(utolsoSorszam / this.sutok.length);
    sorszam = utolsoSorszam - (seged * this.sutok.length);
  }else{
    sorszam = utolsoSorszam
  }
  let kivalasztott = -1;
  
  if(sorszam == 0){
    kivalasztott = 0;
  }else{
    while(sorszam != 0){
      if(kivalasztott == (orak.length - 1)){
        kivalasztott = 0;
      }else{
        kivalasztott++;
      }
      sorszam--;
    }
  }
  

  
  let szorzo = Math.ceil(utolsoSorszam / this.sutok.length);
  retval = szorzo * (this.sutesIdo * 60);

  if(this.vanSzabadSuto(utolsoSorszam)){
    return retval;
  }else{
    //retval += this.sutesIdo * 60;
    retval += orak[kivalasztott];
  }
  return retval;
}

public vanSzabadSuto(n : number){
  let count = 0;
  for(let i = 0; i < this.sutok.length; i++){
    if(this.sutok[i].getElerheto()){
      count++;
    }
  }
  if(count >= n){
    return true;
  }else{
    return false;
  }
}
}