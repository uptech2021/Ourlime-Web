'use client'
import { Select, SelectItem, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react';


export default function Privacy() {
  const [status, setStatus] = useState("Online");
  const [followMe, setFollowMe] = useState("Everyone");
  const [messageMe, setMessageMe] = useState("Everyone");
  const [seeFriends, setSeeFriends] = useState("People I Follow");
  const [postTimeline, setPostTimeline] = useState("Everyone");
  const [seeBirthday, setSeeBirthday] = useState("Everyone");
  const [confirmRequest, setConfirmRequest] = useState("No");
  const [showActivities, setShowActivities] = useState("Yes");
  const [shareLocation, setShareLocation] = useState("Yes");
  const [allowSearch, setAllowSearch] = useState("Yes");

  const [isChanged, setIsChanged] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleSave = () => {

    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  useEffect(() => {
    const hasChanged =
      status !== "Online" ||
      followMe !== "Everyone" ||
      messageMe !== "Everyone" ||
      seeFriends !== "People I Follow" ||
      postTimeline !== "Everyone" ||
      seeBirthday !== "Everyone" ||
      confirmRequest !== "No" ||
      showActivities !== "Yes" ||
      shareLocation !== "Yes" ||
      allowSearch !== "Yes";
    setIsChanged(hasChanged);
  }, [status, followMe, messageMe, seeFriends, postTimeline, seeBirthday, confirmRequest, showActivities, shareLocation, allowSearch]);

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gray-200 lg:items-center text-center">
        <h2 className="mb-4 ml-[1rem] lg:ml-0 lg:mr-[20rem] pt-8 text-left text-2xl font-semibold text-gray-700">
          Profile Setting
        </h2>
        <div className="mx-auto mb-6 w-[90%] lg:w-[30rem] rounded-lg bg-white p-4 text-gray-600 shadow-md">
          {showSuccessMessage && (
            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
              Privacy saved successfully!
            </div>
          )}
          <form>
            {[
              {
                label: "Status",
                state: status,
                setState: setStatus,
                options: [
                  { key: "Online", value: "Online" },
                  { key: "Away", value: "Away" },
                  { key: "Offline", value: "Offline" }
                ]
              },
              {
                label: "Who can follow me?",
                state: followMe,
                setState: setFollowMe,
                options: [
                  { key: "Everyone", value: "Everyone" },
                  { key: "Friends", value: "Friends" },
                  { key: "Nobody", value: "Nobody" }
                ]
              },
              {
                label: "Who can message me?",
                state: messageMe,
                setState: setMessageMe,
                options: [
                  { key: "Everyone", value: "Everyone" },
                  { key: "Friends", value: "Friends" },
                  { key: "Nobody", value: "Nobody" }
                ]
              },
              {
                label: "Who can see my friends?",
                state: seeFriends,
                setState: setSeeFriends,
                options: [
                  { key: "People I Follow", value: "People I Follow" },
                  { key: "Everyone", value: "Everyone" },
                  { key: "Nobody", value: "Nobody" }
                ]
              },
              {
                label: "Who can post on my timeline?",
                state: postTimeline,
                setState: setPostTimeline,
                options: [
                  { key: "Everyone", value: "Everyone" },
                  { key: "Friends", value: "Friends" },
                  { key: "Nobody", value: "Nobody" }
                ]
              },
              {
                label: "Who can see my birthday?",
                state: seeBirthday,
                setState: setSeeBirthday,
                options: [
                  { key: "Everyone", value: "Everyone" },
                  { key: "Friends", value: "Friends" },
                  { key: "Nobody", value: "Nobody" }
                ]
              },
              {
                label: "Confirm request when someone follows you?",
                state: confirmRequest,
                setState: setConfirmRequest,
                options: [
                  { key: "Yes", value: "Yes" },
                  { key: "No", value: "No" }
                ]
              },
              {
                label: "Show my activities?",
                state: showActivities,
                setState: setShowActivities,
                options: [
                  { key: "Yes", value: "Yes" },
                  { key: "No", value: "No" }
                ]
              },
              {
                label: "Share my location with public?",
                state: shareLocation,
                setState: setShareLocation,
                options: [
                  { key: "Yes", value: "Yes" },
                  { key: "No", value: "No" }
                ]
              },
              {
                label: "Allow search engines to index my profile and posts?",
                state: allowSearch,
                setState: setAllowSearch,
                options: [
                  { key: "Yes", value: "Yes" },
                  { key: "No", value: "No" }
                ]
              }
            ].map(({ label, state, setState, options }) => (
              <div key={label} className=" pt-2 mb-4">
                <Select
                  label={label}
                  labelPlacement="outside"
                  placeholder="Select option"
                  selectedKeys={[state]}
                  onChange={(e) => setState(e.target.value)}
                  classNames={{
                    label: "text-left",
                  }}
                >
                  {options.map(option => (
                    <SelectItem key={option.key} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            ))}

            <Button
              className={`mt-6 mt-6 rounded px-6 mt-6 py-2 text-white ${!isChanged ? 'bg-none' : ''}`}
              disabled={!isChanged}
              onClick={handleSave}
            >
              Save
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
