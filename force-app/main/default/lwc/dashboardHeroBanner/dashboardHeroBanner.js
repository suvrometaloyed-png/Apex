import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCurrentUser from '@salesforce/apex/UserContextController.getCurrentUser';

export default class DashboardHeroBanner extends NavigationMixin(LightningElement) {
    userName = 'Rider';

    async connectedCallback() {
        try {
            const userContext = await getCurrentUser();
            if (userContext) {
                const fullName = userContext.contactName || userContext.userName;
                if (fullName) {
                    this.userName = fullName.split(' ')[0];
                }
            }
        } catch (error) {
            console.error('Error loading user context for hero banner:', error);
        }
    }

    get currentDateFormatted() {
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        return today.toLocaleDateString('en-US', options).toUpperCase();
    }

    handleExploreRides() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'rides__c'
            }
        });
    }
}
