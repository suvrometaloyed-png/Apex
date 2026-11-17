import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getJoinedGroups from '@salesforce/apex/GroupController.getJoinedGroups';

export default class JoinedGroups extends NavigationMixin(LightningElement) {
    groups = [];
    error;
    isLoading = true;

    @wire(getJoinedGroups)
    wiredGroups({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.groups = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.groups = [];
        }
    }

    get hasGroups() {
        return this.groups && this.groups.length > 0;
    }

    get formattedGroups() {
        const badgeColors = ['badge-blue', 'badge-amber', 'badge-emerald', 'badge-purple'];

        return this.groups.map((grp, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const colorClass = badgeColors[index % badgeColors.length];

            // Format joined date: e.g. "Dec 1, 2026"
            const formattedDate = this.formatDate(grp.joiningDate);

            // Status pill styling
            let statusPillClass = 'status-pill status-active';
            const statusLower = (grp.membershipStatus || '').toLowerCase();
            if (statusLower.includes('pending')) {
                statusPillClass = 'status-pill status-pending';
            } else if (statusLower.includes('inactive')) {
                statusPillClass = 'status-pill status-inactive';
            }

            return {
                ...grp,
                badgeIndex: num,
                badgeClass: `badge-index ${colorClass}`,
                formattedDate,
                statusPillClass
            };
        });
    }

    formatDate(val) {
        if (!val) return '—';
        const parts = val.toString().split('-');
        let d;
        if (parts.length === 3) {
            d = new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
            d = new Date(val);
        }
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }

    handleBrowseGroups() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'groups__c'
            }
        });
    }

    handleViewGroup(event) {
        const groupId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'groups__c'
            }
        });
    }
}
