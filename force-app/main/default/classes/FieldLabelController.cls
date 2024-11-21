/**
 * @description FieldLabelController class assists with retrieving field labels
 * for a given object and field API name. And includes a helper function to get
 * the sObjectType of a given record.
 */
public with sharing class FieldLabelController {
    /**
     * @description Wrapper class to hold the response data
     */
    public class FieldLabelResponse {
        @AuraEnabled
        public String sObjectType { get; set; }
        @AuraEnabled
        public Map<String, String> fieldLabels { get; set; }

        public FieldLabelResponse() {
            this.fieldLabels = new Map<String, String>();
        }
    }

    /**
     * @description getBulkFieldInfo retrieves both sObjectType and multiple field labels
     * in a single call
     * @param record sObject input record
     * @param fieldApiNames List of field API names
     * @return FieldLabelResponse containing sObjectType and map of field labels
     */
    @AuraEnabled(cacheable=true)
    public static FieldLabelResponse getBulkFieldInfo(
        sObject record,
        List<String> fieldApiNames
    ) {
        FieldLabelResponse response = new FieldLabelResponse();

        try {
            // Get sObjectType
            if (record != null && record.Id != null) {
                Id recordId = record.Id;
                response.sObjectType = recordId.getSObjectType()
                    .getDescribe()
                    .getName();
            }

            // Get field labels
            if (
                fieldApiNames != null &&
                !fieldApiNames.isEmpty() &&
                record != null &&
                record.Id != null
            ) {
                Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe()
                    .get(response.sObjectType)
                    .getDescribe()
                    .fields.getMap();

                for (String fieldApiName : fieldApiNames) {
                    if (fieldMap.containsKey(fieldApiName)) {
                        response.fieldLabels.put(
                            fieldApiName,
                            fieldMap.get(fieldApiName).getDescribe().getLabel()
                        );
                    } else {
                        throw new AuraHandledException('Invalid field name');
                    }
                }
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return response;
    }

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
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return sObjectType;
    }
}
