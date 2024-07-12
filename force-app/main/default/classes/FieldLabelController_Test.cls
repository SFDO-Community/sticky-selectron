@isTest
public class FieldLabelController_Test {
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
}
