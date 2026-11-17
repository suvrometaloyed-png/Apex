public with sharing class DashboardSnapshotService {
  private static final String PARTICIPANT_ACTIVE = 'Active';
  private static final String RIDE_UPCOMING = 'Upcoming';
  private static final String RIDE_COMPLETED = 'Completed';

  /**
   * Builds the rider snapshot for the logged-in user.
   * A season is a calendar year.
   */
  public static DashboardSnapshotWrapper getSnapshot() {
    DashboardSnapshotWrapper snapshot = new DashboardSnapshotWrapper();

    Id contactId = UserContextService.getContactId();

    if (contactId == null) {
      return snapshot;
    }

    Date today = Date.today();
    Date monthStart = today.toStartOfMonth();
    Integer seasonYear = today.year();

    List<Group_Membership__c> memberships = GroupSelector.getJoinedMemberships(
      contactId
    );

    snapshot.groupsJoined = memberships.size();

    for (Group_Membership__c membership : memberships) {
      if (
        membership.Joining_Date__c != null &&
        membership.Joining_Date__c >= monthStart
      ) {
        snapshot.groupsJoinedThisMonth++;
      }
    }

    Decimal distanceThisSeason = 0;
    Decimal distanceLastSeason = 0;

    for (
      Ride_Participant__c participant : RideSelector.getParticipatedRidesByContactId(
        contactId
      )
    ) {
      if (
        participant.Status__c != PARTICIPANT_ACTIVE ||
        participant.Ride__r == null
      ) {
        continue;
      }

      Ride__c ride = participant.Ride__r;

      if (ride.Status__c == RIDE_UPCOMING) {
        snapshot.upcomingRides++;

        if (
          ride.Start_Time__c != null &&
          (snapshot.nextRideDate == null ||
          ride.Start_Time__c < snapshot.nextRideDate)
        ) {
          snapshot.nextRideDate = ride.Start_Time__c;
        }
      } else if (ride.Status__c == RIDE_COMPLETED) {
        snapshot.ridesCompleted++;

        Date rideDate = ride.End_Date__c != null
          ? ride.End_Date__c
          : ride.Start_Time__c;

        if (rideDate != null && rideDate >= monthStart) {
          snapshot.ridesCompletedThisMonth++;
        }

        Decimal distance = ride.Total_Distance__c != null
          ? ride.Total_Distance__c
          : 0;

        if (rideDate != null && rideDate.year() == seasonYear) {
          distanceThisSeason += distance;
        } else if (rideDate != null && rideDate.year() == seasonYear - 1) {
          distanceLastSeason += distance;
        }
      }
    }

    snapshot.distanceThisSeason = distanceThisSeason;

    if (distanceLastSeason > 0) {
      snapshot.distanceChangePercent = Integer.valueOf(
        ((distanceThisSeason - distanceLastSeason) /
          distanceLastSeason *
          100)
          .setScale(0, RoundingMode.HALF_UP)
      );
    }

    return snapshot;
  }
}
