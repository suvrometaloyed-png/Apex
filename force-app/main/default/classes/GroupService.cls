public with sharing class GroupService {

    /**
     * Get all active groups for the current Experience Cloud user.
     */
    public static List<GroupWrapper> getGroups() {

        Id contactId = UserContextService.getContactId();

        List<Group__c> groups = GroupSelector.getActiveGroups();

        if (groups.isEmpty()) {
            return new List<GroupWrapper>();
        }

        Set<Id> groupIds = new Set<Id>();

        for (Group__c groupRecord : groups) {
            groupIds.add(groupRecord.Id);
        }

        /*
         * Bulk queries:
         *
         * 1. Member counts for all groups
         * 2. Current user's memberships for all groups
         */
        Map<Id, Integer> memberCounts =
            GroupSelector.getMemberCounts(groupIds);

        Map<Id, Group_Membership__c> memberships =
            GroupSelector.getMembershipsByGroups(
                groupIds,
                contactId
            );

        List<GroupWrapper> results =
            new List<GroupWrapper>();

        for (Group__c groupRecord : groups) {

            GroupWrapper wrapper =
                buildGroupWrapper(
                    groupRecord,
                    memberCounts,
                    memberships
                );

            results.add(wrapper);
        }

        return results;
    }

    /*
    /**
     * Get details for one group.
     */
    public static GroupWrapper getGroupDetails(Id groupId) {

        validateGroupId(groupId);

        Group__c groupRecord =
            GroupSelector.getGroup(groupId);

        if (groupRecord == null) {
            throw new AuraHandledException(
                'The selected group could not be found.'
            );
        }

        Id contactId =
            UserContextService.getContactId();

        Set<Id> groupIds =
            new Set<Id>{ groupId };

        Map<Id, Integer> memberCounts =
            GroupSelector.getMemberCounts(groupIds);

        Map<Id, Group_Membership__c> memberships =
            GroupSelector.getMembershipsByGroups(
                groupIds,
                contactId
            );

        return buildGroupWrapper(
            groupRecord,
            memberCounts,
            memberships
        );
    }
    

    /**
     * Request membership in a group.
     *
     * IMPORTANT:
     * The ContactId is never supplied by the LWC.
     * It is always derived from the logged-in User.
     */
    public static void joinGroup(Id groupId) {

        validateGroupId(groupId);

        Group__c groupRecord =
            GroupSelector.getGroup(groupId);

        if (groupRecord == null) {
            throw new AuraHandledException(
                'This group is no longer available.'
            );
        }

        Id contactId =
            UserContextService.getContactId();

        /*
         * Check for an existing membership.
         */
        Group_Membership__c existingMembership =
            GroupSelector.getMembership(
                groupId,
                contactId
            );

        if (existingMembership != null) {

            if (
                existingMembership.Status__c ==
                MembershipConstants.ACTIVE
            ) {
                throw new AuraHandledException(
                    'You are already a member of this group.'
                );
            }

            if (
                existingMembership.Status__c ==
                MembershipConstants.ON_HOLD
            ) {
                throw new AuraHandledException(
                    'Your membership for this group is currently on hold.'
                );
            }
        }

        /*
         * Create the membership/request record.
         *
         * The exact request-state field should match
         * your existing metadata.
         */
        Group_Membership__c membership =
            new Group_Membership__c();

        membership.Group__c = groupId;
        membership.Contact__c = contactId;

        membership.Status__c =
            MembershipConstants.REQUEST_PENDING;

        membership.Joining_Date__c =
            System.today();

        insert membership;
    }

    /*
    /**
     * Returns whether the current Contact is an
     * active member of the group.
     */
    public static Boolean isCurrentUserMember(
        Id groupId
    ) {

        validateGroupId(groupId);

        Id contactId =
            UserContextService.getContactId();

        Group_Membership__c membership =
            GroupSelector.getMembership(
                groupId,
                contactId
            );

        return membership != null &&
            membership.Status__c ==
            MembershipConstants.ACTIVE;
    }

    /**
     * Returns active members for a group.
     */
    public static List<GroupMemberWrapper> getGroupMembers(Id groupId) {

        validateGroupId(groupId);

        Group__c groupRecord =
            GroupSelector.getGroup(groupId);

        if (groupRecord == null) {
            throw new AuraHandledException(
                'The selected group could not be found.'
            );
        }

        List<Group_Membership__c> memberships =
            GroupSelector.getGroupMembers(groupId);

        List<GroupMemberWrapper> results =
            new List<GroupMemberWrapper>();

        for (
            Group_Membership__c membership :
            memberships
        ) {

            GroupMemberWrapper wrapper =
                new GroupMemberWrapper();

            wrapper.membershipId =
                membership.Id;

            wrapper.contactId =
                membership.Contact__c;

            wrapper.name =
                membership.Contact__r.Name;

            wrapper.email =
                membership.Contact__r.Email;

            wrapper.status =
                membership.Status__c;

            wrapper.isPending = false;

            results.add(wrapper);
        }

        return results;
    }

    /**
     * Get member count for one group.
     */
    public static Integer getMemberCount(
        Id groupId
    ) {

        validateGroupId(groupId);

        Map<Id, Integer> counts =
            GroupSelector.getMemberCounts(
                new Set<Id>{ groupId }
            );

        return counts.containsKey(groupId)
            ? counts.get(groupId)
            : 0;
    }
    

    // =========================================================
    // PRIVATE METHODS
    // =========================================================

    private static GroupWrapper buildGroupWrapper(
        Group__c groupRecord,
        Map<Id, Integer> memberCounts,
        Map<Id, Group_Membership__c> memberships
    ) {

        GroupWrapper wrapper =
            new GroupWrapper();

        wrapper.id =
            groupRecord.Id;

        wrapper.name =
            groupRecord.Name;

        /*wrapper.description =
            groupRecord.Description__c;

        wrapper.joinPolicy =
            groupRecord.Joining_Policy__c;

        /*wrapper.bannerImage =
            groupRecord.Banner_Image__c;

        wrapper.logo =
            groupRecord.Logo__c;
        wrapper.city =
            groupRecord.City__c;

        wrapper.state =
            groupRecord.State__c;

        wrapper.country =
            groupRecord.Country__c;*/

        wrapper.memberCount =
            memberCounts.containsKey(groupRecord.Id)
                ? memberCounts.get(groupRecord.Id)
                : 0;

        /*
         * NONE is a UI-derived state.
         * It is not stored in Salesforce.
         */
        if (memberships.containsKey(groupRecord.Id)) {

            wrapper.membershipStatus =
                memberships.get(groupRecord.Id).Status__c;

        } else {

            wrapper.membershipStatus =
                'NONE';
        }

        return wrapper;
    }

    private static void validateGroupId(
        Id groupId
    ) {

        if (groupId == null) {
            throw new AuraHandledException(
                'A group must be selected.'
            );
        }
    }
}