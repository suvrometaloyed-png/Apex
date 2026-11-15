import { LightningElement, wire } from 'lwc';
import getUpcomingRides from '@salesforce/apex/RideController.getUpcomingRides';
import userId from '@salesforce/user/Id';

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
    },
    {
        type: 'button',
        cellAttributes: {
            alignment: 'center'
        },
        typeAttributes: {
            label: 'Join Ride',
            name: 'join_ride',
            title: 'Join Ride',
            variant: 'brand',
            disabled: false
        }
    }
];

export default class UpcomingRides extends LightningElement {
    columns = COLUMNS;
    rides = [];
    error;
    isLoading = true;

    // Flow modal state
    isFlowOpen = false;
    selectedRideId;
    selectedRideName = '';
    flowInputVariables = [];

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

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'join_ride') {
            this.selectedRideId = row.id;
            this.selectedRideName = row.name;
            this.flowInputVariables = [
                {
                    name: 'RideId',
                    type: 'String',
                    value: row.id
                },
                {
                    name: 'LoggedInUserName',
                    type: 'String',
                    value: userId
                }
            ];
            this.isFlowOpen = true;
        }
    }

    closeFlowModal() {
        this.isFlowOpen = false;
        this.selectedRideId = null;
        this.selectedRideName = '';
    }

    handleFlowStatusChange(event) {
        if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
            this.closeFlowModal();
        }
    }
}
