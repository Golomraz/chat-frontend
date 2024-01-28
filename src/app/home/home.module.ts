import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaintComponent } from "../paint/paint.component";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule,MatButtonModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class HomeModule{}