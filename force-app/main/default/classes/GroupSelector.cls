public with sharing class GroupSelector {

    /*
     * Returns every active group
     */
    public static List<Group__c> getAllGroups() {

        return [

            SELECT
                Id,
                Name,
                //Description__c,
                Joining_Policy__c
                //Banner_Image__c,
                //Logo__c,
                //City__c,
                //State__c,
                //Country__c

            FROM Group__c

            WHERE Active__c = TRUE

            ORDER BY Name

        ];

    }

    /*
     * Returns one group
     */
    public static Group__c getGroup(Id groupId){

        return [

            SELECT
                Id,
                Name,
                //Description__c,
                Joining_Policy__c
                //Banner_Image__c,
                //Logo__c,
                //City__c,
                //State__c,
                //Country__c

            FROM Group__c

            WHERE Id=:groupId

            LIMIT 1

        ];

    }

    /*
     * Membership for one rider
     */
    public static Group_Membership__c getMembership(

        Id groupId,

        Id contactId

    ){

        List<Group_Membership__c> memberships = [

            SELECT
                Id,
                Status__c

            FROM Group_Membership__c

            WHERE Group__c=:groupId

            AND Contact__c=:contactId

            LIMIT 1

        ];

        return memberships.isEmpty()

            ? null

            : memberships[0];

    }

    /*
     * All members of a group
     */
    public static List<Group_Membership__c> getMembershipsByGroup(

        Id groupId

    ){

        return [

            SELECT

                Id,

                Status__c,

                //Requested_Date__c,

                Contact__c,

                Contact__r.Name,

                Contact__r.Email

            FROM Group_Membership__c

            WHERE Group__c=:groupId

            ORDER BY Contact__r.Name

        ];

    }

    /*
     * Active member count
     */
    public static Integer getMemberCount(

        Id groupId

    ){

        return [

            SELECT COUNT()

            FROM Group_Membership__c

            WHERE Group__c=:groupId

            AND Status__c='Approved'

        ];

    }

    /*
     * Checks duplicate requests
     */
    public static Boolean membershipExists(

        Id groupId,

        Id contactId

    ){

        return [

            SELECT COUNT()

            FROM Group_Membership__c

            WHERE Group__c=:groupId

            AND Contact__c=:contactId

        ] > 0;

    }

}