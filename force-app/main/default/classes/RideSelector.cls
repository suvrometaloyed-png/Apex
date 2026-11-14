public with sharing class RideSelector {

    /**
     * Returns all rides with Status__c = 'Upcoming' ordered by Start_Time__c asc.
     */
    public static List<Ride__c> getUpcomingRides() {
        return [
            SELECT
                Id,
                Name,
                Start_Time__c,
                End_Date__c,
                Status__c,
                Riding_Group__c,
                Riding_Group__r.Name,
                Created_By__c,
                Created_By__r.Name
            FROM Ride__c
            WHERE Status__c = 'Upcoming'
            ORDER BY Start_Time__c ASC NULLS LAST, Name ASC
        ];
    }
}
