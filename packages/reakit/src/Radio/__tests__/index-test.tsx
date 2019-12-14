import * as ts from "typescript";
import { readFileSync } from "fs";
import * as path from "path";
import * as React from "react";
import { render, click } from "reakit-test-utils";
import { expecter } from "ts-snippet";
import { Radio, RadioGroup, useRadioState } from "..";

test("click on radio", () => {
  const Test = () => {
    const radio = useRadioState();
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
  click(radio);
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
  click(radio);
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
  click(radio);
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
  click(radio);
  expect(radio.checked).toBe(true);
});

test("group", () => {
  const Test = () => {
    const radio = useRadioState();
    return (
      <RadioGroup {...radio} aria-label="radiogroup" id="base">
        <label>
          <Radio {...radio} value="a" />a
        </label>
        <label>
          <Radio {...radio} value="b" />b
        </label>
        <label>
          <Radio {...radio} value="c" />c
        </label>
      </RadioGroup>
    );
  };
  const { container } = render(<Test />);
  expect(container).toMatchInlineSnapshot(`
    <div>
      <fieldset
        aria-label="radiogroup"
        id="base"
        role="radiogroup"
      >
        <label>
          <input
            aria-checked="false"
            id="base-1"
            role="radio"
            tabindex="0"
            type="radio"
            value="a"
          />
          a
        </label>
        <label>
          <input
            aria-checked="false"
            id="base-2"
            role="radio"
            tabindex="-1"
            type="radio"
            value="b"
          />
          b
        </label>
        <label>
          <input
            aria-checked="false"
            id="base-3"
            role="radio"
            tabindex="-1"
            type="radio"
            value="c"
          />
          c
        </label>
      </fieldset>
    </div>
  `);
});

test("radio state types", () => {
  const expectSnippet = expecter(
    code => `
    import { useRadioState } from 'packages/reakit/src/Radio';
    ${code}
  `,
    // this is needed due to tsconfig path mapping to other reakit packages
    ts.parseConfigFileTextToJson(
      "tsconfig.json",
      readFileSync(path.resolve(__dirname, "../../../../../tsconfig.json"), {
        encoding: "utf8"
      })
    ).config.compilerOptions,
    path.resolve(__dirname, "../../../../..")
  );

  expectSnippet(`
    enum Flavor {
      Vanilla = "vanilla",
      Chocolate = "chocolate"
    }
    
    const { state } = useRadioState({ state: Flavor.Chocolate });
  `).toSucceed();

  expectSnippet(`
    enum Flavor {
      Vanilla = "vanilla",
      Chocolate = "chocolate"
    }
    
    const { state } = useRadioState({ state: Flavor.Chocolate });
  `).toInfer("state", "Flavor | undefined");

  expectSnippet(`
    enum Flavor {
      Vanilla = "vanilla",
      Chocolate = "chocolate"
    }
    
    const { state } = useRadioState({ state: Flavor.Chocolate });
    const _ = <Radio {...radioState} value="Tomato" />
  `).toFail();

  expectSnippet(`
    import { Radio } from './packages/reakit/src/Radio';

    enum Flavor {
      Vanilla = "vanilla",
      Chocolate = "chocolate"
    }
    
    const { state } = useRadioState({ state: Flavor.Chocolate });
    const _ = <Radio {...radioState} value={Flavor.Vanilla} />
  `).toFail();
});
