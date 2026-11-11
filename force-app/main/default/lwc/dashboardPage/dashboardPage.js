import { LightningElement, track } from 'lwc';
import Id from '@salesforce/user/Id';

export default class DashboardPage extends LightningElement {
    userId = Id;
    
    /*@track showGroups = false;
    @track showRides = false;
    @track showProfile = false;
    @track showDashboard = true;

    handleShowGroups(event) {
        // event.detail holds the true/false value passed from the child
        this.showGroups = event.detail;
        this.showRides = !event.detail; // Assuming you want to toggle rides visibility as well
        this.showProfile = !event.detail; // Assuming you want to toggle profile visibility as well
        this.showDashboard = !event.detail; // Assuming you want to toggle dashboard visibility as well 
    }
    handleShowRides(event) {
        this.showRides = event.detail;
        this.showGroups = !event.detail; // Assuming you want to toggle groups visibility as well
        this.showProfile = !event.detail; // Assuming you want to toggle profile visibility as well
        this.showDashboard = !event.detail; // Assuming you want to toggle dashboard visibility as well 
    }
    handleShowProfile(event) {
        this.showProfile = event.detail;
        this.showGroups = !event.detail; // Assuming you want to toggle groups visibility as well
        this.showRides = !event.detail; // Assuming you want to toggle rides visibility as well
        this.showDashboard = !event.detail; // Assuming you want to toggle dashboard visibility as well 
    }
    handleShowDashboard(event) {
        this.showDashboard = event.detail;
        this.showGroups = !event.detail; // Assuming you want to toggle groups visibility as well
        this.showRides = !event.detail; // Assuming you want to toggle rides visibility as well
        this.showProfile = !event.detail; // Assuming you want to toggle profile visibility as well 
    }*/
}