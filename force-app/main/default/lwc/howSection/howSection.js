import { LightningElement } from 'lwc';

export default class HowSection extends LightningElement {

    steps = [

        {
            id:1,
            number:'1',
            title:'Join a Riding Group',
            description:'Become part of a verified riding community that matches your interests and riding style.'
        },

        {
            id:2,
            number:'2',
            title:'Participate in Rides',
            description:'Join organized rides, meet fellow riders and gain valuable riding experience.'
        },

        {
            id:3,
            number:'3',
            title:'Earn Ratings',
            description:'Receive fair ratings from fellow riders based on safety, discipline and teamwork.'
        },

        {
            id:4,
            number:'4',
            title:'Unlock New Levels',
            description:'Improve your ApeX score to access advanced rides and earn community recognition.'
        }

    ];

}