import { Component } from '@angular/core';

@Component({
    selector: 'app-purchase',
    styleUrls: ['./purchase.component.scss'],
    template: `
        <section class="purchase">
            <div class="purchase__container">
                <h1 class="purchase__title">Условия покупки</h1>
                <p class="purchase__descr">Продажа в ЖК осуществляется через эскроу-счета.</p>
                
                <div class="purchase__links">
                    <a class="purchase__links-item" [routerLinkActive]="['purchase__links-item_active']" routerLink="/purchase/credit">Ипотека</a>
                    <a class="purchase__links-item" [routerLinkActive]="['purchase__links-item_active']" routerLink="/purchase/installment">Рассрочка</a>
                </div>
            </div>

            <router-outlet></router-outlet>
        </section>
    `
})

export class PurchaseComponent {
    public showDetails = false;
    constructor() {}
}
