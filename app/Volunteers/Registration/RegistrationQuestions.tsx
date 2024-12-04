import React from "react";

const RegistrationQuestions = () => {
  const Form = () => (
    <div className="space-y-6">
      <form className="space-y-4">
        <div className="w-full border-t-4 border-[#1F2839] my-4"></div>
        <h2 className="font-bold text-xl">Event Form</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <div className="flex flex-col mb-2">
              <label className="mb-1 text-gray-700">
                I will be volunteering at this event.
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="volunteeringYes"
                  name="volunteering"
                  value="yes"
                  className="mr-2"
                />
                <label htmlFor="volunteeringYes" className="mr-4">
                  Yes
                </label>

                <input
                  type="radio"
                  id="volunteeringNo"
                  name="volunteering"
                  value="no"
                  className="mr-2"
                />
                <label htmlFor="volunteeringNo">No</label>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label className="mb-1 text-gray-700">
                I will be volunteering at this event for the full event time.
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="volunteeringFullYes"
                  name="volunteeringFull"
                  value="yes"
                  className="mr-2"
                />
                <label htmlFor="volunteeringFullYes" className="mr-4">
                  Yes
                </label>

                <input
                  type="radio"
                  id="volunteeringFullNo"
                  name="volunteeringFull"
                  value="no"
                  className="mr-2"
                />
                <label htmlFor="volunteeringFullNo">No</label>
              </div>
            </div>
          </div>
          <div className="sm:col-span-1 mx-2">
            I will be volunteering from:
            <div className="flex flex-col mb-2">
              <label htmlFor="startTime" className="mb-1 text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></input>
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="endTime" className="mb-1 text-gray-700">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></input>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-[#1F2839] my-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <h1 className="font-bold text-lg">Personal Information</h1>
            <div className="flex flex-col mb-2">
              <label htmlFor="ssn" className="mb-1 text-gray-700">
                SSN:
              </label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="first name" className="mb-1 text-gray-700">
                First Name:
              </label>
              <input
                type="text"
                id="first name"
                name="first name"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="last name" className="mb-1 text-gray-700">
                Last Name:
              </label>
              <input
                type="text"
                id="last name"
                name="last name"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="preferred name" className="mb-1 text-gray-700">
                Preferred Name:
              </label>
              <input
                type="text"
                id="preferred name"
                name="preferred name"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label className="mb-1 text-gray-700">
                Do you speak Spanish?
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="speakSpanishYes"
                  name="speakSpanish"
                  value="yes"
                  className="mr-2"
                />
                <label htmlFor="speakSpanishYes" className="mr-4">
                  Yes
                </label>

                <input
                  type="radio"
                  id="speakSpanishNo"
                  name="speakSpanish"
                  value="no"
                  className="mr-2"
                />
                <label htmlFor="speakSpanishNo">No</label>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="usCitizen" className="mb-1 text-gray-700">
                Citizenship Status:
              </label>

              <select
                id="usCitizen"
                name="usCitizen"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="None">
                  <option value="US Citizen"> US Citizen</option>
                  <option value="Naturalized Citizen">
                    {" "}
                    Naturalized Citizen
                  </option>
                  <option value="Immigrant Non-Citizen">
                    {" "}
                    Immigrant Non-Citizen
                  </option>
                  <option value="Non-Immigrant Visa Holder">
                    {" "}
                    Non-Immigrant Visa Holder
                  </option>
                  <option value="Other"> Other</option>
                </optgroup>
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="driversLicense" className="mb-1 text-gray-700">
                DL #:
              </label>
              <input
                type="text"
                id="driversLicense"
                name="driversLicense"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm:col-span-1 mx-2">
            <h1 className="font-bold text-lg">Contact Information</h1>
            <div className="flex flex-col mb-2">
              <label htmlFor="emailAddress" className="mb-1 text-gray-700">
                Email:
              </label>
              <input
                type="text"
                id="emailAddress"
                name="emailAddress"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="phoneNumber" className="mb-1 text-gray-700">
                Phone Number:
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#1F2839] my-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <h1 className="font-bold text-lg">Residence</h1>
            <div className="flex flex-col mb-2">
              <label htmlFor="address" className="mb-1 text-gray-700">
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="city" className="mb-1 text-gray-700">
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm-col-span-1 ml-2">
            <div className="flex flex-col mb-2 mt-7">
              <label htmlFor="state" className="mb-1 text-gray-700">
                State:
              </label>

              <select
                id="state"
                name="state"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </optgroup>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="country" className="mb-1 text-gray-700">
                Country:
              </label>

              <select
                id="country"
                name="country"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup>
                  <option value="USA">United States</option>
                  <option value="CHN">China</option>
                  <option value="IND">India</option>
                  <option value="IDN">Indonesia</option>
                  <option value="PAK">Pakistan</option>
                  <option value="BRA">Brazil</option>
                  <option value="NGA">Nigeria</option>
                  <option value="BGD">Bangladesh</option>
                  <option value="RUS">Russia</option>
                  <option value="MEX">Mexico</option>
                  <option value="JPN">Japan</option>
                  <option value="ETH">Ethiopia</option>
                  <option value="PHL">Philippines</option>
                  <option value="EGY">Egypt</option>
                  <option value="VNM">Vietnam</option>
                  <option value="DRC">Democratic Republic of the Congo</option>
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="zipCode" className="mb-1 text-gray-700">
                Zip Code:
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#1F2839] my-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <h1 className="font-bold text-lg">Emergency Contact Information</h1>
            <div className="flex flex-col mb-2">
              <label
                htmlFor="emergencyFirstName"
                className="mb-1 text-gray-700"
              >
                First Name:
              </label>
              <input
                type="text"
                id="emergencyFirstName"
                name="emergencyFirstName"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="emergencyLastName" className="mb-1 text-gray-700">
                Last Name:
              </label>
              <input
                type="text"
                id="emergencyLastName"
                name="emergencyLastName"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label
                htmlFor="emergencyPreferredName"
                className="mb-1 text-gray-700"
              >
                Preferred Name:
              </label>
              <input
                type="text"
                id="emergencyPreferredName"
                name="emergencyPreferredName"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm-col-span-1 ml-2 mt-7">
            <div className="flex flex-col mb-2">
              <label htmlFor="emergencyEmail" className="mb-1 text-gray-700">
                Email:
              </label>
              <input
                type="text"
                id="emergencyEmail"
                name="emergencyEmail"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label
                htmlFor="emergencyPhoneNumber"
                className="mb-1 text-gray-700"
              >
                Phone Number:
              </label>
              <input
                type="text"
                id="emergencyPhoneNumber"
                name="emergencyPhoneNumber"
                className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div>
          <input
            type="submit"
            id="submit"
            name="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all duration-200 focus:ring-offset-1"
          ></input>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <Form></Form>
    </div>
  );
};

export default RegistrationQuestions;
