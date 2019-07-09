import { AuthorizationObserverService } from './../../authorization/authorization.observer.service';
import { DynamicAdminCreateService } from './dynamic-admin-create.service';
import { IDynamicObject } from '../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-dynamic-admin-create',
    templateUrl: './dynamic-admin-create.component.html',
    styleUrls: ['./dynamic-admin-create.component.scss'],
    providers: [
        DynamicAdminCreateService
    ]
})

export class DynamicAdminCreateComponent implements OnInit, OnChanges, OnDestroy {

    @Input() month: number;
    @Input() year: number;
    @Input() objectsArray: IDynamicObject[] = [];

    @Output() changeObjectsArray: EventEmitter<IDynamicObject[]> = new EventEmitter();

    form: FormGroup = this.formBuilder.group({
        year: this.year,
        month: this.month,
        title: ['', Validators.compose([ Validators.required, Validators.minLength(1)])],
    });

    public AuthorizationEvent;
    public isAuthorizated: boolean = false;

    public tagsArray: string[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private authorization: AuthorizationObserverService,
        private dynamicAdminCreateService: DynamicAdminCreateService
    ) { }

    ngOnInit() {
        // подписка на авторизацию
        this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => {
            this.isAuthorizated = false;
        });
    }

    ngOnDestroy() {
        this.AuthorizationEvent.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.form.controls['month'].setValue(this.month);
        this.form.controls['year'].setValue(this.year);
        this.tagsArray = this.uniqueGenerateArray(this.objectsArray);
    }

    uniqueGenerateArray(arr) {
        let obj = {};
        arr.forEach((str) => {
            obj[str.title] = true;
        });
        return Object.keys(obj);
    }

    onSubmit(form) {
        this.form.reset();
        this.form.controls['month'].setValue(this.month);
        this.form.controls['year'].setValue(this.year);
        let accept = confirm('Создать новый объект?');
        if (accept) {
            this.dynamicAdminCreateService.createObject(form).subscribe(
                (data: IDynamicObject[]) => this.changeObjectsArray.emit(data),
                (err) => {
                    alert('Что-то пошло не так!');
                    console.error(err);
                }
            );
        }
    }

}
