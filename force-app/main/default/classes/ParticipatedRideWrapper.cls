public class ParticipatedRideWrapper {
    @AuraEnabled public Id participantId { get; set; }
    @AuraEnabled public String participantStatus { get; set; }
    @AuraEnabled public Id rideId { get; set; }
    @AuraEnabled public String rideName { get; set; }
    //@AuraEnabled public String description { get; set; }
    @AuraEnabled public Date startTime { get; set; }
    @AuraEnabled public Date endDate { get; set; }
    @AuraEnabled public String rideStatus { get; set; }
    @AuraEnabled public Id ridingGroupId { get; set; }
    @AuraEnabled public String ridingGroupName { get; set; }

    public ParticipatedRideWrapper() {}

    public ParticipatedRideWrapper(Ride_Participant__c participant) {
        this.participantId = participant.Id;
        this.participantStatus = participant.Status__c;
        if (participant.Ride__r != null) {
            this.rideId = participant.Ride__c;
            this.rideName = participant.Ride__r.Name;
            //this.description = participant.Ride__r.Description__c;
            this.startTime = participant.Ride__r.Start_Time__c;
            this.endDate = participant.Ride__r.End_Date__c;
            this.rideStatus = participant.Ride__r.Status__c;
            this.ridingGroupId = participant.Ride__r.Riding_Group__c;
            this.ridingGroupName = participant.Ride__r.Riding_Group__r != null ? participant.Ride__r.Riding_Group__r.Name : null;
        }
    }
}
