public with sharing class UserContextService {

    private static User currentUser;
    private static Contact currentContact;

    public static User getCurrentUser() {
        if (currentUser == null) {
            currentUser = [
                SELECT Id,
                       Name,
                       Email,
                       ContactId,
                       AccountId
                FROM User
                WHERE Id = :UserInfo.getUserId()
                LIMIT 1
            ];
        }

        return currentUser;
    }

    public static Id getUserId() {
        return UserInfo.getUserId();
    }

    public static Id getContactId() {
        User userRecord = getCurrentUser();

        return userRecord != null ? userRecord.ContactId : null;
    }

    public static Contact getCurrentContact() {
        if (currentContact == null) {
            Id contactId = getContactId();

            currentContact = [
                SELECT Id,
                       Name,
                       Email,
                       AccountId
                FROM Contact
                WHERE Id = :contactId
                LIMIT 1
            ];
        }

        return currentContact;
    }

    public static Id getAccountId() {
        return getCurrentUser().AccountId;
    }

    public static UserContextWrapper getCurrentUserContext() {

        User userRecord = getCurrentUser();

        Contact contactRecord = null;

        if (userRecord.ContactId != null) {
            contactRecord = getCurrentContact();
        }

        UserContextWrapper wrapper =
            new UserContextWrapper();

        wrapper.userId = userRecord.Id;
        wrapper.userName = userRecord.Name;
        wrapper.email = userRecord.Email;
        wrapper.contactId = userRecord.ContactId;
        wrapper.accountId = userRecord.AccountId;

        if (contactRecord != null) {
            wrapper.contactName = contactRecord.Name;
        }

        return wrapper;
    }
}