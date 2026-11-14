public class RideController {

    @AuraEnabled(cacheable=true)
    public static List<RideWrapper> getUpcomingRides() {
        try {
            return RideService.getUpcomingRides();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<RideWrapper> getOngoingRides() {
        try {
            return RideService.getOngoingRides();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<RideWrapper> getCompletedRides() {
        try {
            return RideService.getCompletedRides();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
