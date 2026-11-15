import { LightningElement, wire } from 'lwc';
import getJoinedGroups from '@salesforce/apex/GroupController.getJoinedGroups';

const COLUMNS = [
    {
        label: 'Group Name',
        fieldName: 'name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Joined On',
        fieldName: 'joiningDate',
        type: 'date-local',
        typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    },
    {
        label: 'Members',
        fieldName: 'memberCount',
        type: 'number',
        cellAttributes: {
            alignment: 'left'
        }
    },
    {
        label: 'Status',
        fieldName: 'membershipStatus',
        type: 'text'
    }
];

export default class JoinedGroups extends LightningElement {
    columns = COLUMNS;
    groups = [];
    error;
    isLoading = true;
    sortedBy = 'name';
    sortDirection = 'asc';

    @wire(getJoinedGroups)
    wiredGroups({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.groups = this.sortData(data, this.sortedBy, this.sortDirection);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.groups = [];
        }
    }

    get hasGroups() {
        return this.groups.length > 0;
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortDirection = sortDirection;
        this.groups = this.sortData(this.groups, fieldName, sortDirection);
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
