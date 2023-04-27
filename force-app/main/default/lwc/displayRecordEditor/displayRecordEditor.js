import { LightningElement, api } from "lwc";

export default class DisplayRecordEditor extends LightningElement {
  @api inputVariables;
  @api genericTypeMappings;
  @api builderContext;

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