import { LightningElement, api } from 'lwc';
import {
    formatDateTimeLocale,
    formatCurrencyLocale,
    formatDoubleLocale,
    formatPercentLocale
} from 'c/stickySelectronUtils';

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
        // We may get a zero value from Apex that should still be rendered with our JS formatting
        if (
            inputVal ||
            this.sfType === 'CURRENCY' ||
            this.sfType === 'PERCENT' ||
            this.sfType === 'DOUBLE'
        ) {
            if (this.sfType === 'DATETIME') {
                const hasDate = true;
                const hasTime = true;
                return formatDateTimeLocale(inputVal, hasDate, hasTime);
            }
            if (this.sfType === 'DATE') {
                const hasDate = true;
                const hasTime = false;
                return formatDateTimeLocale(inputVal, hasDate, hasTime);
            }
            if (this.sfType === 'TIME') {
                const hasDate = false;
                const hasTime = true;
                return formatDateTimeLocale(inputVal, hasDate, hasTime);
            }
            if (this.sfType === 'CURRENCY') {
                return formatCurrencyLocale(inputVal);
            }
            if (this.sfType === 'PERCENT') {
                return formatPercentLocale(inputVal / 100);
            }
            if (this.sfType === 'DOUBLE') {
                return formatDoubleLocale(inputVal, this.sfScale);
            }
        }
        return inputVal;
    }
}
