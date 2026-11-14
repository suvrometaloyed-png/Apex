public with sharing class RideService {

    /**
     * Get all upcoming rides.
     */
    public static List<RideWrapper> getUpcomingRides() {
        List<Ride__c> rides = RideSelector.getUpcomingRides();
        List<RideWrapper> wrappers = new List<RideWrapper>();

        for (Ride__c ride : rides) {
            wrappers.add(new RideWrapper(ride));
        }

        return wrappers;
    }
}
