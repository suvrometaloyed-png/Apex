import { createElement } from "@lwc/engine-dom";
import DashboardSnapshot from "c/dashboardSnapshot";
import getSnapshot from "@salesforce/apex/DashboardSnapshotController.getSnapshot";

jest.mock(
  "@salesforce/apex/DashboardSnapshotController.getSnapshot",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return { default: createApexTestWireAdapter(jest.fn()) };
  },
  { virtual: true }
);

const SNAPSHOT = {
  groupsJoined: 4,
  groupsJoinedThisMonth: 1,
  upcomingRides: 5,
  nextRideDate: "2026-12-01",
  ridesCompleted: 12,
  ridesCompletedThisMonth: 0,
  distanceThisSeason: 1240,
  distanceChangePercent: 18
};

const flushPromises = () => Promise.resolve();

describe("c-dashboard-snapshot", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  function createComponent() {
    const element = createElement("c-dashboard-snapshot", {
      is: DashboardSnapshot
    });
    document.body.appendChild(element);
    return element;
  }

  it("renders four snapshot cards with derived notes", async () => {
    const element = createComponent();
    getSnapshot.emit(SNAPSHOT);
    await flushPromises();

    const cards = element.shadowRoot.querySelectorAll("li.card");
    expect(cards).toHaveLength(4);

    const text = element.shadowRoot.textContent;
    expect(text).toContain("Groups joined");
    expect(text).toContain("+1 this month");
    expect(text).toContain("Next up Dec 1");
    expect(text).toContain("Keep it rolling");
    expect(text).toContain("1,240");
    expect(text).toContain("↑ 18%");
  });

  it("hides the trend when there is no last season data", async () => {
    const element = createComponent();
    getSnapshot.emit({ ...SNAPSHOT, distanceChangePercent: null });
    await flushPromises();

    expect(element.shadowRoot.querySelector(".trend")).toBeNull();
  });

  it("shows an error message when the wire fails", async () => {
    const element = createComponent();
    getSnapshot.error();
    await flushPromises();

    expect(element.shadowRoot.querySelector(".error-text")).not.toBeNull();
    expect(element.shadowRoot.querySelectorAll("li.card")).toHaveLength(0);
  });
});
