import { LightningElement, api } from 'lwc';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';
import TIMEZONE from '@salesforce/i18n/timeZone';

// Not a complete list - see https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_enum_Schema_DisplayType.htm
/*const TYPE_MAPPINGS = {
    'Boolean': 'boolean',
    'CURRENCY': 'currency',
    'Date': 'date',
    'DATETIME': 'date',
    'Email': 'text',
    'Double': 'number',
    'Percent': 'percent',
    'Phone': 'phone',
    'Picklist': 'text',
    'Reference': 'text',
    'String': 'text',
    'TextArea': 'text',
    'URL': 'url'
};*/

function formatDateTimeLocale(dateStr, hasDate, hasTime) {
    const options = {
        timeZone: TIMEZONE
    };
    if (hasDate) {
        options.dateStyle = 'medium';
    }
    if (hasTime) {
        options.timeStyle = 'short';
    }
    return new Intl.DateTimeFormat(LOCALE, options).format(new Date(dateStr));
}

function formatCurrencyLocale(amount) {
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
        currencyDisplay: 'symbol'
    }).format(amount);
}

function formatDoubleLocale(amount, scale) {
    return new Intl.NumberFormat(LOCALE, {
        minimumFractionDigits: scale
    }).format(amount);
}

function formatPercentLocale(amount) {
    return new Intl.NumberFormat(LOCALE, {
        style: 'percent',
        minimumFractionDigits: 2
    }).format(amount);
}

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
        if (
            inputVal ||
            this.sfType === 'CURRENCY' ||
            this.sfType === 'PERCENT'
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
