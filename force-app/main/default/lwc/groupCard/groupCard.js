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
        const status = (this.membershipStatus || '').toLowerCase();
        return status === 'active' || status === 'approved';
    }


    get isPending() {
        const status = (this.membershipStatus || '').toLowerCase();
        return status === 'pending';
    }


    get isOnHold() {
        const status = (this.membershipStatus || '').toLowerCase();
        return status === 'on hold' || status === 'on_hold';
    }


    get isRejected() {
        const status = (this.membershipStatus || '').toLowerCase();
        return status === 'rejected';
    }


    get canJoin() {
        const status = (this.membershipStatus || '').toUpperCase();
        return (
            status === 'NONE' ||
            status === '' ||
            status === 'REJECTED'
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