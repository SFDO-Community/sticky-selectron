import { LightningElement, api } from 'lwc';
import { getFormattedStringForType } from 'c/stickySelectronUtils';

export default class StickySelectronDataCell extends LightningElement {
    @api object;
    @api fieldName;
    @api sfType;
    @api sfScale;

    get isBooleanType() {
        return this.sfType === 'BOOLEAN';
    }

    get getBooleanValue() {
        return this.object?.[this.fieldName];
    }

    get fieldValForObject() {
        const inputVal = this.object?.[this.fieldName];
        const outputString = getFormattedStringForType(
            inputVal,
            this.sfType,
            this.sfScale
        );

        return outputString;
    }
}
