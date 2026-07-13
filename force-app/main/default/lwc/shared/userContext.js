import getCurrentUser
    from '@salesforce/apex/UserContextController.getCurrentUser';

export async function loadCurrentUser() {
    return await getCurrentUser();
}