import "./App.css";
import { Input } from "components/input";

function App() {
  return (
    <div style={{ padding: 18 }}>
      <Input variantSize="medium" maxLength={5} />
    </div>
  );
}

export default App;
