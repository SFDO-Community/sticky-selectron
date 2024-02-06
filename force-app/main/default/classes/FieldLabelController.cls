public with sharing class FieldLabelController {
    @AuraEnabled(cacheable=true)
    public static String getFieldLabels(String objectName, String fieldAPIName) {
        System.debug('objectName: ' + objectName);
        System.debug('fieldApiNames: ' + fieldAPIName);
        List<String> fieldLabels = new List<String>();
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        return fieldMap.get(fieldAPIName).getDescribe().getLabel();
    }
    @AuraEnabled(cacheable=true)
    public static String getSObjectType(sObject record){
        System.debug('records: ' + record);
        String sObjectType = null;
        try {
            Id recordId = record.Id;
            sObjectType = recordId.getSObjectType().getDescribe().getName();
            System.debug('sObjectType: ' + sObjectType);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return sObjectType;
    }
}