import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

import printTemplate from './template.js';

@Component({
  selector: 'app-print-content',
  templateUrl: './print-content.component.html',
  styleUrls: ['./print-content.component.scss']
})
export class PrintComponent implements OnChanges, OnDestroy {
  @Input() open: boolean;

  @ViewChild('printContent') printContent;

  @Output() closeAction = new EventEmitter();

  windowRef: any;

  constructor() { }

  ngOnChanges(change: SimpleChanges): void {
    if (change.open) {
      this.printHandler();
    }
  }

  ngOnDestroy(): void {
    this.closeWindow();
  }

  private printHandler() {
    if (this.open) {
      return this.openWindow();
    }

    return this.closeWindow();
  }

  private openWindow(): void {
    this.windowRef = window.open('', '', 'width=0,height=0');
    this.windowRef.document.write(printTemplate);
    this.windowRef.document.body.appendChild(this.printContent.nativeElement.cloneNode(true));
    this.windowRef.print();
    this.windowRef.addEventListener('afterprint', this.closeWindow());
  }

  private closeWindow(): void {
    if (this.windowRef) {
      this.windowRef.close();
      this.windowRef = null;
      this.closeAction.emit({ eventType: 'PrintWindow', eventAction: 'PrintClose', status: false });
    }
  }

}
