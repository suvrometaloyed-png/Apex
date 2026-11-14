public class RideService {

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

    /**
     * Get all ongoing rides.
     */
    public static List<RideWrapper> getOngoingRides() {
        List<Ride__c> rides = RideSelector.getOngoingRides();
        List<RideWrapper> wrappers = new List<RideWrapper>();

        for (Ride__c ride : rides) {
            wrappers.add(new RideWrapper(ride));
        }

        return wrappers;
    }

    /**
     * Get all completed rides.
     */
    public static List<RideWrapper> getCompletedRides() {
        List<Ride__c> rides = RideSelector.getCompletedRides();
        List<RideWrapper> wrappers = new List<RideWrapper>();

        for (Ride__c ride : rides) {
            wrappers.add(new RideWrapper(ride));
        }

        return wrappers;
    }
}
