
// https://medium.com/@amandeepkochhar/angular-material-datepicker-set-custom-date-in-dd-mm-yyyy-format-5c0f4340e57
import { DatePipe } from '@angular/common';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment';

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        
export class AppDateAdapter extends NativeDateAdapter {
  
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;

      
      // let month: string = (date.getMonth() + 1).toString();
      // month = +month < 10 ? '0' + month : month;

      let month = monthNames[date.getMonth()];
      
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();

   
  }
}
export const DATEPICKER_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};