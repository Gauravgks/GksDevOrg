public with sharing class examplereturnoneaccountdata {
  @AuraEnabled
  public static Account getAccount() {
    List<Account> accList = [SELECT Id, Name FROM Account LIMIT 1];
    return accList[0];
  }
}