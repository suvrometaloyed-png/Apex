public with sharing class UserContextController {

    @AuraEnabled(cacheable=true)
    public static UserContextWrapper getCurrentUser() {

        return UserContextService.getCurrentUserContext();

    }

}