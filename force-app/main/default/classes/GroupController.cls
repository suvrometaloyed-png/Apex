public with sharing class GroupController {

    /*@AuraEnabled(cacheable=true)
    public static List<GroupWrapper> getGroups() {
        return GroupService.getGroups();
    }

    @AuraEnabled
    public static void joinGroup(Id groupId) {
        GroupService.joinGroup(groupId);
    }

    @AuraEnabled(cacheable=true)
    public static List<GroupMemberWrapper> getGroupMembers(Id groupId) {
        return GroupService.getGroupMembers(groupId);
    }
    @AuraEnabled
    public static void resolveMembership(
        Id membershipId,
        String action
    ){
        GroupService.resolveMembership(
            membershipId,
            action
        );
    }*/
        @AuraEnabled(cacheable=true)
        public static List<GroupWrapper> getGroups() {
            return GroupService.getGroups();
        }

        @AuraEnabled
        public static void joinGroup(Id groupId) {
            GroupService.joinGroup(groupId);
        }

        @AuraEnabled(cacheable=true)
        public static List<GroupMemberWrapper> getGroupMembers(Id groupId) {
            return GroupService.getGroupMembers(groupId);
        }

        @AuraEnabled(cacheable=true)
        public static GroupWrapper getGroupDetails(Id groupId) {
            return GroupService.getGroupDetails(groupId);
        }

        @AuraEnabled(cacheable=true)
        public static Boolean isCurrentUserMember(Id groupId) {
            return GroupService.isCurrentUserMember(groupId);
        }

        @AuraEnabled(cacheable=true)
        public static Integer getMemberCount(Id groupId) {
            return GroupService.getMemberCount(groupId);
        }

    
}