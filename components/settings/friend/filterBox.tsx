import React from 'react';
import { Input } from '@nextui-org/react';
import styles from './friend.module.css';

interface FilterBoxProps {
  showFilters: boolean;
  gender: string;
  setGender: (gender: string) => void;
  status: string;
  setStatus: (status: string) => void;
  distance: number;
  setDistance: (distance: number) => void;
  relationship: string;
  setRelationship: (relationship: string) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  showFilters,
  gender,
  setGender,
  status,
  setStatus,
  distance,
  setDistance,
  relationship,
  setRelationship,
}) => {
  return (
    <div
      className={`filters-box z-1000 absolute top-[25.5rem] w-60 rounded border border-gray-300 bg-white p-4 shadow-md right-8 md:right-12 md:top-[24.5rem] lg:right-14 lg:top-[13rem] lg:w-72 ${
        showFilters ? 'block' : 'hidden'
      }`}
    >
      {/* Gender filter */}
      <div className="mb-4 filter">
        <label className="mb-2 block text-xs font-bold text-black">Gender</label>
        <ul className="filter-buttons flex flex-wrap gap-2">
          {['All', 'Female', 'Male'].map((g) => (
            <li
              key={g}
              className={`${styles.mobileBtn} ${
                gender === g ? styles.BtnActive : styles.BtnInactive
              }`}
              onClick={() => setGender(g)}
            >
              {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Status filter */}
      <div className="mb-4 filter">
        <label className="mb-2 block text-xs font-bold text-black">Status</label>
        <ul className="filter-buttons flex flex-wrap gap-2">
          {['All', 'Online', 'Offline'].map((s) => (
            <li
              key={s}
              className={`${styles.mobileBtn} ${
                status === s ? styles.BtnActive : styles.BtnInactive
              }`}
              onClick={() => setStatus(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Distance filter */}
      <div className="mb-4 filter">
        <label className="mb-2 block text-xs lg:text-sm font-bold text-black">
          Location distance (km)
        </label>
        <Input
          type="range"
          label="Location distance (km)"
          min="1"
          max="100"
          value={distance.toString()}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full"
        />
        <span className="mt-1 block text-center text-xs lg:text-sm text-black">
          {distance}
        </span>
      </div>

      {/* Relationship filter */}
      <div className="mb-4 filter">
        <label className="mb-2 block text-xs lg:text-sm font-bold text-black">
          Relationship
        </label>
        <ul className="filter-buttons flex flex-wrap gap-2">
          {['All', 'Single', 'In a relationship', 'Married', 'Engaged'].map((r) => (
            <li
              key={r}
              className={`${styles.mobileBtn} ${
                relationship === r ? styles.BtnActive : styles.BtnInactive
              }`}
              onClick={() => setRelationship(r)}
            >
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterBox;
