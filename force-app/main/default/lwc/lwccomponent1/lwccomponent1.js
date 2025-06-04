import { LightningElement } from "lwc";
import getAccount from "@salesforce/apex/examplereturnoneaccountdata.getAccount";

export default class Lwccomponent1 extends LightningElement {
  connectedCallback() {
    this.getdata();
  }
  getdata() {
    getAccount()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}