import React from 'react';
import { NumericFormat as OriginalNumericFormat, NumericFormatProps } from 'react-number-format';

const NumericFormat = React.forwardRef<HTMLInputElement, NumericFormatProps>(({ id, ...props }, ref) => (
  <OriginalNumericFormat id={id} {...props} getInputRef={ref} />
));

export default NumericFormat;
