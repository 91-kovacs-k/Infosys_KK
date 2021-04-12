import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../load.service';
import { Costumer } from '../models/costumer';

@Component({
  selector: 'app-add-costumer',
  templateUrl: './add-costumer.component.html',
  styleUrls: ['./add-costumer.component.css'],
})
export class AddCostumerComponent implements OnInit {
  closeResult = '';
  costumers!: Costumer[];
  prefix!: number;
  searchCostumer!: string;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loadservice: LoadService
  ) {}

  setCostumerId() {
    if (this.costumers.length == 0) {
      return 1;
    } else {
      return this.costumers[this.costumers.length - 1].id + 1;
    }
  }

  newCostumer = this.fb.group({
    name: ['', Validators.required],
    zip: [, [Validators.required, Validators.min(1000), Validators.max(9985)]],
    city: [, Validators.required],
    address1: ['', Validators.required],
    address2: [, [Validators.required, Validators.min(1), Validators.max(873)]],
    telephonePrefix: [, Validators.required],
    telephone: [
      ,
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
        Validators.maxLength(7),
      ],
    ],
  });

  async search() {
    this.costumers = await this.loadservice.filterCostumers(
      this.searchCostumer
    );
  }

  async addCostumer() {
    let costumer = this.newCostumer.value;
    if (this.costumers.length > 0) {
      costumer.id = this.costumers[this.costumers.length - 1].id + 1;
    } else {
      costumer.id = 1;
    }
    await this.loadservice.addCostumer(costumer);

    this.newCostumer.reset();
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.addCostumer();
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
    this.costumers = await this.loadservice.loadCostumers();
  }
}
