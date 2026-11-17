import { LightningElement, wire } from 'lwc';
import getOngoingRides from '@salesforce/apex/RideController.getOngoingRides';
import getCompletedRides from '@salesforce/apex/RideController.getCompletedRides';

const BADGE_COLORS = ['badge-blue', 'badge-amber', 'badge-emerald', 'badge-purple'];

function formatDateRange(start, end) {
    if (!start && !end) return 'TBD';

    const parseDate = (val) => {
        if (!val) return null;
        const parts = val.toString().split('-');
        if (parts.length === 3) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return new Date(val);
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (startDate && endDate) {
        return `${monthNames[startDate.getMonth()]} ${startDate.getDate()} – ${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
    } else if (startDate) {
        return `${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
    }
    return `${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
}

function formatRides(rides) {
    return rides.map((ride, index) => {
        const colorClass = BADGE_COLORS[index % BADGE_COLORS.length];

        let statusPillClass = 'status-pill status-upcoming';
        const statusLower = (ride.status || '').toLowerCase();
        if (statusLower.includes('progress')) {
            statusPillClass = 'status-pill status-in-progress';
        } else if (statusLower.includes('complete')) {
            statusPillClass = 'status-pill status-completed';
        }

        return {
            ...ride,
            badgeIndex: (index + 1).toString().padStart(2, '0'),
            badgeClass: `badge-index ${colorClass}`,
            formattedDates: formatDateRange(ride.startTime, ride.endDate),
            statusPillClass
        };
    });
}

export default class RideDetails extends LightningElement {
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

    get formattedOngoingRides() {
        return formatRides(this.ongoingRides);
    }

    get formattedCompletedRides() {
        return formatRides(this.completedRides);
    }
}
