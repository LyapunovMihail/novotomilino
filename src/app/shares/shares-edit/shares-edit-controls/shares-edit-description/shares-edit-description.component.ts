import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ShareBodyBlock } from '../../../../../../serv-files/serv-modules/shares-api/shares.interfaces';

@Component({
    selector: 'app-shares-edit-description',
    template: `
        <div class="form-description">
            <ghm-textarea *ngIf="conf" [(ngModel)]="conf.blockDescription"
                (input)="changeText()"
                [placeholder]="'Текст'"
                class="shares-edit-form__field form-description__field"></ghm-textarea>
            <div class="share-block-remove-btn share-block-remove-btn_for-text" (click)="remove.next()"></div>
        </div>
    `,
    styleUrls: [
        './shares-edit-description.component.scss',
        './../../shares-edit.component.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SharesEditDescriptionComponent),
            multi: true
        }
    ]
})
export class SharesEditDescriptionComponent implements ControlValueAccessor {

    @Output() public remove: EventEmitter<any> = new EventEmitter();

    public conf: ShareBodyBlock;

    constructor() {}

    public writeValue(value: any) {
        this.conf = value;
    }

    public propagateChange = (_: any) => {};

    public registerOnChange(fn) {
      this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public changeText() {
        this.propagateChange(this.conf);
    }
}
