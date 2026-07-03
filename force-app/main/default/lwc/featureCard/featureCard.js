import { LightningElement, api } from 'lwc';

export default class FeatureCard extends LightningElement {

    @api icon;
    @api title;
    @api description;

}