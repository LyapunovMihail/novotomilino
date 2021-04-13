import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDecorationFurnitureSlider } from '../../../../serv-files/serv-modules/decoration-api/decoration.interfaces';

@Injectable()

export class FurnitureSliderService {

    constructor( private http: HttpClient ) {}

    public  getDecorationFurnitureSliderData(): Observable<IDecorationFurnitureSlider[]> {
        return this.http.get<IDecorationFurnitureSlider[]>('/api/decoration/slider/get');
    }

}
