@isTest
private class DashboardSnapshotServiceTest {
  @TestSetup
  static void setupTestData() {
    Group__c testGroup = new Group__c(
      Name = 'Snapshot Group',
      Active__c = true,
      Joining_Policy__c = 'Open'
    );
    insert testGroup;
  }

  private static User getUserWithContact() {
    List<User> users = [
      SELECT Id, ContactId
      FROM User
      WHERE IsActive = TRUE AND ContactId != NULL
      LIMIT 1
    ];

    if (!users.isEmpty()) {
      return users[0];
    }

    Profile partnerProfile = [
      SELECT Id
      FROM Profile
      WHERE Name LIKE '%Partner%' OR UserType = 'PowerPartner'
      LIMIT 1
    ];

    Account acc = new Account(Name = 'Snapshot Test Account');
    insert acc;

    Contact con = new Contact(
      FirstName = 'Snapshot',
      LastName = 'TestUser',
      AccountId = acc.Id,
      Email = 'snapshottestuser@example.com'
    );
    insert con;

    User portalUser = new User(
      FirstName = 'Snapshot',
      LastName = 'TestUser',
      Email = 'snapshottestuser@example.com',
      Username = 'snapshottestuser' +
        System.currentTimeMillis() +
        '@example.com',
      Alias = 'snap',
      TimeZoneSidKey = 'America/Los_Angeles',
      LocaleSidKey = 'en_US',
      EmailEncodingKey = 'UTF-8',
      ProfileId = partnerProfile.Id,
      LanguageLocaleKey = 'en_US',
      ContactId = con.Id
    );
    insert portalUser;

    return portalUser;
  }

  private static Ride__c buildRide(
    String name,
    String status,
    Date rideDate,
    Decimal distance,
    Id groupId
  ) {
    return new Ride__c(
      Name = name,
      Status__c = status,
      Start_Time__c = rideDate,
      End_Date__c = rideDate,
      Total_Distance__c = distance,
      Riding_Group__c = groupId
    );
  }

  @isTest
  static void testGetSnapshot() {
    Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
    User testUser = getUserWithContact();
    Date today = Date.today();

    insert new Group_Membership__c(
      Group__c = testGroup.Id,
      Contact__c = testUser.ContactId,
      Status__c = MembershipConstants.ACTIVE,
      Joining_Date__c = today
    );

    List<Ride__c> rides = new List<Ride__c>{
      buildRide('Next Ride', 'Upcoming', today.addDays(10), null, testGroup.Id),
      buildRide(
        'Later Ride',
        'Upcoming',
        today.addDays(20),
        null,
        testGroup.Id
      ),
      buildRide(
        'This Season Ride',
        'Completed',
        Date.newInstance(today.year(), 1, 1),
        150,
        testGroup.Id
      ),
      buildRide(
        'Last Season Ride',
        'Completed',
        Date.newInstance(today.year() - 1, 6, 1),
        100,
        testGroup.Id
      ),
      buildRide(
        'Not Joined Ride',
        'Completed',
        Date.newInstance(today.year(), 1, 1),
        999,
        testGroup.Id
      )
    };
    insert rides;

    List<Ride_Participant__c> participants = new List<Ride_Participant__c>();
    for (Integer i = 0; i < 4; i++) {
      participants.add(
        new Ride_Participant__c(
          Ride__c = rides[i].Id,
          Contact__c = testUser.ContactId,
          Status__c = 'Active'
        )
      );
    }
    insert participants;

    System.runAs(testUser) {
      Test.startTest();
      DashboardSnapshotWrapper snapshot = DashboardSnapshotController.getSnapshot();
      Test.stopTest();

      System.assertEquals(1, snapshot.groupsJoined, 'One group joined');
      System.assertEquals(
        1,
        snapshot.groupsJoinedThisMonth,
        'Group joined this month'
      );
      System.assertEquals(2, snapshot.upcomingRides, 'Two upcoming rides');
      System.assertEquals(
        today.addDays(10),
        snapshot.nextRideDate,
        'Earliest upcoming ride date'
      );
      System.assertEquals(2, snapshot.ridesCompleted, 'Two completed rides');
      System.assertEquals(
        150,
        snapshot.distanceThisSeason,
        'Only this season distance'
      );
      System.assertEquals(
        50,
        snapshot.distanceChangePercent,
        'Distance up 50% on last season'
      );
    }
  }

  @isTest
  static void testGetSnapshot_IgnoresInactiveParticipation() {
    Group__c testGroup = [SELECT Id FROM Group__c LIMIT 1];
    User testUser = getUserWithContact();

    Ride__c ride = buildRide(
      'Dropped Ride',
      'Upcoming',
      Date.today().addDays(5),
      null,
      testGroup.Id
    );
    insert ride;

    insert new Ride_Participant__c(
      Ride__c = ride.Id,
      Contact__c = testUser.ContactId,
      Status__c = 'Inactive'
    );

    System.runAs(testUser) {
      Test.startTest();
      DashboardSnapshotWrapper snapshot = DashboardSnapshotService.getSnapshot();
      Test.stopTest();

      System.assertEquals(
        0,
        snapshot.upcomingRides,
        'Inactive participation should not count'
      );
      System.assertEquals(null, snapshot.nextRideDate, 'No next ride date');
      System.assertEquals(
        null,
        snapshot.distanceChangePercent,
        'No comparison without last season data'
      );
    }
  }
}
