import { LightningElement, wire } from 'lwc';
import getUpcomingRides from '@salesforce/apex/RideController.getUpcomingRides';
import userId from '@salesforce/user/Id';

export default class UpcomingRides extends LightningElement {
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

    get formattedRides() {
        const badgeColors = ['badge-blue', 'badge-amber', 'badge-emerald', 'badge-purple'];

        return this.rides.map((ride, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const colorClass = badgeColors[index % badgeColors.length];
            const formattedDates = this.formatDateRange(ride.startTime, ride.endDate);

            let statusPillClass = 'status-pill status-upcoming';
            const statusLower = (ride.status || '').toLowerCase();
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

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const startDate = parseDate(start);
        const endDate = parseDate(end);

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

    handleJoinClick(event) {
        const rideId = event.currentTarget.dataset.id;
        const rideName = event.currentTarget.dataset.name;
        this.selectedRideId = rideId;
        this.selectedRideName = rideName;
        this.flowInputVariables = [
            { name: 'RideId', type: 'String', value: rideId },
            { name: 'LoggedInUserName', type: 'String', value: userId }
        ];
        this.isFlowOpen = true;
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
