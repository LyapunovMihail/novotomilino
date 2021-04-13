import { SearchComponent } from './search.component';
import { SearchFormPipe } from './search-form/search-form.pipe';
import { BitNumberPipe } from './search-output/bit-number.pipe';
import { SeoPageComponent } from './seo-page/seo-page.component';
import { SearchOutputPipe } from './search-output/search-output.pipe';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchOutputComponent } from './search-output/search-output.component';
import { InputsListComponent } from './search-form/inputs-list/inputs-list.component';
import { CheckboxListComponent } from './search-form/checkbox-list/checkbox-list.component';

export const SearchComponents = [
    BitNumberPipe,
    SearchFormPipe,
    SearchComponent,
    SearchOutputPipe,
    SeoPageComponent,
    SearchFormComponent,
    InputsListComponent,
    CheckboxListComponent,
];
