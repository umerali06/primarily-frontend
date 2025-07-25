import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingService } from "../services/onboarding";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const OnboardingCategory = () => {
  const [selected, setSelected] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [teamSize, setTeamSize] = useState(1);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Check if onboarding is already completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await onboardingService.getStatus();
        if (response.data?.isCompleted) {
          navigate("/items");
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      }
    };

    if (user) {
      checkOnboardingStatus();
    }
  }, [user, navigate]);

  const handleSelect = (value) => setSelected(value);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleGoalToggle = (goal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = async () => {
    if (step === 1 && selected) {
      setStep(2);
    } else if (step === 2 && selectedCategories.length > 0) {
      setStep(3);
    } else if (step === 3) {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await onboardingService.skip();
      toast.success("Onboarding skipped successfully!");
      navigate("/free-trial");
    } catch (error) {
      toast.error("Failed to skip onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const onboardingData = {
        businessType: selected === "personal" ? "personal" : "small-business",
        selectedCategories,
        teamSize,
        goals,
        preferences: {
          defaultView: "grid",
          notifications: true,
          theme: "light",
        },
      };

      await onboardingService.complete(onboardingData);
      toast.success("Onboarding completed successfully!");
      navigate("/free-trial");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete onboarding"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    {
      id: "retail",
      name: "Retail",
      desc: "Store inventory, products, supplies",
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      desc: "Raw materials, components, finished goods",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      desc: "Medical supplies, equipment, pharmaceuticals",
    },
    {
      id: "education",
      name: "Education",
      desc: "School supplies, equipment, resources",
    },
    {
      id: "construction",
      name: "Construction",
      desc: "Tools, materials, equipment",
    },
    {
      id: "food-service",
      name: "Food Service",
      desc: "Ingredients, supplies, equipment",
    },
    { id: "automotive", name: "Automotive", desc: "Parts, tools, supplies" },
    {
      id: "technology",
      name: "Technology",
      desc: "Hardware, software, components",
    },
    { id: "other", name: "Other", desc: "General inventory management" },
  ];

  const goalOptions = [
    {
      id: "track-inventory",
      name: "Track Inventory",
      desc: "Monitor stock levels and locations",
    },
    {
      id: "reduce-costs",
      name: "Reduce Costs",
      desc: "Optimize inventory and reduce waste",
    },
    {
      id: "improve-efficiency",
      name: "Improve Efficiency",
      desc: "Streamline inventory processes",
    },
    {
      id: "compliance",
      name: "Compliance",
      desc: "Meet regulatory requirements",
    },
    { id: "reporting", name: "Reporting", desc: "Generate inventory reports" },
    { id: "automation", name: "Automation", desc: "Automate inventory tasks" },
  ];

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          {step === 1 && (
            <>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                How will you use Primarily?
              </h1>
              <p className="text-gray-700 text-base md:text-lg mb-8 max-w-md">
                Help us personalize your experience by providing a bit of
                information about your needs.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                What industry are you in?
              </h1>
              <p className="text-gray-700 text-base md:text-lg mb-8 max-w-md">
                Select the categories that best describe your inventory needs.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                What are your goals?
              </h1>
              <p className="text-gray-700 text-base md:text-lg mb-8 max-w-md">
                Tell us what you want to achieve with inventory management.
              </p>
            </>
          )}
          <div className="space-y-6 mb-8">
            {step === 1 && (
              <>
                {/* Personal Card */}
                <div
                  className={`flex items-center gap-6 p-6 bg-white border rounded-xl shadow-sm cursor-pointer transition ${
                    selected === "personal"
                      ? "border-primary ring-2 ring-green-200"
                      : "border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => handleSelect("personal")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected === "personal"}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleSelect("personal")
                  }
                >
                  <span className="inline-flex items-center justify-center w-14 h-14">
                    {/* Personal Icon */}
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="24" cy="24" r="24" fill="#F8F8F9" />
                      <ellipse cx="24" cy="19" rx="7" ry="7" fill="#44475A" />
                      <path
                        d="M24 28c-6 0-10 3.5-10 7v2h20v-2c0-3.5-4-7-10-7Z"
                        fill="#E53935"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      Personal
                    </div>
                    <div className="text-gray-500 text-base">
                      I want to organize stuff in my home.
                    </div>
                  </div>
                </div>
                {/* Business Card */}
                <div
                  className={`flex items-center gap-6 p-6 bg-white border rounded-xl shadow-sm cursor-pointer transition ${
                    selected === "business"
                      ? "border-primary ring-2 ring-green-200"
                      : "border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => handleSelect("business")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected === "business"}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleSelect("business")
                  }
                >
                  <span className="inline-flex items-center justify-center w-14 h-14">
                    {/* Business Icon */}
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="24" cy="24" r="24" fill="#F8F8F9" />
                      <rect
                        x="12"
                        y="22"
                        width="8"
                        height="12"
                        rx="2"
                        fill="#44475A"
                      />
                      <rect
                        x="28"
                        y="16"
                        width="8"
                        height="18"
                        rx="2"
                        fill="#44475A"
                      />
                      <rect
                        x="20"
                        y="28"
                        width="8"
                        height="6"
                        rx="2"
                        fill="#E53935"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      Business
                    </div>
                    <div className="text-gray-500 text-base">
                      I want to track items at my workplace.
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center gap-4 p-4 bg-white border rounded-lg cursor-pointer transition ${
                      selectedCategories.includes(category.id)
                        ? "border-primary ring-2 ring-green-200"
                        : "border-gray-200 hover:border-primary"
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto">
                  {goalOptions.map((goal) => (
                    <div
                      key={goal.id}
                      className={`flex items-center gap-4 p-4 bg-white border rounded-lg cursor-pointer transition ${
                        goals.includes(goal.id)
                          ? "border-primary ring-2 ring-green-200"
                          : "border-gray-200 hover:border-primary"
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <input
                        type="checkbox"
                        checked={goals.includes(goal.id)}
                        onChange={() => handleGoalToggle(goal.id)}
                        className="w-5 h-5 text-primary rounded"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {goal.name}
                        </div>
                        <div className="text-sm text-gray-500">{goal.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex gap-4">
            {step > 1 && (
              <button
                className="flex-1 py-3 rounded-xl font-medium text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                Back
              </button>
            )}
            <button
              className={`flex-1 py-3 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition ${
                (step === 1 && selected) ||
                (step === 2 && selectedCategories.length > 0) ||
                step === 3
                  ? "btn-primary text-white hover:btn-primary-hover"
                  : "bg-gray-200 text-gray-600 cursor-not-allowed"
              }`}
              disabled={
                isLoading ||
                (step === 1 && !selected) ||
                (step === 2 && selectedCategories.length === 0)
              }
              onClick={handleNext}
            >
              {isLoading ? "Processing..." : step === 3 ? "Complete" : "Next"}
              {!isLoading && (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.333 15l5-5-5-5"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Skip for now
          </button>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-10">
          <div className="w-full flex items-center justify-center">
            {/* Provided SVG illustration */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="462"
              height="320"
              fill="none"
            >
              <mask
                id="registration-account-purpose_svg__a"
                width="261"
                height="261"
                x="166"
                y="0"
                maskUnits="userSpaceOnUse"
                style={{ maskType: "alpha" }}
              >
                <path
                  fill="#E8E8EB"
                  d="M320.021 0C234.957 0 166 69.109 166 154.358c0 45.39 14.855 81.828 41.586 105.98L426.295 41.677C398.956 13.507 352.708 0 320.021 0"
                ></path>
              </mask>
              <g
                fill="#F1F1F2"
                mask="url(#registration-account-purpose_svg__a)"
              >
                <path d="M174.471 279.264 446.207 6.948l6.534 6.549-271.736 272.316zm-27.725 0L418.482 6.948l6.534 6.549L153.28 285.813zm-27.723 0L390.759 6.948l6.534 6.549-271.736 272.316zm-27.723 0L375.18-5.22l6.534 6.548L97.835 285.813zm-27.724 0L364.362-22.164l6.534 6.548L70.11 285.813zm-27.724 0 294.85-295.48 6.534 6.548-294.85 295.48zm-27.723 0L305.61-18.853l6.535 6.549L14.663 285.813zm-27.723 0L286.23-27.213l6.534 6.549L-13.06 285.813z"></path>
              </g>
              <mask
                id="registration-account-purpose_svg__b"
                width="261"
                height="261"
                x="201"
                y="59"
                maskUnits="userSpaceOnUse"
                style={{ maskType: "alpha" }}
              >
                <path
                  fill="#fff"
                  d="M307.979 320C393.043 320 462 250.892 462 165.642c0-45.39-14.855-81.828-41.586-105.98L201.705 278.323C229.044 306.494 275.292 320 307.979 320"
                ></path>
              </mask>
              <g fill="#fff" mask="url(#registration-account-purpose_svg__b)">
                <path d="M453.527 40.738 181.791 313.055l-6.534-6.55L446.993 34.19zm27.727 0L209.518 313.055l-6.534-6.55L474.72 34.19zm27.723 0L237.241 313.055l-6.534-6.55L502.443 34.19zm27.722 0L252.821 325.223l-6.534-6.55L530.165 34.19zm27.725 0L263.638 342.167l-6.534-6.549L557.89 34.19zm27.722 0-294.85 295.48-6.535-6.548 294.85-295.48zm27.725 0L322.389 338.855l-6.534-6.548L613.337 34.19zm27.725 0L341.772 347.215l-6.534-6.549L641.062 34.19z"></path>
              </g>
              <path
                fill="#fff"
                d="M342.94 70.88H68.96v197.252h273.98V70.881Z"
              ></path>
              <path
                fill="#1D222B"
                d="M342.938 269.674H68.958c-.91 0-1.626-.677-1.626-1.539V70.883c0-.862.716-1.54 1.627-1.54h273.979c.911 0 1.627.678 1.627 1.54v197.252c0 .862-.716 1.539-1.627 1.539m-272.352-6.079a3 3 0 0 0 3 3H338.31a3 3 0 0 0 3-3V75.422a3 3 0 0 0-3-3H73.586a3 3 0 0 0-3 3z"
              ></path>
              <path
                fill="#F54C60"
                d="M342.944 59.371H68.964v51.26h273.98z"
              ></path>
              <path
                fill="#1D222B"
                d="M342.942 112.169H68.962c-.91 0-1.626-.677-1.626-1.539V59.37c0-.863.716-1.54 1.627-1.54h273.979c.911 0 1.627.677 1.627 1.54v51.26c0 .862-.716 1.539-1.627 1.539M70.589 106.09a3 3 0 0 0 3 3h264.726a3 3 0 0 0 3-3V63.909a3 3 0 0 0-3-3H73.589a3 3 0 0 0-3 3z"
              ></path>
              <path fill="#fff" d="M108.107 110.633h-39.14v37.56h39.14z"></path>
              <path
                fill="#1D222B"
                d="M108.105 149.73h-39.14c-.911 0-1.627-.677-1.627-1.539v-37.56c0-.862.716-1.539 1.627-1.539h39.14c.911 0 1.626.677 1.626 1.539v37.56c0 .862-.748 1.539-1.626 1.539m-37.514-3.078h35.887V112.17H70.591z"
              ></path>
              <path
                fill="#fff"
                d="M88.515 169.19c10.801 0 19.586-8.282 19.586-18.534v-2.463h-39.14v2.463c0 10.222 8.752 18.534 19.554 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M88.518 170.73c-11.68 0-21.213-8.99-21.213-20.073v-2.463c0-.862.715-1.54 1.626-1.54h39.14c.911 0 1.627.678 1.627 1.54v2.463c.033 11.052-9.468 20.073-21.18 20.073M70.59 149.733v.924c0 9.359 8.036 16.994 17.96 16.994 9.89 0 17.959-7.604 17.959-16.994v-.924z"
              ></path>
              <path
                fill="#F54C60"
                d="M147.239 110.631H108.1v37.56h39.139z"
              ></path>
              <path
                fill="#1D222B"
                d="M147.237 149.73h-39.14c-.911 0-1.626-.677-1.626-1.539v-37.56c0-.862.715-1.539 1.626-1.539h39.14c.911 0 1.627.677 1.627 1.539v37.56c0 .862-.748 1.539-1.627 1.539m-37.513-3.078h35.887V112.17h-35.887z"
              ></path>
              <path
                fill="#F54C60"
                d="M127.649 169.188c10.802 0 19.587-8.282 19.587-18.534v-2.463h-39.14v2.463c0 10.222 8.752 18.534 19.553 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M127.649 170.726c-11.681 0-21.213-8.99-21.213-20.073v-2.463c0-.862.715-1.54 1.626-1.54h39.173c.911 0 1.626.678 1.626 1.54v2.463c0 11.052-9.5 20.073-21.212 20.073m-17.927-20.997v.924c0 9.359 8.036 16.994 17.959 16.994 9.891 0 17.959-7.604 17.959-16.994v-.924z"
              ></path>
              <path fill="#fff" d="M186.378 110.631h-39.14v37.56h39.14z"></path>
              <path
                fill="#1D222B"
                d="M186.38 149.73h-39.14c-.911 0-1.627-.677-1.627-1.539v-37.56c0-.862.716-1.539 1.627-1.539h39.14c.911 0 1.627.677 1.627 1.539v37.56c0 .862-.716 1.539-1.627 1.539m-37.513-3.078h35.886V112.17h-35.886z"
              ></path>
              <path
                fill="#fff"
                d="M166.796 169.186c10.802 0 19.586-8.282 19.586-18.534v-2.463h-39.14v2.463c0 10.222 8.752 18.534 19.554 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M166.795 170.724c-11.68 0-21.213-8.99-21.213-20.073v-2.463c0-.862.716-1.54 1.627-1.54h39.14c.911 0 1.626.678 1.626 1.54v2.463c.033 11.052-9.467 20.073-21.18 20.073m-17.927-20.997v.924c0 9.359 8.036 16.994 17.96 16.994 9.89 0 17.959-7.604 17.959-16.994v-.924z"
              ></path>
              <path
                fill="#F54C60"
                d="M225.523 110.633h-39.14v37.56h39.14z"
              ></path>
              <path
                fill="#1D222B"
                d="M225.521 149.73h-39.14c-.911 0-1.627-.677-1.627-1.539v-37.56c0-.862.716-1.539 1.627-1.539h39.14c.911 0 1.626.677 1.626 1.539v37.56c0 .862-.715 1.539-1.626 1.539m-37.514-3.078h35.887V112.17h-35.887z"
              ></path>
              <path
                fill="#F54C60"
                d="M205.936 169.188c10.802 0 19.587-8.282 19.587-18.534v-2.463h-39.14v2.463c0 10.222 8.752 18.534 19.553 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M205.934 170.728c-11.68 0-21.213-8.99-21.213-20.073v-2.463c0-.862.715-1.54 1.626-1.54h39.14c.911 0 1.627.678 1.627 1.54v2.463c.033 11.052-9.468 20.073-21.18 20.073m-17.927-20.997v.924c0 9.359 8.036 16.994 17.959 16.994s17.96-7.604 17.96-16.994v-.924z"
              ></path>
              <path fill="#fff" d="M264.661 110.627h-39.14v37.56h39.14z"></path>
              <path
                fill="#1D222B"
                d="M264.661 149.729h-39.14c-.911 0-1.626-.678-1.626-1.54v-37.56c0-.862.715-1.539 1.626-1.539h39.14c.911 0 1.627.677 1.627 1.539v37.56c0 .862-.716 1.54-1.627 1.54m-37.513-3.079h35.886v-34.481h-35.886z"
              ></path>
              <path
                fill="#fff"
                d="M245.079 169.184c10.802 0 19.586-8.282 19.586-18.534v-2.462h-39.14v2.462c0 10.222 8.752 18.534 19.554 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M245.078 170.722c-11.68 0-21.213-8.99-21.213-20.073v-2.463c0-.862.716-1.54 1.627-1.54h39.14c.911 0 1.627.678 1.627 1.54v2.463c.032 11.052-9.468 20.073-21.181 20.073m-17.927-20.997v.924c0 9.359 8.036 16.994 17.96 16.994 9.89 0 17.959-7.604 17.959-16.994v-.924z"
              ></path>
              <path
                fill="#F54C60"
                d="M303.8 110.633h-39.14v37.56h39.14z"
              ></path>
              <path
                fill="#1D222B"
                d="M303.798 149.73h-39.14c-.911 0-1.627-.677-1.627-1.539v-37.56c0-.862.716-1.539 1.627-1.539h39.14c.911 0 1.627.677 1.627 1.539v37.56c0 .862-.716 1.539-1.627 1.539m-37.513-3.078h35.886V112.17h-35.886z"
              ></path>
              <path
                fill="#F54C60"
                d="M284.214 169.188c10.802 0 19.586-8.282 19.586-18.534v-2.463h-39.14v2.463c0 10.222 8.752 18.534 19.554 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M284.213 170.726c-11.68 0-21.213-8.99-21.213-20.073v-2.463c0-.862.716-1.54 1.627-1.54h39.14c.911 0 1.626.678 1.626 1.54v2.463c.033 11.052-9.467 20.073-21.18 20.073m-17.927-20.997v.924c0 9.359 8.036 16.994 17.959 16.994 9.891 0 17.96-7.604 17.96-16.994v-.924z"
              ></path>
              <path fill="#fff" d="M342.935 110.627h-39.14v37.56h39.14z"></path>
              <path
                fill="#1D222B"
                d="M342.935 149.729h-39.14c-.911 0-1.627-.678-1.627-1.54v-37.56c0-.862.716-1.539 1.627-1.539h39.14c.911 0 1.626.677 1.626 1.539v37.56c0 .862-.715 1.54-1.626 1.54m-37.514-3.079h35.887v-34.481h-35.887z"
              ></path>
              <path
                fill="#fff"
                d="M323.382 169.182c10.802 0 19.586-8.281 19.586-18.534v-2.462h-39.14v2.462c-.032 10.222 8.72 18.534 19.554 18.534"
              ></path>
              <path
                fill="#1D222B"
                d="M323.381 170.722c-11.68 0-21.213-8.99-21.213-20.073v-2.463c0-.862.716-1.54 1.627-1.54h39.14c.911 0 1.626.678 1.626 1.54v2.463c0 11.052-9.5 20.073-21.18 20.073m-17.96-20.997v.924c0 9.359 8.037 16.994 17.96 16.994 9.891 0 17.959-7.604 17.959-16.994v-.924z"
              ></path>
              <path
                fill="#fff"
                d="M257.277 196.801h-51.308v71.364h51.308z"
              ></path>
              <path
                fill="#1D222B"
                d="M257.279 269.676h-51.308c-.911 0-1.627-.678-1.627-1.54v-71.333c0-.862.716-1.539 1.627-1.539h51.308c.911 0 1.626.677 1.626 1.539v71.364c0 .831-.715 1.509-1.626 1.509m-49.682-3.079h48.055v-68.255h-48.055z"
              ></path>
              <path
                fill="#fff"
                d="M205.908 196.803h-51.373v71.364h51.373z"
              ></path>
              <path
                fill="#1D222B"
                d="M205.906 269.676h-51.373c-.911 0-1.627-.678-1.627-1.54v-71.333c0-.862.716-1.539 1.627-1.539h51.373c.911 0 1.627.677 1.627 1.539v71.364c0 .831-.716 1.509-1.627 1.509m-49.746-3.079h48.119v-68.255H156.16z"
              ></path>
              <path
                fill="#fff"
                d="M95.826 90.38c3.523 0 6.38-2.704 6.38-6.038s-2.857-6.037-6.38-6.037c-3.524 0-6.38 2.703-6.38 6.037s2.856 6.037 6.38 6.037Z"
              ></path>
              <path
                fill="#1D222B"
                d="M95.828 91.53c-4.197 0-7.594-3.213-7.594-7.185s3.397-7.185 7.594-7.185c4.196 0 7.593 3.214 7.593 7.185 0 3.972-3.397 7.186-7.593 7.186Zm0-12.074c-2.839 0-5.168 2.203-5.168 4.89 0 2.685 2.33 4.889 5.168 4.889s5.167-2.204 5.167-4.89-2.33-4.89-5.167-4.89Z"
              ></path>
              <path
                fill="#fff"
                d="M115.353 90.38c3.524 0 6.38-2.704 6.38-6.038s-2.856-6.037-6.38-6.037-6.38 2.703-6.38 6.037 2.856 6.037 6.38 6.037Z"
              ></path>
              <path
                fill="#1D222B"
                d="M115.351 91.528c-4.197 0-7.593-3.213-7.593-7.185s3.396-7.185 7.593-7.185 7.593 3.214 7.593 7.185c0 3.972-3.396 7.185-7.593 7.185m0-12.074c-2.838 0-5.167 2.204-5.167 4.89s2.329 4.889 5.167 4.889 5.167-2.204 5.167-4.89-2.329-4.89-5.167-4.89Z"
              ></path>
              <path
                fill="#fff"
                d="M134.884 90.38c3.524 0 6.38-2.704 6.38-6.038s-2.856-6.037-6.38-6.037-6.38 2.703-6.38 6.037 2.856 6.037 6.38 6.037Z"
              ></path>
              <path
                fill="#1D222B"
                d="M134.882 91.528c-4.197 0-7.593-3.213-7.593-7.185s3.396-7.185 7.593-7.185 7.593 3.214 7.593 7.185c0 3.972-3.396 7.185-7.593 7.185m0-12.074c-2.838 0-5.167 2.204-5.167 4.89s2.329 4.889 5.167 4.889c2.839 0 5.168-2.204 5.168-4.89s-2.329-4.89-5.168-4.89Z"
              ></path>
              <path
                fill="#F54C60"
                d="M257.281 186.764H154.535V196.8h102.746z"
              ></path>
              <path
                fill="#1D222B"
                d="M257.279 198.34H154.533c-.911 0-1.627-.677-1.627-1.54v-10.036c0-.862.716-1.539 1.627-1.539h102.746c.911 0 1.627.677 1.627 1.539V196.8c0 .832-.716 1.54-1.627 1.54m-101.119-3.079h99.492v-6.958H156.16zM32.062 230.052c-.488 0-.944-.185-1.27-.585-.553-.678-.455-1.632.26-2.156l58.727-44.61c.716-.523 1.724-.431 2.277.247s.456 1.631-.26 2.155l-58.726 44.61c-.293.215-.65.339-1.008.339"
              ></path>
              <ellipse
                cx="371"
                cy="124.909"
                fill="#1D222B"
                rx="7.491"
                ry="7.5"
                transform="rotate(90 371 124.909)"
              ></ellipse>
              <path
                stroke="#1D222B"
                strokeWidth="2"
                d="M371 136.395a6.496 6.496 0 0 1-6.5-6.492 6.495 6.495 0 0 1 6.5-6.491c3.591 0 6.5 2.907 6.5 6.491a6.496 6.496 0 0 1-6.5 6.492Z"
              ></path>
              <path
                fill="#1D222B"
                d="m152 273.439 46.277-21.591-19.28 47.627-7.241-11.589-12.495 11.373-7.013-7.066 12.412-11.315z"
              ></path>
              <path
                fill="#1D222B"
                d="M361.349 270.773H1.651c-.925 0-1.651-.832-1.651-1.892s.726-1.893 1.65-1.893h359.7c.925 0 1.651.833 1.651 1.893s-.759 1.892-1.651 1.892Z"
              ></path>
              <path
                fill="#F8F8F9"
                d="m153.891 269.213 41.58-19.401-17.324 42.794-6.505-10.413-11.227 10.219-6.301-6.349 11.152-10.167z"
              ></path>
              <path
                fill="#1D222B"
                d="M178.15 293.484a.91.91 0 0 1-.799-.44l-5.911-9.463-10.372 9.445a1 1 0 0 1-.669.247.92.92 0 0 1-.651-.282l-6.301-6.349a.834.834 0 0 1 .037-1.231l10.298-9.375-10.353-6.086a.94.94 0 0 1-.447-.791c0-.317.223-.598.521-.739l41.561-19.4a.98.98 0 0 1 1.041.14.87.87 0 0 1 .242.968l-17.324 42.793a.93.93 0 0 1-.78.563zm-22.714-7.387 5.037 5.065 10.539-9.603a.94.94 0 0 1 .762-.247.91.91 0 0 1 .67.423l5.539 8.864 15.78-38.994-37.955 17.712 9.963 5.839a.84.84 0 0 1 .427.651.87.87 0 0 1-.279.721z"
              ></path>
              <rect
                width="29.965"
                height="3"
                x="50"
                y="170.855"
                fill="#1D222B"
                rx="1.5"
                transform="rotate(90 50 170.855)"
              ></rect>
              <rect
                width="9.988"
                height="3"
                x="56"
                y="175.85"
                fill="#1D222B"
                rx="1.5"
                transform="rotate(90 56 175.85)"
              ></rect>
              <rect
                width="35"
                height="3.995"
                x="371"
                y="296.709"
                fill="#1D222B"
                rx="1.998"
              ></rect>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingCategory;
