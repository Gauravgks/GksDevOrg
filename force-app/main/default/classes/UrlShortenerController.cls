public without sharing class UrlShortenerController {
  @AuraEnabled(cacheable=false)
  public static String shortenUrl(String longUrl) {
    // Generate a short code (6 alphanumeric chars)
    String chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    String shortCode = '';
    for (Integer i = 0; i < 6; i++) {
      Integer idx = Math.abs(
        Math.mod(Crypto.getRandomInteger(), chars.length())
      );
      shortCode += chars.substring(idx, idx + 1);
    }
    // Check for collision
    List<UrlMapping__c> existing = [
      SELECT Id
      FROM UrlMapping__c
      WHERE ShortCode__c = :shortCode
      LIMIT 1
    ];
    while (!existing.isEmpty()) {
      shortCode = '';
      for (Integer i = 0; i < 6; i++) {
        Integer idx = Math.abs(
          Math.mod(Crypto.getRandomInteger(), chars.length())
        );
        shortCode += chars.substring(idx, idx + 1);
      }
      existing = [
        SELECT Id
        FROM UrlMapping__c
        WHERE ShortCode__c = :shortCode
        LIMIT 1
      ];
    }
    // Store mapping
    UrlMapping__c mapping = new UrlMapping__c(
      LongUrl__c = longUrl,
      ShortCode__c = shortCode
    );
    insert mapping;
    // Return the short URL (assuming domain is Salesforce Site or custom domain)
    String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
    return baseUrl + '/shortit/' + shortCode;
  }

  @AuraEnabled(cacheable=true)
  public static String getLongUrl(String shortCode) {
    List<UrlMapping__c> mappings = [
      SELECT LongUrl__c
      FROM UrlMapping__c
      WHERE ShortCode__c = :shortCode
    ];

    if (!mappings.isEmpty()) {
      return mappings[0].LongUrl__c;
    } else {
      return null;
    }
  }
}
