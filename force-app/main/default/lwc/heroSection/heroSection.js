import { LightningElement } from 'lwc';

export default class HeroSection extends LightningElement {

    scrollToHow() {

        const section = document.getElementById('howSection');

        if(section){
            section.scrollIntoView({
                behavior:'smooth'
            });
        }

    }

}   