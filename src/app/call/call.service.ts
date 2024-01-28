import { ElementRef, Injectable } from '@angular/core';
import { SocketService } from '../socket.service';

@Injectable({ providedIn: 'root' })
export class CallService {
  connection?: RTCPeerConnection;
  interval: any;
  soundDetected = false;

  constructor(private socketService: SocketService) {}

  stopCall() {
    clearInterval(this.interval);
  }

  detectSilence(stream: any, silence_delay = 200, min_decibels = -80) {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const streamNode = ctx.createMediaStreamSource(stream);
    streamNode.connect(analyser);
    analyser.minDecibels = min_decibels;

    const data = new Uint8Array(analyser.frequencyBinCount);
    let silence_start = performance.now();
    let triggered = false;

    const loop = (time: any) => {
      requestAnimationFrame(loop);
      analyser.getByteFrequencyData(data);
      if (data.some((v) => v)) {
        if (triggered) {
          triggered = false;
          this.soundDetected = true;
        }
        silence_start = time;
      }
      if (!triggered && time - silence_start > silence_delay) {
        triggered = true;
        this.soundDetected = false;
      }
    };
    loop(Date.now());
  }

  async startCall(room: string, userId: string) {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.detectSilence(userMedia);
    const mediaRecorder = new MediaRecorder(userMedia);
    mediaRecorder.ondataavailable = (event) => {
      this.soundDetected &&
        this.socketService.sendMessage('audio-stream', {
          room: room,
          data: event.data,
          user: userId,
        });
    };

    mediaRecorder.start();

    this.interval = setInterval(() => {
      mediaRecorder.stop();
      mediaRecorder.start();
    }, 1000);
  }
}
