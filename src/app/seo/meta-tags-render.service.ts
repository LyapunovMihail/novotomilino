import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { IFlatsSearchParams } from '../../../serv-files/serv-modules/seo-api/seo.interfaces';

@Injectable()

export class MetaTagsRenderService {

    public flatsSearchParams = new Subject<IFlatsSearchParams>();
    public renderer: Renderer2;

    constructor(
        private seo: Meta,
        private title: Title,
        private http: HttpClient,
    ) {}

    setFlatsSearchParams(val: IFlatsSearchParams) {
        this.flatsSearchParams.next(val);
    }

    getFlatsSearchParams(): Observable<IFlatsSearchParams> {
        return this.flatsSearchParams.asObservable();
    }

    public getMetaTags(options): Observable<any> {
        return this.http.get(`/api/meta_get_common`, {params: {url: options}});
    }

    public render(url, container) {
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

                this.setH1(metas.h1, container);

                this.setFlatsSearchParams(metas.flatsSearchParams);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    private setH1(heading, container) {
        if (heading) {
            setTimeout(() => {
                const h1 = container.nativeElement.querySelector('h1');
                if (h1) {
                    h1.textContent = heading;
                }
            });
        }
    }
}
