import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../socket.service';
import { CallService } from '../call/call.service';
import { FormControl } from '@angular/forms';
import { RoomsService } from './rooms.service';
import { debounceTime, delay, filter, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./html.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private roomsService: RoomsService,
    private router: Router,
    private socketService: SocketService,
    private authService: AuthService
  ) {}
  addedUsers: any[] = [];
  users: any;
  findByLetter = new FormControl('');
  currentUser: any;

  get formattedUsers(): string {
    const users = [this.currentUser, ...this.addedUsers];
    return JSON.stringify(users);
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.authService.getCurrentUser();
    this.findByLetter.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      if (res === '' || !res) {
        this.users = [];
        return;
      }
      this.roomsService
        .findUser(res)
        .subscribe(
          (res) =>
            (this.users = res
              .filter((res: any) => res._id !== this.currentUser.id)
              .slice(0, 10))
        );
    });
  }

  createRoom() {
    this.roomsService.createRoom(this.formattedUsers).subscribe((res) => {
      this.router.navigate(['call/'], { queryParams: { id: res._id } });
      console.error(res);
    });
  }

  add(user: any) {
    if (!this.addedUsers.find((u: any) => u._id === user._id)) {
      this.addedUsers.push({ username: user.username, id: user._id });
      this.users = this.users.filter((u: any) => u._id !== user._id);
    }
  }

  remove(user: any) {
    this.addedUsers = this.addedUsers.filter((u) => u.id !== user.id);
  }
}
