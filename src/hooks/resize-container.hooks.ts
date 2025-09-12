import { Dispatch, SetStateAction } from 'react';

type HandleTogglePropsType = {
  index: number;
  setState: Dispatch<SetStateAction<number>>;
};

const handleToggleCollapsibleContainer = ({
  index,
  setState,
}: HandleTogglePropsType) => {
  setState((prev: number) => (prev === index ? 0 : index));
};

export default handleToggleCollapsibleContainer;
