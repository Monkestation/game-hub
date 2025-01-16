// https://github.com/Microsoft/TypeScript/issues/15480#issuecomment-1245429783
// Increment / Decrement from:
// https://stackoverflow.com/questions/54243431/typescript-increment-number-type

// We intersect with `number` because various use-cases want `number` subtypes,
// including this own source code!

type ArrayOfLength<
  N extends number,
  A extends unknown[] = [],
> = A["length"] extends N ? A : ArrayOfLength<N, [...A, unknown]>;
type Inc<N extends number> = number & [...ArrayOfLength<N>, unknown]["length"];
type Dec<N extends number> = number &
  (ArrayOfLength<N> extends [...infer A, unknown] ? A["length"] : -1);

type RangeOf<start extends number, end extends number> = number &
  (start extends end ? never : start | Range<Inc<start>, end>);
