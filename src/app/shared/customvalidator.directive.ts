import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rankRangeValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control && control.get('fromRank') && control.get('toRank')) {
    const fromRank = parseInt(control.get('fromRank')?.value);
    const toRank = parseInt(control.get('toRank')?.value);
    if (toRank == null) return null;
    return fromRank > toRank ? { rankError: true } : null;
  }
  return null;
}
