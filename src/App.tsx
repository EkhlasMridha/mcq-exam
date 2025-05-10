import type { ElementSizeType } from "components/button/types";
import { Table } from "components/table";

function App() {
  const size: ElementSizeType = "medium";
  const dataList = [
    {
      name: "Sam",
      age: 22,
    },
    {
      name: "Shamsul",
      age: 44,
    },
  ];
  return (
    <div
      style={{ padding: 18, display: "flex", alignItems: "center", gap: 12 }}
    >
      <Table
        dataSource={dataList}
        onRowClick={(params) => {
          console.log(params.row);
        }}
        columns={[
          {
            heading: "Name",
            name: "name",
          },
          {
            heading: "Age",
            name: "age",
          },
        ]}
      />
      {/* <CheckboxGroup
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
      /> */}
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
