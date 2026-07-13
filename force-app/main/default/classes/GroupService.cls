public with sharing class GroupService {

    /*public static List<GroupWrapper> getGroups() {

        List<Group__c> groups =
            GroupSelector.getAllGroups();

        List<GroupWrapper> wrappers =
            new List<GroupWrapper>();

        for(Group__c g : groups){

            GroupWrapper w = new GroupWrapper();

            w.id = g.Id;
            w.name = g.Name;
            //w.description = g.Description__c;
            w.joinPolicy = g.Joining_Policy__c;

            wrappers.add(w);

        }

        return wrappers;

    }
    public static void joinGroup(Id groupId){

        Id contactId = UserContextService.getContactId();

        // Already joined?
        // throw exception

        Group__c group =
            GroupSelector.getGroup(groupId);

        Group_Membership__c membership =
            new Group_Membership__c();

        membership.Group__c = groupId;
        membership.contactId = contactId;

        if(group.Join_Policy__c == 'OPEN'){

            membership.Status__c = MembershipConstants.ACTIVE;

        }else{

            membership.Status__c = MembershipConstants.PENDING;

        }

        insert membership;

    }
    public static void resolveMembership(
        Id membershipId,
        String action
    ){

        Group_Membership__c membership = [

            SELECT
                Id,
                Status__c

            FROM Group_Membership__c

            WHERE Id=:membershipId

        ];

        if(action == 'APPROVE'){

            membership.Status__c = 'ACTIVE';

        }

        else if(action == 'REJECT'){

            membership.Status__c = 'REJECTED';

        }

        update membership;

    }*/

        /*
        * Returns all active groups with membership information
        */
        public static List<GroupWrapper> getGroups() {

            Id contactId = UserContextService.getContactId();

            List<Group__c> groups = GroupSelector.getAllGroups();

            List<GroupWrapper> wrappers = new List<GroupWrapper>();

            for (Group__c groupRec : groups) {

                GroupWrapper wrapper = new GroupWrapper();

                wrapper.id = groupRec.Id;
                wrapper.name = groupRec.Name;
                //wrapper.description = groupRec.Description__c;
                wrapper.joinPolicy = groupRec.Joining_Policy__c;
                //wrapper.bannerImage = groupRec.Banner_Image__c;
                //wrapper.logo = groupRec.Logo__c;

                wrapper.memberCount =
                    GroupSelector.getMemberCount(groupRec.Id);

                Group_Membership__c membership =
                    GroupSelector.getMembership(
                        groupRec.Id,
                        contactId
                    );

                if (membership == null) {

                    wrapper.membershipStatus = 'NONE';

                } else {

                    wrapper.membershipStatus =
                        membership.Status__c;

                }

                wrappers.add(wrapper);

            }

            return wrappers;

        }

        /*
        * Returns one group
        */
        public static GroupWrapper getGroupDetails(Id groupId) {

            Group__c groupRec =
                GroupSelector.getGroup(groupId);

            GroupWrapper wrapper = new GroupWrapper();

            wrapper.id = groupRec.Id;
            wrapper.name = groupRec.Name;
            //wrapper.description = groupRec.Description__c;
            wrapper.joinPolicy = groupRec.Joining_Policy__c;
            //wrapper.bannerImage = groupRec.Banner_Image__c;
            //wrapper.logo = groupRec.Logo__c;

            wrapper.memberCount =
                GroupSelector.getMemberCount(groupId);

            return wrapper;

        }

        /*
        * Creates a join request
        */
        public static void joinGroup(Id groupId) {

            Id contactId =
                UserContextService.getContactId();

            if (GroupSelector.membershipExists(
                    groupId,
                    contactId)) {

                throw new AuraHandledException(
                    'You have already requested to join this group.'
                );

            }

            Group_Membership__c membership =
                new Group_Membership__c();

            membership.Group__c = groupId;
            membership.Contact__c = contactId;

            membership.Status__c =
                MembershipConstants.PENDING;

            //membership.Requested_Date__c =
                System.now();

            insert membership;

        }

        /*
        * Returns all members
        */
        public static List<GroupMemberWrapper> getGroupMembers(
            Id groupId
        ) {

            List<GroupMemberWrapper> wrappers =
                new List<GroupMemberWrapper>();

            List<Group_Membership__c> members =
                GroupSelector.getMembershipsByGroup(groupId);

            for (Group_Membership__c gm : members) {

                GroupMemberWrapper wrapper =
                    new GroupMemberWrapper();

                wrapper.membershipId = gm.Id;
                wrapper.contactId = gm.Contact__c;
                wrapper.name = gm.Contact__r.Name;
                wrapper.email = gm.Contact__r.Email;
                wrapper.status = gm.Status__c;
                wrapper.isPending =
                    gm.Status__c == MembershipConstants.PENDING;

                wrappers.add(wrapper);

            }

            return wrappers;

        }

        /*
        * Checks if current user is an approved member
        */
        public static Boolean isCurrentUserMember(
            Id groupId
        ) {

            Id contactId =
                UserContextService.getContactId();

            Group_Membership__c membership =
                GroupSelector.getMembership(
                    groupId,
                    contactId
                );

            return membership != null &&
                membership.Status__c ==
                MembershipConstants.APPROVED;

        }

        /*
        * Returns active member count
        */
        public static Integer getMemberCount(
            Id groupId
        ) {

            return GroupSelector.getMemberCount(groupId);

        }    

}