import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBeadando';


  sutokSzama = 5; //sütők száma
  sutesIdo = 10; //sütés idő mp-ben
  szabadSutok = new Map<number, boolean>(); //sütők + foglalt vagy sem
  Ora; //sütők órája
  

  constructor() { 
    for(let i=0; i < this.sutokSzama; i++){
      this.szabadSutok.set(i+1, true);
    }
    this.Ora = new Array(this.sutokSzama);
    for(let i=0; i < this.sutokSzama; i++){
      this.Ora[i] = 0;
    }
  }

  getSuto(){
    for(let i=0; i < this.sutokSzama; i++){
      if(this.szabadSutok.get(i+1)){
        this.szabadSutok.set(i+1, false);
        return i+1;
      }
    }
    return -1;
  }

  releaseSuto(suto : number){
    this.szabadSutok.set(suto, true);
  }

  async pizzaRendeles(){
    let suto = this.getSuto();
    if(suto != -1){
      await this.pizzaravar(suto);
      this.releaseSuto(suto);
    }else{
      alert("Nincs több szabad sütő!");
    }
  }

  async pizzaravar(suto : number){
    for(this.Ora[suto-1]; this.Ora[suto-1]<this.sutesIdo; this.Ora[suto-1]++){
      await this.pizzasutes(1000);
    }
    this.Ora[suto-1] = 0;
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  pizzasutes(ms: number){
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


/*
  async pizzarendeles(){
    this.SutokComponent.szabadSuto();
    if(this.szabadsutok > 0){
      this.szabadsutok = this.szabadsutok-1;
      await this.pizzaravar();
      this.szabadsutok = this.szabadsutok+1;
    }
  }

  async pizzaravar(){
    for(this.sutesido=0; this.sutesido<10; this.sutesido++){
      await this.pizzasutes(1000);
    }
    this.sutesido = 0;
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  pizzasutes(ms: number){
    return new Promise( resolve => setTimeout(resolve, ms) );
  }*/
}
