import { createElement } from "@lwc/engine-dom";
import GroupList from "c/groupList";
import getGroups from "@salesforce/apex/GroupController.getGroups";
import { refreshApex } from "@salesforce/apex";

const MOCK_GROUPS = [
  {
    id: "a01000000000001AAA",
    name: "Bay Area Cyclists",
    description: "Weekend road and gravel rides",
    memberCount: 15,
    membershipStatus: "Active"
  },
  {
    id: "a01000000000002AAA",
    name: "City Commuters",
    description: "Daily urban commuters",
    memberCount: 30,
    membershipStatus: "NONE"
  }
];

jest.mock(
  "@salesforce/apex/GroupController.getGroups",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex",
  () => {
    return {
      refreshApex: jest.fn().mockResolvedValue({})
    };
  },
  { virtual: true }
);

describe("c-group-list", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  async function setup() {
    const element = createElement("c-group-list", {
      is: GroupList
    });
    document.body.appendChild(element);

    getGroups.emit(MOCK_GROUPS);
    await Promise.resolve();
    return element;
  }

  it("renders list of group cards", async () => {
    const element = await setup();
    const cards = element.shadowRoot.querySelectorAll("c-group-card");
    expect(cards.length).toBe(2);
  });

  it("opens Leave Group flow modal when leavegroup is dispatched by card and refreshes on finish", async () => {
    const element = await setup();
    const firstCard = element.shadowRoot.querySelector("c-group-card");

    firstCard.dispatchEvent(
      new CustomEvent("leavegroup", {
        detail: { groupId: MOCK_GROUPS[0].id }
      })
    );
    await Promise.resolve();

    const flows = element.shadowRoot.querySelectorAll("lightning-flow");
    expect(flows.length).toBe(1);
    expect(flows[0].flowApiName).toBe("Leave_Group");
    expect(flows[0].flowInputVariables).toEqual([
      { name: "varGroupId", type: "String", value: MOCK_GROUPS[0].id },
      { name: "loggedInUserDetails", type: "String", value: expect.any(String) }
    ]);

    flows[0].dispatchEvent(
      new CustomEvent("statuschange", { detail: { status: "FINISHED" } })
    );
    await Promise.resolve();

    expect(refreshApex).toHaveBeenCalledTimes(1);
    expect(element.shadowRoot.querySelectorAll("lightning-flow").length).toBe(
      0
    );
  });

  it("opens and closes group details modal on viewdetails and close events", async () => {
    const element = await setup();
    const firstCard = element.shadowRoot.querySelector("c-group-card");

    firstCard.dispatchEvent(
      new CustomEvent("viewdetails", {
        detail: { groupId: MOCK_GROUPS[0].id }
      })
    );
    await Promise.resolve();

    const detailsModal = element.shadowRoot.querySelector(
      "c-group-details-modal"
    );
    expect(detailsModal).not.toBeNull();

    detailsModal.dispatchEvent(new CustomEvent("close"));
    await Promise.resolve();

    expect(
      element.shadowRoot.querySelector("c-group-details-modal")
    ).toBeNull();
  });
});
