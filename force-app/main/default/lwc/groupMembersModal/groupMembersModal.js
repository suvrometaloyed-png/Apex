import { LightningElement, api } from 'lwc';

export default class GroupMembersModal extends LightningElement {

    @api isOpen = false;
    @api groupName;
    @api members = [];

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

}