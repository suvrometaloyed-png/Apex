import { LightningElement, wire } from 'lwc';
import getUpcomingRides from '@salesforce/apex/RideController.getUpcomingRides';

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
    /*{
        label: 'Description',
        fieldName: 'description',
        type: 'text',
        wrapText: true
    }*/
];

export default class UpcomingRides extends LightningElement {
    columns = COLUMNS;
    rides = [];
    error;
    isLoading = true;

    @wire(getUpcomingRides)
    wiredRides({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.rides = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.rides = [];
        }
    }

    get hasRides() {
        return this.rides && this.rides.length > 0;
    }
}
