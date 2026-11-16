public class RideSelector {

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

        /**
         * Returns all rides with Status__c = 'In Progress' ordered by Start_Time__c asc.
         */
        public static List<Ride__c> getOngoingRides() {
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
                WHERE Status__c = 'In Progress'
                ORDER BY Start_Time__c ASC NULLS LAST, Name ASC
            ];
        }

        /**
     * Returns all rides with Status__c = 'Completed' ordered by Start_Time__c asc.
     */
    public static List<Ride__c> getCompletedRides() {
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
            WHERE Status__c = 'Completed'
            ORDER BY Start_Time__c ASC NULLS LAST, Name ASC
        ];
    }

    /**
     * Returns all ride participant records for a specific contact.
     */
    public static List<Ride_Participant__c> getParticipatedRidesByContactId(Id contactId) {
        if (contactId == null) {
            return new List<Ride_Participant__c>();
        }
        return [
            SELECT
                Id,
                Status__c,
                Contact__c,
                Ride__c,
                Ride__r.Id,
                Ride__r.Name,
                Ride__r.Start_Time__c,
                Ride__r.End_Date__c,
                Ride__r.Status__c,
                Ride__r.Riding_Group__c,
                Ride__r.Riding_Group__r.Name
            FROM Ride_Participant__c
            WHERE Contact__c = :contactId
            ORDER BY Ride__r.Start_Time__c ASC NULLS LAST, Ride__r.Name ASC
        ];
    }
}
