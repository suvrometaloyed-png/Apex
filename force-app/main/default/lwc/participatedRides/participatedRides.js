import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getParticipatedRides from '@salesforce/apex/RideController.getParticipatedRides';

export default class ParticipatedRides extends NavigationMixin(LightningElement) {
    rides = [];
    error;
    isLoading = true;

    @wire(getParticipatedRides)
    wiredParticipatedRides({ error, data }) {
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

    get formattedRides() {
        const badgeColors = ['badge-blue', 'badge-amber', 'badge-emerald', 'badge-purple'];

        return this.rides.map((ride, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const colorClass = badgeColors[index % badgeColors.length];

            // Format dates range: e.g. "Dec 1 – Dec 31, 2026"
            const formattedDates = this.formatDateRange(ride.startTime, ride.endDate);

            // Status pill styling
            let statusPillClass = 'status-pill status-upcoming';
            const statusLower = (ride.rideStatus || '').toLowerCase();
            if (statusLower.includes('progress')) {
                statusPillClass = 'status-pill status-in-progress';
            } else if (statusLower.includes('complete')) {
                statusPillClass = 'status-pill status-completed';
            }

            return {
                ...ride,
                badgeIndex: num,
                badgeClass: `badge-index ${colorClass}`,
                formattedDates,
                statusPillClass
            };
        });
    }

    formatDateRange(start, end) {
        if (!start && !end) return 'TBD';

        const parseDate = (val) => {
            if (!val) return null;
            const parts = val.toString().split('-');
            if (parts.length === 3) {
                return new Date(parts[0], parts[1] - 1, parts[2]);
            }
            return new Date(val);
        };

        const startDate = parseDate(start);
        const endDate = parseDate(end);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (startDate && endDate) {
            const startMonth = monthNames[startDate.getMonth()];
            const startDay = startDate.getDate();
            const endMonth = monthNames[endDate.getMonth()];
            const endDay = endDate.getDate();
            const endYear = endDate.getFullYear();

            return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${endYear}`;
        } else if (startDate) {
            return `${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
        }
        return `${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }

    handleBrowseRides() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'rides__c'
            }
        });
    }

    handleJoinRide(event) {
        const rideId = event.target.dataset.id;
        // Navigate or trigger ride action
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'rides__c'
            }
        });
    }
}
