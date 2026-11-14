public with sharing class RideController {

    @AuraEnabled(cacheable=true)
    public static List<RideWrapper> getUpcomingRides() {
        try {
            return RideService.getUpcomingRides();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
