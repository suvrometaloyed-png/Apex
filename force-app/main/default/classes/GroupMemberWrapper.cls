public class GroupMemberWrapper {

    @AuraEnabled 
    public Id membershipId;

    @AuraEnabled 
    public Id contactId;

    @AuraEnabled 
    public String name;

    @AuraEnabled 
    public String email;
   
    @AuraEnabled 
    public String status;
    
    @AuraEnabled 
    public Boolean isPending;

}