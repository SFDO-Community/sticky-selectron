import { LightningElement, api } from 'lwc';

export default class StickySelectronDataCell extends LightningElement {
    @api object;
    @api fieldName;

    get fieldValForObject() {
        return this.object[this.fieldName];
    }
}
