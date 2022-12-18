import { chakra, Code, Heading } from '@chakra-ui/react';
import React from 'react';
import { FaviconOptions } from 'use-favicon/dist/types';

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
      width={'400px'}
      textAlign="left"
      mb={4}
    >
      <Heading as="h3" size="md" mb={4}>
        {name}
      </Heading>
      <Code width="full" p={4} whiteSpace="pre-wrap">
        {JSON.stringify(options, null, 2)}
      </Code>
    </chakra.button>
  );
};

export default ConfigCard;
