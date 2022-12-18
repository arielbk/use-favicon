import {
  Box,
  Checkbox,
  Divider,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { Variant } from '../../App';
import FaviconViewer from './FaviconViewer';

interface Props {
  selectedVariant: Variant;
  setSelectedVariant: (newVariant: Variant) => void;
  faviconSvg?: string;
  hasDark: boolean;
  hasAway: boolean;
  setFaviconNotification: () => void;
}

const Output: React.FC<Props> = ({
  selectedVariant,
  setSelectedVariant,
  faviconSvg,
  hasDark,
  hasAway,
  setFaviconNotification,
}) => {
  return (
    <Box border="1px solid #ccc" borderRadius={8} p={8} alignSelf="flex-start">
      <FaviconViewer faviconSvg={faviconSvg ?? null} />
      <RadioGroup
        onChange={(newVal: string) => setSelectedVariant(newVal as Variant)}
        value={selectedVariant as string}
      >
        <Stack direction="column">
          <Radio value="default">Default</Radio>
          <Radio value="dark" isDisabled={!hasDark}>
            Dark
          </Radio>
          <Radio value="away" isDisabled={!hasAway}>
            Away
          </Radio>
        </Stack>
      </RadioGroup>
      <Divider my={4} />
      <Checkbox onChange={() => setFaviconNotification()}>
        Notification
      </Checkbox>
    </Box>
  );
};

export default Output;
