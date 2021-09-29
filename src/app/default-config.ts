export default `{
  fields: [
    {
      name: 'avengers',
      title: 'Superhero Questionnaire',
      fields: [
        {
          name: 'groot',
          type: 'text',
          options: {
            label: 'How would Groot answer this question?',
            placeholder: 'Hodor',
            cssClasses: ['col-md-8'],
            inlineLabel: false,
          },
        },
        {
          name: 'power',
          type: 'radio',
          options: {
            label: 'Who says: “With great power, there must also come great responsibility”?',
            placeholder: 'select an option',
            items: [
              { value: 'spidey', label: 'Spiderman' },
              { value: 'batty', label: 'Batman' },
              { value: 'none', label: 'Thanos' },
            ],
            cssClasses: ['col-12'],
            inlineLabel: false,
          },
        },
        {
          name: 'checkboxGroup',
          type: 'checkbox',
          options: {
            label: 'Choose your favorite Avenger',
            placeholder: 'select an option',
            items: [
              { value: 'hulk', label: 'Hulk' },
              { value: 'same', label: 'Same as first option' },
              { value: 'all', label: 'All the above' },
            ],
            cssClasses: ['col-6'],
            inlineLabel: false,
          },
        },
        {
          name: 'awake',
          type: 'select',
          options: {
            label: 'Can we buy Kryptonite with Crypto currency?',
            placeholder: 'select an option',
            color: 'primary',
            items: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'ynot', label: 'Why not?' },
            ],
            cssClasses: ['d-inline-block ', 'col-6', 'pe-3'],
            inlineLabel: false,
          },
        },
        {
          name: 'superman',
          type: 'date',
          options: {
            label: 'When was superman born?',
            placeholder: 'DD/MM/YYYY',
            cssClasses: ['d-inline-block ', 'col-6', 'ps-3'],
            inlineLabel: false,
          },
        },
        {
          name: 'marvel-dc',
          type: 'textarea',
          options: {
            label: 'Why is Marvel better than DC?',
            placeholder: 'Type here',
            cssClasses: ['col-12'],
          },
        },
        {
          cssClasses: ['d-flex', 'justify-content-between'],
          fields: [
            {
              type: 'button',
              options: {
                label: 'Submit',
                type: 'submit',
                cssClasses: ['d-inline-block'],
              },
            },
            {
              type: 'button',
              options: {
                label: 'Reset',
                color: 'outline',
                cssClasses: ['d-inline-block', 'outline-btn'],
                callback(event, formGroup, config) {
                  console.log(event, formGroup, config);
                },
              },
            },
          ],
        },
      ],
    },
  ],
}`;
