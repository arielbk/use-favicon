import { chakra, Code, Heading } from '@chakra-ui/react';
import React from 'react';
import { FaviconOptions } from '../../../dist/types';

interface ConfigCardProps {
  name: string;
  options: FaviconOptions;
  isSelected: boolean;
  selectConfig: () => void;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
  name,
  options,
  isSelected,
  selectConfig,
}) => {
  return (
    <chakra.button
      onClick={selectConfig}
      p={4}
      border={`1px solid ${isSelected ? '#636Cff' : '#ccc'}`}
    >
      <Heading as="h3" size="md">
        {name}
      </Heading>
      <Code>{JSON.stringify(options, null, 2)}</Code>
    </chakra.button>
  );
};

export default ConfigCard;
