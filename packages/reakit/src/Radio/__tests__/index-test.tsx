import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RadioGroup } from "../RadioGroup";
import { Radio, useRadioState } from "..";

test("click on radio", () => {
  const Test = () => {
    const radio = useRadioState<string>();
    return (
      <label>
        <Radio {...radio} value="radio" />
        radio
      </label>
    );
  };
  const { getByLabelText } = render(<Test />);
  const radio = getByLabelText("radio") as HTMLInputElement;
  expect(radio.checked).toBe(false);
  fireEvent.click(radio);
  expect(radio.checked).toBe(true);
});

test("click on non-native radio", () => {
  const Test = () => {
    const radio = useRadioState<"radio">();
    return (
      <label>
        <Radio {...radio} as="div" value="radio" />
        radio
      </label>
    );
  };
  const { getByLabelText } = render(<Test />);
  const radio = getByLabelText("radio") as HTMLInputElement;
  expect(radio.checked).toBe(false);
  fireEvent.click(radio);
  expect(radio.checked).toBe(true);
});

test("onChange", () => {
  const Test = () => {
    const { state, setState, ...radio } = useRadioState();
    const [checked, setChecked] = React.useState(false);
    const toggle = () => setChecked(!checked);
    return (
      <label>
        <Radio {...radio} value="radio" onChange={toggle} checked={checked} />
        radio
      </label>
    );
  };
  const { getByLabelText } = render(<Test />);
  const radio = getByLabelText("radio") as HTMLInputElement;
  expect(radio.checked).toBe(false);
  fireEvent.click(radio);
  expect(radio.checked).toBe(true);
});

test("onChange non-native radio", () => {
  const Test = () => {
    const { state, setState, ...radio } = useRadioState();
    const [checked, setChecked] = React.useState(false);
    const toggle = () => setChecked(!checked);
    return (
      <label>
        <Radio
          {...radio}
          as="div"
          value="radio"
          onChange={toggle}
          checked={checked}
        />
        radio
      </label>
    );
  };
  const { getByLabelText } = render(<Test />);
  const radio = getByLabelText("radio") as HTMLInputElement;
  expect(radio.checked).toBe(false);
  fireEvent.click(radio);
  expect(radio.checked).toBe(true);
});

test("radio group initial state", () => {
  const Test = () => {
    type Superhero = "superman" | "batman";
    const radio = useRadioState<Superhero>({ state: "superman" });

    return (
      <RadioGroup {...radio} aria-label="superhero">
        <label>
          <Radio<Superhero> {...radio} value="superman" />
          Clark Kent
        </label>
        <label>
          <Radio {...radio} value="batman" />
          Bruce Wayne
        </label>
      </RadioGroup>
    );
  };
  const { getByLabelText } = render(<Test />);
  const radio = getByLabelText("Clark Kent") as HTMLInputElement;
  expect(radio.checked).toBe(true);
});
