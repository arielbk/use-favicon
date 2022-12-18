import { Box, Flex, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useFavicon from 'use-favicon';
import { FaviconOptions } from 'use-favicon/dist/types';
import ConfigCard from './components/ConfigCard';
import Output from './components/Output';
import configs, { Config } from './configs';

export type Variant = 'default' | 'dark' | 'away';

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
    <Box mx="auto" px={8} width="100%">
      <Heading as="h1" size="3xl" my={8}>
        use favicon
      </Heading>
      <Flex gap={8} flexGrow={0}>
        <Output
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          faviconSvg={faviconSvg}
          hasDark={!!selectedConfig.options.darkVariant}
          hasAway={!!selectedConfig.options.awayVariant}
          setFaviconNotification={setFaviconNotification}
        />
        <div>
          {configs.map((config) => (
            <ConfigCard
              {...config}
              key={config.id}
              isSelected={config.id === selectedConfig.id}
              selectConfig={() => setSelectedConfig(config)}
            />
          ))}
        </div>
      </Flex>
    </Box>
  );
}

export default App;
