import { LightningElement, wire } from 'lwc';
import getParticipatedRides from '@salesforce/apex/RideController.getParticipatedRides';

const COLUMNS = [
    {
        label: 'Ride Name',
        fieldName: 'rideName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Riding Group',
        fieldName: 'ridingGroupName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Start Date',
        fieldName: 'startTime',
        type: 'date-local',
        sortable: true,
        typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    },
    {
        label: 'End Date',
        fieldName: 'endDate',
        type: 'date-local',
        sortable: true,
        typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    },
    {
        label: 'Ride Status',
        fieldName: 'rideStatus',
        type: 'text',
        sortable: true
    },
    {
        label: 'Participation Status',
        fieldName: 'participantStatus',
        type: 'text',
        sortable: true
    }
];

export default class ParticipatedRides extends LightningElement {
    columns = COLUMNS;
    rides = [];
    error;
    isLoading = true;
    sortedBy = 'startTime';
    sortDirection = 'asc';

    @wire(getParticipatedRides)
    wiredParticipatedRides({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.rides = this.sortData(data, this.sortedBy, this.sortDirection);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.rides = [];
        }
    }

    get hasRides() {
        return this.rides && this.rides.length > 0;
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortDirection = sortDirection;
        this.rides = this.sortData(this.rides, fieldName, sortDirection);
    }

    sortData(rows, fieldName, direction) {
        const modifier = direction === 'asc' ? 1 : -1;
        return [...rows].sort((a, b) => {
            const left = (a[fieldName] ?? '').toString().toLowerCase();
            const right = (b[fieldName] ?? '').toString().toLowerCase();
            if (left === right) {
                return 0;
            }
            return left > right ? modifier : -modifier;
        });
    }
}
