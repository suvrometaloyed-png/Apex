import { LightningElement, api } from 'lwc';

export default class GroupCard extends LightningElement {

    @api group;
    isJoining = false;


    /*get location() {
        if (!this.group) {
            return '';
        }
        const parts = [
            this.group.city,
            this.group.state,
            this.group.country
        ].filter(Boolean);

        return parts.join(', ');
    }*/


    get membershipStatus() {
        return this.group?.membershipStatus || 'NONE';
    }


    get isMember() {
        return this.membershipStatus === 'Active';
    }


    get isPending() {
        return this.membershipStatus === 'Pending';
    }


    get isOnHold() {
        return this.membershipStatus === 'On Hold';
    }


    get isRejected() {
        return this.membershipStatus === 'Rejected';
    }


    get canJoin() {
        return (
            this.membershipStatus === 'NONE' ||
            this.membershipStatus === 'Rejected'
        );
    }


    handleViewDetails() {
        this.dispatchEvent(
            new CustomEvent('viewdetails', {
                detail: {
                    groupId: this.group.id
                }
            })
        );
    }


    handleJoin() {
        this.isJoining = true;
        this.dispatchEvent(
            new CustomEvent('joingroup', {
                detail: {
                    groupId: this.group.id
                }
            })
        );
    }


    @api
    joinCompleted() {
        this.isJoining = false;
    }
}