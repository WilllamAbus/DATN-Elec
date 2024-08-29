import React from 'react';
import { NumericFormat as OriginalNumericFormat, NumericFormatProps } from 'react-number-format';

const NumericFormat = React.forwardRef<HTMLInputElement, NumericFormatProps>((props, ref) => (
  <OriginalNumericFormat {...props} getInputRef={ref} />
));

export default NumericFormat;
