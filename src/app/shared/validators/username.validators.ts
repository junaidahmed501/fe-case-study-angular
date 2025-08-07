import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Custom validator that checks if a control's value contains the word 'test'
 * @returns A validator function that returns an error object if validation fails, null otherwise
 */
export function noTestUsernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // If no value or not a string, skip validation
    if (!control.value || typeof control.value !== 'string') {
      return null;
    }

    // Check if username contains 'test' (case insensitive)
    const containsTest = control.value.toLowerCase().includes('test');

    return containsTest ? { noTestUsername: true } : null;
  };
}
