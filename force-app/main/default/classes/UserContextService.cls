/*public with sharing class UserContextService {

    public static UserContextWrapper getCurrentUser() {

        UserContextWrapper wrapper = new UserContextWrapper();

        User u = [
            SELECT
                Id,
                Name,
                ContactId
            FROM User
            WHERE Id = :UserInfo.getUserId()
        ];

        wrapper.userId = u.Id;
        wrapper.userName = u.Name;
        wrapper.contactId = u.ContactId;

        return wrapper;
    }

}*/
public with sharing class UserContextService {

    /*
     * Returns the current Salesforce User
     */
    public static User getCurrentUser() {

        return [

            SELECT
                Id,
                Name,
                Email,
                ContactId,
                AccountId

            FROM User

            WHERE Id = :UserInfo.getUserId()

            LIMIT 1

        ];

    }

    /*
     * Returns the current Contact Id
     */
    public static Id getContactId() {

        User userRecord = getCurrentUser();

        if (userRecord.ContactId == null) {

            throw new AuraHandledException(
                'No Contact is associated with the current user.'
            );

        }

        return userRecord.ContactId;

    }

    /*
     * Returns the current Account Id
     */
    public static Id getAccountId() {

        return getCurrentUser().AccountId;

    }

    /*
     * Returns the current User Id
     */
    public static Id getUserId() {

        return UserInfo.getUserId();

    }

    /*
     * Returns the current Contact
     */
    public static Contact getCurrentContact() {

        Id contactId = getContactId();

        return [

            SELECT
                Id,
                Name,
                Email,
                AccountId

            FROM Contact

            WHERE Id = :contactId

            LIMIT 1

        ];

    }

    /*
     * Returns a wrapper for Experience Cloud
     */
    public static UserContextWrapper getCurrentUserContext() {

        User userRecord = getCurrentUser();

        Contact contactRecord = null;

        if (userRecord.ContactId != null) {

            contactRecord = getCurrentContact();

        }

        UserContextWrapper wrapper = new UserContextWrapper();

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