import { Injectable } from '@angular/core';
import { SeoService } from '../seo/seo.service';

@Injectable()
export class MetaRenderAdminService {

    /*
        Когда создается новая акция/новость, по ее ссылке добавляются соответствующие мета теги
        и записываютсчя в базу,

        При редактировании, они изменяются, или же, если это старая акция/новость, которая была
        создана до внедрения этого сервиса, при ее редактировании ей так же добавляются мета-теги
    */

    private metaOption = {
        siteName: 'Видный Берег 2',
        typeName: { news: 'Новости', shares: 'Акции' },
    };

    constructor(
        private seoService: SeoService
    ) { }

    public setMeta(insertedShares, form, page) {
        const id = insertedShares.insertedIds[0];
        const option = this.metaOption;

        this.seoService.setTag().subscribe( data => {
            const newMeta = data.concat().pop();

            newMeta.title = `${form.name} ЖК «${option.siteName}» Официальный сайт`;
            newMeta.h1 = form.name;
            newMeta.url = `/news-shares/${page}/list/1/${id}`;
            newMeta.meta[0] = {
                name: 'description',
                content: `${option.typeName[page]} ЖК «${option.siteName}» - ${form.name}`
            };
            this.seoService.updateTag(newMeta).subscribe();
        });
    }
    public updateMeta(form, id, page) {
        const option = this.metaOption;

        this.seoService.getTags().subscribe( data => {
            const newMeta: any = data.find(el => ( el.url.split('/').pop() ) === id) || {};

            if (!('_id' in newMeta)) { // если это старая акция в кторой не были проставлены метатеги при создании
                this.setMeta({insertedIds: [id] }, form, page); // добавляем их
            } else { // или обновляем
                newMeta['title'] = `${form.name} ЖК «${option.siteName}» Официальный сайт`;
                newMeta['h1'] = form.name;
                newMeta['url'] = `/news-shares/${page}/list/1/${id}`;
                newMeta['meta'][0] = {
                    name: 'description',
                    content: `${option.typeName[page]} ЖК «${option.siteName}» - ${form.name}`
                };

                this.seoService.updateTag(newMeta).subscribe();
            }
        });
    }
}
