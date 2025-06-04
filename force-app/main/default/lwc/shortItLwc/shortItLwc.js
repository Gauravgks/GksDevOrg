import { LightningElement, track } from "lwc";
import shortenUrl from "@salesforce/apex/UrlShortenerController.shortenUrl";

export default class ShortItLwc extends LightningElement {
  @track url = "";
  @track shortUrl = "";
  @track error = "";
  @track isUrlValid = false;

  get isShortenDisabled() {
    return !this.isUrlValid;
  }

  handleInputChange(event) {
    this.url = event.target.value;
    // Simple URL validation regex
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
    this.isUrlValid = urlPattern.test(this.url);
  }

  async shortenUrl() {
    this.error = "";
    this.shortUrl = "";
    if (!this.url) {
      this.error = "Please enter a URL.";
      return;
    }
    try {
      const result = await shortenUrl({ longUrl: this.url });
      this.shortUrl = result;
    } catch (err) {
      this.error = "Failed to shorten URL. URL already exists.";
    }
  }
}
