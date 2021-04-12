import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../load.service';
import { Pizza } from '../models/pizza';

@Component({
  selector: 'app-delete-pizza',
  templateUrl: './delete-pizza.component.html',
  styleUrls: ['./delete-pizza.component.css'],
})
export class DeletePizzaComponent implements OnInit {
  closeResult = '';
  @Input() oldPizza!: Pizza;

  constructor(
    private modalService: NgbModal,
    private loadservice: LoadService
  ) {}

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.deletePizza();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  async deletePizza() {
    await this.loadservice.deletePizza(this.oldPizza.id);
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

  async ngOnInit() {}
}
