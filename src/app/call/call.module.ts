import { NgModule } from '@angular/core';
import { CallComponent } from './call.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaintComponent } from '../paint/paint.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [CallComponent, PaintComponent],
  imports: [RouterModule, MatButtonModule,MatFormFieldModule, CommonModule]
})
export class CallModule {}
