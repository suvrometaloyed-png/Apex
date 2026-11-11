@isTest
private class GroupServiceTest {

    @TestSetup
    static void setupTestData() {
        Group__c testGroup = new Group__c(
            Name = 'Test Partner Group',
            Active__c = true,
            Joining_Policy__c = 'Open'
        );
        insert testGroup;
    }

    private static User getPartnerUser() {
        List<User> partnerUsers = [
            SELECT Id, ContactId 
            FROM User 
            WHERE IsActive = true 
              AND ContactId != null 
              AND (UserType = 'PowerPartner' OR Profile.Name LIKE '%Partner%') 
            LIMIT 1
        ];

        if (!partnerUsers.isEmpty()) {
            return partnerUsers[0];
        }

        List<User> usersWithContact = [
            SELECT Id, ContactId 
            FROM User 
            WHERE IsActive = true 
              AND ContactId != null 
            LIMIT 1
        ];

        if (!usersWithContact.isEmpty()) {
            return usersWithContact[0];
        }

        return createPartnerUser();
    }

    private static User createPartnerUser() {
        Profile partnerProfile = [
            SELECT Id 
            FROM Profile 
            WHERE Name LIKE '%Partner%' 
               OR UserType = 'PowerPartner' 
            LIMIT 1
        ];

        Account acc = new Account(Name = 'Partner Test Account');
        insert acc;

        Contact con = new Contact(
            FirstName = 'Partner',
            LastName = 'TestUser',
            AccountId = acc.Id,
            Email = 'partnertestuser@example.com'
        );
        insert con;

        User partnerUser = new User(
            FirstName = 'Partner',
            LastName = 'TestUser',
            Email = 'partnertestuser@example.com',
            Username = 'partnertestuser' + System.currentTimeMillis() + '@example.com',
            Alias = 'ptest',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = partnerProfile.Id,
            LanguageLocaleKey = 'en_US',
            ContactId = con.Id
        );
        insert partnerUser;

        return partnerUser;
    }

    @isTest
    static void testGetGroups() {
        User partnerUser = getPartnerUser();

        System.runAs(partnerUser) {
            Test.startTest();
            List<GroupWrapper> groups = GroupService.getGroups();
            Test.stopTest();

            System.assertNotEquals(null, groups, 'Group list should not be null');
            System.assert(groups.size() > 0, 'Group list should contain active groups');
        }
    }

    @isTest
    static void testGetGroupDetails() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        System.runAs(partnerUser) {
            Test.startTest();
            GroupWrapper details = GroupService.getGroupDetails(testGroup.Id);
            Test.stopTest();

            System.assertNotEquals(null, details, 'Group details should not be null');
            System.assertEquals(testGroup.Id, details.id, 'Returned group ID should match');
        }
    }

    @isTest
    static void testGetGroupDetails_NullGroupId() {
        User partnerUser = getPartnerUser();

        System.runAs(partnerUser) {
            Boolean exceptionThrown = false;
            Test.startTest();
            try {
                GroupService.getGroupDetails(null);
            } catch (AuraHandledException e) {
                exceptionThrown = true;
            }
            Test.stopTest();

            System.assertEquals(true, exceptionThrown, 'AuraHandledException expected when group ID is null');
        }
    }

    @isTest
    static void testJoinGroup_Success() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        System.runAs(partnerUser) {
            Test.startTest();
            GroupService.joinGroup(testGroup.Id);
            Test.stopTest();

            List<Group_Membership__c> memberships = [
                SELECT Id, Status__c, Contact__c 
                FROM Group_Membership__c 
                WHERE Group__c = :testGroup.Id AND Contact__c = :partnerUser.ContactId
            ];

            System.assertEquals(1, memberships.size(), 'Membership should be created');
            System.assertEquals(MembershipConstants.REQUEST_PENDING, memberships[0].Status__c, 'Status should be Pending');
        }
    }

    @isTest
    static void testJoinGroup_AlreadyActiveMember() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        Group_Membership__c membership = new Group_Membership__c(
            Group__c = testGroup.Id,
            Contact__c = partnerUser.ContactId,
            Status__c = MembershipConstants.ACTIVE,
            Joining_Date__c = Date.today()
        );
        insert membership;

        System.runAs(partnerUser) {
            Boolean exceptionThrown = false;
            Test.startTest();
            try {
                GroupService.joinGroup(testGroup.Id);
            } catch (AuraHandledException e) {
                exceptionThrown = true;
            }
            Test.stopTest();

            System.assertEquals(true, exceptionThrown, 'AuraHandledException expected when user is already active member');
        }
    }

    @isTest
    static void testJoinGroup_OnHoldMember() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        Group_Membership__c membership = new Group_Membership__c(
            Group__c = testGroup.Id,
            Contact__c = partnerUser.ContactId,
            Status__c = MembershipConstants.ON_HOLD,
            Joining_Date__c = Date.today()
        );
        insert membership;

        System.runAs(partnerUser) {
            Boolean exceptionThrown = false;
            Test.startTest();
            try {
                GroupService.joinGroup(testGroup.Id);
            } catch (AuraHandledException e) {
                exceptionThrown = true;
            }
            Test.stopTest();

            System.assertEquals(true, exceptionThrown, 'AuraHandledException expected when user membership is on hold');
        }
    }

    @isTest
    static void testIsCurrentUserMember() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        Group_Membership__c membership = new Group_Membership__c(
            Group__c = testGroup.Id,
            Contact__c = partnerUser.ContactId,
            Status__c = MembershipConstants.ACTIVE,
            Joining_Date__c = Date.today()
        );
        insert membership;

        System.runAs(partnerUser) {
            Test.startTest();
            Boolean isMember = GroupService.isCurrentUserMember(testGroup.Id);
            Test.stopTest();

            System.assertEquals(true, isMember, 'User should be active member');
        }
    }

    @isTest
    static void testGetGroupMembers() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        Group_Membership__c membership = new Group_Membership__c(
            Group__c = testGroup.Id,
            Contact__c = partnerUser.ContactId,
            Status__c = MembershipConstants.REQUEST_APPROVED,
            Joining_Date__c = Date.today()
        );
        insert membership;

        System.runAs(partnerUser) {
            Test.startTest();
            List<GroupMemberWrapper> members = GroupService.getGroupMembers(testGroup.Id);
            Test.stopTest();

            System.assertNotEquals(null, members, 'Members list should not be null');
            System.assertEquals(1, members.size(), 'Should return 1 member');
        }
    }

    @isTest
    static void testGetMemberCount() {
        Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
        User partnerUser = getPartnerUser();

        Group_Membership__c membership = new Group_Membership__c(
            Group__c = testGroup.Id,
            Contact__c = partnerUser.ContactId,
            Status__c = MembershipConstants.REQUEST_APPROVED,
            Joining_Date__c = Date.today()
        );
        insert membership;

        System.runAs(partnerUser) {
            Test.startTest();
            Integer count = GroupService.getMemberCount(testGroup.Id);
            Test.stopTest();

            System.assertEquals(1, count, 'Member count should be 1');
        }
    }
}

