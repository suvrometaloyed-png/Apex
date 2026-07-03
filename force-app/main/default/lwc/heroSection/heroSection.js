import { LightningElement } from 'lwc';

export default class HeroSection extends LightningElement {

    scrollToHow() {
        this.dispatchEvent(
            new CustomEvent('scrolltohow')
        );
    }

}