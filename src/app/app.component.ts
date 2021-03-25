import { Component } from '@angular/core';
import { Queue } from './models/Queue';
import { Rendeles } from './models/Rendeles';
import { Vevo } from './models/Vevo';
import { SutoManagementComponent } from './suto-management/suto-management.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBeadando';


  private varakozoSor = new Queue<Rendeles>(180); //180 a maximum várakozó pizza, mert 12 órát van nyitva a pizzéria egy nap, 5 sütő van és egy pizza 20 percig sül: 12*60/20*5=180
  private rendelesLog: string = "";
  private varakozasLog: string = "";
  private szallitasIdo = 20;

  konyha = new SutoManagementComponent();
  wrongPizzaDb = false;

  constructor() {

  }

  public rendeles(pizzaDB: number) {
    if (!(pizzaDB > 0 && pizzaDB < 11)) {
      this.wrongPizzaDb = true;
    } else {
      this.wrongPizzaDb = false;
    }
    if (!this.wrongPizzaDb) {
      let vevo = new Vevo();
      vevo.setNev("Kiss", "Jóska");
      vevo.setCim(3500, "Miskolc", "Petőfi út", 130);
      let rendeles = new Rendeles(vevo, pizzaDB);
      let varakozas;
      this.rendelesLogger(rendeles);
      if (this.varakozoSor.isEmpty()) {
        this.varakozoSor.enqueue(rendeles);

        varakozas = this.konyha.mikorKerulSorra(rendeles, this.varakozoSor);
        this.konyha.Sut(this.varakozoSor);
      } else {
        this.varakozoSor.enqueue(rendeles);
       varakozas = this.konyha.mikorKerulSorra(rendeles, this.varakozoSor);
      }

      this.varakozasLogger(rendeles, varakozas);
    }
  }

  private rendelesLogger(rendeles: Rendeles) {
    this.rendelesLog = this.rendelesLog + "A  #" + rendeles.getID() + " számú rendelését felvettük (" +
      rendeles.getQuantity() + " db pizza).\nVevő: " + rendeles.getVevo().getNev() + ". Szállítási cím: " +
      rendeles.getVevo().getCimek().getIrsz() + " " + rendeles.getVevo().getCimek().getVaros() + ", " +
      rendeles.getVevo().getCimek().getUtca() + " " + rendeles.getVevo().getCimek().getHsz() + ".\n\n";
  }

  public getRendelesLog() {
    return this.rendelesLog;
  }

  private varakozasLogger(rendeles: Rendeles, varakozas: number) {
    let percString;
    let mpercString;
    let perc = Math.floor(varakozas / 60);
    let mperc = varakozas - (perc * 60);
    // perc += this.szallitasIdo;

    if(perc < 10){
      percString = "0"+ perc.toString();
    }else{
      percString = perc.toString();
    }
    if(mperc < 10){
      mpercString = "0"+ mperc.toString();
    }else{
      mpercString = mperc.toString();
    }
    this.varakozasLog = this.varakozasLog + "A #" + rendeles.getID() + " számú rendelésre " + percString + ":" + mpercString + " kell várni!\n";
  }

  public getVarakozasLog() {
    return this.varakozasLog;
  }

}
