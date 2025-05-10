import { RadioInput } from "components/radio-input";
import "./App.css";
import { Checkbox } from "components/checkbox";
import type { ElementSizeType } from "components/button/types";

function App() {
  const size: ElementSizeType = "large";
  return (
    <div
      style={{ padding: 18, display: "flex", alignItems: "center", gap: 12 }}
    >
      <Checkbox variantSize={size} />
      <RadioInput variantSize={size} />
    </div>
  );
}

export default App;
