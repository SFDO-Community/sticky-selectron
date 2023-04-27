import { LightningElement, api } from "lwc";

export default class CombinedLwcEditor extends LightningElement {

/* VolumeEditor *********************************************************************** */

  _inputVariables = [];

/* VolumeEditor *********************************************************************** */

   @api
   get inputVariables() {
     return this._inputVariables;
   }
 
   // Set a field with the data that was stored from the flow.
   // This data includes the public volume property of the custom volume
   // component.
   set inputVariables(variables) {
     this._inputVariables = variables || [];
   }
 
   // Get the value of the volume input variable.
   get volume() {
     const param = this.inputVariables.find(({ name }) => name === "volume");
     return param && param.value;
   }
 
   @api
   validate() {
     const volumeCmp = this.template.querySelector("lightning-slider");
     const validity = [];
     if (this.volume < 0 || this.volume > 100) {
       volumeCmp.setCustomValidity("The slider range is between 0 and 100.");
       validity.push({
         key: "Slider Range",
         errorString: "The slider range is between 0 and 100."
       });
     } else {
       volumeCmp.setCustomValidity("");
     }
     volumeCmp.reportValidity();
     return validity;
   }

/* displayRecordEditor **************************************************************** */
  //@api inputVariables;
  @api genericTypeMappings;
  @api builderContext;



/* displayRecordEditor **************************************************************** */
  get inputValue2() {
    const param = this.inputVariables.find(({ name }) => name === "inputValue2");
    return param && param.value;
  }

  get inputType() {
    const type = this.genericTypeMappings.find(
      ({ typeName }) => typeName === "T"
    );
    return type && type.typeValue;
  }

  get typeOptions() {
    return [
      { label: "Account", value: "Account" },
      { label: "Contact", value: "Contact" },
      { label: "Case", value: "Case" },
      { label: "Lead", value: "Lead" }
    ];
  }

  get valueOptions() {
    const variables = this.builderContext.variables;
    return variables.map(({ name }) => ({
      label: name,
      value: name
    }));
  }

/* VolumeEditor *********************************************************************** */

  handleChange(event) {
    if (event && event.detail) {
      const newValue = event.detail.value;
      const valueChangedEvent = new CustomEvent(
        "configuration_editor_input_value_changed",
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            name: "volume",
            newValue,
            newValueDataType: "Number"
          }
        }
      );
      this.dispatchEvent(valueChangedEvent);
    }
  }

/* displayRecordEditor **************************************************************** */
  handleInputTypeChange(event) {
    if (event && event.detail) {
      const newValue = event.detail.value;
      const typeChangedEvent = new CustomEvent(
        "configuration_editor_generic_type_mapping_changed",
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            typeName: "T",
            typeValue: newValue
          }
        }
      );
      this.dispatchEvent(typeChangedEvent);
    }
  }

  handleValueChange(event) {
    if (event && event.detail) {
      const newValue = event.detail.value;
      const valueChangedEvent = new CustomEvent(
        "configuration_editor_input_value_changed",
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            name: "inputValue2",
            newValue,
            newValueDataType: "reference"
          }
        }
      );
      this.dispatchEvent(valueChangedEvent);
    }
  }
}