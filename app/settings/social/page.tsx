'use client';
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";

export default function Social() {
	const [Fname, setFName] = useState('');
	const [Tname, setTName] = useState('');
	const [Vname, setVName] = useState('');
	const [Lname, setLName] = useState('');
	const [Iname, setIName] = useState('');
	const [Yname, setYName] = useState('');

 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  const handleSave = () => {
   
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); 
  };
	return (
		<>
			<main className="flex min-h-screen flex-col items-center bg-gray-200 text-center">
				<h2 className="mb-4 mr-[10rem] lg:mr-[20rem] pt-8 text-left text-2xl font-semibold text-gray-700">
					Social Links
				</h2>
				<div className="mx-auto w-[90%] lg:w-[30rem] rounded-lg bg-white p-4 shadow-md">
					<div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
					{showSuccessMessage && (
          <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
            Social saved successfully!
          </div>
        )}
						<Input
							type="text"
							placeholder="Facebook Username"
							onChange={(e) => setFName(e.target.value)}
							
						/>
						<Input
							type="text"
							placeholder="Twitter Username"
							onChange={(e) => setTName(e.target.value)}
							
						/>
					</div>
					<div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
						<Input
							type="text"
							placeholder="Vkontakte Username"
							onChange={(e) => setVName(e.target.value)}
							
						/>
						<Input
							type="text"
							placeholder="Linkedin Username"
							onChange={(e) => setLName(e.target.value)}
							
						/>
					</div>
					<div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
						<Input
							type="text"
							placeholder="Instagram Username"
							onChange={(e) => setIName(e.target.value)}
							
						/>
						<Input
							type="text"
							placeholder="Youtube Username"
							onChange={(e) => setYName(e.target.value)}
							
						/>
					</div>

					<Button 
		className={`mt-4 mx-auto rounded px-4 py-2 text-white ${!Fname || !Vname || !Yname || !Iname || !Tname || !Lname ? 'bg-none' : ''}`}
		isDisabled={!Fname || !Vname || !Yname || !Iname || !Tname || !Lname}
		onClick={handleSave}
        >
          Save
        </Button>
				</div>
			</main>
		</>
	);
}
