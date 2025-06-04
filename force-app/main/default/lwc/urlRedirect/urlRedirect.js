import { LightningElement } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { wire } from "lwc";
import getLongUrl from "@salesforce/apex/UrlShortenerController.getLongUrl";

export default class UrlRedirect extends LightningElement {
  shortCode;
  error;

  @wire(CurrentPageReference)
  getStateParameters(currentPageReference) {
    if (currentPageReference) {
      const path = window.location.pathname;
      const match = path.match(/\/shortit\/([^/]+)/);
      if (match && match[1]) {
        this.shortCode = match[1];
        this.fetchLongUrl();
      } else {
        this.error = "Invalid short URL.";
      }
    }
  }

  async fetchLongUrl() {
    try {
      const url = await getLongUrl({ shortCode: this.shortCode });
      if (url) {
        window.location.replace(url);
      } else {
        this.error = "Short URL not found.";
      }
    } catch (e) {
      this.error = "Error fetching URL.";
    }
  }
}
