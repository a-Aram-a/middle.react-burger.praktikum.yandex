import { useState } from 'react';

type TUseForm<T> = {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const useForm = <T extends Record<string, string>>(
  initialValues: T
): TUseForm<T> => {
  const [values, setValues] = useState<T>(initialValues);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, setValues, onChange };
};
