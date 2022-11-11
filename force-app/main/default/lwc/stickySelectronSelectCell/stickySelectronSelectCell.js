import { LightningElement, api } from "lwc";

export default class StickySelectronSelectCell extends LightningElement {
  @api object;
  @api selectedMap;

  get checkboxClasses() {
    if (this.selectedMap[this.object.Id]) {
      return "slds-checkbox-button slds-checkbox-button_is-checked";
    }

    return "slds-checkbox-button";
  }
}
