import { Pipe, PipeTransform } from '@angular/core';
import { FormConfig } from './search-form.config';

@Pipe({
    name: 'mySearchFormPipe',
    pure: false
})

export class SearchFormPipe implements PipeTransform  {

    public housesList = FormConfig.housesList;

    constructor() {}

    transform(housesValues: number[]): string {
        if (housesValues.length < 4 && housesValues.length > 0) {
            housesValues.sort();
            let housesString = housesValues.reduce((prevVal, currentVal, i) => {
                return prevVal + this.housesList.find((item) => Number(item.value) === currentVal).name + (i + 1 < housesValues.length ? '; ' : '');
            }, '');
            housesString = housesString.length > 15 ? housesString.slice(0, 13) + '..' : housesString;
            return housesString;
        }
        return 'Все корпуса';
    }
}
