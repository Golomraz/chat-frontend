import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs'
import { mergeMap, takeUntil, switchMap } from 'rxjs/operators'

import { PaintService } from './paint.service'
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-paint',
  template: `
    <button mat-raised-button *ngIf='isHost' (click)='clear()'>Очистить</button>
    <canvas #mount></canvas>
  `,
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit, AfterViewInit {

  constructor(private paintSvc: PaintService, private elRef: ElementRef, private socketService: SocketService,) { }

  @Input() isHost: boolean = false;
  @Input() room: any = {};

  points: any[] = [];

  ngOnInit() {
    this.paintSvc.initialize(this.elRef.nativeElement)
    console.error(this.isHost)
    console.error(this.room)
    if (this.isHost) this.startPainting()
    if (!this.isHost) this.listenPainting()
  }
  ngAfterViewInit() {

  }

  listenPainting() {
    this.socketService.getMessage('paintings').subscribe((res) => {
      res.points.forEach((p: any) => {
        this.paintSvc.paint({ clientX: p.clientX, clientY: p.clientY })
      })
    })

    this.socketService.getMessage('clear').subscribe(() => {
      this.paintSvc.clear()
    })
  }

  clear() {
    this.points = []
    this.paintSvc.clear()
    this.socketService.sendMessage('clear', {room:this.room._id})
  }

  private startPainting() {
    const { nativeElement } = this.elRef;
    const canvas = nativeElement.querySelector('canvas') as HTMLCanvasElement
    const move$ = fromEvent<MouseEvent>(canvas, 'mousemove')
    const down$ = fromEvent<MouseEvent>(canvas, 'mousedown')
    const up$ = fromEvent<MouseEvent>(canvas, 'mouseup')
    const paints$ = down$.pipe(
      mergeMap(down => move$.pipe(takeUntil(up$)))
    );

    down$.subscribe(console.info)

    const offset = getOffset(canvas)

    paints$.subscribe((event) => {
      const clientX = event.clientX - offset.left
      const clientY = event.clientY - offset.top - 26
      this.paintSvc.paint({ clientX, clientY })
    });

    paints$.pipe().subscribe((event) => {
      const clientX = event.clientX - offset.left;
      const clientY = event.clientY - offset.top;
      this.points.push({clientX, clientY});
      if (this.points.length === 50) {
          this.socketService.sendMessage('points', {room:this.room._id, points: this.points})
          this.points = [];
      }
    })
  }

}

function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  }
}