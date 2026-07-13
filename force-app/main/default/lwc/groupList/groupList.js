import { LightningElement } from 'lwc';

import getGroups from '@salesforce/apex/GroupController.getGroups';
import joinGroup from '@salesforce/apex/GroupController.joinGroup';

export default class GroupList extends LightningElement {

        /*groups = [

                {
                    id:'1',
                    name:'SOB Kolkata',
                    joinPolicy:'OPEN',
                    membershipStatus:'NONE'
                },

                {
                    id:'2',
                    name:'Adventure Riders',
                    joinPolicy:'REQUEST',
                    membershipStatus:'PENDING'
                },

                {
                    id:'3',
                    name:'Mountain Riders',
                    joinPolicy:'OPEN',
                    membershipStatus:'ACTIVE'
                }

                ];*/
        connectedCallback() {

            this.loadGroups();

        }

        loadGroups() {

            this.loading = true;

            getGroups()

                .then(result => {

                    this.groups = result;

                })

                .catch(error => {

                    this.error = error;

                })

                .finally(() => {

                    this.loading = false;

                });

        }

        isAdmin = true;

        handleJoin(event){

            this.loading = true;

            joinGroup({

                groupId:event.detail

            })

            .then(()=>{

                return this.loadGroups();

            })

            .catch(error=>{

                this.showToast(
                    'Error',
                    error.body.message,
                    'error'
                );

            })

            .finally(()=>{

                this.loading = false;

            });

        }

        handleManage(event){

            console.log(event.detail);

        }
        forwardJoin(event){

            this.dispatchEvent(

                new CustomEvent(

                    'join',

                    {

                        detail:event.detail

                    }

                )

            );

        }

        forwardMembers(event){

            this.dispatchEvent(

                new CustomEvent(

                    'viewmembers',

                    {

                        detail:event.detail

                    }

                )

            );

        }

}