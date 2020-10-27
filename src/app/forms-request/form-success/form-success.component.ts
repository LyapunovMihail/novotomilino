import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-form-success',
    templateUrl: './form-success.component.html',
    styleUrls: ['./../forms-request.component.scss']
})
export class FormSuccessComponent implements OnChanges {

    @Output() close: EventEmitter<boolean> = new EventEmitter();
    @Input() isOpen = false;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if ( 'isOpen' in changes && this.isOpen === true ) {
            setTimeout(() => {
               this.isOpen = false;
            }, 9000);
        }
    }

}
