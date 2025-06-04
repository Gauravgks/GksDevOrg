@IsTest
public with sharing class getRecentRecordsViewDataTest {

@IsTest
  static void testQueryData() {
    // Create test data
    Account testAccount1 = new Account(Name = 'Test Account 1');
    Account testAccount2 = new Account(Name = 'Test Account 2');
    insert new List<Account>{ testAccount1, testAccount2 };

    Test.startTest();

    // Call the method being tested
    List<getRecentRecordsViewData.RecordWithAccess> result = getRecentRecordsViewData.queryData(
      'Account'
    );

    Test.stopTest();

    // Assert the results
    System.assertEquals(2, result.size(), 'Unexpected number of records');

    for (getRecentRecordsViewData.RecordWithAccess recordWithAccess : result) {
      SObject record = recordWithAccess.record;
      Boolean hasAccess = recordWithAccess.hasReadAccess;

      if (record.Id == testAccount1.Id) {
        System.assertEquals(
          'Test Account 1',
          record.get('Name'),
          'Incorrect record name'
        );
        System.assertEquals(
          true,
          hasAccess,
          'Access should be true for testAccount1'
        );
      } else if (record.Id == testAccount2.Id) {
        System.assertEquals(
          'Test Account 2',
          record.get('Name'),
          'Incorrect record name'
        );
        System.assertEquals(
          true,
          hasAccess,
          'Access should be true for testAccount2'
        );
      } else {
        System.assert(false, 'Unexpected record ID');
      }
    }
  }

}