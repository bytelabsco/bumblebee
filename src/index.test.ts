import { Bumblebee } from './index';
import { defaultConfiguration } from './default-configuration';

test('should generate defaults', () => {

    Bumblebee.generate(defaultConfiguration);

});