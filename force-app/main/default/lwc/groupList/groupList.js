import { LightningElement, wire } from 'lwc';

import getGroups from '@salesforce/apex/GroupController.getGroups';
// import joinGroup from '@salesforce/apex/GroupController.joinGroup';

import { refreshApex } from '@salesforce/apex';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import userId from '@salesforce/user/Id';

export default class GroupList extends LightningElement {
    currentUserId = userId;
    groups = [];

    searchTerm = '';

    isLoading = true;

    errorMessage;

    selectedGroupId;

    wiredGroupsResult;

    // Flow modal state for Join Group
    isFlowOpen = false;
    joinGroupFlowName = 'Join_Group'; // Placeholder Flow name
    flowInputVariables = [];


    // ---------------------------------------------------------
    // LOAD GROUPS
    // ---------------------------------------------------------

    @wire(getGroups)
    wiredGroups(result) {

        this.wiredGroupsResult = result;

        const { data, error } = result;

        this.isLoading = false;

        if (data) {

            this.groups = data;

            this.errorMessage = undefined;

        } else if (error) {

            this.groups = [];

            this.errorMessage =
                this.reduceError(error);
        }
    }


    // ---------------------------------------------------------
    // FILTERED GROUPS
    // ---------------------------------------------------------

    get filteredGroups() {

        if (!this.searchTerm) {
            return this.groups;
        }

        const search =
            this.searchTerm.toLowerCase();

        return this.groups.filter(group => {

            const name =
                group.name?.toLowerCase() || '';



            return (
                name.includes(search)
                
            );
        });
    }


    get hasGroups() {

        return this.filteredGroups.length > 0;
    }


    // ---------------------------------------------------------
    // SEARCH
    // ---------------------------------------------------------

    handleSearch(event) {

        this.searchTerm =
            event.target.value?.trim() || '';
    }


    clearSearch() {

        this.searchTerm = '';
    }


    // ---------------------------------------------------------
    // JOIN GROUP
    // ---------------------------------------------------------

    async handleJoinGroup(event) {

        const groupId =
            event.detail.groupId;

        if (!groupId) {
            return;
        }

        // --- Commented out direct Apex joinGroup call to use Flow instead ---
        /*
        try {

            await joinGroup({
                groupId: groupId
            });

            this.showToast(
                'Request Submitted',
                'Your request to join the group has been submitted.',
                'success'
            );

            await refreshApex(
                this.wiredGroupsResult
            );

        } catch (error) {

            this.showToast(
                'Unable to Join Group',
                this.reduceError(error),
                'error'
            );

        }
        */

        // Launch Join Group Flow modal
        this.flowInputVariables = [
            {
                name: 'varGroupId',
                type: 'String',
                value: groupId
            },
            {
                name: 'LoggedInUserId',
                type: 'String',
                value: this.currentUserId
            }
        ];
        this.isFlowOpen = true;
    }

    closeFlowModal() {
        this.isFlowOpen = false;
        this.resetJoinButtons();
    }

    resetJoinButtons() {
        const cards = this.template.querySelectorAll('c-group-card');
        if (cards) {
            cards.forEach((card) => {
                if (typeof card.joinCompleted === 'function') {
                    card.joinCompleted();
                }
            });
        }
    }

    async handleFlowStatusChange(event) {
        const status = event.detail.status;
        if (status === 'FINISHED' || status === 'FINISHED_SCREEN') {
            this.closeFlowModal();
            if (this.wiredGroupsResult) {
                await refreshApex(this.wiredGroupsResult);
            }
        } else if (status === 'ERROR') {
            this.closeFlowModal();
        }
    }


    // ---------------------------------------------------------
    // VIEW DETAILS
    // ---------------------------------------------------------

    handleViewDetails(event) {

        this.selectedGroupId =
            event.detail.groupId;
    }


    handleCloseDetails() {

        this.selectedGroupId = undefined;
    }


    /*
     * Derived from the loaded list so the modal stays in sync
     * after refreshApex (e.g. status changes).
     */
    get selectedGroup() {

        if (!this.selectedGroupId) {
            return undefined;
        }

        return this.groups.find(
            group => group.id === this.selectedGroupId
        );
    }


    // ---------------------------------------------------------
    // RETRY
    // ---------------------------------------------------------

    async handleRetry() {

        this.isLoading = true;

        this.errorMessage = undefined;

        try {

            await refreshApex(
                this.wiredGroupsResult
            );

        } catch (error) {

            this.errorMessage =
                this.reduceError(error);

        } finally {

            this.isLoading = false;
        }
    }


    // ---------------------------------------------------------
    // TOAST
    // ---------------------------------------------------------

    showToast(
        title,
        message,
        variant
    ) {

        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }


    // ---------------------------------------------------------
    // ERROR HANDLING
    // ---------------------------------------------------------

    reduceError(error) {

        if (!error) {
            return 'An unexpected error occurred.';
        }

        if (Array.isArray(error.body)) {

            return error.body
                .map(item => item.message)
                .join(', ');
        }

        if (typeof error.body?.message === 'string') {

            return error.body.message;
        }

        if (typeof error.message === 'string') {

            return error.message;
        }

        return 'An unexpected error occurred.';
    }
}