import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormControl} from '@angular/forms';
import {MatError} from '@angular/material/input';

@Component({
  selector: 'app-form-error',
  imports: [CommonModule, MatError],
  template: `
    @if (shouldShowErrors()) {
      @let ctrl = control();
      @if (ctrl.hasError('required')) {
        <mat-error>This field is required</mat-error>
      }
      @if (ctrl.hasError('minlength')) {
        <mat-error>
          Must be at least {{ctrl.getError('minlength')?.requiredLength}} characters
        </mat-error>
      }
      @if (ctrl.hasError('noTestUsername')) {
        <mat-error>
          Cannot contain the word "test"
        </mat-error>
      }
    }
  `,
})
export class FormErrorComponent {
  /**
   * The form control to check for errors
   */
  control = input.required<AbstractControl | FormControl>();

  /**
   * Check if errors should be displayed
   */
  shouldShowErrors(): boolean {
    const ctrl = this.control();
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }
}
