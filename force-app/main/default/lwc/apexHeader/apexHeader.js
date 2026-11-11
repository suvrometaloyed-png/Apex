import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class ApexHeader extends NavigationMixin(LightningElement) {
    goLogin(){
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage', 
            attributes: {
                pageName: 'Login'
            }
        })
    }
}