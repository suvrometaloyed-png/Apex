import { createElement } from "@lwc/engine-dom";
import GroupDetailsModal from "c/groupDetailsModal";

const GROUP = {
  id: "a00000000000001AAA",
  name: "Sunday Riders",
  joinPolicy: "Open to all riders",
  membershipStatus: "Pending",
  memberCount: 12,
  joiningDate: "2026-01-15"
};

function setup(group) {
  const element = createElement("c-group-details-modal", {
    is: GroupDetailsModal
  });
  element.group = group;
  document.body.appendChild(element);
  return element;
}

describe("c-group-details-modal", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("shows joining status and group details", async () => {
    const element = setup(GROUP);
    await Promise.resolve();

    const text = element.shadowRoot.textContent;
    expect(text).toContain("Sunday Riders");
    expect(text).toContain("Request Pending");
    expect(text).toContain("12 Members");
    expect(text).toContain("Open to all riders");
  });

  it("shows a not-a-member state when status is NONE", async () => {
    const element = setup({
      ...GROUP,
      membershipStatus: "NONE",
      joiningDate: undefined
    });
    await Promise.resolve();

    expect(element.shadowRoot.textContent).toContain("Not a Member");
  });

  it("shows a fallback when there is no joining policy", async () => {
    const element = setup({ ...GROUP, joinPolicy: undefined });
    await Promise.resolve();

    expect(element.shadowRoot.textContent).toContain(
      "No joining policy has been provided"
    );
  });

  it("fires close from the footer button and on Escape", async () => {
    const element = setup(GROUP);
    await Promise.resolve();

    const handler = jest.fn();
    element.addEventListener("close", handler);

    element.shadowRoot.querySelector("footer button").click();
    expect(handler).toHaveBeenCalledTimes(1);

    element.shadowRoot
      .querySelector("section")
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("has only Close button in footer even for members", async () => {
    const element = setup({ ...GROUP, membershipStatus: "Active" });
    await Promise.resolve();

    const footerButtons = [
      ...element.shadowRoot.querySelectorAll("footer button")
    ].map((b) => b.textContent.trim());
    expect(footerButtons).toEqual(["Close"]);
  });
});
