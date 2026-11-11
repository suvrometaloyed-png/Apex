import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class DashboardHeader extends NavigationMixin(LightningElement) {
    @api userId;
    goDashboard(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'dashboard__c' // Use the unique API/Developer Name of your Experience site page
            }
        });
    }

    goRides(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'rides__c' // Use the unique API/Developer Name of your Experience site page
            }
        });
    }

    goGroups(){    
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'groups__c' // Use the unique API/Developer Name of your Experience site page
            }
        });
    }

    goProfile(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'profile__c' // Use the unique API/Developer Name of your Experience site page
            }
        });
    }

    logout(){
        // Construct the full logout URL for your specific Experience Site
        // basePath usually ends with '/s', so we replace it with '/secur/logout.jsp'
        const logoutUrl = basePath.replace(/\/s$/, '') + '/secur/logout.jsp';
        
        // Navigate the user to the logout endpoint
        window.location.href = logoutUrl;
    }

}