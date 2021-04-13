import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../load.service';
import { Pizza } from '../models/pizza';

@Component({
  selector: 'app-add-pizza',
  templateUrl: './add-pizza.component.html',
  styleUrls: ['./add-pizza.component.css'],
})
export class AddPizzaComponent implements OnInit {
  closeResult = '';
  pizza!: Pizza[];
  bakeTime = this.loadservice.bakeTime;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loadservice: LoadService
  ) {}

  newPizza = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    size: [32, [Validators.min(32), Validators.max(48)]],
    preparationTime: [20, [Validators.min(1), Validators.max(40)]],
    price: [1000, [Validators.min(1000), Validators.max(5000)]],
  });

  get name() {
    return this.newPizza.get('name');
  }
  get description() {
    return this.newPizza.get('description');
  }
  get size() {
    return this.newPizza.get('size');
  }
  get preparationTime() {
    return this.newPizza.get('preparationTime');
  }
  get price() {
    return this.newPizza.get('price');
  }

  async addPizza() {
    let pizza = this.newPizza.value;
    pizza.id = this.setPizzaId();
    pizza.selected = 0;
    await this.loadservice.addPizza(pizza);

    this.newPizza.reset();
  }

  setPizzaId() {
    if (this.pizza.length == 0) {
      return 1;
    } else {
      return this.pizza[this.pizza.length - 1].id + 1;
    }
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.addPizza();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async ngOnInit() {
    this.pizza = await this.loadservice.loadPizza();
  }
}
