/* eslint-disable no-console */
/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api, track } from "lwc";

// Note that sometimes we are dealing with a Proxy object and want to print it to console
// while debugging
// JSON.stringify(proxyObj) will work to print to console
// or JSON.parse(JSON.stringify(proxyObj)) will get a regular JSON version of the Proxy

// Note that passing in true for asc is our default sort, false for asc reverses our sort
// Also we have to check for null/undefined values
function compareByField(fieldName, asc) {
  return (a, b) => {
    if (b[fieldName] && !a[fieldName]) {
      return asc ? -1 : 1;
    }
    if (a[fieldName] < b[fieldName]) {
      return asc ? -1 : 1;
    }
    if (a[fieldName] && !b[fieldName]) {
      return asc ? 1 : -1;
    }
    if (a[fieldName] > b[fieldName]) {
      return asc ? 1 : -1;
    }
    return 0;
  };
}

export default class StickySelectronMain extends LightningElement {
  @api tableHeader;
  @api listCount;
  @api selectedListCount;
  @api initialListCount;
  isLoading = false;

  @api inputTableFieldNames;
  @api selectedTableFieldNames;

  isSelectColHeader = false;
  selectAllButtons = "DA KINE";
  selectedMap = {};
  @track workingInputObjList = [];
  @track workingSelectedObjList = [];
  @track initialInputObjList = [];
  @track fieldsOnLeft = [{ label: "Select", fieldname: "Select" }];
  @track fieldsOnRight = [];

  @api // Note: specify only the getter or setter as @api, not both.
  get inputSObjectsList() {
    return this.initialInputObjList;
  }

  set inputSObjectsList(inputSObjectsList = []) {
    this.workingInputObjList = [...inputSObjectsList];
  }

  @api // Note: specify only the getter or setter as @api, not both.
  get selectedSObjectsList() {
    return this.workingSelectedObjList;
  }

  set selectedSObjectsList(selectedSObjectsList = []) {
    this.workingSelectedObjList = [...selectedSObjectsList];
  }

  // control
  initialized = false;
  isAsc = true;
  sortedField = "Name";

  connectedCallback() {
    if (this.inputTableFieldNames && this.inputTableFieldNames.length) {
      for (let inputTableFieldName of this.inputTableFieldNames) {
        this.fieldsOnLeft.push({
          label: inputTableFieldName,
          fieldname: inputTableFieldName,
          isDynamic: true
        });
      }
    }
    if (this.selectedTableFieldNames && this.selectedTableFieldNames.length) {
      for (let selectedTableFieldName of this.selectedTableFieldNames) {
        this.fieldsOnRight.push({
          label: selectedTableFieldName,
          fieldname: selectedTableFieldName,
          isDynamic: true
        });
      }
    }
    this.listCount = this.workingInputObjList.length;
    this.isLoading = true;
    this.initialInputObjList = this.workingInputObjList;
    this.initialListCount = this.listCount;
  }

  renderedCallback() {
    // if the component is newly rendered from initial load, traverse through all selected list and check items when can
    if (this.initialized === false) {
      this.workingSelectedObjList.forEach((element) =>
        this.setChecked(element.Id)
      );
      // set initialized to true so it doesn't run again
      this.initialized = true;
    }
    this.isLoading = false;
  }

  handleSelectAll() {
    this.workingInputObjList.forEach((sObj) => {
      if (!this.selectedMap[sObj.Id]) {
        this.selectAction(sObj.Id);
      }
    });
  }

  handleUnSelectAll() {
    this.workingSelectedObjList = [];
    this.selectedMap = {};
    this.selectedListCount = this.workingSelectedObjList.length;
  }

  handleColSort(event) {
    let fieldName = event.currentTarget.dataset.fieldname;
    // We don't toggle Select (it is always isAsc = true)
    if (fieldName !== "Select" && this.sortedField === fieldName) {
      // If this.sortedField === fieldName it means we are toggling ascending or descending
      this.isAsc = !this.isAsc;
    } else {
      // This means we are sorting on a new column, so set ascending to true
      this.isAsc = true;
    }
    this.sortedField = fieldName;
    // Our template should only pay attention to the asc parameter for the sorted col, so don't have to remove
    for (let a = 0; a < this.fieldsOnLeft.length; a++) {
      let thisField = this.fieldsOnLeft[a];
      if (thisField.fieldname === fieldName) {
        thisField.sorted = true;
        thisField.asc = this.isAsc;
      } else {
        thisField.sorted = false;
      }
    }

    // If the field we need to sort is the Select column, we need a different comparison function.
    // This comparison function should check the workingSelectedObjList list and see if both A and B
    // are in it. If they are found (meaning the findIndex returns 0 or above, then treat that as 1)
    // If an element is not found, then findIndex will return -1 - so we can just compare the A and B 1 or -1
    if (fieldName === "Select") {
      this.isSelectColHeader = true;
      this.workingInputObjList = this.workingInputObjList.sort((a, b) => {
        let indexA = this.workingSelectedObjList.findIndex(
          (item) => item.Id === a.Id
        );
        indexA = indexA >= 0 ? 1 : -1;
        let indexB = this.workingSelectedObjList.findIndex(
          (item) => item.Id === b.Id
        );
        indexB = indexB >= 0 ? 1 : -1;
        // This is the return order because we want the selected records at the top of the list when ascending
        return this.isAsc ? indexB - indexA : indexA - indexB;
      });
    } else {
      this.isSelectColHeader = false;
      this.workingInputObjList = this.workingInputObjList.sort(
        compareByField(fieldName, this.isAsc)
      );
    }
  }

  handleCheck(event) {
    event.preventDefault();
    const objectId = event.currentTarget.dataset.key;
    // check if we already exist in working selection list - if so, do not add
    const matchingIndex = this.workingSelectedObjList.findIndex(
      (element) => element.Id === objectId
    );
    if (matchingIndex === -1) {
      this.selectAction(objectId);
    } else {
      // in this case we need to remove the matchingItem
      this.workingSelectedObjList.splice(matchingIndex, 1);
      this.setUnchecked(objectId);
    }
  }

  handleRemove(event) {
    const objectId = event.currentTarget.name;
    this.unselectAction(objectId);
  }

  setChecked(itemKey) {
    this.selectedMap[itemKey] = true;
    const newMap = { ...this.selectedMap };
    // We have to assign a new variable to make sure the child component re-renders
    // because the child component @api reactivity is shallow
    this.selectedMap = newMap;
    this.selectedListCount = this.workingSelectedObjList.length;
  }

  setUnchecked(itemKey) {
    delete this.selectedMap[itemKey];
    const newMap = { ...this.selectedMap };
    // We have to assign a new variable to make sure the child component re-renders
    // because the child component @api reactivity is shallow
    this.selectedMap = newMap;
    this.selectedListCount = this.workingSelectedObjList.length;
  }

  // processing for selecting an item
  selectAction(itemKey) {
    const selectedItem = this.workingInputObjList.find(
      (element) => element.Id === itemKey
    );
    this.workingSelectedObjList.push(selectedItem);
    // go find the correct checkbox button on the source list and check
    this.setChecked(itemKey);
  }

  // processing for unselecting an item
  unselectAction(itemKey) {
    // find selected item from selected list
    this.workingSelectedObjList = this.workingSelectedObjList.filter(
      (element) => element.Id !== itemKey
    );
    // go find the correct checkbox button on the source list and uncheck
    this.setUnchecked(itemKey);
  }

  handleCommit() {
    // Process search input field
    this.handleSearch();
  }

  handleClick() {
    this.handleSearch();
  }

  handleSearch() {
    const inp = this.template.querySelector("lightning-input");
    const searchKey = inp.value.toLowerCase();

    if (searchKey) {
      this.workingInputObjList = this.initialInputObjList;

      if (this.workingInputObjList) {
        let recs = [];
        for (let rec of this.workingInputObjList) {
          let recCopy = JSON.parse(JSON.stringify(rec));
          recCopy.Id = null;

          let valuesArray = [];
          for (const fieldObj of this.fieldsOnLeft) {
            const fieldAPIName = fieldObj.fieldname;
            if (fieldAPIName && recCopy[fieldAPIName] !== undefined) {
              valuesArray.push(recCopy[fieldAPIName]);
            }
          }

          for (let val of valuesArray) {
            if (val) {
              if (typeof val === "string") {
                if (val.toLowerCase().includes(searchKey)) {
                  recs.push(rec);
                  break;
                }
              } else if (typeof val === "number") {
                if (val.toString().includes(searchKey)) {
                  recs.push(rec);
                  break;
                }
              }
            }
          }
        }
        this.workingInputObjList = recs;
        this.workingSelectedObjList.forEach((element) =>
          this.setChecked(element.Id)
        );
      }
    } else {
      this.workingInputObjList = this.initialInputObjList;
      this.workingSelectedObjList.forEach((element) =>
        this.setChecked(element.Id)
      );
    }
  }
}
