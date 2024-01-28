import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptor } from './custom.interceptor';
import { SocketIoModule } from 'ngx-socket-io';
import { env } from 'src/environment';
import { HomeModule } from './home/home.module';
import { CallModule } from './call/call.module';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HomeModule,
    CallModule,
    SocketIoModule.forRoot({url: env.API_URL}),
    ButtonModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
