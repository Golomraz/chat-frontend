import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() submitForm = new EventEmitter();

  form = this._fb.group({
    username: [
      '',
      [
        Validators.required,
      
      ],
    ],
    password: [
      '',
      [
        Validators.required,
      
      ],
    ],
  });

  constructor(private _fb: FormBuilder) {}

  onSubmit() {
    this.submitForm.emit(this.form.value);
  }

  getError(formControlName: string): string {
    return this.form.get(formControlName)?.getError('pattern') ? 'Ошибка' : '';
  }
}
