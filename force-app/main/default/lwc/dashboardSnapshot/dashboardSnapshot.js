import { LightningElement, wire } from "lwc";
import getSnapshot from "@salesforce/apex/DashboardSnapshotController.getSnapshot";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export default class DashboardSnapshot extends LightningElement {
  snapshot;
  error;
  isLoading = true;

  @wire(getSnapshot)
  wiredSnapshot({ error, data }) {
    this.isLoading = false;
    if (data) {
      this.snapshot = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.snapshot = undefined;
    }
  }

  get hasData() {
    return !!this.snapshot;
  }

  get cards() {
    const s = this.snapshot;
    if (!s) {
      return [];
    }

    return [
      {
        key: "groups",
        label: "Groups joined",
        value: s.groupsJoined,
        iconName: "utility:groups",
        tileClass: "icon-tile tile-blue",
        note: this.groupsNote(s)
      },
      {
        key: "upcoming",
        label: "Upcoming rides",
        value: s.upcomingRides,
        iconName: "utility:clock",
        tileClass: "icon-tile tile-green",
        note: s.nextRideDate
          ? `Next up ${this.formatShortDate(s.nextRideDate)}`
          : "No rides scheduled"
      },
      {
        key: "completed",
        label: "Rides completed",
        value: s.ridesCompleted,
        iconName: "utility:favorite",
        tileClass: "icon-tile tile-amber",
        note: this.completedNote(s)
      },
      {
        key: "distance",
        label: "Distance this season",
        value: new Intl.NumberFormat().format(s.distanceThisSeason || 0),
        unit: "km",
        iconName: "utility:trending",
        tileClass: "icon-tile tile-purple",
        hasTrend:
          s.distanceChangePercent !== null &&
          s.distanceChangePercent !== undefined,
        trendText: this.trendText(s.distanceChangePercent),
        trendClass:
          s.distanceChangePercent < 0 ? "trend trend-down" : "trend trend-up"
      }
    ];
  }

  groupsNote(s) {
    if (s.groupsJoinedThisMonth > 0) {
      return `+${s.groupsJoinedThisMonth} this month`;
    }
    return s.groupsJoined > 0 ? "Active member" : "Join your first group";
  }

  completedNote(s) {
    if (s.ridesCompletedThisMonth > 0) {
      return `+${s.ridesCompletedThisMonth} this month`;
    }
    return s.ridesCompleted > 0 ? "Keep it rolling" : "Your first ride awaits";
  }

  trendText(percent) {
    if (percent === null || percent === undefined) {
      return "";
    }
    return `${percent < 0 ? "↓" : "↑"} ${Math.abs(percent)}%`;
  }

  formatShortDate(value) {
    const [, month, day] = value.split("-").map(Number);
    return `${MONTH_NAMES[month - 1]} ${day}`;
  }
}
