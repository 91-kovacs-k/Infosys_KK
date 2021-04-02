export class Oven {
  private static varForId = 1; // segéd változó id létrehozáshoz
  private id: number; // sütő azonosító
  private ovenTimer: Time; // óra típusú változó ami az adott sütő órája lesz
  private availability: boolean; // elérhető-e vagy sem az adott sütő

  public constructor() {
    this.id = Oven.setID();
    this.availability = true;
    this.ovenTimer = new Time();
  }

  public getID() {
    return this.id;
  }

  public getOvenTimer() {
    return this.ovenTimer;
  }

  public timeCompare(sec: number) {
    let timeInSec =
      this.ovenTimer.getMinutes() * 60 + this.ovenTimer.getSeconds();
    if (sec < timeInSec) {
      return true;
    } else {
      return false;
    }
  }

  public getTimeInSeconds() {
    return this.ovenTimer.getMinutes() * 60 + this.ovenTimer.getSeconds();
  }

  public getAvailability() {
    return this.availability;
  }

  public setAvailability(bool: boolean) {
    this.availability = bool;
  }

  private static setID() {
    return Oven.varForId++;
  }
}

export class Time {
  private minutes;
  private seconds;

  constructor() {
    this.minutes = 0;
    this.seconds = 0;
  }

  public getMinutes() {
    return this.minutes;
  }

  public getMinutesString() {
    if (this.minutes < 10) {
      return '0' + this.minutes.toString();
    } else {
      return this.minutes.toString();
    }
  }

  public setMinutes(n: number) {
    if (n > 60 || n < 0) {
      throw new Error('Nem jó számot kapott az Ora.setPerc()');
    } else {
      this.minutes = n;
    }
  }

  public getSeconds() {
    return this.seconds;
  }

  public getSecondsString() {
    if (this.seconds < 10) {
      return '0' + this.seconds.toString();
    } else {
      return this.seconds.toString();
    }
  }

  public setSeconds(n: number) {
    if (n > 60 || n < 0) {
      throw new Error('Nem jó számot kapott az Ora.setMPerc()');
    } else {
      this.seconds = n;
    }
  }

  public Reset() {
    this.minutes = 0;
    this.seconds = 0;
  }
}
