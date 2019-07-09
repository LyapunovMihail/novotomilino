import { Component } from '@angular/core';

@Component({
    selector: 'app-purchase',
    styleUrls: ['./purchase.component.scss'],
    template: `
        <section class="purchase">
            <div class="purchase_container">
                <h1 class="title purchase_title">Условия покупки</h1>
                <p class="purchase_description">

                    <span>Продажа в ЖК осуществляется через эскроу-счета.</span><br>
                    <button class="purchase_description_details" *ngIf="!showDetails" (click)="showDetails = true">Подробнее</button>
                    <span *ngIf="showDetails">Эскроу-счет в долевом строительстве – это специальный счет, открываемый в банке, на котором замораживаются деньги дольщика на период строительства дома, и передаются Застройщику только после того, как тот исполнит свои обязательства перед дольщиком.
                    Применение эскроу счетов регламентируется законом в ст. 860.7 ГК РФ.</span>
                    
                </p>
                
                <ul class="purchase_links">
                    <li class="purchase_links_item">
                        <a class="dark-text_link purchase_links_item_content" [routerLinkActive]="['dark-text_link--active']" routerLink="/purchase/credit">Ипотека</a>
                    </li>
                    <li class="purchase_links_item">
                        <a class="dark-text_link purchase_links_item_content" [routerLinkActive]="['dark-text_link--active']" routerLink="/purchase/installment"><span class="long">Покупка в рассрочку</span><span class="short">Рассрочка</span></a>
                    </li>
                </ul>

                <router-outlet></router-outlet>
            </div>
        </section>
    `
})

export class PurchaseComponent {
    public showDetails = false;
    constructor() {}
}
