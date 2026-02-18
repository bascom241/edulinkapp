import { Edit, CheckCircle, AlertCircle, Loader, X, } from "lucide-react";

interface Cli6Props {
  formData: any;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  showToast: boolean
  setShowToast: (data: boolean) => void
}
import { useClassRoomStore } from "../../../store/useClassRoom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Cli6 = ({ formData, onEditStep, onSubmit, showToast, setShowToast }: Cli6Props) => {


  const sections = [
    {
      title: "Basic Information",
      step: 1,
      data: [
        { label: "Class Name", value: formData.className },
        { label: "Category", value: formData.classCategory },
        { label: "Target Audience", value: formData.targetAudience },
      ],
    },
    {
      title: "Pricing & Duration",
      step: 2,
      data: [
        { label: "Price", value: formData.price },
        {
          label: "Duration",
          value: formData.duration
            ? `${formData.duration} (Auto-expires after this period)`
            : "",
        },
      ],
    },
    {
      title: "Delivery Method",
      step: 3,
      data: [
        { label: "Model", value: formData.deliveryModel },
        { label: "Location", value: formData.classLocation },
      ],
    },
    {
      title: "Class Description",
      step: 4,
      data: [{ label: "Description", value: formData.description }],
    },
    // {
    //   title: "Class Materials",
    //   step: 5,
    //   // ⚡ Instead of a flat `data`, we’ll render custom for materials
    //   materials: formData.materials,
    // },
  ];

  const { creatingClassroom } = useClassRoomStore()
  const { user } = useAuthStore();



  useEffect(() => {
    if (user?.bankAccount === null || user?.bankName === null) {
      setShowToast(true);
    }
  }, [user]);


  return (
    <section className="bg-white rounded-lg p-6">

     {showToast && (
  <div
    className="
      fixed top-5 right-5 z-50
      w-[360px]
      rounded-xl
      bg-pink-100
      border-r-4 border-pink-500
      p-4
      shadow-lg
      animate-[slideIn_0.4s_ease-out]
    "
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h4 className="text-pink-800 font-semibold mb-1">
          Bank details required
        </h4>

        <p className="text-sm text-pink-700 leading-relaxed">
          Your account currently doesn’t have bank details.  
          Please add your bank information to enable payouts before creating a classroom.
        </p>

        <Link
          to="/profile"
          className="
            inline-flex items-center justify-center
            mt-4
            px-4 py-2
            rounded-lg
            bg-pink-500
            text-white
            text-sm font-medium
            hover:bg-pink-600
            transition
            shadow-sm
          "
        >
          Set bank details
        </Link>
      </div>

      <button
        onClick={() => setShowToast(false)}
        className="text-pink-600 hover:text-pink-800 transition"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  </div>
)}


      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Review Classroom
        </h1>
        <p className="text-gray-600">
          Please review all details before creating your classroom.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-6 mb-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {section.title}
              </h3>
              <button
                onClick={() => onEditStep(section.step - 1)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            {/* Default Data Rendering */}
            {section.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-gray-900 break-words">
                      {item.value || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}


            {/* {section.materials && (
              <div className="space-y-6">
                {Object.entries(section.materials).map(([category, items]: any) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-700 mb-2 capitalize">
                      {category}
                    </h4>
                    {items.length > 0 ? (
                      <ul className="space-y-3">
                        {items.map((item: any, i: number) => (
                          <li
                            key={i}
                            className="p-3 border border-gray-200 rounded-lg"
                          >
                            <p className="text-gray-900 font-medium">
                              {item.title || "Untitled"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description || "No description"}
                            </p>
                            {item.file && (
                              <p className="text-sm text-blue-600 break-all mt-1">
                                {item.file}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">No {category} added</p>
                    )}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </div>

      {/* Final Check & Submit */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Before you create</h4>
            <p className="text-blue-700 text-sm">
              Please ensure all information is correct. You can edit any section
              by clicking the Edit button. Once created, some details cannot be
              changed.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          {
            creatingClassroom ? <Loader className="animate-spin" /> : "Create classroom"
          }
        </button>
        <p className="text-sm text-gray-500 mt-3">
          You'll be able to add students and schedule sessions after creation
        </p>
      </div>
    </section>
  );
};

export default Cli6;
