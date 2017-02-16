import Ember from 'ember';
const { Controller } = Ember;

export default Controller.extend({
  options: [
    'Portugal',
    'USA',
    'Spain',
    'Canada',
    'Italy',
    'Sweden'
  ],

  people: [
    {
      name: 'D. Afonso I',
      description: 'Founder of the Kingdom of Portugal'
    },
    {
      name: 'D. Sancho I',
      description: 'Son of Aplphonso I'
    },
    {
      name: 'D. Afonso II',
      description: 'Son of Sancius I'
    },
    {
      name: 'D. Sancho II',
      description: 'Son of Alphonso II'
    },
    {
      name: 'D. Afonso III',
      description: 'Son of Alphonso II'
    }
  ]
});