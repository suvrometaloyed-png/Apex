import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class ApexHeader extends NavigationMixin(LightningElement) {
  goLogin() {
    this[NavigationMixin.Navigate]({
      type: "comm__loginPage",
      attributes: {
        actionName: "login"
      }
    });
  }
  goAbout() {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "about__c"
      }
    });
  }
  goHome() {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "Home"
      }
    });
  }
}
