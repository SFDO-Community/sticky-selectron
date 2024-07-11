/**
 * @description FieldLabelController class assists with retrieving field labels
 * for a given object and field API name. And includes a helper function to get
 * the sObjectType of a given record.
 */
public with sharing class FieldLabelController {
    /**
     * @description getFieldLabels retrieves field labels
     * for a given object and field API name
     * @param objectName Input object name
     * @param fieldApiName Input field API name
     * @return String label name
     */
    @AuraEnabled(cacheable=true)
    public static String getFieldLabels(
        String objectName,
        String fieldApiName
    ) {
        String label = null;
        try {
            Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe()
                .get(objectName)
                .getDescribe()
                .fields.getMap();
            label = fieldMap.get(fieldApiName).getDescribe().getLabel();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return label;
    }

    /**
     * @description getSObjectType retrieves the sObjectType
     * for a given record
     * @param record sObject input record
     * @return String sObjectType Name
     */
    @AuraEnabled(cacheable=true)
    public static String getSObjectType(sObject record) {
        String sObjectType = null;
        try {
            Id recordId = record.Id;
            sObjectType = recordId.getSObjectType().getDescribe().getName();
            //System.debug(System.info,'sObjectType: ' + sObjectType);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return sObjectType;
    }
}
