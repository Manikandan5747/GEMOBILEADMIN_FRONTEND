import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appPriceInput]'
})
export class PriceInputDirective {
    private debounceTimeout: any;
    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('focus', ['$event.target.value'])
    onFocus(value: string) {
        debugger
        this.el.nativeElement.value = this.unformat(value);
    }


    // @HostListener('input', ['$event.target.value'])
    // onInput(value: string) {
    //   // Remove non-digit characters
    //   const digitsOnly = value.replace(/\D/g, '');

    //   // Format with commas for thousands separators
    //   const formattedValue = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    //   // Update the input element with the formatted value
    //   this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
    // }



    @HostListener('blur', ['$event.target.value'])
    onBlur(value: string) {
        debugger
        this.el.nativeElement.value = this.format(value);
    }

    private format(value: string): string {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    private unformat(value: string): string {
        return value.replace(/,/g, '');
    }

    public formatInputValue() {
        const value = this.el.nativeElement.value;
        const formattedValue = this.format(value);
        this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
    }

}

