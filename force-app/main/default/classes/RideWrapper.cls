public class RideWrapper {
    @AuraEnabled public Id id { get; set; }
    @AuraEnabled public String name { get; set; }
    //@AuraEnabled public String description { get; set; }
    @AuraEnabled public Date startTime { get; set; }
    @AuraEnabled public Date endDate { get; set; }
    @AuraEnabled public String status { get; set; }
    @AuraEnabled public Id ridingGroupId { get; set; }
    @AuraEnabled public String ridingGroupName { get; set; }
    @AuraEnabled public Id createdById { get; set; }
    @AuraEnabled public String createdByName { get; set; }

    public RideWrapper() {}

    public RideWrapper(Ride__c ride) {
        this.id = ride.Id;
        this.name = ride.Name;
        //this.description = ride.Description__c;
        this.startTime = ride.Start_Time__c;
        this.endDate = ride.End_Date__c;
        this.status = ride.Status__c;
        this.ridingGroupId = ride.Riding_Group__c;
        this.ridingGroupName = ride.Riding_Group__r != null ? ride.Riding_Group__r.Name : null;
        //this.createdById = ride.Created_By__c;
        //this.createdByName = ride.Created_By__r != null ? ride.Created_By__r.Name : null;
    }
}
