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
        // Note that setting to short will have a 2-digit year, but we want 4 digit
        //options.dateStyle = 'short';

        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
    }
    // If we leave default formatting (not setting date and time options) then time is not shown
    if (hasTime) {
        // timeStyle short is the format we want, but since we need a 4 digit year, we need to set the time components manually
        //options.timeStyle = 'short';

        options.hour = '2-digit';
        options.minute = '2-digit';
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

export {
    formatDateTimeLocale,
    formatCurrencyLocale,
    formatDoubleLocale,
    formatPercentLocale
};
