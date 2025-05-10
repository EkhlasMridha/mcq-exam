import { RadioGroup, RadioInput } from "components/radio-input";
import { Checkbox, CheckboxGroup } from "components/checkbox";
import type { ElementSizeType } from "components/button/types";

function App() {
  const size: ElementSizeType = "medium";
  return (
    <div
      style={{ padding: 18, display: "flex", alignItems: "center", gap: 12 }}
    >
      <CheckboxGroup
        value={["f", "s"]}
        items={[
          {
            label: "Raining cats and dogs",
            value: "a",
          },
          {
            label: "Wise foxs tail",
            value: "b",
          },
          {
            label: "Journy around the world",
            value: "c",
          },
          {
            label: "Mission of folk tails",
            value: "d",
          },
        ]}
      />
      {/* <Checkbox variantSize={size} label="My checkbox" /> */}
      {/* <RadioInput disabled checked /> */}
      {/* <RadioGroup
        variantSize={size}
        orientation="row"
        itemGap={12}
        items={[
          {
            label: "Raining cats and dogs",
            value: "a",
          },
          {
            label: "Wise foxs tail",
            value: "b",
          },
          {
            label: "Journy around the world",
            value: "c",
          },
          {
            label: "Mission of folk tails",
            value: "d",
          },
        ]}
      /> */}
    </div>
  );
}

export default App;
