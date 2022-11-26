import {
  RadioGroup,
  Stack,
  Radio,
  Button,
  Heading,
  Container,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useFavicon from 'use-favicon';
import { FaviconOptions } from 'use-favicon/dist/types';
import ConfigCard from './components/ConfigCard';
import FaviconViewer from './components/FaviconViewer';
import configs, { Config } from './configs';

type Variant = 'default' | 'dark' | 'away';

const defaultOptions: FaviconOptions = {
  type: 'emoji',
  value: '🙂',
  darkVariant: {
    type: 'emoji',
    value: '✨',
  },
  awayVariant: {
    type: 'emoji',
    value: '🫣',
  },
};

function App() {
  const [selectedConfig, setSelectedConfig] = useState<Config>(configs[0]);
  const [selectedVariant, setSelectedVariant] = useState<Variant>('default');

  const { faviconSvg, setOptions, setFaviconNotification } =
    useFavicon(defaultOptions);

  useEffect(() => {
    if (selectedVariant === 'default') {
      setOptions(selectedConfig.options);
    } else if (selectedVariant === 'dark') {
      setOptions({
        ...selectedConfig.options,
        ...selectedConfig.options.darkVariant,
      });
    } else if (selectedVariant === 'away') {
      setOptions({
        ...selectedConfig.options,
        ...selectedConfig.options.awayVariant,
      });
    }
  }, [selectedConfig.options, selectedVariant]);

  return (
    <Container mx="auto" my={8} display="flex" flexDirection="column" gap={8}>
      <Heading as="h1" size="3xl">
        useFavicon
      </Heading>
      <FaviconViewer faviconSvg={faviconSvg ?? null} />
      <RadioGroup
        onChange={(newVal: Variant) => setSelectedVariant(newVal)}
        value={selectedVariant}
      >
        <Stack direction="row">
          <Radio value="default">Default</Radio>
          <Radio value="dark" isDisabled={!selectedConfig.options.darkVariant}>
            Dark
          </Radio>
          <Radio value="away" isDisabled={!selectedConfig.options.awayVariant}>
            Away
          </Radio>
        </Stack>
      </RadioGroup>
      <Button onClick={() => setFaviconNotification()}>
        Toggle notification
      </Button>
      <Heading as="h2" size="xl">
        Examples
      </Heading>
      {configs.map((config) => (
        <ConfigCard
          {...config}
          key={config.id}
          isSelected={config.id === selectedConfig.id}
          selectConfig={() => setSelectedConfig(config)}
        />
      ))}
    </Container>
  );
}

export default App;
