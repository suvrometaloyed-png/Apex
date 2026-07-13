import { LightningElement } from 'lwc';

import getGroups
from '@salesforce/apex/GroupController.getGroups';

import joinGroup
from '@salesforce/apex/GroupController.joinGroup';

import getGroupMembers
from '@salesforce/apex/GroupController.getGroupMembers';

//import resolveMembership from '@salesforce/apex/GroupController.resolveMembership';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GroupsPage extends LightningElement {

    groups = [];

    members = [];

    loading = false;

    showMembers = false;

    selectedGroupName;

    connectedCallback(){

        this.loadGroups();

    }

    loadGroups(){

        this.loading = true;

        getGroups()

        .then(result=>{

            this.groups = result;

        })

        .catch(error=>{

            this.showError(error);

        })

        .finally(()=>{

            this.loading = false;

        });

    }

    handleJoin(event){

        joinGroup({

            groupId:event.detail

        })

        .then(()=>{

            this.loadGroups();

        })

        .catch(error=>{

            this.showError(error);

        });

    }

    handleViewMembers(event){

        this.selectedGroupName = event.detail.name;

        getGroupMembers({

            groupId:event.detail.id

        })

        .then(result=>{

            this.members = result;

            this.showMembers = true;

        })

        .catch(error=>{

            this.showError(error);

        });

    }

    handleApprove(event){

        this.resolve(event.detail,'APPROVE');

    }

    handleReject(event){

        this.resolve(event.detail,'REJECT');

    }

    resolve(id,action){

        resolveMembership({

            membershipId:id,

            action

        })

        .then(()=>{

            return getGroupMembers({

                groupId:this.members[0].groupId

            });

        })

        .then(result=>{

            this.members = result;

            this.loadGroups();

        });

    }

    closeModal(){

        this.showMembers = false;

    }

    showError(error){

        this.dispatchEvent(

            new ShowToastEvent({

                title:'Error',

                message:error.body?.message || 'Unknown Error',

                variant:'error'

            })

        );

    }

}