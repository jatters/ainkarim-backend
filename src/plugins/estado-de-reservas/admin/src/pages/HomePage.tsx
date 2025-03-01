import { Main } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <h1>Welcome to {formatMessage({ id: getTranslation('plugin.name') })}</h1>

      <p style={{ fontSize: 16 }}>Este es un mensaje de bienvenida</p>
    </Main>
  );
};

export { HomePage };
