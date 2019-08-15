import * as React from "react";
import {
  useSealedState,
  SealedInitialState
} from "reakit-utils/useSealedState";
import {
  RoverState,
  RoverActions,
  RoverInitialState,
  useRoverState
} from "../Rover";

export type RadioState<T> = RoverState & {
  /**
   * The `value` attribute of the current checked radio.
   */
  state: T;
};

export type RadioActions<T> = RoverActions & {
  /**
   * Sets `state`.
   */
  setState: React.Dispatch<React.SetStateAction<T>>;
};

export type RadioInitialState<T = any> = RoverInitialState &
  Partial<Pick<RadioState<T>, "state">>;

export type RadioStateReturn<T> = RadioState<T> & RadioActions<T>;

export function useRadioState<T>(
  initialState: SealedInitialState<RadioInitialState<T>> = {}
): RadioStateReturn<T | undefined> {
  const {
    state: initialCurrentValue,
    loop: loop = true,
    ...sealed
  } = useSealedState(initialState);

  const [state, setState] = React.useState(initialCurrentValue);

  const rover = useRoverState({ ...sealed, loop });

  return {
    ...rover,
    state,
    setState
  };
}

const keys: Array<keyof RadioStateReturn<any>> = [
  ...useRoverState.__keys,
  "state",
  "setState"
];

useRadioState.__keys = keys;
