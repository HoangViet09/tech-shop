import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/shared/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  spectIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private productS: ProductService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      brand: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      product_type: ['', Validators.compose([Validators.required])],
      spect_header: ['', Validators.compose([Validators.required])],
      productSpectsArr: this.fb.array([this.createProductSpectRow()]),
      productColorOptionsArr: this.fb.array([this.createColorOptionsRow()]),
      productOfferIncludeArr: this.fb.array([this.createOfferIncludeRow()]),
      productPaymentIncentivesArr: this.fb.array([
        this.createPaymentIncentivesRow(),
      ]),
      productPromotionArr: this.fb.array([this.createPromotionRow()]),
      productImageArr: this.fb.array([this.createImageRow()]),
    });
  }

  // createMilestoneRow(): FormGroup {
  //   return this.formBuilder.group({
  //     msName: ['', Validators.required],
  //     msStartDate: ['', Validators.required],
  //     msEndDate: ['', Validators.required],
  //     msProgressEst: ['', Validators.required],
  //     msProgressTT: ['', Validators.required],
  //   });
  // }

  // group of function spect
  createProductSpectRow(): FormGroup {
    return this.fb.group({
      techTitle: ['', Validators.required],
      techContent: ['', Validators.required],
    });
  }
  get productSpectsArr(): FormArray {
    return this.form.get('productSpectsArr') as FormArray;
  }
  addProductSpectRow(): void {
    const newRow = this.createProductSpectRow();
    this.productSpectsArr.push(newRow);

    this.cdr.detectChanges();
  }

  deleteProductSpectRow(index: number): void {
    this.productSpectsArr.removeAt(index);

    this.cdr.detectChanges();
  }

  // group of function color option input
  createColorOptionsRow(): FormGroup {
    return this.fb.group({
      color_label: ['', Validators.required],
      color_price: ['', Validators.required],
    });
  }
  get productColorOptionsArr(): FormArray {
    return this.form.get('productColorOptionsArr') as FormArray;
  }
  addColorOptionRow(): void {
    const newRow = this.createColorOptionsRow();
    this.productColorOptionsArr.push(newRow);

    this.cdr.detectChanges();
  }

  deleteColorOptionRow(index: number): void {
    this.productColorOptionsArr.removeAt(index);

    this.cdr.detectChanges();
  }

  // group of function offer include input
  createOfferIncludeRow(): FormGroup {
    return this.fb.group({
      offer_include: [''],
    });
  }
  get productOfferIncludeArr(): FormArray {
    return this.form.get('productOfferIncludeArr') as FormArray;
  }
  addOfferIncludeRow(): void {
    const newRow = this.createOfferIncludeRow();
    this.productOfferIncludeArr.push(newRow);

    this.cdr.detectChanges();
  }

  deleteOfferIncludeRow(index: number): void {
    this.productOfferIncludeArr.removeAt(index);

    this.cdr.detectChanges();
  }

  // group of function payment incentives input
  createPaymentIncentivesRow(): FormGroup {
    return this.fb.group({
      payment_incentives: [''],
    });
  }
  get productPaymentIncentivesArr(): FormArray {
    return this.form.get('productPaymentIncentivesArr') as FormArray;
  }
  addPaymentIncentivesRow(): void {
    const newRow = this.createPaymentIncentivesRow();
    this.productPaymentIncentivesArr.push(newRow);

    this.cdr.detectChanges();
  }

  deletePaymentIncentivesRow(index: number): void {
    this.productPaymentIncentivesArr.removeAt(index);

    this.cdr.detectChanges();
  }
  // group of function promotion input
  createPromotionRow(): FormGroup {
    return this.fb.group({
      promotion: [''],
    });
  }
  get productPromotionArr(): FormArray {
    return this.form.get('productPromotionArr') as FormArray;
  }
  addPromotionRow(): void {
    const newRow = this.createPromotionRow();
    this.productPromotionArr.push(newRow);

    this.cdr.detectChanges();
  }

  deletePromotionRow(index: number): void {
    this.productPromotionArr.removeAt(index);

    this.cdr.detectChanges();
  }

  // group of function promotion input
  createImageRow(): FormGroup {
    return this.fb.group({
      Image: ['', Validators.required],
    });
  }
  get productImageArr(): FormArray {
    return this.form.get('productImageArr') as FormArray;
  }
  addImageRow(): void {
    const newRow = this.createImageRow();
    this.productImageArr.push(newRow);

    this.cdr.detectChanges();
  }

  deleteImageRow(index: number): void {
    this.productImageArr.removeAt(index);

    this.cdr.detectChanges();
  }

  closeModal() {
    this.activeModal.close();
  }

  convertDataStructure(data: any) {
    // Create the new data structure
    const newData = {
      product_type: data.product_type,
      product_images: data.productImageArr.map((item: any) => item.Image),
      product_header: {
        brand: data.brand,
        title: data.title,
        price: parseInt(data.price),
        color_option: data.productColorOptionsArr,
        promotion: data.productPromotionArr
          .map((item: any) => item.promotion)
          .filter(Boolean),
        payment_incentives: data.productPaymentIncentivesArr
          .map((item: any) => item.payment_incentives)
          .filter(Boolean),
        offer_include: data.productOfferIncludeArr
          .map((item: any) => item.offer_include)
          .filter(Boolean),
      },
      product_desc: {
        product_over_view: [],
        product_spect: {
          spectHeader: data.spect_header,
          spectContent: data.productSpectsArr.map((item: any) => ({
            techTitle: item.techTitle,
            techContent: item.techContent.trim(),
          })),
        },
      },
    };

    return newData;
  }

  onSubmit(form: any) {
    // console.log(form);
    const dataConverted = this.convertDataStructure(form.value);
    // console.log(dataConverted);
    this.form.markAllAsTouched();
    if (form.valid == false) {
      Swal.fire({
        title: 'Có lỗi trong quá trình nhập liệu',
        icon: 'error',
        timer: 700,
      });
      return;
    }
    return this.productS.addProduct(dataConverted).then(() => {
      this.closeModal();
    });
  }
}
