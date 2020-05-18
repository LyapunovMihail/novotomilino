import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MetaTagsRenderService } from '../../../seo/meta-tags-render.service';
import { IFlatsSearchParams, TagInterface } from '../../../../../serv-files/serv-modules/seo-api/seo.interfaces';
import { SeoPageService } from './seo-page.service';

@Component({
    selector: 'app-seo-page',
    templateUrl: './seo-page.component.html',
    styleUrls: ['./seo-page.component.scss'],
    providers: [SeoPageService]
})

export class SeoPageComponent implements OnInit, OnChanges {

    @Input() public searchParams: IFlatsSearchParams;
    @Output() public modalClose: EventEmitter<any> = new EventEmitter<any>();

    public form: FormGroup;

    constructor(
        public router: Router,
        public seoPageService: SeoPageService,
        public metaTagsRenderService: MetaTagsRenderService,
        public formBuilder: FormBuilder
    ) {}

    public ngOnInit() {

        this.form = this.formBuilder.group({
            url: '/flats/_search/',
            title: '',
            h1: '',
            meta: <FormArray> this.formBuilder.array([this.formBuilder.group({name: '', content: ''})]),
            flatsSearchParams: this.searchParams,
            flatsPopularCategory: true
        });

        this.metaTagsRenderService.getMetaTags(this.router.url)
            .subscribe((seoObj: TagInterface) => {
                if (seoObj._id) {
                    this.form = this.formBuilder.group({
                        _id: seoObj._id,
                        url: seoObj.url || '/flats/_search/',
                        title: seoObj.title || '',
                        h1: seoObj.h1 || '',
                        meta: <FormArray> this.formBuilder.array(
                        seoObj.meta.length > 0 ?
                            seoObj.meta.map((meta) => this.formBuilder.group({name: meta.name, content: meta.content}))
                            : [this.formBuilder.group({name: '', content: ''})]
                        ),
                        flatsSearchParams: this.searchParams,
                        flatsPopularCategory: true
                    });
                }
            },
            (err) => console.log(err));

    }

    public ngOnChanges() {
        if (this.form) {
            this.form['controls']['flatsSearchParams'].setValue(this.searchParams);
        }
    }

    public createOrUpdateTag(formObject) {
        if (formObject._id) {
            this.updateTag(formObject);
        } else {
            this.createTag(formObject);
        }
    }

    public createTag(formObject) {
        this.seoPageService.createTag(formObject)
            .subscribe(
                (data) => this.router.navigate(['/seo']),
                (error) => console.error(error)
            );
    }

    public updateTag(formObject) {
        this.seoPageService.updateTag(formObject)
            .subscribe(
                (data) => this.router.navigate(['/seo']),
                (error) => console.error(error)
            );
    }

    public pushTag() {
        (<FormArray> this.form.controls['meta']).push(this.formBuilder.group({name: '', content: ''}));
    }

    public popTag(i) {
        (<FormArray> this.form.controls['meta']).removeAt(i);
    }
}
