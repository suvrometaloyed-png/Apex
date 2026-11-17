public with sharing class DashboardSnapshotController {
  @AuraEnabled(cacheable=true)
  public static DashboardSnapshotWrapper getSnapshot() {
    try {
      return DashboardSnapshotService.getSnapshot();
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
