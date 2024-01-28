import { Injectable } from '@angular/core';


let infiniteX = Infinity;
let infiniteY = Infinity;
let colorHue = '#000';

@Injectable({providedIn: 'root'})
export class PaintService {
  private canvas: any = null
  private ctx!: any

  initialize(mountPoint: HTMLElement) {
    this.canvas = mountPoint.querySelector('canvas')
    this.ctx = this.canvas?.getContext('2d')
    this.canvas.width = mountPoint.offsetWidth;
    this.canvas.height = mountPoint.offsetHeight;
  }

  paint({ clientX, clientY }: any) {
    this.ctx.strokeStyle = `hsl(${colorHue}, 100%, 60%)`;
    this.ctx.beginPath();
    if (Math.abs(infiniteX - clientX) < 10 && Math.abs(infiniteY - clientY) < 10) {
      this.ctx.moveTo(infiniteX, infiniteY);
    }
    this.ctx.lineTo(clientX, clientY);
    this.ctx.stroke();
    infiniteX = clientX;
    infiniteY = clientY;
  }

  clear() {
    console.error(this.ctx)
    this.ctx.reset()
  }

}