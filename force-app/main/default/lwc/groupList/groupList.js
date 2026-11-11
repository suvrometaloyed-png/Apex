import { LightningElement, wire } from 'lwc';

import getGroups from '@salesforce/apex/GroupController.getGroups';
import joinGroup from '@salesforce/apex/GroupController.joinGroup';

import { refreshApex } from '@salesforce/apex';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import userId from '@salesforce/user/Id';

export default class GroupList extends LightningElement {
    currentUserId = userId;
    groups = [];

    searchTerm = '';

    isLoading = true;

    errorMessage;

    wiredGroupsResult;


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

        try {

            await joinGroup({
                groupId: groupId
            });

            this.showToast(
                'Request Submitted',
                'Your request to join the group has been submitted.',
                'success'
            );

            /*
             * Refresh Apex data so the card immediately
             * reflects the new membership/request state.
             */
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
    }


    // ---------------------------------------------------------
    // VIEW DETAILS
    // ---------------------------------------------------------

    handleViewDetails(event) {

        this.dispatchEvent(
            new CustomEvent(
                'viewdetails',
                {
                    detail: {
                        groupId:
                            event.detail.groupId
                    }
                }
            )
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