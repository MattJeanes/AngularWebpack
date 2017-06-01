import { Component } from '@angular/core';

@Component({
    templateUrl: './home.template.html',
    styleUrls: ['./home.style.scss']
})
export class HomeComponent {
    appName: string = "My App";
    public count: number = 0;
    public counter(amount: number) {
        this.count = this.count + amount;
    }
}