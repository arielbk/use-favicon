import { Box } from '@chakra-ui/react';

type Props = {
  faviconSvg: string | null;
};

export default function FaviconViewer({ faviconSvg }: Props) {
  return (
    <Box mb={8} width="200px">
      {' '}
      {faviconSvg ? <img src={`data:image/svg+xml,${faviconSvg}`} /> : null}
    </Box>
  );
}
