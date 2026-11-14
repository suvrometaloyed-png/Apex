@isTest
private class RideServiceTest {

    @TestSetup
    static void setupTestData() {
        Group__c testGroup = new Group__c(
            Name = 'Valley Cyclists',
            Active__c = true,
            Joining_Policy__c = 'Open'
        );
        insert testGroup;

        List<Ride__c> rides = new List<Ride__c>{
            new Ride__c(
                Name = 'Morning Coast Ride',
                Description__c = 'Scenic coast route',
                Status__c = 'Upcoming',
                Start_Time__c = Date.today().addDays(2),
                End_Date__c = Date.today().addDays(2),
                Riding_Group__c = testGroup.Id
            ),
            new Ride__c(
                Name = 'Past Mountain Loop',
                Description__c = 'Completed ride',
                Status__c = 'Completed',
                Start_Time__c = Date.today().addDays(-5),
                End_Date__c = Date.today().addDays(-5),
                Riding_Group__c = testGroup.Id
            )
        };
        insert rides;
    }

    @isTest
    static void testGetUpcomingRides() {
        Test.startTest();
        List<RideWrapper> upcomingRides = RideController.getUpcomingRides();
        Test.stopTest();

        System.assertNotEquals(null, upcomingRides, 'Rides list should not be null');
        System.assertEquals(1, upcomingRides.size(), 'Should return only rides with Upcoming status');
        System.assertEquals('Morning Coast Ride', upcomingRides[0].name, 'Ride name should match');
        System.assertEquals('Upcoming', upcomingRides[0].status, 'Status should be Upcoming');
        System.assertEquals('Valley Cyclists', upcomingRides[0].ridingGroupName, 'Riding group name should be populated');
    }
}
