@isTest
public class FieldLabelControllerTest {
    @isTest
    static void basicTest () {
        // tests FieldLabelController
        List<String> fieldApiNames = new List<String> ();
        fieldApiNames.add('CreatedDate');
        fieldApiNames.add('LastModifiedDate');
        List<String> fieldLabels = FieldLabelController.getFieldLabels('Account',fieldApiNames);
        System.assertEquals('Created Date', fieldLabels[0]);
    }
}