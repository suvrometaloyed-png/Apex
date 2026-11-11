public with sharing class GroupController { 
    @AuraEnabled(cacheable=true)
    public static List<GroupWrapper> getGroups() {
        try {
            return GroupService.getGroups();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void joinGroup(Id groupId) {
        try {
            GroupService.joinGroup(groupId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<GroupMemberWrapper> getGroupMembers(Id groupId) {
        try {
            return GroupService.getGroupMembers(groupId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static GroupWrapper getGroupDetails(Id groupId) {
        try {
            return GroupService.getGroupDetails(groupId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Boolean isCurrentUserMember(Id groupId) {
        try {
            return GroupService.isCurrentUserMember(groupId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Integer getMemberCount(Id groupId) {
        try {
            return GroupService.getMemberCount(groupId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}