public without sharing class getRecentRecordsViewData {
  // Wrapper class
  public class RecordWithAccess {
    @AuraEnabled
    public SObject record;
    @AuraEnabled
    public Boolean hasReadAccess;

    public RecordWithAccess(SObject record, Boolean hasReadAccess) {
      this.record = record;
      this.hasReadAccess = hasReadAccess;
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<RecordWithAccess> queryData(String objectName) {
    List<SObject> sObjectList = new List<SObject>();
    String queryString =
      'SELECT Id, Name FROM ' +
      objectName +
      ' ORDER BY LastModifiedDate DESC LIMIT 10';
    sObjectList = Database.query(queryString); //NOPMD

    // Preparing a list to check record access check
    List<String> idForRecordAccessCheck = new List<String>();
    for (SObject sobj : sObjectList) {
      String recordid = (String) sobj.get('id');
      idForRecordAccessCheck.add(recordid);
    }

    // Query for read access
    List<UserRecordAccess> accessList = [
      SELECT RecordId, HasReadAccess
      FROM UserRecordAccess
      WHERE
        UserId = :UserInfo.getUserId()
        AND RecordId IN :idForRecordAccessCheck
    ];

    // Create a map of record ID to read access and adding it in the wrapper object
    Map<Id, Boolean> readAccessMap = new Map<Id, Boolean>();
    for (UserRecordAccess access : accessList) {
      readAccessMap.put(access.RecordId, access.HasReadAccess);
    }

    // Create list of wrapper objects with access information
    List<RecordWithAccess> recordsWithAccess = new List<RecordWithAccess>();
    for (SObject sobj : sObjectList) {
      Id recordId = (Id) sobj.get('Id');
      Boolean hasAccess = readAccessMap.containsKey(recordId)
        ? readAccessMap.get(recordId)
        : false;
      recordsWithAccess.add(new RecordWithAccess(sobj, hasAccess));
    }

    return recordsWithAccess;
  }
}
