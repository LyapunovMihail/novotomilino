import { Component } from '@angular/core';

@Component({
    selector: 'app-purchase',
    styleUrls: ['./purchase.component.scss'],
    template: `
        <section class="purchase">
            <div class="purchase_container">
                <h1 class="title purchase_title">Условия покупки</h1>
                <span class="purchase_description">
                    <p>
                        <span>Продажа в ЖК осуществляется через эскроу-счета.</span><br>
                        Эскроу-счет в долевом строительстве – это специальный счет, открываемый в банке, на котором замораживаются деньги дольщика на период строительства дома, и передаются Застройщику только после того, как тот исполнит свои обязательства перед дольщиком.
                        Применение эскроу счетов регламентируется законом в ст. 860.7 ГК РФ.
                    </p>
                    <button class="purchase_description_details" *ngIf="!showDetails" (click)="showDetails = true">Подробнее</button>
                    <p *ngIf="showDetails">
                        Буквально, расчеты с Застройщиком через эскроу-счет выглядят так. При покупке квартиры в новостройке, и заключении Договора долевого участия (ДДУ), дольщик после регистрации договора должен его оплатить. Но деньги он передает не Застройщику, а вносит в банк, на специальный счет эскроу. Деньги на этом счете блокируются, т.е. доступа к ним не имеют ни дольщик, ни Застройщик, в течение всего срока строительства.
                    </p>
                    <p *ngIf="showDetails">
                        После сдачи дома в эксплуатацию, и передачи квартир дольщикам, Застройщик получает доступ к деньгам на счете эскроу.
                    </p>
                </span>
                
                <ul class="purchase_links">
                    <li class="purchase_links_item purchase_links_item--credit">
                        <a class="dark-text_link purchase_links_item_content" [routerLinkActive]="['dark-text_link--active']" routerLink="/purchase/credit">Ипотека</a>
                    </li>
                    <li class="purchase_links_item purchase_links_item--installment">
                        <a class="dark-text_link purchase_links_item_content" [routerLinkActive]="['dark-text_link--active']" routerLink="/purchase/installment">Покупка в рассрочку</a>
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
