public with sharing class FieldLabelController {
    @AuraEnabled(cacheable=true)
    public static String getFieldLabels(
        String objectName,
        String fieldAPIName
    ) {
        String label = null;
        try {
            List<String> fieldLabels = new List<String>();
            Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe()
                .get(objectName)
                .getDescribe()
                .fields.getMap();
            label = fieldMap.get(fieldAPIName).getDescribe().getLabel();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return label;
    }

    @AuraEnabled(cacheable=true)
    public static String getSObjectType(sObject record) {
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
