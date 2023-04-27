import { LightningElement, track } from "lwc";

export default class CreateFieldLists extends LightningElement {
  @track mainFieldCount = 0;
  @track selectedFieldCount = 0;
  /*   @track fieldsOnLeft = [
    { label: "Select", fieldname: "Select" },
    { label: "First Name", fieldname: "FirstName", sorted: true, asc: true },org
    { label: "Last Name", fieldname: "LastName" }
  ];
 */
  @track mainFields = [];
  @track mainFieldsListEmpty; // boolean to display Main Fields List or alert
  @track selectedFields = [];
  @track selectedFieldsListEmpty; // boolean to display Selected Fields List or alert

  connectedCallback() {
    this.mainFields.push(
      {
        Id: 0,
        Name: "Name"
      },
      {
        Id: 1,
        Name: "Email"
      },
      {
        Id: 2,
        Name: "Phone"
      },
      {
        Id: 3,
        Name: "Description"
      }
    );
    this.mainFieldsListEmpty = false;

    this.selectedFields.push(
      {
        Id: 0,
        Name: "Name"
      },
      {
        Id: 1,
        Name: "Email"
      }
    );
    this.selectedFieldsListEmpty = false;
  }

  // Add field to array for custom field list.
  handleAdd(event) {
    const fieldSection  = event.target.dataset.section;
    const newFieldAdded  = event.target.value;

    if (fieldSection == "add-main") {
      this.mainFieldCount = this.mainFields.length; // index for new Main Field
      let newEntry = {
        Id: this.mainFieldCount,
        Name: newFieldAdded
      };
      this.mainFields.push(newEntry);
      this.mainFieldsListEmpty = false;
      console.log("KRS ==> handleAdd this.mainFields is: -->", JSON.stringify(this.mainFields));
    } else if (fieldSection == "add-selected") {
      this.selectedFieldCount = this.selectedFields.length;  // index for new Selected Field
      let newEntry = {
        Id: this.selectedFieldCount,
        Name: newFieldAdded
      };
      this.selectedFields.push(newEntry);
      this.selectedFieldsListEmpty = false;
      console.log("KRS ==> handleAdd this.selectedFields is: -->", JSON.stringify(this.selectedFields));
    }
  }

  // Remove all fields from array for custom field list.
  handleClear(event) {
    const fieldSection  = event.target.dataset.section;
    if (fieldSection == "clear-main") {
      this.mainFields = [];
      this.mainFieldsListEmpty = true;
    } else if (fieldSection == "clear-selected") {
      this.selectedFields = [];
      this.selectedFieldsListEmpty = true;
    }
  }

}