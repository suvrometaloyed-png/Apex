import { LightningElement } from 'lwc';

export default class WhySection extends LightningElement {

    features = [

        {
            id:1,
            icon:'🛡️',
            title:'Safety First',
            description:'Every rider earns trust through responsible riding and positive community feedback.'
        },

        {
            id:2,
            icon:'📈',
            title:'Fair Progression',
            description:'Unlock advanced rides as your experience and reputation grow.'
        },

        {
            id:3,
            icon:'🤝',
            title:'Stronger Communities',
            description:'Encourage teamwork, respect, and accountability within every riding group.'
        }

    ];

}