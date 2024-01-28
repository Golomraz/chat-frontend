import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
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
    re_password: [
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
