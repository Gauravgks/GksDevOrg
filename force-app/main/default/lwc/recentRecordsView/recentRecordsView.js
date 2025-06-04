import { LightningElement, track } from "lwc";
import getRecords from "@salesforce/apex/getRecentRecordsViewData.queryData";
//import getAccount from "@salesforce/apex/examplereturnoneaccountdata.getAccount";

export default class RecentRecordsView extends LightningElement {
  showFieldValues = false;
  selectedRecordId;
  showRecordData = false;
  selectedOject;

  // accordian approach
  // lwc cmp to call 1 class
  //   showSpinner = false;

  get isAccount() {
    return this.selectedOject === "Account";
  }

  get isContact() {
    return this.selectedOject === "Contact";
  }

  get isOpportunity() {
    return this.selectedOject === "Opportunity";
  }

  @track columns = [
    { label: "Record ID", fieldName: "Id", type: "text" },
    { label: "Name", fieldName: "Name", type: "text" },
    {
      label: "Has Read Access",
      fieldName: "hasReadAccess",
      type: "boolean",
      hideDefaultActions: true,
      cellAttributes: {
        iconName: { fieldName: "lockIcon" },
        iconPosition: "right"
      }
    },
    {
      type: "action",
      typeAttributes: { rowActions: { fieldName: "rowActions" } }
    }
  ];
  @track data = [];

  get options() {
    return [
      { label: "Accounts", value: "Account" },
      { label: "Contacts", value: "Contact" },
      { label: "Opportunities", value: "Opportunity" }
    ];
  }

  // Disable action button on the basis of record accessibility
  getRowActions(row) {
    return [
      {
        label: "Show details",
        name: "show_details",
        disabled: !row.hasReadAccess
      }
    ];
  }

  handleChange(event) {
    this.showRecordData = false;
    this.selectedOject = event.detail.value;
    // Reset to default values
    this.displayValue = [
      "Name",
      "Owner",
      "CreatedBy",
      "LastModifiedBy",
      "CreatedDate",
      "LastModifiedDate"
    ];
    // Add object-specific fields
    if (this.selectedOject === "Account") {
      this.displayValue.push("Website");
    } else if (this.selectedOject === "Contact") {
      this.displayValue.push("Phone");
    } else if (this.selectedOject === "Opportunity") {
      this.displayValue.push("Amount");
    }
    this.showFieldValues = true;
    this.data = []; // Clear previous data
  }

  // Method to fetch records from the Apex
  getRecords() {
    this.getSelectedObjectRecords();
  }

  async getSelectedObjectRecords() {
    try {
      let result = await getRecords({
        objectName: this.selectedOject
      });
      this.data = this.processRecords(result);
    } catch (error) {
      console.log(error);
    }
  }

  // Data preparation being done as per datatable
  processRecords(records) {
    return records.map((item) => {
      return {
        hasReadAccess: item.hasReadAccess,
        lockIcon: item.hasReadAccess ? "" : "utility:lock",
        rowActions: this.getRowActions({ hasReadAccess: item.hasReadAccess }),
        Id: item.record.Id,
        Name: item.record.Name
      };
    });
  }

  // Show the record details from the datatable action button click
  handleRowAction(event) {
    // this.showSpinner = true;
    // Get the action name and row data from the event
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    if (actionName === "show_details") {
      this.selectedRecordId = row.Id;
      //   this.showSpinner = false;
      this.showRecordData = true;
      console.log("Show details for record: ", row.Id);
    }
  }
}