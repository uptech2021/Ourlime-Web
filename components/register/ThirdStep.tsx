'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Select, SelectItem } from '@nextui-org/react';
import styles from "./register.module.css";
import { countries } from 'countries-list';
import PhoneInput from 'react-phone-number-input';
import transparentLogo from 'public/images/transparentLogo.png';
import Image from 'next/image';
import { isValidPhoneNumber } from 'react-phone-number-input';

type ThirdStepProps = {
    setStep: Dispatch<SetStateAction<number>>;
    setCountry: Dispatch<SetStateAction<string>>;
    setPhone: Dispatch<SetStateAction<string>>;
    phoneError?: string;
    isStepValid: boolean;
    validateStep: () => boolean;
    countryError: string;
    error: string;
    setCity: Dispatch<SetStateAction<string>>;
    cityError: string;
    setPostalCode: Dispatch<SetStateAction<string>>;
    postalCodeError: string;
    setAddress: Dispatch<SetStateAction<string>>;
    AddressError: string;
    phone?: string;
    setZipCode: Dispatch<SetStateAction<string>>;
    zipCodeError: string;
    contactExistsError: string;
    handleContactChange: (value: string) => void;
};

const totalSteps = 5;
const currentStep = 3;
const progressPercentage = (currentStep / totalSteps) * 100;

const ThirdStep: React.FC<ThirdStepProps> = ({
    setStep,
    setCountry,
    isStepValid,
    validateStep,
    countryError,
    setPhone,
    phoneError,
    phone,
    error,
    setCity,
    cityError,
    setPostalCode,
    postalCodeError,
    setAddress,
    AddressError,
    setZipCode,
    zipCodeError,
    contactExistsError,
    handleContactChange
}) => {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    useEffect(() => {
        validateStep();
    }, [setCountry, validateStep]);

    const countryList = Object.entries(countries).map(([code, country]) => ({
        code,
        name: country.name,
    }));

    const handleNextStep = (e: React.MouseEvent) => {
        e.preventDefault();
        setAttemptedSubmit(true);
        if (phone && selectedCountry && isValidPhoneNumber(phone)) {
            setStep(4);
        }
    };

    const isFormValid = phone && selectedCountry && isValidPhoneNumber(phone);

    return (
        <div className="step-3 mt-5 flex flex-col justify-center relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
                <div
                    className="h-full bg-greenTheme transition-all duration-700 ease-in-out relative progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <Image
                        src={transparentLogo}
                        alt="Logo"
                        className="absolute -top-2 right-0 transform translate-x-1/2"
                        width={20}
                        height={20}
                    />
                </div>
            </div>

            <div className="mx-auto w-full border-none bg-black bg-opacity-[50%] px-5 py-4">
                <h1 className="text-2xl font-bold text-white text-center mt-8">
                    Let the community know about you
                </h1>
                <div className='w-3/4 mx-auto'>
                    <form className="mt-4 flex flex-col gap-4">
                        {/* City and Region */}
                        <div className='flex flex-col gap-4 md:flex-row md:gap-10'>
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
                                    placeholder="City (Optional)"
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
                                    placeholder="Region (Optional)"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Country Selection */}
                        <Select
                            placeholder="Country"
                            onChange={(e) => {
                                setCountry(e.target.value);
                                setSelectedCountry(e.target.value);
                            }}
                            className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-white text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500`}
                            classNames={{
                                base: "text-black",
                                trigger: "text-black",
                                value: "text-black"
                            }}
                            required
                        >
                            {countryList.map((country) => (
                                <SelectItem key={country.code} value={country.name}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </Select>
                        {attemptedSubmit && countryError && (
                            <p className="text-bold mt-1 text-left text-red-500">{countryError}</p>
                        )}

                        {/* Address */}
                        <input
                            type="text"
                            className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
                            placeholder="Address (Optional)"
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        {/* Phone Input */}
                        <PhoneInput
                            value={phone}
                            className="phone rounded-md overflow-hidden"
                            defaultCountry="TT"
                            onChange={handleContactChange}
                            international
                            withCountryCallingCode
                            inputClass="w-full border-none text-black placeholder-black focus:outline-none bg-white px-4 py-2"
                            autoComplete="off"
                            required
                            numberInputProps={{
                                maxLength: 15
                            }}
                            placeholder="Enter your phone number"
                        />
                        {contactExistsError && (
                            <p className="text-red-500 text-sm mt-1">{contactExistsError}</p>
                        )}
                        {attemptedSubmit && phoneError && (
                            <p className="text-bold mt-1 text-left text-red-500">{phoneError}</p>
                        )}

                        {/* Postal Codes */}
                        <div className='flex flex-col gap-4 md:flex-row md:gap-10'>
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
                                    placeholder="Zip Code (Optional)"
                                    onChange={(e) => setZipCode(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
                                    placeholder="Postal Code (Optional)"
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex w-full flex-col gap-1 md:gap-12 md:flex-row">
                            <Button
                                onClick={() => setStep(2)}
                                type="button"
                                className="submit my-4 w-full md:w-2/5 mx-auto rounded-full bg-white px-8 py-3 text-greenTheme hover:bg-gray-300 text-lg font-semibold"
                            >
                                Previous Step
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                type="button"
                                disabled={!isFormValid}
                                className="submit my-4 w-full md:w-2/5 mx-auto rounded-full bg-greenTheme px-8 py-3 text-white hover:bg-green-600 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ThirdStep;
