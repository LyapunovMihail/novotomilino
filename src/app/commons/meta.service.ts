import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class MetaService {
    constructor(
        public meta: Meta,
        public title: Title,
    ) { }

    changeMetaTag(url) {

        if (url === '/') {
            this.title.setTitle('ЖК Новотомилино Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Купить квартиру в ЖК Новотомилино. Цены на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('about') > 0) {
            this.title.setTitle('Информация о ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Информация о ЖК Новотомилино на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('location') > 0) {
            this.title.setTitle('Расположение ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Расположение ЖК Новотомилино на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('decoration') > 0) {
            this.title.setTitle('Примеры отделки квартир ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Примеры отделки квартир ЖК Новотомилино на официальном сайте застройщика.'}, true);

            if (url.indexOf('decoration/living-rooms') > 0) {
                this.title.setTitle('Примеры отделки жилых комнат в квартирах ЖК Новотомилино. Официальный сайт');
                this.meta.addTag({ name: 'description', content: 'Примеры отделки жилых комнат в квартирах ЖК Новотомилино на официальном сайте застройщика.'}, true);
            } else if (url.indexOf('decoration/kitchen') > 0) {
                this.title.setTitle('Примеры отделки кухонь в квартирах ЖК Новотомилино. Официальный сайт');
                this.meta.addTag({ name: 'description', content: 'Примеры отделки кухонь в квартирах ЖК Новотомилино на официальном сайте застройщика.'}, true);
            } else if (url.indexOf('decoration/bathroom') > 0) {
                this.title.setTitle('Примеры отделки санузлов в квартирах ЖК Новотомилино. Официальный сайт');
                this.meta.addTag({ name: 'description', content: 'Примеры отделки санузлов в квартирах ЖК Новотомилино на официальном сайте застройщика.'}, true);
            } else if (url.indexOf('decoration/hallway') > 0) {
                this.title.setTitle('Примеры отделки прихожих в квартирах ЖК Новотомилино. Официальный сайт');
                this.meta.addTag({ name: 'description', content: 'Примеры отделки прихожих в квартирах ЖК Новотомилино на официальном сайте застройщика.'}, true);
            }
        } else if (url.indexOf('flats') > 0) {
            this.title.setTitle('Квартиры ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Квартиры ЖК Новотомилино на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('dynamic') > 0) {
            this.title.setTitle('Ход строительства ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Ход строительства ЖК Новотомилино на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('purchase') > 0) {
            this.title.setTitle('Условия покупки квартиры ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Условия покупки квартиры ЖК Новотомилино на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('news-shares') > 0) {
            this.title.setTitle('Новости ЖК Новотомилино. Официальный сайт');
            this.meta.addTag({ name: 'description', content: 'Новости ЖК Новотомилино на официальном сайте застройщика.'}, true);
        } else if (url.indexOf('documentation') > 0) {
            this.title.setTitle('Документация ЖК Новотомилино. Официальный сайт.');
            this.meta.addTag({ name: 'description', content: 'Документация ЖК Новотомилино на официальном сайте застройщика.'}, true);
        }
    }
}
