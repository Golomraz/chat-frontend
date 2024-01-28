import { Component, OnInit } from '@angular/core';
import { AuthPage } from './auth.const';
import { HttpClient } from '@angular/common/http';
import { ILoginResult } from './auth.interface';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit{
  pages = AuthPage;
  selectedPage = this.pages.Reg;

  constructor(private authService: AuthService, private socketService: SocketService) {}

  get pageKeys(): string[] {
    return Object.values(this.pages);
  }

  get isRegister(): boolean {
    return this.selectedPage === this.pages.Reg;
  }

  get isLogin(): boolean {
    return this.selectedPage === this.pages.Log;
  }

  ngOnInit(): void {
    
  }

  changePage(page: string) {
    this.selectedPage = page as AuthPage;
  }

  onRegister(data: any) {
    this.authService.signUp({ password: data.password, username: data.username });
  }

  onLogin(data: any) {
    this.authService.signIn(data);
  }
}
