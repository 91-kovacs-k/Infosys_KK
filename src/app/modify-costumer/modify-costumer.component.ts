import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../load.service';
import { Costumer } from '../models/costumer';

@Component({
  selector: 'app-modify-costumer',
  templateUrl: './modify-costumer.component.html',
  styleUrls: ['./modify-costumer.component.css'],
})
export class ModifyCostumerComponent implements OnInit {
  closeResult = '';
  costumers!: Costumer[];
  prefix!: number;
  searchCostumer!: string;
  @Input() oldCostumer!: Costumer;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loadservice: LoadService
  ) {}

  costumer = this.fb.group({
    name: [, Validators.required],
    zip: [, [Validators.required, Validators.min(1000), Validators.max(9985)]],
    city: [, Validators.required],
    address1: [, Validators.required],
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

  async modifyCostumer() {
    const costumer = this.costumer.value;
    costumer.id = this.oldCostumer.id;
    await this.loadservice.modifyCostumer(costumer);

    this.costumer.reset();
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.modifyCostumer();
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