import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { InventoryService } from '../inventory.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {
  title: string = "Manage Inventory";
  buttonlabel: string = "Save";
  userPrivilegeObj: any;
  loading: boolean = false;
  addEditForm!: FormGroup;
  categoryList: any[] = []; // Holds categories from the API
  currentUser: any;
  isEdit: any;
  isShowErrors: boolean = false;
  inventory_id: any;
  formData = new FormData();
  imageSrc: any;

  imageSrc1: any;
  initialImageURL: string = ''; // To store initial image URL
  imageUpdated: boolean = false; // Flag to track if the image is updated
  constructor(
    private cookieService: CookieService,
    private customerService: CustomerService,
    private elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService
  ) {
    this.route.queryParams.subscribe(params => {
      this.inventory_id = params['inventory_id'];
      this.isEdit = params['isEdit'];
    });
    this.getCurrentUserPrivilege();
  }
  categoryTypes = [
    { id: 'GE INTERNAL', name: 'GE Internal' },
    { id: 'EXTERNAL VENDOR', name: 'External vendor' },
    { id: 'EXTERNAL VENDOR BRANDED', name: 'External vendor branded' }
  ];
  ngOnInit() {
    this.loading = true;
    this.buttonlabel = this.isEdit === "EDIT" ? "Update" : "Save";

    // Build the form with new fields
    this.addEditForm = this.fb.group({
      gift_name: ['', [Validators.required]],
      category_type: ['', Validators.required],
      category_id: ['', Validators.required],
      qty: ['', [Validators.required, Validators.min(1)]],
      no_repeat: [false],
      status: ['1', Validators.required],
      gift_image: ['', Validators.required]
    });

    if (this.inventory_id) {
      this.inventoryService.getByIdCategory(this.inventory_id).subscribe((data: any) => {
        setTimeout(() => this.fillForm(data[0]), 1000);
      });
    }

    if (this.isEdit === 'VIEW') {
      this.addEditForm.disable();
    }

    this.loadCategories(); // Load category list

    this.loading = false;
  }

  private fillForm(parsedData: any) {
    this.initialImageURL = parsedData.gift_image;
    this.addEditForm.patchValue({
      gift_name:parsedData.gift_name,
      category_id: parsedData.category_id,
      category_type: parsedData.category_type,
      qty: parsedData.qty,
      no_repeat: parsedData.no_repeat,
      status: parsedData.status && parsedData.status.toString(),
      gift_image: parsedData.gift_image,

    });
  }

  async getCurrentUserPrivilege() {
    const tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == 1); // Adjust module_id accordingly
  }

  loadCategories() {
    // Call the API to get category list
    this.inventoryService.getCategoryList().subscribe((data: any) => {
      this.categoryList = data; // Assuming 'data' is the array of categories
    });
  }

  get formControl(): any { return this.addEditForm.controls; }

  public save() {
    this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

    this.isShowErrors = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return;
    }
console.log(this.addEditForm.value)
    this.loading = true;
    this.formData = new FormData();

    const enteredData = this.addEditForm.value;
    enteredData.inventory_id = this.inventory_id;

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : {};
    enteredData.created_by = obj[0]?.login_id;
    enteredData.modified_by = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;
    this.formData.append('updategift_image', enteredData.gift_image); //link

    for (let key in enteredData) {
      if (key !== 'gift_image') {
        this.formData.append(key, enteredData[key]);
      }
    }

    // Append the image only if it was updated or no initial image exists
    if (this.imageUpdated || !this.initialImageURL) {
      this.formData.append('gift_image', enteredData.gift_image);// file obj
    }
   
    if (this.inventory_id) {
      // Update logic
      this.inventoryService.updateCategory(this.formData, this.inventory_id).subscribe(
        (response: any) => {
          if (response.success == true) {
            this.success(response.message);
            this.loading = false;
            this.router.navigate(['/luckyDraw/listInventory']);
          } else {
            this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
            this.handleError(response.message);
            this.loading = false;
          }
        },
        (error) => {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${error.message}`);
          this.handleError(error.message);
          this.loading = false;
        }
      );
    } else {
      // Create logic
      this.inventoryService.createCategory(this.formData).subscribe(
        (response: any) => {
          if (response.success == true) {
            this.success(response.message);
            this.loading = false;
            this.router.navigate(['/luckyDraw/listInventory']);
          } else {
            this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
            this.handleError(response.message);
            this.loading = false;
          }
        },
        (error) => {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${error.message}`);
          this.handleError(error.message);
          this.loading = false;
        }
      );
    }
  }

  private success(message: string) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success' });
    this.loading = false;
  }

  private handleError(error: string) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error' });
    this.loading = false;
  }

  async onFileChangedBackEmirates(event: any) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    const selectedFile = files[0];

    // Check if the file is a valid image
    if (this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        gift_image: selectedFile
      });

      // Read and preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc1 = e.target.result;  // Preview image
      };
      reader.readAsDataURL(selectedFile);
      this.imageUpdated = true; 
    } else {
      // Show an error message for unsupported file types
      this.errorlogService.logManualValidationError(`add-inventory component|onFileChangedBackEmirates()|Unsupported file type selected. Please select an image file (jpg, jpeg, png, gif, jfif).`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Unsupported file type selected. Please select an image file (jpg, jpeg, png, gif, jfif).",
        icon: 'error',
      });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        gift_image: null
      });
    }
  }

  // Method to check if file is a PDF
  isPDF(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

  // Method to check if file is an image
  isIMG(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif|jfif)$/i.test(fileName);
  }

}