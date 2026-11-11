public with sharing class GroupSelector {

    /**
     * Returns all active groups.
     */
    public static List<Group__c> getActiveGroups() {
        return [
            SELECT
                Id,
                Name,
                Joining_Policy__c 
            FROM Group__c
            WHERE Active__c = TRUE
            ORDER BY Name
        ];
    }


    /**
     * Returns a single active group.
     */
    public static Group__c getGroup(Id groupId) {

        if (groupId == null) {
            return null;
        }

        List<Group__c> groups = [
            SELECT
                Id,
                Name,
                Joining_Policy__c
            FROM Group__c
            WHERE Id = :groupId
            AND Active__c = TRUE
            LIMIT 1
        ];

        return groups.isEmpty() ? null : groups[0];
    }


    /**
     * Returns approved member counts for multiple groups.
     *
     * Bulkified - no SOQL inside a loop.
     */
    public static Map<Id, Integer> getMemberCounts(
        Set<Id> groupIds
    ) {

        Map<Id, Integer> result = new Map<Id, Integer>();

        if (groupIds == null || groupIds.isEmpty()) {
            return result;
        }

        for (AggregateResult ar : [
            SELECT
                Group__c groupId,
                COUNT(Id) memberCount
            FROM Group_Membership__c
            WHERE Group__c IN :groupIds
            AND Status__c = :MembershipConstants.REQUEST_APPROVED
            GROUP BY Group__c
        ]) {

            result.put(
                (Id) ar.get('groupId'),
                (Integer) ar.get('memberCount')
            );
        }

        return result;
    }


    /**
     * Returns memberships for the given Contact
     * across multiple groups.
     */
    public static Map<Id, Group_Membership__c>
        getMembershipsByGroups(
            Set<Id> groupIds,
            Id contactId
        ) {

        Map<Id, Group_Membership__c> result =
            new Map<Id, Group_Membership__c>();

        if (
            groupIds == null ||
            groupIds.isEmpty() ||
            contactId == null
        ) {
            return result;
        }

        for (Group_Membership__c membership : [
            SELECT
                Id,
                Group__c,
                Contact__c,
                Status__c,
                Joining_Date__c
            FROM Group_Membership__c
            WHERE Group__c IN :groupIds
            AND Contact__c = :contactId
        ]) {

            result.put(
                membership.Group__c,
                membership
            );
        }

        return result;
    }


    /**
     * Returns the given Contact's membership
     * for a particular group.
     */
    public static Group_Membership__c getMembership(
        Id groupId,
        Id contactId
    ) {

        if (groupId == null || contactId == null) {
            return null;
        }

        List<Group_Membership__c> memberships = [
            SELECT
                Id,
                Group__c,
                Contact__c,
                Status__c,
                Joining_Date__c
            FROM Group_Membership__c
            WHERE Group__c = :groupId
            AND Contact__c = :contactId
            LIMIT 1
        ];

        return memberships.isEmpty()
            ? null
            : memberships[0];
    }


    /**
     * Returns active members of a group.
     */
    public static List<Group_Membership__c> getGroupMembers(Id groupId) {

        return [
            SELECT
                Id,
                Group__c,
                Contact__c,
                Contact__r.Name,
                Contact__r.Email,
                Status__c,
                Joining_Date__c
            FROM Group_Membership__c
            WHERE Group__c = :groupId
            AND Status__c = :MembershipConstants.REQUEST_APPROVED
            ORDER BY Contact__r.Name
        ];
    }
}