

import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Injectable()
export class FormErrorsService {

  // return list of error messages
  public validationMessages() {
    const messages = {
      required: 'This field is required',
      middle_initial: 'Only one letter allowed',
      linkedin: 'Need LinkedIn URL',
      email: 'This email address is invalid',
      not_allowed_characters: (matches: any[]) => {

        let matchedCharacters = matches;

        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `These characters are not allowed: ${matchedCharacters}`;
      },
    };

    return messages;
  }

 
/**
 * Changes by Arun
 * Parent and child relationship reactive form validation(Popup form)
 * https://stackoverflow.com/questions/47279252/how-to-trigger-a-validation-of-child-component-from-parent-component-onsubmit-an
 */
  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    // console.log("control ",control);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } 
    // This is used for dynamic array fields EX-(Customer plan > plan attributes)
    else if (control instanceof FormArray) {
      const arrayControl = control.controls;
        arrayControl.forEach( ele => {
          if (ele instanceof FormGroup) {
            this.validateAllFormFields(ele);
          }
        })
    }else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}
}





