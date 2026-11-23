import { createElement } from "@lwc/engine-dom";
import GroupCard from "c/groupCard";

const GROUP_NON_MEMBER = {
  id: "a01000000000001AAA",
  name: "Bay Area Cyclists",
  description: "Weekend road and gravel rides",
  memberCount: 15,
  membershipStatus: "NONE"
};

const GROUP_MEMBER = {
  id: "a01000000000002AAA",
  name: "Morning Pedalers",
  description: "Early morning city loops",
  memberCount: 24,
  membershipStatus: "Active"
};

describe("c-group-card", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  function setup(group) {
    const element = createElement("c-group-card", {
      is: GroupCard
    });
    element.group = group;
    document.body.appendChild(element);
    return element;
  }

  it("renders group name and member count", async () => {
    const element = setup(GROUP_NON_MEMBER);
    await Promise.resolve();

    const name = element.shadowRoot.querySelector(".group-name");
    expect(name.textContent).toBe("Bay Area Cyclists");
  });

  it("shows Join Group button for non-members and fires joingroup on click", async () => {
    const element = setup(GROUP_NON_MEMBER);
    await Promise.resolve();

    const joinBtn = element.shadowRoot.querySelector(".primary-button");
    expect(joinBtn).not.toBeNull();
    expect(joinBtn.textContent.trim()).toBe("Join Group");

    const handler = jest.fn();
    element.addEventListener("joingroup", handler);

    joinBtn.click();
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({
      groupId: GROUP_NON_MEMBER.id
    });
  });

  it("shows Leave Group button for active members and fires leavegroup on click", async () => {
    const element = setup(GROUP_MEMBER);
    await Promise.resolve();

    const leaveBtn = element.shadowRoot.querySelector(".destructive-button");
    expect(leaveBtn).not.toBeNull();
    expect(leaveBtn.textContent.trim()).toBe("Leave Group");

    const handler = jest.fn();
    element.addEventListener("leavegroup", handler);

    leaveBtn.click();
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({
      groupId: GROUP_MEMBER.id
    });
    expect(leaveBtn.disabled).toBe(true);

    element.leaveCompleted();
    await Promise.resolve();
    expect(leaveBtn.disabled).toBe(false);
  });

  it("fires viewdetails when View Details button is clicked", async () => {
    const element = setup(GROUP_NON_MEMBER);
    await Promise.resolve();

    const detailsBtn = element.shadowRoot.querySelector(".secondary-button");
    const handler = jest.fn();
    element.addEventListener("viewdetails", handler);

    detailsBtn.click();
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({
      groupId: GROUP_NON_MEMBER.id
    });
  });
});
