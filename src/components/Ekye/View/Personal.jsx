import { FaDiamond } from "react-icons/fa6";
import ReadOnlyInput from "../../ReadOnlyInput";

const Personal = () => {
  return (
    <div className="">
      <div className="rounded-xl space-y-2">
        {/**Basic Information */}
        <div className="bg-white rounded-xl">
          <div className="flex items-center gap-4 justify-between bg-white text-lg pr-4 rounded-xl">
            <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
              <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
              Basic Information
            </h1>
            <div className="flex gap-1 items-end justify-end text-right">
              <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
              <div className="flex w-2 h-2 rounded-full bg-black"></div>
              <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          <form className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-4">
            <ReadOnlyInput label="FullName" placeholder="Odinson" />
            <ReadOnlyInput label="Age" placeholder="32" />
            <ReadOnlyInput label="Gender" placeholder="Male" />
            <ReadOnlyInput label="Phone" placeholder="9865408502" />
            <ReadOnlyInput label="Email" placeholder="odyopmail@yopmail.com" />
            <ReadOnlyInput label="Date Of Birth" placeholder="2004-12-06" />
            <ReadOnlyInput label="Blood Type" placeholder="AB" />
            <ReadOnlyInput label="Department" placeholder="UI/UX Design" />
            <ReadOnlyInput label="Position" placeholder="Junior" />
            <ReadOnlyInput label="Maritial Status" placeholder="UnMarried" />
          </form>
        </div>
        {/**Guardians && Emergency Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/**Guardians Information */}
          <div className="bg-white rounded-2xl pb-2">
            <div className="flex items-center gap-4 justify-between bg-white text-lg pr-4 rounded-2xl">
              <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
                <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
                Guardian Details
              </h1>
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <form className="container grid grid-cols-1 md:grid-cols-2">
              <ReadOnlyInput label="Guardian's Name" placeholder="Odinson" />
              <ReadOnlyInput
                label="Guardian's Number"
                placeholder="9865408502"
              />
              <ReadOnlyInput label="Guardian's Relation" placeholder="Father" />
            </form>
          </div>
          {/**Emerency Information */}
          <div className="bg-white rounded-2xl  pb-2">
            <div className="flex items-center justify-between bg-white text-lg pr-4 rounded-2xl">
              <h1 className="py-2 text-left text-xl font-semibold flex underline underline-offset-4 decoration-red-500">
                <FaDiamond className="h-3 w-2 text-red-700 mt-5 ml-3" />
                Emergency Details
              </h1>
              <div className="flex gap-1 items-end justify-end text-right">
                <div className="flex w-2 h-2 rounded-full bg-red-400"></div>
                <div className="flex w-2 h-2 rounded-full bg-black"></div>
                <div className="flex w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <form className="container grid grid-cols-1 md:grid-cols-2">
              <ReadOnlyInput label="Guardian's Relation" placeholder="Father" />
              <ReadOnlyInput
                label="Guardian's Number"
                placeholder="9865408502"
              />
              <ReadOnlyInput label="Guardian's Name" placeholder="Odinson" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;
