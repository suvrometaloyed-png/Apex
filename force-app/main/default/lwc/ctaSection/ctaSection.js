import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CtaSection extends NavigationMixin(LightningElement) {
    goSignup() {
        console.log('Navigating to signup page...');
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage', 
            attributes: {
                pageName: 'SelfRegister'
            }
        });
        // Implementation for signup action
    }

    goLearnMore() {
        // Implementation for learning more action
    }
}