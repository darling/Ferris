import { sample } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('...string', {
    name: '...string',
    execute: async function (_argument, params) {
        if (params.length <= 0) return;

        return _argument.lowercase ? params.join(' ').toLowerCase() : params.join(' ');
    },
    example: () => {
        return (
            sample([
                'Anything goes here',
                'Lorem ipsum dolor sit amet, consectetur ',
                'You can put anything with spaces and such',
                'Powder croissant donut donut. Sweet jelly gummi...',
            ]) || 'Anything goes here'
        );
    },
    description:
        'This is a long string that can have many words. Type as much as you want and Ferris will record it all.',
});
