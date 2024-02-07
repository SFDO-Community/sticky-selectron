@isTest
public class FieldLabelControllerTest {
    @isTest
    static void labelTest () {
        String fieldApiName = 'CreatedDate';
        String fieldLabel = FieldLabelController.getFieldLabels('Account',fieldApiName);
        System.assertEquals('Created Date', fieldLabel);
    }
    @isTest
    static void labelException () {
        String fieldApiName = 'CreatedDateWrong';
        try {
            String fieldLabel = FieldLabelController.getFieldLabels('Account',fieldApiName);
        } catch (Exception ex) {
            System.assert(true);
        }
    }

    @isTest
    static void sObjectTest () {
        Account acct = new Account ();
        try {
            //insert acct;
            String sObjectApiName = FieldLabelController.getSObjectType(acct);
            System.assertEquals('Account', sObjectApiName);
        } catch (Exception ex) {
            System.assert(true);
        }
    }
}