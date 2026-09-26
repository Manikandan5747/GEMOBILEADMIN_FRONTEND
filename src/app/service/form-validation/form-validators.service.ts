

import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';

@Injectable()
export class ErrorMatcherService implements ErrorStateMatcher {

  // isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
  //   const isSubmitted = form && form.submitted;
  //   return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  // }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    return !!(control && control.invalid && control.touched);
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


  



export const errorMessages: { [key: string]: string } = {
  required: 'This field is required',
  middle_initial: 'Only one letter allowed',
  email: 'Invalid email address',
};



