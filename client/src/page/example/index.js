import AppBadge from "compounds/badge";
import CustomButton from "compounds/button";
import CustomDialog from "compounds/dialogy";
import InputBox from "compounds/input";
import CustomSelect from "compounds/select";
import { useCallback, useState } from "react";

function BasicExample() {
  const [formData, setFormData] = useState({});
  const handleInputChange = useCallback((field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  return (
    <>
      <div className="m-4 p-4 bg-white rounded-lg shadow-sm">
        <h1>Basic Example</h1>
        <p>This is a basic example of a PS Portal Components.</p>
      </div>

      <div className="m-4 p-4 bg-white rounded-lg shadow-sm">
        <InputBox
          label="Basic Input Box"
          placeholder="Placeholder"
          return="target"
          onChange={(value) =>
            handleInputChange("basic_input", value.target.value)
          }
        />

        <h2 className="mt-4 mb-2 font-medium">Usage :</h2>
        <code>
          import InputBox from "compounds/input";
          <br />
          {"<InputBox/>"}
        </code>

        <h2 className="mt-4 mb-2 font-medium">Properties Usage :</h2>
        <code>
          {"<InputBox"}
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;label="Basic Input Box" <br />
          &nbsp;&nbsp;&nbsp;&nbsp;placeholder="Placeholder" <br />
          &nbsp;&nbsp;&nbsp;&nbsp;return="target" <br />
          &nbsp;&nbsp;&nbsp;&nbsp;onChange=
          {"{(value) => handleInputChange('basic_input', value.target.value)}"}
          <br />
          {"/>"}
        </code>
      </div>

      <div className="flex gap-4 m-4">
        <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
          <CustomButton
            label="Submit"
            onClick={() => alert("Clicked")}
            others="mt-2 w-52"
          />

          <h2 className="mt-4 mb-2 font-medium">Usage :</h2>
          <code>
            import InputBox from "compounds/button";
            <br />
            {"<CustomButton/>"}
          </code>

          <h2 className="mt-4 mb-2 font-medium">Properties Usage :</h2>
          <code lang="javascript">
            {"<CustomButton"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;label="Click Me" <br />
            &nbsp;&nbsp;&nbsp;&nbsp;others="mt-2 w-52" // If any other styles
            needed (Optional)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;onClick=
            {"{() => alert('Clicked')"}
            <br />
            {"/>"}
          </code>
        </div>

        <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex gap-4">
            <AppBadge label="Active" color="primary" others={"w-32"} />
            <AppBadge label="Not Active" color="red" others={"w-32"} />
          </div>
          <h2 className="mt-4 mb-2 font-medium">Usage :</h2>
          <code>
            import AppBadge from "compounds/badge";
            <br />
            {"<AppBadge/>"}
          </code>

          <h2 className="mt-4 mb-2 font-medium">Properties Usage :</h2>
          <code>
            {"<AppBadge"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;label="Active" <br />
            &nbsp;&nbsp;&nbsp;&nbsp;color="primary" <br />
            {"/>"}
          </code>
        </div>
      </div>

      <div className="flex gap-4 m-4">
        <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
          <CustomButton
            label="Open Dialog"
            onClick={() => handleInputChange("openDialogy", true)}
            others="mt-2 w-52"
          />
          {formData.openDialogy && (
            <CustomDialog
              open={formData.openDialogy}
              handleClose={() => handleInputChange("openDialogy", false)}
              title="Dialog Title"
              body={
                <div>
                  <p>This is a dialog body</p>
                </div>
              }
            />
          )}

          <h2 className="mt-4 mb-2 font-medium">Usage :</h2>
          <code>
            import CustomDialog from "compounds/dialogy";
            <br />
            {"<CustomDialog/>"}
          </code>

          <h2 className="mt-4 mb-2 font-medium">Properties Usage :</h2>
          <code lang="javascript">
            {"<CustomButton"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;label="Open Dialog" <br />
            &nbsp;&nbsp;&nbsp;&nbsp;others="mt-2 w-52" // If any other styles
            needed (Optional)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;onClick=
            {"{() => handleInputChange('openDialogy', true)"}
            <br />
            {"/>"}
            <br /> <br />
            {"<CustomDialog"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp; open={"{formData.openDialogy}"} <br />
            &nbsp;&nbsp;&nbsp;&nbsp; handleClose=
            {"{() => handleInputChange('openDialogy', false)}"} <br />
            &nbsp;&nbsp;&nbsp;&nbsp;title="Dialog Title" <br />
            &nbsp;&nbsp;&nbsp;&nbsp;body={"{}"}
            <br />
            {"/>"}
          </code>
        </div>

        <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
          <CustomSelect
            label="Select Box"
            options={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]}
            return="target"
            onChange={(value) => handleInputChange("select_box", value)}
          />

          <h2 className="mt-4 mb-2 font-medium">Usage :</h2>
          <code>
            import CustomSelect from "compounds/select";
            <br />
            {"<CustomSelect/>"}
          </code>

          <h2 className="mt-4 mb-2 font-medium">Properties Usage :</h2>
          <code lang="javascript">
            {"<CustomSelect"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;label="Click Me" <br />
            &nbsp;&nbsp;&nbsp;&nbsp;return="target" <br />
            &nbsp;&nbsp;&nbsp;&nbsp;onChange={`options={[]}`} <br />
            &nbsp;&nbsp;&nbsp;&nbsp;onChange=
            {"={(value) => handleInputChange('select_box', value)}"}
            <br />
            {"/>"}
          </code>
        </div>
      </div>
    </>
  );
}

export default BasicExample;
