import { LightningElement, wire } from 'lwc';
import getOngoingRides from '@salesforce/apex/RideController.getOngoingRides';
import getCompletedRides from '@salesforce/apex/RideController.getCompletedRides';

const COLUMNS = [
    {
        label: 'Ride Name',
        fieldName: 'name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Riding Group',
        fieldName: 'ridingGroupName',
        type: 'text'
    },
    {
        label: 'Start Date',
        fieldName: 'startTime',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    },
    {
        label: 'End Date',
        fieldName: 'endDate',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    },
    {
        label: 'Status',
        fieldName: 'status',
        type: 'text'
    }
];

export default class RideDetails extends LightningElement {
    columns = COLUMNS;

    ongoingRides = [];
    isOngoingLoading = true;
    ongoingError;

    completedRides = [];
    isCompletedLoading = true;
    completedError;

    @wire(getOngoingRides)
    wiredOngoingRides({ error, data }) {
        this.isOngoingLoading = false;
        if (data) {
            this.ongoingRides = data;
            this.ongoingError = undefined;
        } else if (error) {
            this.ongoingError = error;
            this.ongoingRides = [];
        }
    }

    @wire(getCompletedRides)
    wiredCompletedRides({ error, data }) {
        this.isCompletedLoading = false;
        if (data) {
            this.completedRides = data;
            this.completedError = undefined;
        } else if (error) {
            this.completedError = error;
            this.completedRides = [];
        }
    }

    get hasOngoingRides() {
        return this.ongoingRides && this.ongoingRides.length > 0;
    }

    get hasCompletedRides() {
        return this.completedRides && this.completedRides.length > 0;
    }
}
