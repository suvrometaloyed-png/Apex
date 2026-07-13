import { LightningElement, api } from 'lwc';

export default class GroupCard extends LightningElement {

    @api group;
    @api isAdmin = false;

    handleViewMembers() {
        this.dispatchEvent(
            new CustomEvent('viewmembers', {
                detail: {
                    id: this.group.id,
                    name: this.group.name
                }
            })
        );
    }
    get membershipStatus() {
        return this.group.membershipStatus;
    }

    get joinPolicy() {
        return this.group.joinPolicy === 'OPEN'
            ? 'Open membership'
            : 'Approval required';
    }

    get showJoinButton() {
        return !['ACTIVE', 'PENDING', 'REJECTED'].includes(this.membershipStatus);
    }

    get showManageButton() {
        return this.isAdmin && this.membershipStatus === 'ACTIVE';
    }

    get statusLabel() {
        switch (this.membershipStatus) {
            case 'ACTIVE':
                return 'Member';
            case 'PENDING':
                return 'Pending approval';
            case 'REJECTED':
                return 'Rejected';
            default:
                return '';
        }
    }

    handleJoin() {
        this.dispatchEvent(
            new CustomEvent('join', {
                detail: this.group.id
            })
        );
    }

    handleManage() {
        this.dispatchEvent(
            new CustomEvent('manage', {
                detail: this.group.id
            })
        );
    }
    
}