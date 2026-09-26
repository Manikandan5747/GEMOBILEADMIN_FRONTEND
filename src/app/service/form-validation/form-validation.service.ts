import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  wholeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let min = 0;
      let value = control.value;
      if (value < min) {
        return { 'isNegativeValue': true };
      }
      if (value && value.toString().includes(".")) {
        return { 'isDecimalValue': true };
      }
      return null;
    };
  }

  maxNumberValidator(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let value = control.value;
      if (value && value > max) {
        return { 'isMaximumValue': true };
      }
      return null;
    };
  }

  commonFieldErrorMessage(control: AbstractControl) {
    // console.log("control ", control);
    if (control && control.touched) {
      if (control.errors?.['whitespace']) {
        return "White space not allowed";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  decimalNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let min = 0;
      let value = control.value;
      // console.log("value ",value);
      if (value && value < min) {
        return { 'isNegativeValue': true };
      }
      // Allow only two digit
      const regExp = /^\d*(?:[.,]\d{1,2})?$/;
      if (value && !regExp.test(value)) {
        return { 'invalidDecimalValue': true };
      }
      return null;
    };
  }



  nonNegativeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value < 0) {
        return { 'negative': true };
      }
      return null;
    };
  }


  wholeNumberErrorMessage(control: AbstractControl) {
    if (control && control.touched) {
      if (control.errors?.['required']) {
        return "This field is required";
      } else {
        if (control.errors?.['isDecimalValue']) {
          return "Decimal value is not allowed"
        }
        if (control.errors?.['isNegativeValue']) {
          return "Negative value is not allowed"
        }
        return "";
      }
    } else {
      return "";
    }
  }




  textFieldValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let value = control.value;
      // Allow only alphabets and space
      const regExp = /^[a-zA-Z ]*$/;
      if (value && !regExp.test(value)) {
        return { 'invalidValue': true };
      }
      return null;
    };
  }



  trimValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value.startsWith(' ')) {
        return {
          'trimError': { value: 'control has leading whitespace' }
        };
      }
      if (control.value.endsWith(' ')) {
        return {
          'trimError': { value: 'control has trailing whitespace' }
        };
      }

      return null;
    };
  };




  noWhitespaceValidator(control: FormControl) {
    if (control.value) {
      let value = control.value.trim();
      if (value.length === 0) {
        return { 'whitespace': true };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // Whitespace validator
  noZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = control.value === 0;
      return forbidden ? { 'zero': { value: control.value } } : null;
    };
  }



  /**
    * Marks all controls in a form group as touched
    * @param formGroup - The form group to touch
    */
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }






}

@Injectable()
export class ErrorMatcherService implements ErrorStateMatcher {

  // isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
  //   const isSubmitted = form && form.submitted;
  //   return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  // }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    return !!(control && control.invalid && control.touched);
  }
}


