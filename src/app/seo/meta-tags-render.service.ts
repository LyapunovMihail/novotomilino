import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { IFlatsSearchParams } from '../../../serv-files/serv-modules/seo-api/seo.interfaces';

@Injectable()

export class MetaTagsRenderService {

    public h1 = new Subject<string>();
    public flatsSearchParams = new Subject<IFlatsSearchParams>();

    constructor(
        private http: HttpClient,
        private seo: Meta,
        private title: Title
    ) {}

    setH1(val: string) {
        this.h1.next(val);
    }

    getH1(): Observable<string> {
        return this.h1.asObservable();
    }

    setFlatsSearchParams(val: IFlatsSearchParams) {
        this.flatsSearchParams.next(val);
    }

    getFlatsSearchParams(): Observable<IFlatsSearchParams> {
        return this.flatsSearchParams.asObservable();
    }

    public getMetaTags(options): Observable<any> {
        return this.http.get(`/api/meta_get_common`, {params: {url: options}});
    }

    public render(url) {
        this.getMetaTags(url).subscribe(
            (metas) => {
                if (metas.meta.length > 0) {
                    this.seo.addTags(metas.meta);
                }

                if (metas.title) {
                    this.title.setTitle(metas.title);
                } else {
                    this.title.setTitle(`\u00ABНовотомилино\u00BB Официальный сайт`);
                }

                if (metas.h1) {
                    this.setH1(metas.h1);
                }

                this.setFlatsSearchParams(metas.flatsSearchParams);

            },
            (err) => {
                console.log(err);
            }
        );
    }
}
