import { Injectable } from '@angular/core';
import { SeoService } from '../seo/seo.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class MetaRenderAdminService {

    /*
        Когда создается новая акция/новость, по ее ссылке добавляются соответствующие мета теги
        и записываютсчя в базу,

        При редактировании, они изменяются, или же, если это старая акция/новость, которая была
        создана до внедрения этого сервиса, при ее редактировании ей так же добавляются мета-теги

        При удалении новости/акции, находим по id в поле url элемент с мета тегами и удаляем его
    */

    private ngUnsubscribe = new Subject();
    private metaOption = {
        siteName: 'Новотомилино',
        typeName: { news: 'Новости', shares: 'Акции' },
        url: {
            news: '/news-shares/news/list/',
            shares: '/news-shares/shares/list/1/',
        },
        title: {
            news: 'title',
            shares: 'name',
        }
    };

    constructor(
        private seoService: SeoService
    ) { }

    public setMeta(obj, form, page) {
        const id = this.getId(obj, page);
        const option = this.metaOption;

        this.seoService.setTag()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe( data => {
                const newMeta = data.concat().pop();

                newMeta.title = `${form[option.title[page]]} ЖК «${option.siteName}» Официальный сайт`;
                newMeta.h1 = form[option.title[page]];
                newMeta.url = option.url[page] + id;
                newMeta.meta[0] = {
                    name: 'description',
                    content: `${option.typeName[page]} ЖК «${option.siteName}» - ${form[option.title[page]]}`
                };
                this.seoService.updateTag(newMeta)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe();
        });
    }
    public updateMeta(form, id, page) {
        const option = this.metaOption;

        this.seoService.getTags()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe( data => {
                const newMeta: any = data.find(el => ( el.url.split('/').pop() ) === id) || {};

                if (!('_id' in newMeta)) { // если это старая акция в кторой не были проставлены метатеги при создании
                    this.setMeta({ _id: id }, form, page); // добавляем их
                } else { // или обновляем
                    newMeta['title'] = `${form[option.title[page]]} ЖК «${option.siteName}» Официальный сайт`;
                    newMeta['h1'] = form[option.title[page]];
                    newMeta['url'] = option.url[page] + id;
                    newMeta['meta'][0] = {
                        name: 'description',
                        content: `${option.typeName[page]} ЖК «${option.siteName}» - ${form[option.title[page]]}`
                    };

                    this.seoService.updateTag(newMeta)
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe();
                }
        });
    }
    public popMeta(id) {
        this.seoService.getTags()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(meta => {
                const tag = meta.find(el => el.url.split('/').pop() === id);
                if (!tag) { return; }
                this.seoService.deleteTag(tag._id)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe();
        });
    }

    public unsubscribe() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private getId(obj, page) {
        if (page === 'news') {
            return obj._id;
        } else if (page === 'shares') {
            return obj.insertedIds[0];
        } else {
            return obj;
        }
    }
}