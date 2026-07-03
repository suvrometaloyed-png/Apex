import { LightningElement } from 'lwc';

export default class LandingPage extends LightningElement {

    handleScrollToHow() {

        const section =
            this.template.querySelector('.how-anchor');

        if(section){

            section.scrollIntoView({
                behavior:'smooth',
                block:'start'
            });

        }

    }

}