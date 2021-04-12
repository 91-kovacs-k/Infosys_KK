import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../load.service';
import { Pizza } from '../models/pizza';

@Component({
  selector: 'app-modify-pizza',
  templateUrl: './modify-pizza.component.html',
  styleUrls: ['./modify-pizza.component.css'],
})
export class ModifyPizzaComponent implements OnInit {
  closeResult = '';
  pizza!: Pizza[];
  @Input() oldPizza!: Pizza;

  pizzaForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    size: [32, [Validators.min(32), Validators.max(48)]],
    preparationTime: [20, [Validators.min(1), Validators.max(40)]],
    price: [1000, [Validators.min(1000), Validators.max(5000)]],
  });

  async modifyPizza() {
    let pizza = this.pizzaForm.value;
    pizza.id = this.oldPizza.id;
    pizza.preparationTime = this.loadservice.bakeTime;
    pizza.selected = this.oldPizza.selected;
    await this.loadservice.modifyPizza(pizza);

    this.pizzaForm.reset();
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.modifyPizza();
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

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loadservice: LoadService
  ) {}

  async ngOnInit() {
    this.pizza = await this.loadservice.loadPizza();
  }
}
