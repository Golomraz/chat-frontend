import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RoomsService } from '../home/rooms.service';
import { SocketService } from '../socket.service';
import { CallService } from './call.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit, OnDestroy {
  constructor(
    private roomService: RoomsService,
    private callService: CallService,
    private activatedRouter: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router
  ) {}
  room: any;
  currentUser: any;
  roomUsers: any = [];
  isHost = false;
  isInvited = false;
  isJoined = false;
  isWaiting = false;
  requests: any = [];
  rejected = false;
  isMicroOn = true;
  timer: any;

  get microButtonText(): string {
    return this.isMicroOn ? 'Выключить микрофон' : 'Включить микрофон';
  }

  async ngOnInit() {
    this.socketService
      .getMessage('audio-stream')
      .subscribe((res) => this.playAudio(res));

    this.currentUser = await this.authService.getCurrentUser();

    this.room = await this.roomService.getRoom(
      this.activatedRouter.snapshot.queryParams['id']
    );

    this.isHost = this.currentUser.id === this.room.host;
    this.isInvited = JSON.parse(this.room.users).find(
      (u: any) => u.id === this.currentUser.id
    );
    if (this.isHost) {
      this.socketService
        .getMessage(this.currentUser.id)
        .subscribe((res) => this.showRequests(res));
      this.joinToRoom();
    } else {
      this.roomUsers = JSON.parse(this.room.users).filter(
        (u: any) => !!u.status
      );
    }

    if (!this.isInvited && !this.isHost && !this.isJoined) {
      this.socketService
        .getMessage(this.currentUser.id)
        .subscribe((res) => this.checkAnswer(res));
    }
  }

  ngOnDestroy(): void {
    this.leaveRoom();
  }

  playAudio(res: any) {
    const audioLink = window.URL.createObjectURL(
      new Blob([res.audio], { type: 'audio/webm; codecs=opus' })
    );
    const audio = new Audio(audioLink);
    audio.play();
  }

  showRequests(res: any) {
    this.requests.push(res);
  }

  checkAnswer(res: boolean) {
    if (res) {
      this.joinToRoom();
    } else {
      this.rejected = true;
    }
  }

  joinToRoom() {
    this.socketService.getMessage('deleted').subscribe(() => this.leaveRoom());
    this.socketService.getMessage('kicked').subscribe(() => this.leaveRoom());
    this.socketService
      .getMessage('disconnected')
      .subscribe(() => this.updateUserList());
    this.socketService
      .getMessage('leaved')
      .subscribe((res) => this.deleteFromUserList(res));
    this.socketService
      .getMessage('micro-changed')
      .subscribe((res) => this.changeOtherUserMicro(res));
    this.socketService.sendMessage('join', {
      data: this.room._id,
      user: this.currentUser,
    });
    this.socketService
      .getMessage(this.room._id)
      .subscribe((res) => this.addUser(res));
    this.callService.startCall(this.room._id, this.currentUser.id);

    if (!this.isHost) this.isJoined = true;
    console.error(this.roomUsers);
  }

  addUser(user: any) {
    this.roomUsers.push(user);
  }

  leaveRoom() {
    this.callService.stopCall();
    this.socketService.sendMessage('leave', {
      data: this.room._id,
      user: this.currentUser.id,
    });
    if (this.roomUsers.length <= 1) {
      this.deleteRoom();
    }
    this.router.navigate(['home']);
  }

  async updateUserList() {
    this.room = await this.roomService.getRoom(
      this.activatedRouter.snapshot.queryParams['id']
    );

    this.roomUsers = JSON.parse(this.room.users).filter((u: any) => !!u.status);
  }

  changeMicroStatus() {
    this.isMicroOn = !this.isMicroOn;

    this.socketService.sendMessage('micro-change', {
      data: this.room._id,
      user: this.currentUser.id,
      status: this.isMicroOn,
    });

    if (this.isMicroOn) {
      this.callService.startCall(this.room._id, this.currentUser.id);
    } else {
      this.callService.stopCall();
    }
  }

  changeOtherUserMicro(data: any) {
    this.roomUsers.forEach((el: any) => {
      if (el.id === data.user) {
        el.microOff = !data.status;
      }
    });
  }

  kick(user: any) {
    this.socketService.sendMessage('kick', { data: this.room._id, user });
  }

  deleteRoom() {
    this.socketService.sendMessage('delete', { data: this.room._id });
  }

  deleteFromUserList(userId: string) {
    this.roomUsers = this.roomUsers.filter((u: any) => u.id !== userId);
  }

  askToJoin() {
    this.socketService.sendMessage('ask-to-join', {
      data: this.room,
      user: this.currentUser,
    });
    this.socketService.getMessage(this.currentUser.id);
    this.isWaiting = true;
  }

  accept(req: any) {
    this.socketService.sendMessage('accept', { user: req });
    this.requests = this.requests.filter(
      (request: any) => request.id !== req.id
    );
  }

  decline(req: any) {
    this.socketService.sendMessage('decline', { user: req });
    this.requests = this.requests.filter(
      (request: any) => request.id !== req.id
    );
  }
}
