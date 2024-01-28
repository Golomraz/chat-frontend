import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AuthComponent, RegisterComponent, LoginComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})

export class AuthModule {}