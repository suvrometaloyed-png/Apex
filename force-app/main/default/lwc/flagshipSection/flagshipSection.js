import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class FlagshipSection extends NavigationMixin(LightningElement) {
    naviageToPage(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://www.instagram.com/bbg_motorrad_official/'
            }
        });
    }

}