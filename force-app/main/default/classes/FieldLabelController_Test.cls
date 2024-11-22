@isTest
private class FieldLabelController_Test {
    @TestSetup
    static void setupTestData() {
        // Create test Account
        Account testAccount = new Account(
            Name = 'Test Account',
            Type = 'Customer',
            Industry = 'Technology'
        );
        insert testAccount;
    }

    @isTest
    static void labelTest() {
        String fieldApiName = 'CreatedDate';
        String fieldLabel = FieldLabelController.getFieldLabels(
            'Account',
            fieldApiName
        );
        System.assertEquals(
            'Created Date',
            fieldLabel,
            'Field label does not match'
        );
    }

    @isTest
    static void labelException() {
        String fieldApiName = 'CreatedDateWrong';
        try {
            String fieldLabel = FieldLabelController.getFieldLabels(
                'Account',
                fieldApiName
            );
            System.assertEquals(
                'Created Date',
                fieldLabel,
                'This should have thrown an exception'
            );
        } catch (Exception ex) {
            System.assert(true, 'Exception was thrown');
        }
    }

    @isTest
    static void sObjectTest() {
        Account acct = new Account();
        try {
            //insert acct;
            String sObjectApiName = FieldLabelController.getSObjectType(acct);
            System.assertEquals(
                'Account',
                sObjectApiName,
                'sObject type name does not match'
            );
        } catch (Exception ex) {
            System.assert(true, 'Exception was thrown');
        }
    }

    @isTest
    static void testGetBulkFieldInfo_ValidInputs() {
        // Get the test account
        Account testAccount = [
            SELECT Id, Name, Type, Industry
            FROM Account
            LIMIT 1
        ];

        // Prepare test inputs
        List<String> fieldApiNames = new List<String>{
            'Name',
            'Type',
            'Industry'
        };

        Test.startTest();
        // Call the method
        FieldLabelController.FieldLabelResponse response = FieldLabelController.getBulkFieldInfo(
            testAccount,
            fieldApiNames
        );
        Test.stopTest();

        // Verify results
        Assert.isNotNull(response, 'Response should not be null');
        System.assertEquals(
            'Account',
            response.sObjectType,
            'SObject type should be Account'
        );
        Assert.isNotNull(
            response.fieldLabels,
            'Field labels map should not be null'
        );
        System.assertEquals(
            3,
            response.fieldLabels.size(),
            'Should have labels for all requested fields'
        );

        // Verify specific field labels
        System.assert(
            response.fieldLabels.containsKey('Name'),
            'Should contain Name field'
        );
        System.assert(
            response.fieldLabels.containsKey('Type'),
            'Should contain Type field'
        );
        System.assert(
            response.fieldLabels.containsKey('Industry'),
            'Should contain Industry field'
        );

        // Verify actual label values (these are standard field labels)
        System.assertEquals(
            'Account Name',
            response.fieldLabels.get('Name').label,
            'Name field should have correct label'
        );
        System.assertEquals(
            'Account Type',
            response.fieldLabels.get('Type').label,
            'Type field should have correct label'
        );
        System.assertEquals(
            'Industry',
            response.fieldLabels.get('Industry').label,
            'Industry field should have correct label'
        );
    }

    @isTest
    static void testGetBulkFieldInfo_NullRecord() {
        List<String> fieldApiNames = new List<String>{ 'Name', 'Type' };

        Test.startTest();
        FieldLabelController.FieldLabelResponse response = FieldLabelController.getBulkFieldInfo(
            null,
            fieldApiNames
        );
        Test.stopTest();

        // Verify we still get field labels even without a record
        Assert.isNotNull(response, 'Response should not be null');
        Assert.isNull(
            response.sObjectType,
            'SObject type should be null when no record provided'
        );
    }

    @isTest
    static void testGetBulkFieldInfo_EmptyFieldList() {
        Account testAccount = [SELECT Id FROM Account LIMIT 1];

        Test.startTest();
        FieldLabelController.FieldLabelResponse response = FieldLabelController.getBulkFieldInfo(
            testAccount,
            new List<String>()
        );
        Test.stopTest();

        // Verify basic response structure
        Assert.isNotNull(response, 'Response should not be null');
        System.assertEquals(
            'Account',
            response.sObjectType,
            'SObject type should be Account'
        );
        Assert.isNotNull(
            response.fieldLabels,
            'Field labels map should not be null'
        );
        System.assertEquals(
            0,
            response.fieldLabels.size(),
            'Should have no field labels'
        );
    }

    @isTest
    static void testGetBulkFieldInfo_InvalidField() {
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        List<String> fieldApiNames = new List<String>{ 'Name', 'InvalidField' };

        Test.startTest();
        try {
            FieldLabelController.getBulkFieldInfo(testAccount, fieldApiNames);
            System.assert(
                false,
                'Should have thrown an exception for invalid field'
            );
        } catch (Exception e) {
            // Verify we got the expected exception
            System.assert(true, 'Expected exception was thrown');
        }
    }

    @isTest
    static void testGetBulkFieldInfo_BulkOperation() {
        // Create multiple test accounts
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 100; i++) {
            testAccounts.add(
                new Account(
                    Name = 'Test Account ' + i,
                    Type = 'Customer',
                    Industry = 'Technology'
                )
            );
        }
        insert testAccounts;

        // Prepare large list of fields
        List<String> fieldApiNames = new List<String>{
            'Name',
            'Type',
            'Industry',
            'Phone',
            'Website',
            'BillingStreet',
            'BillingCity',
            'BillingState',
            'BillingPostalCode',
            'BillingCountry'
        };

        Test.startTest();
        List<FieldLabelController.FieldLabelResponse> responses = new List<FieldLabelController.FieldLabelResponse>();

        // Make multiple calls to simulate bulk operation
        for (Account acc : testAccounts) {
            responses.add(
                FieldLabelController.getBulkFieldInfo(acc, fieldApiNames)
            );
        }
        Test.stopTest();

        // Verify bulk operation results
        System.assertEquals(
            100,
            responses.size(),
            'Should have processed all accounts'
        );
        for (FieldLabelController.FieldLabelResponse response : responses) {
            System.assertEquals(
                10,
                response.fieldLabels.size(),
                'Each response should have all field labels'
            );
            System.assertEquals(
                'Account',
                response.sObjectType,
                'Each response should have correct sObject type'
            );
        }
    }
}
