public class DashboardSnapshotWrapper {
  @AuraEnabled
  public Integer groupsJoined { get; set; }
  @AuraEnabled
  public Integer groupsJoinedThisMonth { get; set; }
  @AuraEnabled
  public Integer upcomingRides { get; set; }
  @AuraEnabled
  public Date nextRideDate { get; set; }
  @AuraEnabled
  public Integer ridesCompleted { get; set; }
  @AuraEnabled
  public Integer ridesCompletedThisMonth { get; set; }
  @AuraEnabled
  public Decimal distanceThisSeason { get; set; }
  @AuraEnabled
  public Integer distanceChangePercent { get; set; }

  public DashboardSnapshotWrapper() {
    this.groupsJoined = 0;
    this.groupsJoinedThisMonth = 0;
    this.upcomingRides = 0;
    this.ridesCompleted = 0;
    this.ridesCompletedThisMonth = 0;
    this.distanceThisSeason = 0;
  }
}
