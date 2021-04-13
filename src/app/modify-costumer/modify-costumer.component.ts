import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    address2: [
      ,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(873),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
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
  get name() {
    return this.costumer.get('name');
  }
  get zip() {
    return this.costumer.get('zip');
  }
  get city() {
    return this.costumer.get('city');
  }
  get address1() {
    return this.costumer.get('address1');
  }
  get address2() {
    return this.costumer.get('address2');
  }
  get telephonePrefix() {
    return this.costumer.get('telephonePrefix');
  }
  get telephone() {
    return this.costumer.get('telephone');
  }

  async modifyCostumer() {
    let costumer = this.costumer.value;
    costumer.id = this.oldCostumer.id;
    await this.loadservice.modifyCostumer(costumer);

    this.costumer.reset();
  }

  open(content: any) {
    this.costumer.controls['name'].setValue(this.oldCostumer.name);
    this.costumer.controls['zip'].setValue(this.oldCostumer.zip);
    this.costumer.controls['city'].setValue(this.oldCostumer.city);
    this.costumer.controls['address1'].setValue(this.oldCostumer.address1);
    this.costumer.controls['address2'].setValue(this.oldCostumer.address2);
    this.costumer.controls['telephonePrefix'].setValue(
      this.oldCostumer.telephonePrefix
    );
    this.costumer.controls['telephone'].setValue(this.oldCostumer.telephone);

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
    this.costumer.controls['name'].setValue(this.oldCostumer.name);
    this.costumer.controls['zip'].setValue(this.oldCostumer.zip);
    this.costumer.controls['city'].setValue(this.oldCostumer.city);
    this.costumer.controls['address1'].setValue(this.oldCostumer.address1);
    this.costumer.controls['address2'].setValue(this.oldCostumer.address2);
    this.costumer.controls['telephonePrefix'].setValue(
      this.oldCostumer.telephonePrefix
    );
    this.costumer.controls['telephone'].setValue(this.oldCostumer.telephone);
  }
}
