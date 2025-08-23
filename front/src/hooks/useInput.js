import { useState } from 'react';

const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  const bind = {
    value,
    onChange: handleChange
  };

  return {
    value,
    bind,
    reset,
    setValue
  };
};

export default useInput;