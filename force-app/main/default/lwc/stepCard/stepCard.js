import { LightningElement, api } from 'lwc';

export default class StepCard extends LightningElement {

    @api number;
    @api title;
    @api description;

}