import { RadioGroup, Stack, Radio, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useFavicon from 'use-favicon';
import { FaviconOptions } from 'use-favicon/dist/types';
import FaviconViewer from './components/FaviconViewer';

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
  const [wholeOptions, setWholeOptions] =
    useState<FaviconOptions>(defaultOptions);
  const [selectedVariant, setSelectedVariant] = useState<Variant>('default');

  const { faviconSvg, setOptions, setFaviconNotification } =
    useFavicon(defaultOptions);

  useEffect(() => {
    if (selectedVariant === 'default') {
      setOptions(wholeOptions);
    } else if (selectedVariant === 'dark') {
      setOptions({ ...wholeOptions, ...wholeOptions.darkVariant });
    } else if (selectedVariant === 'away') {
      setOptions({ ...wholeOptions, ...wholeOptions.awayVariant });
    }
  }, [wholeOptions, selectedVariant]);

  return (
    <div>
      <FaviconViewer faviconSvg={faviconSvg ?? null} />
      <RadioGroup
        onChange={(newVal: Variant) => setSelectedVariant(newVal)}
        value={selectedVariant}
      >
        <Stack direction="row">
          <Radio value="default">Default</Radio>
          <Radio value="dark">Dark</Radio>
          <Radio value="away">Away</Radio>
        </Stack>
      </RadioGroup>
      <Button onClick={() => setFaviconNotification()}>
        Toggle notification
      </Button>
    </div>
  );
}

export default App;
