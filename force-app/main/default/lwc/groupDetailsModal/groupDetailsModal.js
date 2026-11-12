import { LightningElement, api } from 'lwc';

const STATUS_CONFIG = {
    Active: {
        label: 'Member',
        message: 'You are an active member of this group.',
        css: 'status status-member'
    },
    Approved: {
        label: 'Approved',
        message: 'Your request to join this group has been approved.',
        css: 'status status-member'
    },
    Pending: {
        label: 'Request Pending',
        message: 'Your request to join is awaiting review by the group.',
        css: 'status status-pending'
    },
    'On Hold': {
        label: 'Membership On Hold',
        message: 'Your membership is currently on hold.',
        css: 'status status-hold'
    },
    Rejected: {
        label: 'Request Rejected',
        message: 'Your request to join was rejected. You can request to join again.',
        css: 'status status-rejected'
    },
    Cancelled: {
        label: 'Request Cancelled',
        message: 'Your request to join this group was cancelled.',
        css: 'status status-hold'
    },
    'Inactive/Expired': {
        label: 'Membership Expired',
        message: 'Your membership in this group is no longer active.',
        css: 'status status-hold'
    }
};

const NOT_JOINED = {
    label: 'Not a Member',
    message: 'You have not requested to join this group yet.',
    css: 'status status-hold'
};

export default class GroupDetailsModal extends LightningElement {
    @api group;

    _focused = false;

    get status() {
        return STATUS_CONFIG[this.group?.membershipStatus] || NOT_JOINED;
    }

    get statusLabel() {
        return this.status.label;
    }

    get statusMessage() {
        return this.status.message;
    }

    get statusClass() {
        return this.status.css;
    }

    get memberCountLabel() {
        const count = this.group?.memberCount ?? 0;
        return `${count} ${count === 1 ? 'Member' : 'Members'}`;
    }

    renderedCallback() {
        if (this.group && !this._focused) {
            this._focused = true;
            this.refs.closeButton?.focus();
        }
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            event.stopPropagation();
            this.handleClose();
        }
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}
